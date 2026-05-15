import type { Locale } from '@/i18n/config';
import { retentionDictEs } from './es';
import { retentionDictEn } from './en';

export type { RetentionDictionary } from './es';

const dicts = { es: retentionDictEs, en: retentionDictEn };

export const getRetentionDict = (locale: Locale) => dicts[locale] ?? retentionDictEs;
