import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './i18n/en/common.json';
import fi from './i18n/fi/common.json';
import sv from './i18n/sv/common.json';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { common: en },
      fi: { common: fi },
      sv: { common: sv },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fi', 'sv'],
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
    // The message extractor adds any missing translations as empty strings, which is what we want.
    // Unless we set this, those empty strings are then shown as is in the interface, though;
    // with this, we'll fall back to the English string instead.
    // This should be fine since we shouldn't need to support empty translations, but if we do,
    // this should then be changed.
    returnEmptyString: false,
  });

export default i18n;
