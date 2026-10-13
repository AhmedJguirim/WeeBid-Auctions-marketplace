import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { navRoutes } from "../../config/routes";
import PagedTable, { dateLabel } from "./PagedTable";

const DemandesListing = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  return (
    <PagedTable
      title={t("userMenu.quotes")}
      subtitle={t("tables.quotesSubtitle")}
      endpoint="/demandesTable"
      params={{ transmittedTo: `/api/users/${user.id}` }}
      enabled={user.id !== undefined}
      emptyText={t("tables.quotesEmpty")}
      columns={[
        { header: t("tables.from"), cell: (d) => <Link to={`${navRoutes.DEMANDE}/${d.id}`} className="font-semibold text-brand-700 hover:underline">{d.transmitter.displayName}</Link> },
        { header: t("detail.date"), align: "right", cell: (d) => <span className="text-slate-500">{dateLabel(d.date)}</span> },
        { header: "", align: "right", cell: (d) => <Link to={`${navRoutes.DEMANDE}/${d.id}`} className="btn-secondary !px-3 !py-1.5 text-xs">{t("tables.reply")}</Link> },
      ]}
    />
  );
};

export default DemandesListing;
