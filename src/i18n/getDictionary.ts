import 'server-only';
import { cookies } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from './config';

const dictionaries = {
  es: () => import('./dictionaries/es.json').then(mod => mod.default),
  en: () => import('./dictionaries/en.json').then(mod => mod.default)
};

export type Dictionary = Awaited<ReturnType<typeof dictionaries.es>>;

// Spanish-first: ignoramos el accept-language del browser. Si alguien quiere
// otro idioma, debe setear explícitamente la cookie NEXT_LOCALE.
export const getActiveLocale = async (): Promise<Locale> => {
  const fromCookie = (await cookies()).get('NEXT_LOCALE')?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;
  return defaultLocale;
};

export const getDictionary = async (locale?: Locale): Promise<Dictionary> => {
  const active = locale ?? (await getActiveLocale());
  return dictionaries[active]?.() ?? dictionaries[defaultLocale]();
};
