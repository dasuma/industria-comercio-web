import type { Locale } from '@/i18n/config';
import { cgmRefillDictEs, type CgmRefillDictionary } from './es';
import { cgmRefillDictEn } from './en';

const dicts: Record<Locale, CgmRefillDictionary> = {
  es: cgmRefillDictEs,
  en: cgmRefillDictEn
};

export const getCgmRefillDict = (locale: Locale): CgmRefillDictionary => dicts[locale] ?? dicts.es;
export type { CgmRefillDictionary };
