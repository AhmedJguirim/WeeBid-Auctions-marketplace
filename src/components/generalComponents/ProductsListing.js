import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BACKEND_URL } from "../../config/env";
import { navRoutes } from "../../config/routes";
import Countdown, { useAuctionClock } from "../ui/Countdown";
import EmptyState from "../ui/EmptyState";
import { formatNumber } from "../../i18n";

const StatusLine = ({ startDate, endDate }) => {
  const { t } = useTranslation();
  const { status } = useAuctionClock(startDate, endDate);
  const tone = status === "live" ? "text-green-700" : status === "upcoming" ? "text-gray-600" : "text-red-700";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${tone}`}>
      {status === "live" && <span className="h-2 w-2 animate-pulse-dot rounded-full bg-green-600" />}
      {t(`status.${status === "upcoming" ? "soon" : status}`)}
    </span>
  );
};

// Missing seed pictures fall back to this path; the alt text says what belongs there.
const FALLBACK_IMAGE = "/assets/placeholders/product.svg";

export const AuctionCard = ({ vente, type }) => {
  const { t } = useTranslation();
  const reverse = type === navRoutes.ENCHEREINVERSE;
  const doc = vente.article.documents && vente.article.documents[0];
  const image = doc ? `${BACKEND_URL}${doc.contentUrl}` : FALLBACK_IMAGE;
  const alt = doc ? vente.article.name : `${vente.article.name}: product photo on a plain light background, item centred`;

  return (
    <article>
      <Link to={`${type}/${vente.id}`} className="block aspect-[4/5] overflow-hidden border border-gray-300 bg-gray-100">
        <img src={image} alt={alt} loading="lazy" className="h-full w-full object-contain" />
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusLine startDate={vente.startDate} endDate={vente.endDate} />
        <Countdown startDate={vente.startDate} endDate={vente.endDate} />
      </div>
      <Link to={`${type}/${vente.id}`}>
        <h3 className="mt-2 truncate font-sans text-sm font-bold text-gray-900 hover:text-brand-600">{vente.article.name}</h3>
      </Link>
      <p className="mt-1 text-sm text-gray-900">
        <span className="text-gray-600">{reverse ? t("card.bestPrice") : t("card.currentBid")} </span>
        {formatNumber(vente.currentPrice)} TND
      </p>
      <p className="mt-0.5 flex items-center justify-between text-xs text-gray-600">
        <Link to={`${navRoutes.CONSULTUSER}/${vente.user.id}`} className="truncate underline underline-offset-2 hover:text-brand-600">
          {vente.user.displayName}
        </Link>
        {vente.quantity > 1 && <span>×{vente.quantity}</span>}
      </p>
      <Link to={`${type}/${vente.id}`} className="btn-primary mt-3 w-full">
        {reverse ? t("card.propose") : t("card.bid")}
      </Link>
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
      ? "grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4";
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
