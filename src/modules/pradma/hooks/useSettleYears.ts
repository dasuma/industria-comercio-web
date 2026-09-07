import { useMemo } from 'react';
import { useGetInvoicesByEstablishment } from '../data';
import type { Invoice } from '../models/invoice.interface';
import { computeSettleYears, lastPaidYear } from '../utils/settlePeriod';

const NO_INVOICES: Invoice[] = [];

// Años que le falta liquidar a un establecimiento, derivados de sus facturas.
// Lo comparten la cabecera del detalle (CTA de pendientes) y el flujo de liquidar.
export const useSettleYears = (establishmentId: number | null) => {
  const { data, isSuccess, refetch } = useGetInvoicesByEstablishment(establishmentId);
  const invoices = data ?? NO_INVOICES;

  const years = useMemo(() => computeSettleYears(invoices, new Date().getFullYear()), [invoices]);
  const lastPaid = useMemo(() => lastPaidYear(invoices), [invoices]);

  return { years, lastPaidYear: lastPaid, isReady: isSuccess, refetch };
};
