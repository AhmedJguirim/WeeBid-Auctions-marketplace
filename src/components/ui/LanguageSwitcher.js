import React from "react";
import { useTranslation } from "react-i18next";
import { languages } from "../../i18n";

// Compact FR | EN toggle.
const LanguageSwitcher = ({ className = "" }) => {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage || "fr").slice(0, 2);
  return (
    <div role="group" aria-label={t("lang.label")} className={`inline-flex gap-1 text-xs font-bold ${className}`}>
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          title={l.label}
          aria-pressed={current === l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`px-1.5 py-0.5 transition ${current === l.code ? "text-gray-900 underline underline-offset-4" : "text-gray-500 hover:text-gray-900"}`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
