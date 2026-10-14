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
  const base = "flex h-10 min-w-[2.5rem] items-center justify-center border border-transparent px-3 text-sm transition";
  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label={t("pagination.label")}>
      <button className={`${base} text-gray-600 hover:border-gray-900 disabled:opacity-40 disabled:hover:border-transparent`} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={18} />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`${base} ${p === page ? "border-gray-900 font-bold text-gray-900" : "text-gray-600 hover:border-gray-300"}`}
          >
            {p}
          </button>
        )
      )}
      <button className={`${base} text-gray-600 hover:border-gray-900 disabled:opacity-40 disabled:hover:border-transparent`} disabled={page >= count} onClick={() => onChange(page + 1)}>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
