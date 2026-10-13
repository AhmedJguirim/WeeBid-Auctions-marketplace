import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../../config/env";
import { navRoutes } from "../../config/routes";
import demoListImage from "../../media/images/demoListImage.png";
import Countdown, { useAuctionClock } from "../ui/Countdown";
import EmptyState from "../ui/EmptyState";
import Avatar from "../ui/Avatar";
import { formatNumber } from "../../i18n";

const StatusBadge = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const { status } = useAuctionClock(startDate, endDate);
  if (status === "live")
    return (
      <span className="badge bg-white/95 text-emerald-600 shadow-sm backdrop-blur">
        <span className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500" />
        {t("status.live")}
      </span>
    );
  if (status === "upcoming") return <span className="badge bg-white/95 text-amber-600 shadow-sm">{t("status.soon")}</span>;
  return <span className="badge bg-slate-900/80 text-white">{t("status.ended")}</span>;
};

export const AuctionCard = ({ vente, type }) => {
  const { t } = useTranslation();
  const reverse = type === navRoutes.ENCHEREINVERSE;
  const doc = vente.article.documents && vente.article.documents[0];
  const image = doc ? `${BACKEND_URL}${doc.contentUrl}` : demoListImage;

  return (
    <article className="group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to={`${type}/${vente.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={vente.article.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge startDate={vente.startDate} endDate={vente.endDate} />
          </div>
          <div className="absolute right-3 top-3">
            <Countdown startDate={vente.startDate} endDate={vente.endDate} />
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`${type}/${vente.id}`}>
          <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-brand-700">{vente.article.name}</h3>
        </Link>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
          <Link to={`${navRoutes.CONSULTUSER}/${vente.user.id}`} className="flex min-w-0 items-center gap-1.5 hover:text-brand-700">
            <Avatar name={vente.user.displayName} image={vente.user.image} size={20} />
            <span className="truncate">{vente.user.displayName}</span>
          </Link>
          {vente.quantity > 1 && (
            <span className="inline-flex items-center gap-1">
              <Users size={13} /> ×{vente.quantity}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {reverse ? t("card.bestPrice") : t("card.currentBid")}
            </p>
            <p className="text-xl font-extrabold tabular-nums text-slate-900">
              {formatNumber(vente.currentPrice)} <span className="text-sm font-semibold text-slate-500">TND</span>
            </p>
          </div>
          <Link to={`${type}/${vente.id}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white">
            {reverse ? t("card.propose") : t("card.bid")}
          </Link>
        </div>
      </div>
    </article>
  );
};

/**
 * Grid of auction cards. `elemsPerLine` is kept for backwards compatibility
 * (the layout is now responsive), `ventes` can be an array or an object.
 */
const ProductsListing = ({ ventes, type, columns = "default", limit }) => {
  const { t } = useTranslation();
  let list = Object.keys(ventes || {}).map((k) => ventes[k]);
  if (limit) list = list.slice(0, limit);
  const grid =
    columns === "wide"
      ? "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  return (
    <div className={`grid ${grid}`}>
      {list.map((vente) => (
        <AuctionCard key={vente.id} vente={vente} type={type} />
      ))}
      {list.length === 0 && (
        <EmptyState
          title={t("card.emptyTitle")}
          text={t("card.emptyText")}
        />
      )}
    </div>
  );
};

export default ProductsListing;
