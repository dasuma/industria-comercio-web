'use client';

import { useState } from 'react';
import { Skeleton } from '@dasuma/pradma-ui';
import { EmptyState } from '@/components/ListState';
import { useGetInvoicesByEstablishment } from '../../data';
import type { Establishment } from '../../models/establishment.interface';
import type { Invoice } from '../../models/invoice.interface';
import type { PradmaDictionary } from '../../dictionaries';
import { SettlementSheet } from '../SettlementSheet';
import { InvoiceRow } from '../InvoiceRow';

interface EstablishmentInvoicesProps {
  establishment: Establishment;
  dict: PradmaDictionary;
}

export const EstablishmentInvoices = ({ establishment, dict }: EstablishmentInvoicesProps) => {
  const d = dict.invoices;
  const [selected, setSelected] = useState<Invoice | null>(null);
  const { data: invoices, isLoading, isError } = useGetInvoicesByEstablishment(establishment.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" role="status" aria-busy>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton.Root key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState variant="error" title={dict.common.errorTitle} description={d.errorLoading} />
    );
  }

  if (!invoices?.length) {
    return <EmptyState title={d.empty} />;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {invoices.map(invoice => (
          <InvoiceRow
            key={invoice.id}
            invoice={invoice}
            dict={d}
            onClick={() => setSelected(invoice)}
          />
        ))}
      </div>

      {selected ? (
        <SettlementSheet
          mode="saved"
          invoice={selected}
          establishment={establishment}
          dict={dict}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </>
  );
};
