
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptTranslations from './locales/pt.json';
import esTranslations from './locales/es.json';

// Import English translation files
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enHome from './locales/en/home.json';
import enFeatures from './locales/en/features.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptTranslations },
      es: { translation: esTranslations },
      en: {
        translation: {
          common: enCommon,
          auth: enAuth,
          home: enHome,
          features: enFeatures
        }
      }
    },
    fallbackLng: 'pt',
    lng: 'pt',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['navigator'],
      caches: []
    }
  });

export default i18n;
