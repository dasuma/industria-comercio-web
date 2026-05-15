import type { Locale } from '@/i18n/config';
import { reportTitoDictEs, type ReportTitoDictionary } from './es';
import { reportTitoDictEn } from './en';

const dicts: Record<Locale, ReportTitoDictionary> = {
  es: reportTitoDictEs,
  en: reportTitoDictEn
};

export const getReportTitoDict = (locale: Locale): ReportTitoDictionary =>
  dicts[locale] ?? dicts.es;
export type { ReportTitoDictionary };
