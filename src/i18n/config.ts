
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptTranslations from './locales/pt.json';
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      pt: { translation: ptTranslations },
      en: { translation: enTranslations },
      es: { translation: esTranslations }
    },
    fallbackLng: 'pt',
    lng: 'pt',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['navigator'],
      caches: [] // Disable caching
    }
  });

export default i18n;
