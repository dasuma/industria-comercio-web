export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Locale BCP-47 para Intl (fechas, números, listas) a partir del locale de la app. */
export const INTL_LOCALES: Record<Locale, string> = {
  es: 'es-CO',
  en: 'en-US'
};
