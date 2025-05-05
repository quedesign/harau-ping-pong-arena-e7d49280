
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptTranslations from './locales/pt.json';

// Inicializa i18next com configurações simplificadas
i18n
  .use(initReactI18next)
  .init({
    resources: {
<<<<<<< HEAD
      pt: { translation: ptTranslations },
=======
      pt: { translation: ptTranslations }
>>>>>>> 605609c8f086d6d7d7a78f62cfaefa565697e810
    },
    fallbackLng: 'pt',
    lng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
