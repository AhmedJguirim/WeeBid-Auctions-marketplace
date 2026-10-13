import React from "react";
import { useSelector } from "react-redux";
import PagedTable, { dateLabel } from "./PagedTable";

const NotificationListing = () => {
  const user = useSelector((state) => state.user);
  return (
    <PagedTable
      title="Notifications"
      subtitle="L'historique de vos notifications."
      endpoint="/notificationTable"
      params={{ user: `/api/users/${user.id}` }}
      enabled={user.id !== undefined}
      emptyText="Vous n'avez aucune notification."
      columns={[
        { header: "Titre", cell: (n) => <a href={n.route} className="font-semibold text-brand-700 hover:underline">{n.title}</a> },
        { header: "Description", cell: (n) => <span className="text-slate-600">{n.description}</span> },
        { header: "Date", align: "right", cell: (n) => <span className="whitespace-nowrap text-slate-500">{dateLabel(n.date)}</span> },
      ]}
    />
  );
};

export default NotificationListing;
