import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PagedTable, { dateLabel } from "./PagedTable";

const NotificationListing = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  return (
    <PagedTable
      title={t("notifications.title")}
      subtitle={t("tables.notificationsSubtitle")}
      endpoint="/notificationTable"
      params={{ user: `/api/users/${user.id}` }}
      enabled={user.id !== undefined}
      emptyText={t("notifications.empty")}
      columns={[
        { header: t("tables.title"), cell: (n) => <a href={n.route} className="font-semibold text-brand-700 hover:underline">{n.title}</a> },
        { header: t("detail.description"), cell: (n) => <span className="text-slate-600">{n.description}</span> },
        { header: t("detail.date"), align: "right", cell: (n) => <span className="whitespace-nowrap text-slate-500">{dateLabel(n.date)}</span> },
      ]}
    />
  );
};

export default NotificationListing;
