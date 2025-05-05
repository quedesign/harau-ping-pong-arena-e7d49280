
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptTranslations from './locales/pt.json';

// Inicializa i18next com configurações simplificadas
i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptTranslations }
    },
    fallbackLng: 'pt',
    lng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
