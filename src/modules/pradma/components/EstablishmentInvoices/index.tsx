'use client';

import { useState } from 'react';
import { useGetInvoicesByEstablishment, useGetEstablishment } from '../../data';
import type { Invoice } from '../../models/invoice.interface';
import type { PradmaDictionary } from '../../dictionaries';
import { SettlementSheet, InvoiceRow } from '../SettlementSheet';

interface EstablishmentInvoicesProps {
  establishmentId: number;
  dict: PradmaDictionary;
}

export const EstablishmentInvoices = ({ establishmentId, dict }: EstablishmentInvoicesProps) => {
  const d = dict.invoices;
  const [selected, setSelected] = useState<Invoice | null>(null);
  const { data: establishment } = useGetEstablishment(establishmentId);
  const { data: invoices, isLoading, isError } = useGetInvoicesByEstablishment(establishmentId);

  if (isLoading) return <p className="text-text-sub-600 py-6 text-center text-sm">{d.loading}</p>;
  if (isError) return <p className="text-error-dark py-6 text-center text-sm">{d.errorLoading}</p>;
  if (!invoices?.length)
    return <p className="text-text-sub-600 py-6 text-center text-sm">{d.empty}</p>;

  return (
    <>
      <div className="flex flex-col gap-2">
        {invoices.map(invoice => (
          <InvoiceRow
            key={invoice.id}
            year={invoice.year}
            status={invoice.status}
            total={invoice.total}
            statusLabel={d.status[invoice.status as keyof typeof d.status] ?? invoice.status}
            onClick={() => setSelected(invoice)}
          />
        ))}
      </div>

      {selected && establishment && (
        <SettlementSheet
          mode="saved"
          invoice={selected}
          establishment={establishment}
          statusLabels={d.status as Record<string, string>}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};
