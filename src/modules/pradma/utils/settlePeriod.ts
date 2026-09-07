import type { Invoice } from '../models/invoice.interface';

/** Período de una liquidación: siempre el año calendario completo (1 ene → 31 dic). */
export const settlePeriod = (year: number): { startDate: string; endDate: string } => ({
  startDate: `${year}-01-01`,
  endDate: `${year}-12-31`
});

export const SETTLE_PERIOD_MONTHS = 12;

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
