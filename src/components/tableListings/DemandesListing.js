import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { navRoutes } from "../../config/routes";
import PagedTable, { dateLabel } from "./PagedTable";

const DemandesListing = () => {
  const user = useSelector((state) => state.user);
  return (
    <PagedTable
      title="Demandes de devis reçues"
      subtitle="Les membres qui vous demandent une proposition sur un produit."
      endpoint="/demandesTable"
      params={{ transmittedTo: `/api/users/${user.id}` }}
      enabled={user.id !== undefined}
      emptyText="Vous n'avez reçu aucune demande de devis."
      columns={[
        { header: "De la part de", cell: (d) => <Link to={`${navRoutes.DEMANDE}/${d.id}`} className="font-semibold text-brand-700 hover:underline">{d.transmitter.displayName}</Link> },
        { header: "Date", align: "right", cell: (d) => <span className="text-slate-500">{dateLabel(d.date)}</span> },
        { header: "", align: "right", cell: (d) => <Link to={`${navRoutes.DEMANDE}/${d.id}`} className="btn-secondary !px-3 !py-1.5 text-xs">Répondre</Link> },
      ]}
    />
  );
};

export default DemandesListing;
