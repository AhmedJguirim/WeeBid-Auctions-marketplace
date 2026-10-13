import React from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarClock, CheckCircle2, Eye, EyeOff, Gavel, Loader2, MapPin, ShieldAlert, Trash2, TrendingDown, TrendingUp,
} from "lucide-react";
import { BACKEND_URL } from "../../../config/env";
import { apiRoutes, navRoutes } from "../../../config/routes";
import Api from "../../../AxiosInstance";
import Socket from "../../base/customComponents/Socket";
import { fetchWatchList } from "../../../redux/actions";
import placeHolder from "../../../media/images/imagelessAuction.png";
import Countdown, { useAuctionClock } from "../../ui/Countdown";
import Modal from "../../ui/Modal";
import Avatar from "../../ui/Avatar";

/**
 * One detail page for both kinds of auctions. Everything that differs between an
 * "enchère" (bids go up) and an "enchère inversée" (prices go down) lives here.
 */
const CONFIG = {
  enchere: {
    resource: "encheres",
    path: navRoutes.ENCHERES,
    watchField: "enchere",
    bidsTable: "/augmentationsTable",
    bidsResource: "/augmentations",
    highest: "/augmentationHighest",
    action: "/augmenter",
    sign: 1,
    steps: [1, 5, 10, 50],
    label: { price: "Offre actuelle", bid: "offre", bids: "Offres", verb: "Enchérir", manage: "Gérer les offres", noun: "enchère", history: "Historique des offres", Icon: TrendingUp },
  },
  inverse: {
    resource: "enchere_inverses",
    path: navRoutes.ENCHERESINVERSES,
    watchField: "enchereInverse",
    bidsTable: "/reductionsTable",
    bidsResource: "/reductions",
    highest: "/reductionLowest",
    action: "/reduire",
    sign: -1,
    steps: [1, 5, 10, 50],
    label: { price: "Meilleur prix", bid: "réduction", bids: "Réductions", verb: "Proposer ce prix", manage: "Gérer les réductions", noun: "enchère inversée", history: "Historique des réductions", Icon: TrendingDown },
  },
};

const fmt = (n) => (Math.round(n * 100) / 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
const dateTime = (d) => new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
const toInput = (d) => {
  const date = new Date(d);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const DetailRow = ({ label, value }) =>
  value ? (
    <div className="flex justify-between gap-4 py-3 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold capitalize text-slate-800">{value}</dd>
    </div>
  ) : null;

const AuctionDetail = ({ kind }) => {
  const cfg = CONFIG[kind];
  const { Icon } = cfg.label;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const loggedIn = user.id !== undefined;

  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [enchere, setEnchere] = React.useState(null);
  const [article, setArticle] = React.useState({});
  const [images, setImages] = React.useState([]);
  const [activeImage, setActiveImage] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [bids, setBids] = React.useState([]);
  const [delta, setDelta] = React.useState(5);
  const [watchIri, setWatchIri] = React.useState(null);
  const [modal, setModal] = React.useState(null); // "confirm" | "bids" | "delete" | "dates"
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dates, setDates] = React.useState({ start: "", end: "" });
  const [bidPages, setBidPages] = React.useState(1);

  const clock = useAuctionClock(enchere ? enchere.startDate : 0, enchere ? enchere.endDate : 0);
  const closed = enchere && enchere.fermeture !== null;
  const status = !enchere ? "upcoming" : closed ? "ended" : clock.status;
  const isOwner = enchere && enchere.user.id === user.id;

  //#region data loading
  const loadPrice = React.useCallback(
    (initPrice) =>
      axios
        .get(`${apiRoutes.API}${cfg.highest}`, {
          params: { page: 1, [cfg.watchField]: `/api/${cfg.resource}/${id}`, "order[date]": "desc" },
        })
        .then((res) => {
          const first = res.data["hydra:member"][0];
          setPrice(first ? first.value : initPrice);
        })
        .catch(console.log),
    [cfg, id]
  );

  const loadBids = React.useCallback(
    (pages = 1) =>
      axios
        .get(`${apiRoutes.API}${cfg.bidsTable}`, {
          params: { page: pages, [cfg.watchField]: `/api/${cfg.resource}/${id}`, "order[date]": "desc" },
        })
        .then((res) => setBids((prev) => (pages === 1 ? res.data["hydra:member"] : [...prev, ...res.data["hydra:member"]])))
        .catch(console.log),
    [cfg, id]
  );

  const loadEnchere = React.useCallback(() => {
    return axios
      .get(`${apiRoutes.API}/${cfg.resource}/${id}`)
      .then((res) => {
        const data = res.data;
        setEnchere(data);
        setDates({ start: toInput(data.startDate), end: toInput(data.endDate) });
        setImages((data.article.documents || []).map((d) => BACKEND_URL + d.contentUrl));
        loadPrice(data.initPrice);
        Socket.emit("join-rooms", [data["@id"].concat("LOCAL")]);
        return axios.get(`${apiRoutes.API}/articles/${data.article.id}`);
      })
      .then((res) => setArticle(res.data))
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [cfg, id, loadPrice]);

  React.useEffect(() => {
    setLoading(true);
    setNotFound(false);
    loadEnchere();
    loadBids(1);
    setBidPages(1);
    return () => Socket.emit("leave-room", `/api/${cfg.resource}/${id}`);
  }, [id, cfg, loadEnchere, loadBids]);

  // live updates pushed by the socket server
  React.useEffect(() => {
    const onNewPrice = () => {
      loadPrice(enchere ? enchere.initPrice : 0);
      loadBids(1);
    };
    Socket.on("NEW_PRICE", onNewPrice);
    return () => Socket.off("NEW_PRICE", onNewPrice);
  }, [loadPrice, loadBids, enchere]);

  // is this auction in the user's watch list?
  React.useEffect(() => {
    if (!loggedIn) return;
    Api.get("/surveilles", { params: { user: `/api/users/${user.id}`, [cfg.watchField]: `/api/${cfg.resource}/${id}` } })
      .then((res) => {
        const first = res.data["hydra:member"][0];
        setWatchIri(first ? first["@id"] : null);
      })
      .catch(() => {});
  }, [loggedIn, user.id, cfg, id]);
  //#endregion

  //#region actions
  const toggleWatch = () => {
    if (!watchIri) {
      Api.post("/surveilles", { user: `/api/users/${user.id}`, [cfg.watchField]: `/api/${cfg.resource}/${id}` })
        .then((res) => {
          setWatchIri(res.data["@id"]);
          dispatch(fetchWatchList(user.id));
        })
        .catch(console.log);
    } else {
      Api.delete(watchIri.replace("/api", ""))
        .then(() => {
          setWatchIri(null);
          dispatch(fetchWatchList(user.id));
        })
        .catch(console.log);
    }
  };

  const newPrice = Math.round((price + cfg.sign * delta) * 100) / 100;
  const validBid = delta > 0 && newPrice > 0;

  const placeBid = () => {
    setBusy(true);
    setError("");
    Api.post(cfg.action, {
      user: `/api/users/${user.id}`,
      [cfg.watchField]: `/api/${cfg.resource}/${id}`,
      value: newPrice,
      date: new Date(),
    })
      .then(() => {
        setModal(null);
        loadPrice(enchere.initPrice);
        loadBids(1);
        Socket.emit("AUGMENT", enchere["@id"], user.displayName, newPrice, kind === "inverse" ? enchere.initPrice : 1);
      })
      .catch(() => setError("Votre offre n'a pas pu être enregistrée. Réessayez."))
      .finally(() => setBusy(false));
  };

  const closeAuction = () =>
    Api.post("/fermetures", { date: new Date().getTime(), isSold: true, finalPrice: price, [cfg.watchField]: `/api/${cfg.resource}/${id}` })
      .then(loadEnchere)
      .catch(() => alert("Une erreur est survenue."));

  const deleteAuction = () => {
    setBusy(true);
    Api.delete(`/${cfg.resource}/${id}`)
      .then(() => navigate("/"))
      .catch(() => {
        setBusy(false);
        setModal(null);
        alert("Il y a une erreur, veuillez contacter le support technique.");
      });
  };

  const deleteBid = (bidId) =>
    Api.delete(`${cfg.bidsResource}/${bidId}`)
      .then(() => {
        loadPrice(enchere.initPrice);
        loadBids(1);
        setBidPages(1);
      })
      .catch(() => alert("Une erreur interne du serveur est survenue."));

  const saveDates = async () => {
    setBusy(true);
    setError("");
    try {
      if (dates.start !== toInput(enchere.startDate)) await Api.put(`/${cfg.resource}/${id}`, { startDate: new Date(dates.start).toISOString() });
      if (dates.end !== toInput(enchere.endDate)) await Api.put(`/${cfg.resource}/${id}`, { endDate: new Date(dates.end).toISOString() });
      setModal(null);
      loadEnchere();
    } catch (err) {
      setError(err.response && err.response.status >= 500 ? "Erreur interne du serveur." : "Dates invalides.");
    }
    setBusy(false);
  };
  //#endregion

  if (loading) {
    return (
      <div className="container-page grid gap-8 py-10 lg:grid-cols-5">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200 lg:col-span-3" />
        <div className="space-y-4 lg:col-span-2">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-56 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }
  if (notFound || !enchere) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Cette {cfg.label.noun} est introuvable</h1>
        <Link to={cfg.path} className="btn-primary mt-6">Retour aux {cfg.label.noun}s</Link>
      </div>
    );
  }

  const seller = enchere.user;
  const city = seller.adresse && seller.adresse[0] && seller.adresse[0].ville;
  const statusBadge =
    status === "live" ? (
      <span className="badge bg-emerald-50 text-emerald-700"><span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500" /> En direct</span>
    ) : status === "upcoming" ? (
      <span className="badge bg-amber-50 text-amber-700">À venir</span>
    ) : (
      <span className="badge bg-slate-100 text-slate-600">Terminée</span>
    );

  return (
    <div className="container-page py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">Accueil</Link> <span className="mx-1.5">/</span>
        <Link to={cfg.path} className="hover:text-brand-600">{kind === "inverse" ? "Enchères inversées" : "Enchères"}</Link> <span className="mx-1.5">/</span>
        <span className="text-slate-800">{article.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* gallery */}
        <div className="lg:col-span-3 lg:row-start-1">
          <div className="card overflow-hidden p-2">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              <img src={images[activeImage] || placeHolder} alt={article.name} className="h-full w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="mt-2 grid grid-cols-5 gap-2">
                {images.map((src, i) => (
                  <button key={src} onClick={() => setActiveImage(i)} className={`aspect-square overflow-hidden rounded-xl ring-2 transition ${i === activeImage ? "ring-brand-500" : "ring-transparent opacity-70 hover:opacity-100"}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* sticky bid panel */}
        <aside className="space-y-5 lg:col-span-2 lg:col-start-4 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24 space-y-5">
            <div>
              <div className="flex items-center gap-2">{statusBadge}</div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{article.name}</h1>
            </div>

            <div className="card space-y-5 p-6">
              <Countdown variant="blocks" startDate={enchere.startDate} endDate={enchere.endDate} />
              {closed && <p className="text-sm font-semibold text-slate-500">Clôturée par le vendeur.</p>}

              <div className="flex items-end justify-between border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{cfg.label.price}</p>
                  <p className="text-4xl font-black tabular-nums text-slate-900">
                    {fmt(price)} <span className="text-lg font-bold text-slate-400">TND</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Prix de départ</p>
                  <p className="font-semibold tabular-nums text-slate-600">{fmt(enchere.initPrice)} TND</p>
                </div>
              </div>

              {status === "live" && !isOwner && (
                loggedIn ? (
                  <div className="space-y-3 border-t border-slate-100 pt-5">
                    <label htmlFor="delta" className="text-sm font-semibold text-slate-700">
                      {kind === "inverse" ? "Montant de la réduction" : "Montant de l'augmentation"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {cfg.steps.map((s) => (
                        <button key={s} onClick={() => setDelta(s)} className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${delta === s ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                          {cfg.sign > 0 ? "+" : "−"}{s}
                        </button>
                      ))}
                    </div>
                    <input id="delta" type="number" min="0.1" step="0.1" value={delta} onChange={(e) => setDelta(parseFloat(e.target.value) || 0)} className="input" />
                    <p className="text-sm text-slate-500">
                      Nouveau prix : <span className="font-bold text-slate-900">{fmt(newPrice)} TND</span>
                    </p>
                    <button disabled={!validBid || busy} onClick={() => setModal("confirm")} className="btn-primary w-full !py-3">
                      <Gavel size={17} /> {cfg.label.verb}
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-slate-100 pt-5">
                    <Link to={navRoutes.LOGIN} className="btn-primary w-full !py-3">Connectez-vous pour participer</Link>
                  </div>
                )
              )}

              {isOwner && (
                <div className="space-y-2 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vous êtes le vendeur</p>
                  <button onClick={() => { loadBids(1); setBidPages(1); setModal("bids"); }} className="btn-secondary w-full">{cfg.label.manage}</button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setError(""); setModal("dates"); }} className="btn-secondary"><CalendarClock size={16} /> Dates</button>
                    {status !== "ended" && <button onClick={closeAuction} className="btn-secondary"><CheckCircle2 size={16} /> Clôturer</button>}
                  </div>
                  <button onClick={() => setModal("delete")} className="btn w-full text-rose-600 hover:bg-rose-50"><Trash2 size={16} /> Supprimer</button>
                </div>
              )}

              {loggedIn && !isOwner && status !== "ended" && (
                <button onClick={toggleWatch} className="btn-secondary w-full">
                  {watchIri ? <><EyeOff size={16} /> Ne plus surveiller</> : <><Eye size={16} /> Surveiller cette enchère</>}
                </button>
              )}
            </div>

            {/* seller */}
            <div className="card flex items-center gap-4 p-5">
              <Avatar name={seller.displayName} size={52} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">Vendeur</p>
                <Link to={`${navRoutes.CONSULTUSER}/${seller.id}`} className="block truncate font-bold text-slate-900 hover:text-brand-700">{seller.displayName}</Link>
                {city && <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} /> {city}</p>}
              </div>
              <Link to={`${navRoutes.CONSULTUSER}/${seller.id}`} className="btn-secondary !px-3 !py-2 text-xs">Profil</Link>
            </div>

            {/* bid history */}
            <div className="card p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Icon size={16} className="text-brand-600" /> {cfg.label.history}</h2>
              {bids.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">Aucune {cfg.label.bid} pour le moment. Soyez le premier !</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {bids.slice(0, 6).map((b, i) => (
                    <li key={b.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <Avatar name={b.user.displayName} size={28} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-800">{b.user.displayName}</p>
                        <p className="text-xs text-slate-400">{dateTime(b.date)}</p>
                      </div>
                      <span className={`font-bold tabular-nums ${i === 0 ? "text-emerald-600" : "text-slate-600"}`}>{fmt(b.value)} TND</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
        {/* description + details (below the bid panel on mobile) */}
        <div className="space-y-6 lg:col-span-3 lg:row-start-2">
          <section className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">{article.description || "Aucune description fournie."}</p>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Détails de l'article</h2>
            <dl className="mt-2 divide-y divide-slate-100">
              <DetailRow label="État" value={article.state} />
              <DetailRow label="Localisation" value={article.localisation} />
              <DetailRow label="Marque" value={article.brand} />
              <DetailRow label="Code barre" value={article.codebar} />
              <DetailRow label="Fabrication" value={article.fabrication_date && new Date(article.fabrication_date).toLocaleDateString("fr-FR")} />
              <DetailRow label="Quantité" value={String(enchere.quantity)} />
            </dl>
          </section>
        </div>

      </div>

      {/* confirm bid */}
      <Modal
        open={modal === "confirm"}
        onClose={() => setModal(null)}
        title="Confirmer votre offre"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>Annuler</button>
            <button className="btn-primary" disabled={busy} onClick={placeBid}>
              {busy && <Loader2 size={16} className="animate-spin" />} Confirmer
            </button>
          </>
        }
      >
        <p className="text-slate-600">
          Vous allez proposer <span className="font-bold text-slate-900">{fmt(newPrice)} TND</span> pour « {article.name} ».
        </p>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          Cette {cfg.label.bid} est définitive et ne peut pas être annulée. Une {cfg.label.bid} fantaisiste peut entraîner des pénalités.
        </div>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
      </Modal>

      {/* owner: manage bids */}
      <Modal open={modal === "bids"} onClose={() => setModal(null)} title={cfg.label.manage} size="lg" footer={<button className="btn-secondary" onClick={() => setModal(null)}>Fermer</button>}>
        {bids.length === 0 ? (
          <p className="text-slate-500">Aucune {cfg.label.bid} pour le moment.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr><th className="pb-2">Membre</th><th className="pb-2">Téléphone</th><th className="pb-2 text-right">Montant</th><th className="pb-2 text-right">Date</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bids.map((b) => (
                <tr key={b.id}>
                  <td className="py-2.5"><Link to={`${navRoutes.CONSULTUSER}/${b.user.id}`} className="font-semibold text-brand-700 hover:underline">{b.user.displayName}</Link></td>
                  <td className="py-2.5 text-slate-500">{b.user.telephone}</td>
                  <td className="py-2.5 text-right font-bold tabular-nums">{fmt(b.value)}</td>
                  <td className="py-2.5 text-right text-slate-500">{dateTime(b.date)}</td>
                  <td className="py-2.5 text-right"><button onClick={() => deleteBid(b.id)} aria-label="Supprimer" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {bids.length === bidPages * 15 && (
          <button className="btn-ghost mt-3 w-full" onClick={() => { loadBids(bidPages + 1); setBidPages(bidPages + 1); }}>Afficher plus</button>
        )}
      </Modal>

      {/* owner: delete */}
      <Modal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        title="Supprimer cette annonce ?"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>Annuler</button>
            <button className="btn !bg-rose-600 text-white hover:!bg-rose-700" disabled={busy} onClick={deleteAuction}>Supprimer</button>
          </>
        }
      >
        <p className="text-slate-600">Cette action est irréversible. L'{cfg.label.noun} et tout son historique seront supprimés.</p>
      </Modal>

      {/* owner: dates */}
      <Modal
        open={modal === "dates"}
        onClose={() => setModal(null)}
        title="Modifier les dates"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>Annuler</button>
            <button className="btn-primary" disabled={busy} onClick={saveDates}>Enregistrer</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Début</label>
            <input type="datetime-local" className="input" value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Fin</label>
            <input type="datetime-local" className="input" value={dates.end} onChange={(e) => setDates({ ...dates, end: e.target.value })} />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default AuctionDetail;
