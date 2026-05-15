import type { Locale } from '@/i18n/config';
import { cgmReportDictEs, type CgmReportDictionary } from './es';
import { cgmReportDictEn } from './en';

const dicts: Record<Locale, CgmReportDictionary> = {
  es: cgmReportDictEs,
  en: cgmReportDictEn
};

export const getCgmReportDict = (locale: Locale): CgmReportDictionary => dicts[locale] ?? dicts.es;
export type { CgmReportDictionary };
