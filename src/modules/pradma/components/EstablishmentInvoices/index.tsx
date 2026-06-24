'use client';

import { useGetInvoicesByEstablishment } from '../../data';
import type { PradmaDictionary } from '../../dictionaries';

interface EstablishmentInvoicesProps {
  establishmentId: number;
  dict: PradmaDictionary;
}

export const EstablishmentInvoices = ({ establishmentId, dict }: EstablishmentInvoicesProps) => {
  const { invoicesDict } = { invoicesDict: dict.invoices };
  const { data: invoices, isLoading, isError } = useGetInvoicesByEstablishment(establishmentId);

  if (isLoading) {
    return <p className="text-text-sub-600 py-4 text-center text-sm">{invoicesDict.loading}</p>;
  }

  if (isError) {
    return (
      <p className="text-text-sub-600 py-4 text-center text-sm">{invoicesDict.errorLoading}</p>
    );
  }

  if (!invoices || invoices.length === 0) {
    return <p className="text-text-sub-600 py-4 text-center text-sm">{invoicesDict.empty}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {invoices.map(invoice => (
        <div
          key={invoice.id}
          className="bg-bg-white-0 ring-stroke-soft-200 rounded-lg px-4 py-3 ring-1"
        >
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-text-strong-950 text-sm font-semibold">
                {invoicesDict.year} {invoice.year}
              </span>
              <StatusBadge status={invoice.status} dict={invoicesDict} />
            </div>
            <span className="text-text-strong-950 text-sm font-medium">
              {formatCurrency(invoice.total)}
            </span>
          </div>

          {/* Expiration date */}
          {invoice.expirationDate && (
            <p className="text-text-sub-600 mt-1 text-xs">
              {invoicesDict.expirationDate}: {new Date(invoice.expirationDate).toLocaleDateString()}
            </p>
          )}

          {/* Details */}
          {invoice.details.length > 0 && (
            <div className="border-stroke-soft-200 mt-2 border-t pt-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-text-sub-600">
                    <th className="pb-1 text-left font-medium">{invoicesDict.kind}</th>
                    <th className="pb-1 text-right font-medium">{invoicesDict.amount}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.details.map(detail => (
                    <tr key={detail.id} className="text-text-strong-950">
                      <td className="py-0.5 capitalize">{detail.kind}</td>
                      <td className="py-0.5 text-right">{formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Helpers ─── */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-success-lighter text-success-base',
  created: 'bg-bg-weak-50 text-text-sub-600'
};

const StatusBadge = ({ status, dict }: { status: string; dict: PradmaDictionary['invoices'] }) => {
  const style = STATUS_STYLES[status] ?? 'bg-bg-weak-50 text-text-sub-600';
  const label = dict.statuses[status as keyof typeof dict.statuses] ?? status;
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{label}</span>;
};
