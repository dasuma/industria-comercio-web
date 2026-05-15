export const formatNumber = (value: number, locale = 'es-CO'): string =>
  new Intl.NumberFormat(locale).format(value);

export const formatCurrency = (value: number, currency = 'COP', locale = 'es-CO'): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    value
  );

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

const LONG_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
};

const NUMERIC_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
};

export const formatDate = (
  value: Date | string | null | undefined,
  locale = 'es-CO',
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
  fallback = '-'
): string => {
  if (value === null || value === undefined || value === '') return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatLongDate = (value: Date | string | null | undefined, locale = 'es-CO'): string =>
  formatDate(value, locale, LONG_DATE_OPTIONS);

export const formatNumericDate = (
  value: Date | string | null | undefined,
  locale = 'es-CO'
): string => formatDate(value, locale, NUMERIC_DATE_OPTIONS);
