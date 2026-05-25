"use client";

import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import arCommon from "../../../public/locales/ar/common.json";
import enCommon from "../../../public/locales/en/common.json";

export default function LangI18nProvider({ children, lang }) {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      lng: lang,
      fallbackLng: "ar",
      supportedLngs: ["ar", "en"],
      ns: ["common"],
      defaultNS: "common",
      resources: {
        ar: { common: arCommon },
        en: { common: enCommon },
      },
      interpolation: { escapeValue: false },
      react: {
        useSuspense: false,
        bindI18n: "languageChanged loaded",
        bindI18nStore: "added removed",
      },
    });
  } else {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
