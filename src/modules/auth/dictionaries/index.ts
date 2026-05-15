import type { Locale } from '@/i18n/config';
import { authDictEs, type AuthDictionary } from './es';
import { authDictEn } from './en';

const dicts: Record<Locale, AuthDictionary> = {
  es: authDictEs,
  en: authDictEn
};

export const getAuthDict = (locale: Locale): AuthDictionary => dicts[locale] ?? dicts.es;
export type { AuthDictionary };
