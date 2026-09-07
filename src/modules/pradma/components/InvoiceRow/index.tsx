'use client';

import { RiArrowRightSLine } from '@dasuma/pradma-ui/icons';
import { formatCurrency, formatNumericDate } from '@/utils/format';
import type { Invoice } from '../../models/invoice.interface';
import type { PradmaDictionary } from '../../dictionaries';
import { InvoiceStatusBadge } from '../InvoiceStatusBadge';

interface InvoiceRowProps {
  invoice: Invoice;
  dict: PradmaDictionary['invoices'];
  onClick: () => void;
}

// Fila compacta de liquidación para la lista dentro del establecimiento.
export const InvoiceRow = ({ invoice, dict, onClick }: InvoiceRowProps) => {
  const statusLabel = dict.status[invoice.status as keyof typeof dict.status] ?? invoice.status;

  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-bg-weak-50 focus-visible:ring-stroke-strong-950 ring-stroke-soft-200 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ring-1 transition-colors outline-none focus-visible:ring-2"
    >
      <span className="text-label-sm text-text-strong-950 w-12 shrink-0 tabular-nums">
        {invoice.year}
      </span>
      <InvoiceStatusBadge status={invoice.status} label={statusLabel} />
      <span className="min-w-0 flex-1" />
      {invoice.expirationDate ? (
        <span className="text-paragraph-xs text-text-soft-400 shrink-0">
          {dict.expirationDate} {formatNumericDate(invoice.expirationDate)}
        </span>
      ) : null}
      <span className="text-label-sm text-text-strong-950 shrink-0 tabular-nums">
        {formatCurrency(invoice.total)}
      </span>
      <RiArrowRightSLine className="text-text-soft-400 size-4 shrink-0" aria-hidden />
    </button>
  );
};
