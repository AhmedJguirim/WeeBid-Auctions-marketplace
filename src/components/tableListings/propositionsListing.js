import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { navRoutes } from "../../config/routes";
import PagedTable, { dateLabel } from "./PagedTable";

const PropositionsListing = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  return (
    <PagedTable
      title={t("userMenu.proposals")}
      subtitle={t("tables.proposalsSubtitle")}
      endpoint="/propositionsTable"
      params={{ transmittedTo: `/api/users/${user.id}` }}
      enabled={user.id !== undefined}
      emptyText={t("tables.proposalsEmpty")}
      columns={[
        { header: t("tables.from"), cell: (p) => <Link to={`${navRoutes.CONSULTUSER}/${p.transmitter.id}`} className="font-semibold text-brand-700 hover:underline">{p.transmitter.displayName}</Link> },
        { header: t("tables.proposedAuction"), cell: (p) => <Link to={`${navRoutes.ENCHERE}/${p.enchere.id}`} className="font-semibold text-slate-800 hover:text-brand-700 hover:underline">{p.enchere.article.name}</Link> },
        { header: t("detail.date"), align: "right", cell: (p) => <span className="text-slate-500">{dateLabel(p.date)}</span> },
      ]}
    />
  );
};

export default PropositionsListing;
