import es from './dictionaries/es.json';
import en from './dictionaries/en.json';
import { defaultLocale, isLocale, type Locale } from './config';

export type ClientDictionary = typeof es;

const dictionaries: Record<Locale, ClientDictionary> = { es, en };

// Versión sync del diccionario global para Client Components que no reciben
// `locale` por prop (error boundaries). Lee el `lang` que el root layout puso
// en <html>; en SSR cae al default.
export const getClientDictionary = (locale?: Locale): ClientDictionary => {
  if (locale) return dictionaries[locale];
  if (typeof document === 'undefined') return dictionaries[defaultLocale];
  const lang = document.documentElement.lang;
  return isLocale(lang) ? dictionaries[lang] : dictionaries[defaultLocale];
};
