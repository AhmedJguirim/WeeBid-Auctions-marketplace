import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { navRoutes } from "../../config/routes";
import PagedTable, { dateLabel } from "./PagedTable";

const PropositionsListing = () => {
  const user = useSelector((state) => state.user);
  return (
    <PagedTable
      title="Propositions reçues"
      subtitle="Les enchères que d'autres membres vous proposent suite à vos demandes de devis."
      endpoint="/propositionsTable"
      params={{ transmittedTo: `/api/users/${user.id}` }}
      enabled={user.id !== undefined}
      emptyText="Vous n'avez reçu aucune proposition."
      columns={[
        { header: "De la part de", cell: (p) => <Link to={`${navRoutes.CONSULTUSER}/${p.transmitter.id}`} className="font-semibold text-brand-700 hover:underline">{p.transmitter.displayName}</Link> },
        { header: "Enchère proposée", cell: (p) => <Link to={`${navRoutes.ENCHERE}/${p.enchere.id}`} className="font-semibold text-slate-800 hover:text-brand-700 hover:underline">{p.enchere.article.name}</Link> },
        { header: "Date", align: "right", cell: (p) => <span className="text-slate-500">{dateLabel(p.date)}</span> },
      ]}
    />
  );
};

export default PropositionsListing;
