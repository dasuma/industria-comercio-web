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

const DATE_ONLY_ISO = /^\d{4}-\d{2}-\d{2}$/;

// Un "YYYY-MM-DD" sin hora lo parsea `new Date` como medianoche UTC, que en
// zonas negativas (Colombia, UTC-5) cae en el día anterior. Lo anclamos al
// mediodía local para que se muestre el día que dice el string.
const parseDate = (value: Date | string): Date => {
  if (value instanceof Date) return value;
  return DATE_ONLY_ISO.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
};

export const formatDate = (
  value: Date | string | null | undefined,
  locale = 'es-CO',
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
  fallback = '-'
): string => {
  if (value === null || value === undefined || value === '') return fallback;
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatLongDate = (value: Date | string | null | undefined, locale = 'es-CO'): string =>
  formatDate(value, locale, LONG_DATE_OPTIONS);

export const formatNumericDate = (
  value: Date | string | null | undefined,
  locale = 'es-CO'
): string => formatDate(value, locale, NUMERIC_DATE_OPTIONS);

export const formatPercent = (
  value: number | null | undefined,
  locale = 'es-CO',
  maximumFractionDigits = 2
): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value)} %`;
};

/** Reemplaza `{key}` por su valor en un string de diccionario. */
export const interpolate = (template: string, values: Record<string, string | number>): string =>
  Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template
  );
