import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Socket from "./Socket";
import { newNotifications } from "../../../redux/actions";
import { navRoutes } from "../../../config/routes";
import useClickOutside from "../../ui/useClickOutside";

// "3 h ago" style label
function timeAgo(date, t) {
  const diff = Math.max(0, Date.now() - new Date(date).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return t("timeAgo.now");
  if (m < 60) return t("timeAgo.minutes", { count: m });
  const h = Math.floor(m / 60);
  if (h < 24) return t("timeAgo.hours", { count: h });
  return t("timeAgo.days", { count: Math.floor(h / 24) });
}

export default function NotificationsMenu() {
  const { t } = useTranslation();
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");
  useClickOutside(ref, () => setOpen(false));

  // live notifications pushed by the socket server
  React.useEffect(() => {
    const onNotification = (notification) => {
      setToast(notification.title);
      dispatch(newNotifications(notification));
    };
    Socket.on("NOTIFICATION", onNotification);
    return () => Socket.off("NOTIFICATION", onNotification);
  }, [dispatch]);

  React.useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const list = Object.keys(notifications || {}).map((k) => notifications[k]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t("notifications.title")}
        className="relative flex h-10 w-10 items-center justify-center text-gray-900 transition hover:text-brand-600"
      >
        <Bell size={22} strokeWidth={1.75} />
        {list.length > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand-600" />}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden border border-gray-300 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
            <h3 className="text-sm font-bold text-gray-900">{t("notifications.title")}</h3>
            <Link to={navRoutes.NOTIFICATIONS} onClick={() => setOpen(false)} className="text-xs text-gray-900 underline hover:text-brand-600">
              {t("common.seeAll")}
            </Link>
          </div>
          <ul className="max-h-80 divide-y divide-gray-100 overflow-auto">
            {list.length === 0 && <li className="px-4 py-8 text-center text-sm text-gray-500">{t("notifications.empty")}</li>}
            {list.map((n, i) => (
              <li key={n.id || i}>
                <a href={n.route} className="block px-4 py-3 transition hover:bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{n.description}</p>
                  <p className="mt-1 text-[11px] text-gray-400">{timeAgo(n.date, t)}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] flex max-w-xs items-start gap-3 bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          <Bell size={16} className="mt-0.5 shrink-0 text-white" />
          <span>{toast}</span>
          <button onClick={() => setToast("")} aria-label={t("common.close")}><X size={16} className="text-gray-400" /></button>
        </div>
      )}
    </div>
  );
}
