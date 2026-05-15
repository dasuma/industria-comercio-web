import type { Locale } from '@/i18n/config';
import { shellDictEs, type ShellDictionary } from './es';
import { shellDictEn } from './en';

const dicts: Record<Locale, ShellDictionary> = {
  es: shellDictEs,
  en: shellDictEn
};

export const getShellDict = (locale: Locale): ShellDictionary => dicts[locale] ?? dicts.es;
export type { ShellDictionary } from './es';
