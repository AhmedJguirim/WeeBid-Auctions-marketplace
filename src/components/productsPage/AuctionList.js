import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiRoutes, navRoutes } from "../../config/routes";
import ProductsListing from "../generalComponents/ProductsListing";
import PageHeader from "../ui/PageHeader";
import Pagination from "../ui/Pagination";

const endpoints = { enchere: "/encheres", inverse: "/enchere_inverses" };
const routes = { enchere: navRoutes.ENCHERE, inverse: navRoutes.ENCHEREINVERSE };

const Switch = ({ checked, onChange, label }) => (
  <label className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-gray-900">
    <input type="checkbox" className="h-4 w-4 cursor-pointer rounded-sm border-gray-900 accent-brand-600" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    {label}
  </label>
);

const Tabs = ({ kind }) => {
  const { t } = useTranslation();
  return (
    <div className="inline-flex gap-6 text-sm">
      {[
        ["enchere", "nav.auctions", navRoutes.ENCHERES],
        ["inverse", "nav.reverseAuctions", navRoutes.ENCHERESINVERSES],
      ].map(([k, key, path]) => (
        <Link
          key={k}
          to={path}
          className={`border-b-2 pb-1 transition ${kind === k ? "border-gray-900 font-bold text-gray-900" : "border-transparent text-gray-600 hover:text-gray-900"}`}
        >
          {t(key)}
        </Link>
      ))}
    </div>
  );
};

/**
 * Generic paginated auction listing used by every "list of enchères" page
 * (all / per category / per user / search results), for both kinds.
 */
const AuctionList = ({ kind = "enchere", filters = {}, title, subtitle, tabs = false }) => {
  const { t } = useTranslation();
  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [showExpired, setShowExpired] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const filtersKey = JSON.stringify(filters);

  // go back to the first page whenever the query changes
  React.useEffect(() => setPage(1), [filtersKey, showExpired, kind]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = { page, ...filters };
    if (!showExpired) params["endDate[after]"] = new Date();
    axios
      .get(`${apiRoutes.API}${endpoints[kind]}`, { params })
      .then((response) => {
        if (cancelled) return;
        setItems(response["data"]["hydra:member"]);
        const last = response["data"]["hydra:view"] && response["data"]["hydra:view"]["hydra:last"];
        const match = last && last.match(/page=(\d+)/);
        setPages(match ? parseInt(match[1], 10) : 1);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showExpired, filtersKey, kind]);

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} actions={tabs && <Tabs kind={kind} />} />
      <div className="container-page py-8">
        <div className="mb-8 flex items-center justify-between border-b border-gray-300 pb-4">
          <p className="text-sm text-gray-900">{t("list.results", { count: items.length })}</p>
          <Switch checked={showExpired} onChange={setShowExpired} label={t("list.showEnded")} />
        </div>
        <div className={loading ? "opacity-60 transition" : "transition"}>
          <ProductsListing ventes={items} type={routes[kind]} />
        </div>
        <Pagination page={page} count={pages} onChange={setPage} />
      </div>
    </>
  );
};

export default AuctionList;
