import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

export const languages = [
  { code: "fr", label: "Français", short: "FR", locale: "fr-FR" },
  { code: "en", label: "English", short: "EN", locale: "en-GB" },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { fr: { translation: fr }, en: { translation: en } },
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    nonExplicitSupportedLngs: true, // "en-US" -> "en"
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "lang",
      caches: ["localStorage"],
    },
  });

// keep <html lang> and the tab title in sync with the language
const sync = () => {
  document.documentElement.lang = i18n.resolvedLanguage || "fr";
  document.title = i18n.t("meta.title");
};
i18n.on("languageChanged", sync);
i18n.on("initialized", sync);

/** BCP-47 locale (fr-FR / en-GB) of the current language, for Intl / toLocale*String. */
export const currentLocale = () => {
  const lang = i18n.resolvedLanguage || i18n.language || "fr";
  return (languages.find((l) => l.code === lang.slice(0, 2)) || languages[0]).locale;
};

export const formatNumber = (n) => (Math.round(n * 100) / 100).toLocaleString(currentLocale(), { maximumFractionDigits: 2 });
export const formatDate = (d, options = { day: "2-digit", month: "short", year: "numeric" }) =>
  new Date(d).toLocaleDateString(currentLocale(), options);
export const formatDateTime = (d, options = { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) =>
  new Date(d).toLocaleString(currentLocale(), options);

export default i18n;
