import type { Locale } from '@/i18n/config';
import { cgmAnalysisDictEs, type CgmAnalysisDictionary } from './es';
import { cgmAnalysisDictEn } from './en';

const dicts: Record<Locale, CgmAnalysisDictionary> = {
  es: cgmAnalysisDictEs,
  en: cgmAnalysisDictEn
};

export const getCgmAnalysisDict = (locale: Locale): CgmAnalysisDictionary =>
  dicts[locale] ?? dicts.es;
export type { CgmAnalysisDictionary };
