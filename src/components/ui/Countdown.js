import React from "react";
import { useTranslation } from "react-i18next";

// Splits a duration in ms into days / hours / minutes / seconds.
export const splitDuration = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
};

// Returns { status: "upcoming" | "live" | "ended", remaining: ms } and re-renders every second.
export const useAuctionClock = (startDate, endDate) => {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) return { status: "upcoming", remaining: start - now };
  if (now < end) return { status: "live", remaining: end - now };
  return { status: "ended", remaining: 0 };
};

const pad = (n) => String(n).padStart(2, "0");

export const formatShort = ({ days, hours, minutes, seconds }, t) =>
  days > 0
    ? `${days}${t("time.d")} ${pad(hours)}${t("time.h")} ${pad(minutes)}${t("time.m")}`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

/**
 * Compact countdown. `variant="pill"` for cards, `variant="blocks"` for detail pages.
 * Keeps the legacy props (startDate / endDate) used across the app.
 */
const Countdown = ({ startDate, endDate, variant = "pill" }) => {
  const { t } = useTranslation();
  const labels = { upcoming: t("countdown.startsIn"), live: t("countdown.endsIn"), ended: t("countdown.ended") };
  const { status, remaining } = useAuctionClock(startDate, endDate);
  const d = splitDuration(remaining);

  if (variant === "blocks") {
    const cells = [
      [t("time.days"), d.days],
      [t("time.hours"), d.hours],
      [t("time.min"), d.minutes],
      [t("time.sec"), d.seconds],
    ];
    return (
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {labels[status]}
        </p>
        {status === "ended" ? (
          <p className="text-2xl font-bold text-slate-400">{t("countdown.auctionEnded")}</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {cells.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-900 px-2 py-3 text-center text-white">
                <div className="text-2xl font-bold tabular-nums sm:text-3xl">{pad(value)}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const tone =
    status === "ended"
      ? "bg-slate-100 text-slate-500"
      : status === "upcoming"
      ? "bg-amber-50 text-amber-700"
      : remaining < 3600 * 1000 * 6
      ? "bg-rose-50 text-rose-600"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`badge tabular-nums ${tone}`}>
      {status === "ended" ? t("countdown.ended") : `${status === "upcoming" ? t("countdown.startsIn") + " " : ""}${formatShort(d, t)}`}
    </span>
  );
};

export default Countdown;
