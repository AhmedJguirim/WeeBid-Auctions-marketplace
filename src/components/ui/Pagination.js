import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Minimal numbered pagination. `page` is 1-based.
const Pagination = ({ page, count, onChange }) => {
  const { t } = useTranslation();
  if (!count || count <= 1) return null;
  const pages = [];
  for (let i = 1; i <= count; i++) {
    if (i === 1 || i === count || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  const base = "flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl px-3 text-sm font-semibold transition";
  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label={t("pagination.label")}>
      <button className={`${base} text-slate-600 hover:bg-white disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={18} />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-slate-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`${base} ${p === page ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}
          >
            {p}
          </button>
        )
      )}
      <button className={`${base} text-slate-600 hover:bg-white disabled:opacity-40`} disabled={page >= count} onClick={() => onChange(page + 1)}>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
