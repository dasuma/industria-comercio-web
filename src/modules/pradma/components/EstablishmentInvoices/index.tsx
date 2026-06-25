'use client';

import { useState } from 'react';
import { CompactButton } from '@biaenergy/ui';
import { RiArrowDownSLine, RiArrowUpSLine, RiDownloadLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { useGetInvoicesByEstablishment } from '../../data';
import type { Invoice, InvoiceDetail } from '../../models/invoice.interface';
import type { PradmaDictionary } from '../../dictionaries';

interface EstablishmentInvoicesProps {
  establishmentId: number;
  dict: PradmaDictionary;
}

// Kinds that render as totals (highlighted green)
const TOTAL_KINDS = new Set(['gross_total', 'balance_due', 'amount_payable', 'total_payable']);

// Kinds that render as subtotals (light grey bg)
const SUBTOTAL_KINDS = new Set(['subtotal_tax']);

const formatCop = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(iso.slice(0, 10) + 'T12:00:00'));
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-bg-weak-50 text-text-sub-600',
  pending: 'bg-warning-lighter text-warning-dark',
  paid: 'bg-success-lighter text-success-dark',
  overdue: 'bg-error-lighter text-error-dark',
  created: 'bg-bg-weak-50 text-text-sub-600'
};

const handleDownloadPdf = (pdfUrl: string, invoiceId: number, year: number) => {
  const a = document.createElement('a');
  a.href = pdfUrl;
  a.download = `liquidacion-${invoiceId}-${year}.pdf`;
  a.target = '_blank';
  a.click();
};

/* ─── Row detail line ─── */
const DetailRow = ({ detail }: { detail: InvoiceDetail }) => {
  const isTotal = TOTAL_KINDS.has(detail.kind);
  const isSubtotal = SUBTOTAL_KINDS.has(detail.kind);
  return (
    <div
      className={cn(
        'border-stroke-soft-200 flex items-center gap-3 border-b px-4 py-2 last:border-0',
        isTotal && 'bg-success-lighter',
        isSubtotal && 'bg-bg-weak-50'
      )}
    >
      <span className="text-text-sub-600 min-w-0 flex-1 text-xs leading-snug">
        {detail.description || detail.kind}
      </span>
      <span
        className={cn(
          'shrink-0 text-right text-xs font-semibold tabular-nums',
          isTotal ? 'text-success-dark text-sm' : 'text-text-strong-950',
          detail.amount === 0 && !isTotal && 'text-text-soft-400 font-normal'
        )}
      >
        {detail.amount === 0 ? '—' : formatCop(detail.amount)}
      </span>
    </div>
  );
};

/* ─── Invoice card ─── */
const InvoiceCard = ({
  invoice,
  dict
}: {
  invoice: Invoice;
  dict: PradmaDictionary['invoices'];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
      {/* Header row — clickable */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="hover:bg-bg-weak-50 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
      >
        {/* Year */}
        <span className="text-text-strong-950 w-10 shrink-0 text-sm font-bold">{invoice.year}</span>

        {/* Status badge */}
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
            STATUS_STYLES[invoice.status] ?? STATUS_STYLES.pending
          )}
        >
          {dict.status[invoice.status as keyof typeof dict.status] ?? invoice.status}
        </span>

        {/* Presentation date */}
        <span className="text-text-sub-600 min-w-0 flex-1 text-xs">
          {dict.columns.presentationDate}: {formatDate(invoice.presentationDate)}
        </span>

        {/* Total */}
        <span className="text-text-strong-950 shrink-0 text-sm font-semibold tabular-nums">
          {formatCop(invoice.total)}
        </span>

        {/* Chevron */}
        <span className="text-text-soft-400 shrink-0">
          {open ? <RiArrowUpSLine className="h-4 w-4" /> : <RiArrowDownSLine className="h-4 w-4" />}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="border-stroke-soft-200 border-t">
          {/* Download button */}
          {invoice.pdfUrl && (
            <div className="border-stroke-soft-200 flex justify-end border-b px-4 py-2">
              <CompactButton.Root
                variant="ghost"
                size="medium"
                onClick={() => handleDownloadPdf(invoice.pdfUrl!, invoice.id, invoice.year)}
              >
                <CompactButton.Icon as={RiDownloadLine} />
              </CompactButton.Root>
            </div>
          )}

          {/* Rows */}
          {invoice.details.length > 0 ? (
            <div>
              {invoice.details.map(d => (
                <DetailRow key={d.id} detail={d} />
              ))}
            </div>
          ) : (
            <p className="text-text-sub-600 px-4 py-3 text-xs">—</p>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Main component ─── */
export const EstablishmentInvoices = ({ establishmentId, dict }: EstablishmentInvoicesProps) => {
  const d = dict.invoices;
  const { data: invoices, isLoading, isError } = useGetInvoicesByEstablishment(establishmentId);

  if (isLoading) return <p className="text-text-sub-600 py-6 text-center text-sm">{d.loading}</p>;
  if (isError) return <p className="text-error-dark py-6 text-center text-sm">{d.errorLoading}</p>;
  if (!invoices?.length)
    return <p className="text-text-sub-600 py-6 text-center text-sm">{d.empty}</p>;

  return (
    <div className="flex flex-col gap-2">
      {invoices.map(invoice => (
        <InvoiceCard key={invoice.id} invoice={invoice} dict={d} />
      ))}
    </div>
  );
};
