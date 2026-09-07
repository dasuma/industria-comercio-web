import type { Invoice } from '../models/invoice.interface';

interface PeriodSource {
  startDate: string;
  endDate: string | null;
}

// Parseamos al mediodía local para que un ISO "YYYY-MM-DD" no caiga en el día
// anterior en zonas horarias negativas (Colombia es UTC-5).
const atNoon = (isoDate: string): Date => new Date(`${isoDate.slice(0, 10)}T12:00:00`);

export const resolveStartDate = (source: PeriodSource, year: number): string =>
  atNoon(source.startDate).getFullYear() === year ? source.startDate.slice(0, 10) : `${year}-01-01`;

export const resolveEndDate = (source: PeriodSource, year: number): string => {
  if (!source.endDate) return `${year}-12-31`;
  return atNoon(source.endDate).getFullYear() === year
    ? source.endDate.slice(0, 10)
    : `${year}-12-31`;
};

/** Meses calendario que abarca el período, acotado a 12. */
export const diffMonths = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const s = atNoon(start);
  const e = atNoon(end);
  return Math.min(
    12,
    Math.max(0, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1)
  );
};

/** Para cada mes del año (índice 0-11), si el período lo toca. */
export const coveredMonths = (start: string, end: string, year: number): boolean[] => {
  const s = atNoon(start);
  const e = atNoon(end);
  return Array.from({ length: 12 }, (_, month) => {
    const monthStart = new Date(year, month, 1, 12);
    const monthEnd = new Date(year, month + 1, 0, 12);
    return monthEnd >= s && monthStart <= e;
  });
};

export const lastPaidYear = (invoices: Invoice[]): number | null => {
  const paidYears = invoices.filter(inv => inv.status === 'paid').map(inv => inv.year);
  return paidYears.length > 0 ? Math.max(...paidYears) : null;
};

/**
 * Años pendientes de liquidar: desde el siguiente al último pagado hasta el
 * año anterior al actual (el año en curso nunca se liquida). Sin pagos, se
 * asume que falta liquidar solo el año anterior.
 */
export const computeSettleYears = (invoices: Invoice[], currentYear: number): number[] => {
  const maxYear = currentYear - 1;
  const firstPending = (lastPaidYear(invoices) ?? currentYear - 2) + 1;
  const years: number[] = [];
  for (let y = firstPending; y <= maxYear; y++) years.push(y);
  return years;
};
