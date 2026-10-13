// WeeBid real-time server (socket.io).
//
// What it does:
//   - rooms: every auction has a room, every member has a personal room (notifications)
//   - when a member bids, the bid is VERIFIED against the API (the client is never trusted),
//     then the new price is pushed to the room and the watchers are notified
//
// Abuse protection: per-IP connection cap, per-socket event rate limit, small payloads,
// strictly validated event arguments, personal rooms only for the authenticated member.

const axios = require("axios").default;
const { Server } = require("socket.io");

// ---------------------------------------------------------------- configuration
const PORT = parseInt(process.env.PORT || "8081", 10);
const API_URL = (process.env.API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:3000"];
const SOCKET_USER = process.env.SOCKET_USER || "socket@weebid.internal"; // service account used to create notifications
const SOCKET_PASSWORD = process.env.SOCKET_PASSWORD || "";
const LANG = (process.env.NOTIFICATION_LANG || "fr").startsWith("en") ? "en" : "fr";
const MAX_CONN_PER_IP = parseInt(process.env.MAX_CONN_PER_IP || "20", 10);
const EVENTS_PER_WINDOW = parseInt(process.env.EVENTS_PER_WINDOW || "30", 10);
const WINDOW_MS = 10000;
const MAX_ROOMS = 60;
const FRESH_MS = 120000; // a bid / request must have been created less than 2 minutes ago to be announced

const TEXT = {
  fr: {
    bid: (u, n, p) => ({ title: "Nouvelle offre", description: `${u} a augmenté le prix de ${n} jusqu'à ${p} TND` }),
    cut: (u, n, p) => ({ title: "Nouvelle réduction", description: `${u} a réduit le prix de ${n} jusqu'à ${p} TND` }),
    quote: (u) => ({ title: "Demande de devis", description: `${u} vous a envoyé une demande de devis` }),
    proposal: (u) => ({ title: "Proposition reçue", description: `${u} vous a envoyé une proposition de devis` }),
  },
  en: {
    bid: (u, n, p) => ({ title: "New bid", description: `${u} raised the price of ${n} to ${p} TND` }),
    cut: (u, n, p) => ({ title: "New price cut", description: `${u} lowered the price of ${n} to ${p} TND` }),
    quote: (u) => ({ title: "Quote request", description: `${u} sent you a quote request` }),
    proposal: (u) => ({ title: "Proposal received", description: `${u} sent you a quote proposal` }),
  },
}[LANG];

// ---------------------------------------------------------------- API access
const http = axios.create({ baseURL: API_URL, timeout: 8000 });
let tokenCache = null; // { token, expires }

async function apiToken() {
  if (!SOCKET_PASSWORD) return null;
  if (tokenCache && tokenCache.expires > Date.now()) return tokenCache.token;
  const res = await http.post("/api/login_check", { username: SOCKET_USER, password: SOCKET_PASSWORD });
  tokenCache = { token: res.data.token, expires: Date.now() + 20 * 24 * 3600 * 1000 };
  return tokenCache.token;
}

async function createNotification(body) {
  const send = async () => {
    const token = await apiToken();
    return http.post("/api/notifications", body, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  };
  try {
    return (await send()).data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      tokenCache = null; // expired / changed password: log in again once
      return (await send()).data;
    }
    throw err;
  }
}

// who is this socket? (token sent by the browser at connection time, verified by the API itself)
async function memberId(socket) {
  if (socket.data.memberId !== undefined) return socket.data.memberId;
  const token = socket.handshake.auth && socket.handshake.auth.token;
  let id = null;
  if (typeof token === "string" && token.length < 4000) {
    try {
      const res = await http.get("/api/userdata", { headers: { Authorization: `Bearer ${token}` } });
      id = res.data.id || null;
    } catch (e) {
      id = null;
    }
  }
  socket.data.memberId = id;
  return id;
}

// ---------------------------------------------------------------- validation helpers
const isInt = (v) => Number.isInteger(v) && v > 0 && v < 1e9;
const AUCTION_IRI = /^\/api\/(encheres|enchere_inverses)\/(\d+)$/;
const parseAuction = (iri) => {
  const m = typeof iri === "string" && iri.length < 60 ? AUCTION_IRI.exec(iri) : null;
  return m ? { kind: m[1] === "encheres" ? "enchere" : "inverse", id: parseInt(m[2], 10), iri } : null;
};
const fresh = (date) => Date.now() - new Date(date).getTime() < FRESH_MS;

// ---------------------------------------------------------------- server
const io = new Server(PORT, {
  cors: { origin: CORS_ORIGIN },
  maxHttpBufferSize: 1e5, // 100 KB per message
  connectTimeout: 10000,
  pingTimeout: 20000,
});

const clientIp = (socket) => {
  const forwarded = socket.handshake.headers["x-forwarded-for"]; // set by nginx to the real client address
  return (forwarded ? String(forwarded).split(",")[0].trim() : socket.handshake.address) || "unknown";
};
const perIp = new Map();

io.use((socket, next) => {
  const ip = clientIp(socket);
  const count = perIp.get(ip) || 0;
  if (count >= MAX_CONN_PER_IP) return next(new Error("too many connections"));
  perIp.set(ip, count + 1);
  socket.on("disconnect", () => {
    const left = (perIp.get(ip) || 1) - 1;
    if (left <= 0) perIp.delete(ip);
    else perIp.set(ip, left);
  });
  next();
});

io.on("connection", (socket) => {
  // ---- per-socket event rate limit: too many events -> warning, then disconnection
  let stamps = [];
  let strikes = 0;
  socket.use((packet, next) => {
    const now = Date.now();
    stamps = stamps.filter((t) => now - t < WINDOW_MS);
    stamps.push(now);
    if (stamps.length <= EVENTS_PER_WINDOW) return next();
    strikes += 1;
    if (strikes >= 3) socket.disconnect(true);
    else socket.emit("rate-limited");
    return undefined; // the event is dropped
  });

  // run async handlers without ever crashing the process
  const on = (event, handler) =>
    socket.on(event, (...args) => {
      Promise.resolve(handler(...args)).catch((err) => console.log(`[${event}]`, err.message));
    });

  on("join-rooms", async (rooms) => {
    const list = (Array.isArray(rooms) ? rooms : [rooms]).slice(0, MAX_ROOMS);
    for (const room of list) {
      if (typeof room !== "string" || room.length > 70) continue;
      if (/^\/api\/(encheres|enchere_inverses)\/\d+(LOCAL)?$/.test(room)) {
        if (socket.rooms.size < MAX_ROOMS) socket.join(room); // public auction rooms
      } else if (/^\d+USER$/.test(room)) {
        // personal room: only for the member it belongs to
        const id = await memberId(socket);
        if (id !== null && room === `${id}USER`) socket.join(room);
      }
    }
  });

  on("leave-room", (enchere) => {
    if (parseAuction(enchere)) socket.leave(`${enchere}LOCAL`);
  });

  // a member just bid (enchere) or cut the price (inverse): announce it
  const lastAnnounce = new Map();
  on("AUGMENT", async (enchere, _user, newPrice, initPrice) => {
    const auction = parseAuction(enchere);
    if (!auction || typeof newPrice !== "number") return;
    const now = Date.now();
    if (now - (lastAnnounce.get(enchere) || 0) < 1500) return; // one announcement / 1.5 s / auction / socket
    lastAnnounce.set(enchere, now);
    if (lastAnnounce.size > 100) lastAnnounce.clear();

    // never trust the client: read the real latest bid from the API
    const inverse = auction.kind === "inverse";
    const res = await http.get(inverse ? "/api/reductionLowest" : "/api/augmentationHighest", {
      params: { page: 1, [inverse ? "enchereInverse" : "enchere"]: enchere, "order[date]": "desc" },
    });
    const last = res.data["hydra:member"][0];
    if (!last || Math.abs(last.value - newPrice) > 0.001 || !fresh(last.date)) return;
    const bidder = last.user.displayName;

    socket.to(`${enchere}LOCAL`).emit("NEW_PRICE", enchere, bidder, last.value, Number(initPrice) || 0);

    const watchers = await http.get("/api/surveilles", { params: { [inverse ? "enchereInverse" : "enchere"]: enchere } });
    for (const watch of watchers.data["hydra:member"].slice(0, 200)) {
      const target = watch.enchere || watch.enchereInverse;
      const name = target.article.name;
      const text = inverse ? TEXT.cut(bidder, name, last.value) : TEXT.bid(bidder, name, last.value);
      const notification = await createNotification({
        user: watch.user["@id"],
        title: text.title,
        description: text.description,
        date: new Date(),
        route: `/${inverse ? "enchereInverse" : "enchere"}/${target.id}`,
        type: inverse ? "enchereInverse" : "enchere",
      });
      socket.to(enchere).emit("NOTIFICATION", notification);
    }
  });

  // a member sent a quote request to another member
  on("DEMANDE", async (demande, userId) => {
    if (!demande || !isInt(demande.id) || !isInt(Number(userId))) return;
    const res = await http.get(`/api/demande_devis/${demande.id}`);
    const request = res.data;
    if (!request.transmittedTo || request.transmittedTo.id !== Number(userId) || !fresh(request.date)) return;
    const text = TEXT.quote(request.transmitter.displayName);
    const notification = await createNotification({
      user: request.transmittedTo["@id"],
      title: text.title,
      description: text.description,
      date: new Date(),
      route: `/demande_devis/${request.id}`,
      type: "demande_devis",
    });
    socket.to(`${request.transmittedTo.id}USER`).emit("NOTIFICATION", notification);
  });

  // a member answered a quote request with one of their auctions
  on("PROPOSITION", async (proposition) => {
    if (!proposition || !isInt(proposition.id)) return;
    const res = await http.get(`/api/propositions/${proposition.id}`);
    const answer = res.data;
    if (!answer.transmittedTo || !answer.enchere || !fresh(answer.date)) return;
    const text = TEXT.proposal(answer.transmitter.displayName);
    const notification = await createNotification({
      user: answer.transmittedTo["@id"],
      title: text.title,
      description: text.description,
      date: new Date(),
      route: `/enchere/${answer.enchere.id}`,
      type: "proposition",
    });
    socket.to(`${answer.transmittedTo.id}USER`).emit("NOTIFICATION", notification);
  });
});

console.log(`socket server on :${PORT} (api: ${API_URL}, notifications ${SOCKET_PASSWORD ? "enabled" : "DISABLED: set SOCKET_PASSWORD"}, lang: ${LANG})`);
