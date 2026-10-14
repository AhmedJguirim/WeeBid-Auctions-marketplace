import React from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import {
  CalendarClock, CheckCircle2, Eye, EyeOff, Gavel, Loader2, MapPin, ShieldAlert, Trash2, TrendingDown, TrendingUp,
} from "lucide-react";
import { BACKEND_URL } from "../../../config/env";
import { apiRoutes, navRoutes } from "../../../config/routes";
import Api from "../../../AxiosInstance";
import Socket from "../../base/customComponents/Socket";
import { fetchWatchList } from "../../../redux/actions";
import Countdown, { useAuctionClock } from "../../ui/Countdown";
import Modal from "../../ui/Modal";
import Avatar from "../../ui/Avatar";
import { formatDate, formatDateTime, formatNumber } from "../../../i18n";

const placeHolder = "/assets/placeholders/product.svg"; // not committed yet, see public/assets/README.md

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
    Icon: TrendingUp,
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
    Icon: TrendingDown,
  },
};

const fmt = formatNumber;
const dateTime = (d) => formatDateTime(d);
const toInput = (d) => {
  const date = new Date(d);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const DetailRow = ({ label, value }) =>
  value ? (
    <div className="flex justify-between gap-4 py-3 text-sm">
      <dt className="font-bold text-gray-900">{label}</dt>
      <dd className="text-right text-gray-900 first-letter:uppercase">{value}</dd>
    </div>
  ) : null;

const AuctionDetail = ({ kind }) => {
  const cfg = CONFIG[kind];
  const { Icon } = cfg;
  const { t } = useTranslation();
  const k = (key, opts) => t(`detail.${kind}.${key}`, opts);
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
      .catch(() => setError(k("bidError")))
      .finally(() => setBusy(false));
  };

  const closeAuction = () =>
    Api.post("/fermetures", { date: new Date().getTime(), isSold: true, finalPrice: price, [cfg.watchField]: `/api/${cfg.resource}/${id}` })
      .then(loadEnchere)
      .catch(() => alert(t("detail.genericError")));

  const deleteAuction = () => {
    setBusy(true);
    Api.delete(`/${cfg.resource}/${id}`)
      .then(() => navigate("/"))
      .catch(() => {
        setBusy(false);
        setModal(null);
        alert(t("detail.supportError"));
      });
  };

  const deleteBid = (bidId) =>
    Api.delete(`${cfg.bidsResource}/${bidId}`)
      .then(() => {
        loadPrice(enchere.initPrice);
        loadBids(1);
        setBidPages(1);
      })
      .catch(() => alert(t("detail.serverError")));

  const saveDates = async () => {
    setBusy(true);
    setError("");
    try {
      if (dates.start !== toInput(enchere.startDate)) await Api.put(`/${cfg.resource}/${id}`, { startDate: new Date(dates.start).toISOString() });
      if (dates.end !== toInput(enchere.endDate)) await Api.put(`/${cfg.resource}/${id}`, { endDate: new Date(dates.end).toISOString() });
      setModal(null);
      loadEnchere();
    } catch (err) {
      setError(err.response && err.response.status >= 500 ? t("detail.serverErrorShort") : t("detail.invalidDates"));
    }
    setBusy(false);
  };
  //#endregion

  if (loading) {
    return (
      <div className="container-page grid gap-8 py-10 lg:grid-cols-5">
        <div className="aspect-[4/3] animate-pulse rounded-sm bg-gray-200 lg:col-span-3" />
        <div className="space-y-4 lg:col-span-2">
          <div className="h-10 w-2/3 animate-pulse rounded-sm bg-gray-200" />
          <div className="h-40 animate-pulse rounded-sm bg-gray-200" />
          <div className="h-56 animate-pulse rounded-sm bg-gray-200" />
        </div>
      </div>
    );
  }
  if (notFound || !enchere) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-gray-900">{k("notFound")}</h1>
        <Link to={cfg.path} className="btn-primary mt-6">{k("backTo")}</Link>
      </div>
    );
  }

  const seller = enchere.user;
  const city = seller.adresse && seller.adresse[0] && seller.adresse[0].ville;
  const statusBadge =
    status === "live" ? (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-700"><span className="h-2 w-2 animate-pulse-dot rounded-full bg-green-600" /> {t("status.live")}</span>
    ) : status === "upcoming" ? (
      <span className="text-xs font-bold uppercase tracking-wide text-gray-600">{t("status.upcoming")}</span>
    ) : (
      <span className="text-xs font-bold uppercase tracking-wide text-red-700">{t("status.ended")}</span>
    );

  return (
    <div className="container-page py-6">
      <nav className="mb-8 text-xs text-gray-900">
        <Link to="/" className="underline underline-offset-2 hover:text-brand-600">{t("footer.home")}</Link> <span className="mx-2">/</span>
        <Link to={cfg.path} className="underline underline-offset-2 hover:text-brand-600">{kind === "inverse" ? t("nav.reverseAuctions") : t("nav.auctions")}</Link> <span className="mx-1.5">/</span>
        <span>{article.name}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-5 lg:grid-rows-[auto_1fr]">
        {/* gallery */}
        <div className="lg:col-span-3 lg:row-start-1">
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {images.length > 1 && (
              <div className="flex gap-3 sm:w-24 sm:shrink-0 sm:flex-col">
                {images.map((src, i) => (
                  <button key={src} onClick={() => setActiveImage(i)} className={`aspect-[4/5] w-20 shrink-0 overflow-hidden border bg-gray-100 transition sm:w-full ${i === activeImage ? "border-brand-600 ring-2 ring-brand-100" : "border-gray-300 hover:border-gray-900"}`}>
                    <img src={src} alt={`${article.name}, view ${i + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
            <div className="aspect-[4/5] flex-1 overflow-hidden border border-gray-300 bg-gray-100 sm:max-w-xl">
              <img
                src={images[activeImage] || placeHolder}
                alt={images[activeImage] ? article.name : `${article.name}: main product photo on a plain light background, item centred`}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* sticky bid panel */}
        <aside className="lg:col-span-2 lg:col-start-4 lg:row-span-2 lg:row-start-1">
          <div className="space-y-6 lg:sticky lg:top-32">
            <div>
              <div className="flex items-center gap-2">{statusBadge}</div>
              <h1 className="mt-2 font-sans text-2xl font-normal text-gray-900">{article.name}</h1>
            </div>

            <div className="space-y-5 border-t border-gray-300 pt-6">
              <Countdown variant="blocks" startDate={enchere.startDate} endDate={enchere.endDate} />
              {closed && <p className="text-sm font-semibold text-gray-500">{t("detail.closedBySeller")}</p>}

              <div className="flex items-end justify-between border-t border-gray-300 pt-5">
                <div>
                  <p className="text-sm font-bold text-gray-900">{k("price")}</p>
                  <p className="text-3xl tabular-nums text-gray-900">
                    {fmt(price)} <span className="text-base text-gray-600">TND</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">{t("detail.startPrice")}</p>
                  <p className="font-semibold tabular-nums text-gray-600">{fmt(enchere.initPrice)} TND</p>
                </div>
              </div>

              {status === "live" && !isOwner && (
                loggedIn ? (
                  <div className="space-y-3 border-t border-gray-300 pt-5">
                    <label htmlFor="delta" className="text-sm font-bold text-gray-900">
                      {k("amountLabel")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {cfg.steps.map((s) => (
                        <button key={s} onClick={() => setDelta(s)} className={`min-w-[3rem] border px-3 py-2 text-sm transition ${delta === s ? "border-brand-600 text-brand-600 ring-1 ring-brand-600" : "border-gray-900 text-gray-900 hover:border-brand-600"}`}>
                          {cfg.sign > 0 ? "+" : "−"}{s}
                        </button>
                      ))}
                    </div>
                    <input id="delta" type="number" min="0.1" step="0.1" value={delta} onChange={(e) => setDelta(parseFloat(e.target.value) || 0)} className="input" />
                    <p className="text-sm text-gray-600">
                      {t("detail.newPrice")} <span className="font-bold text-gray-900">{fmt(newPrice)} TND</span>
                    </p>
                    <button disabled={!validBid || busy} onClick={() => setModal("confirm")} className="btn-primary w-full !py-3.5">
                      <Gavel size={16} /> {k("verb")}
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-300 pt-5">
                    <Link to={navRoutes.LOGIN} className="btn-primary w-full !py-3.5">{t("detail.loginToJoin")}</Link>
                  </div>
                )
              )}

              {isOwner && (
                <div className="space-y-2 border-t border-gray-300 pt-5">
                  <p className="text-sm font-bold text-gray-900">{t("detail.youAreSeller")}</p>
                  <button onClick={() => { loadBids(1); setBidPages(1); setModal("bids"); }} className="btn-secondary w-full">{k("manage")}</button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setError(""); setModal("dates"); }} className="btn-secondary"><CalendarClock size={16} /> {t("detail.dates")}</button>
                    {status !== "ended" && <button onClick={closeAuction} className="btn-secondary"><CheckCircle2 size={16} /> {t("detail.closeAuction")}</button>}
                  </div>
                  <button onClick={() => setModal("delete")} className="btn w-full text-red-700 hover:text-red-900"><Trash2 size={16} /> {t("common.delete")}</button>
                </div>
              )}

              {loggedIn && !isOwner && status !== "ended" && (
                <button onClick={toggleWatch} className="btn-secondary w-full">
                  {watchIri ? <><EyeOff size={16} /> {t("detail.unwatch")}</> : <><Eye size={16} /> {t("detail.watch")}</>}
                </button>
              )}
            </div>

            {/* seller */}
            <div className="card flex items-center gap-4 p-5">
              <Avatar name={seller.displayName} size={52} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600">{t("detail.seller")}</p>
                <Link to={`${navRoutes.CONSULTUSER}/${seller.id}`} className="block truncate font-bold text-gray-900 hover:text-brand-600">{seller.displayName}</Link>
                {city && <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} /> {city}</p>}
              </div>
              <Link to={`${navRoutes.CONSULTUSER}/${seller.id}`} className="btn-secondary !px-3 !py-2 text-xs">{t("detail.profile")}</Link>
            </div>

            {/* bid history */}
            <div className="card p-5">
              <h2 className="flex items-center gap-2 font-sans text-sm font-bold text-gray-900"><Icon size={16} strokeWidth={1.75} /> {k("history")}</h2>
              {bids.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">{k("noBidsYet")}</p>
              ) : (
                <ul className="mt-3 divide-y divide-gray-100">
                  {bids.slice(0, 6).map((b, i) => (
                    <li key={b.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <Avatar name={b.user.displayName} size={28} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-gray-900">{b.user.displayName}</p>
                        <p className="text-xs text-gray-600">{dateTime(b.date)}</p>
                      </div>
                      <span className={`font-bold tabular-nums ${i === 0 ? "text-green-700" : "text-gray-600"}`}>{fmt(b.value)} TND</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>
        {/* description + details (below the bid panel on mobile) */}
        <div className="space-y-8 lg:col-span-3 lg:row-start-2">
          <section className="border-t border-gray-300 pt-6">
            <h2 className="font-sans text-sm font-bold text-gray-900">{t("detail.description")}</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-900">{article.description || t("detail.noDescription")}</p>
          </section>

          <section className="border-t border-gray-300 pt-6">
            <h2 className="font-sans text-sm font-bold text-gray-900">{t("detail.articleDetails")}</h2>
            <dl className="mt-2 divide-y divide-gray-100">
              <DetailRow label={t("detail.state")} value={article.state && t(`state.${article.state}`, { defaultValue: article.state })} />
              <DetailRow label={t("detail.location")} value={article.localisation} />
              <DetailRow label={t("detail.brand")} value={article.brand} />
              <DetailRow label={t("detail.barcode")} value={article.codebar} />
              <DetailRow label={t("detail.manufactured")} value={article.fabrication_date && formatDate(article.fabrication_date, { year: "numeric", month: "2-digit", day: "2-digit" })} />
              <DetailRow label={t("detail.quantity")} value={String(enchere.quantity)} />
            </dl>
          </section>
        </div>

      </div>

      {/* confirm bid */}
      <Modal
        open={modal === "confirm"}
        onClose={() => setModal(null)}
        title={k("confirmTitle")}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>{t("common.cancel")}</button>
            <button className="btn-primary" disabled={busy} onClick={placeBid}>
              {busy && <Loader2 size={16} className="animate-spin" />} {t("common.confirm")}
            </button>
          </>
        }
      >
        <p className="text-gray-600">
          <Trans i18nKey={`detail.${kind}.confirmText`} values={{ price: `${fmt(newPrice)} TND`, name: article.name }} components={{ b: <span className="font-bold text-gray-900" /> }} />
        </p>
        <div className="mt-4 flex items-start gap-2 border border-gray-300 bg-gray-100 p-3 text-sm text-gray-900">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          {k("definitive")}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Modal>

      {/* owner: manage bids */}
      <Modal open={modal === "bids"} onClose={() => setModal(null)} title={k("manage")} size="lg" footer={<button className="btn-secondary" onClick={() => setModal(null)}>{t("common.close")}</button>}>
        {bids.length === 0 ? (
          <p className="text-gray-500">{k("noBids")}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-gray-400">
              <tr><th className="pb-2">{t("detail.member")}</th><th className="pb-2">{t("detail.phone")}</th><th className="pb-2 text-right">{t("detail.amount")}</th><th className="pb-2 text-right">{t("detail.date")}</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bids.map((b) => (
                <tr key={b.id}>
                  <td className="py-2.5"><Link to={`${navRoutes.CONSULTUSER}/${b.user.id}`} className="font-semibold text-brand-700 hover:underline">{b.user.displayName}</Link></td>
                  <td className="py-2.5 text-gray-500">{b.user.telephone}</td>
                  <td className="py-2.5 text-right font-bold tabular-nums">{fmt(b.value)}</td>
                  <td className="py-2.5 text-right text-gray-500">{dateTime(b.date)}</td>
                  <td className="py-2.5 text-right"><button onClick={() => deleteBid(b.id)} aria-label={t("common.delete")} className="rounded-sm p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {bids.length === bidPages * 15 && (
          <button className="btn-ghost mt-3 w-full" onClick={() => { loadBids(bidPages + 1); setBidPages(bidPages + 1); }}>{t("common.showMore")}</button>
        )}
      </Modal>

      {/* owner: delete */}
      <Modal
        open={modal === "delete"}
        onClose={() => setModal(null)}
        title={t("detail.deleteTitle")}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>{t("common.cancel")}</button>
            <button className="btn !border-red-700 !bg-red-700 text-white hover:!bg-red-800" disabled={busy} onClick={deleteAuction}>{t("common.delete")}</button>
          </>
        }
      >
        <p className="text-gray-600">{k("deleteText")}</p>
      </Modal>

      {/* owner: dates */}
      <Modal
        open={modal === "dates"}
        onClose={() => setModal(null)}
        title={t("detail.editDates")}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>{t("common.cancel")}</button>
            <button className="btn-primary" disabled={busy} onClick={saveDates}>{t("common.save")}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">{t("detail.start")}</label>
            <input type="datetime-local" className="input" value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-900">{t("detail.end")}</label>
            <input type="datetime-local" className="input" value={dates.end} onChange={(e) => setDates({ ...dates, end: e.target.value })} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default AuctionDetail;
