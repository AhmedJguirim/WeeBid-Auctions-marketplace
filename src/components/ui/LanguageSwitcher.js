import React from "react";
import { useTranslation } from "react-i18next";
import { languages } from "../../i18n";

// Compact FR | EN toggle.
const LanguageSwitcher = ({ className = "" }) => {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage || "fr").slice(0, 2);
  return (
    <div role="group" aria-label={t("lang.label")} className={`inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-bold ${className}`}>
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          title={l.label}
          aria-pressed={current === l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`rounded-md px-2.5 py-1.5 transition ${current === l.code ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
