import type { Locale } from '@/i18n/config';
import { pradmaDictEs, type PradmaDictionary } from './es';
import { pradmaDictEn } from './en';

const dicts: Record<Locale, PradmaDictionary> = {
  es: pradmaDictEs,
  en: pradmaDictEn
};

export const getPradmaDict = (locale: Locale): PradmaDictionary => dicts[locale] ?? dicts.es;
export type { PradmaDictionary };
