import type { Locale } from '@/i18n/config';
import { exampleDictEs, type ExampleDictionary } from './es';
import { exampleDictEn } from './en';

const dicts: Record<Locale, ExampleDictionary> = {
  es: exampleDictEs,
  en: exampleDictEn
};

export const getExampleDict = (locale: Locale): ExampleDictionary => dicts[locale] ?? dicts.es;
export type { ExampleDictionary };
