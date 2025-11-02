import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
});

// sync document direction with current language
const setDir = (lng: string) => {
  if (typeof document !== "undefined") {
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  }
};

setDir(i18n.language);

i18n.on("languageChanged", (lng) => setDir(lng));

export default i18n;
