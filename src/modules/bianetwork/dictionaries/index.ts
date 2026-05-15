import type { Locale } from '@/i18n/config';
import { bianetworkDictEs, type BianetworkDictionary } from './es';
import { bianetworkDictEn } from './en';

const dicts: Record<Locale, BianetworkDictionary> = {
  es: bianetworkDictEs,
  en: bianetworkDictEn
};

export const getBianetworkDict = (locale: Locale): BianetworkDictionary =>
  dicts[locale] ?? dicts.es;
export type { BianetworkDictionary };
