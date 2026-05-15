'use client';

import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { ContractSearch } from '@modules/cgm-analysis';
import type { Contract } from '@modules/cgm-analysis';
import { useFindContractsByIds } from '../../data';
import { getRetentionDict } from '../../dictionaries';
import { ContractDetail } from '../ContractDetail';

interface ContractsViewProps {
  locale: Locale;
}

export const ContractsView = ({ locale }: ContractsViewProps) => {
  const dict = getRetentionDict(locale);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isFetching, isError } = useFindContractsByIds(
    selectedId !== null ? [selectedId] : []
  );

  const contract = data?.contracts?.[0];

  const handleSelect = (c: Contract) => {
    setSelectedId(c.id);
  };

  return (
    <div className="flex flex-col gap-6">
      <ContractSearch locale={locale} onSelect={handleSelect} />

      {selectedId === null && (
        <div className="border-stroke-soft-200 bg-bg-weak-25/40 text-paragraph-sm text-text-soft-400 rounded-xl border border-dashed p-10 text-center">
          {dict.contracts.search.placeholder}
        </div>
      )}

      {selectedId !== null && isFetching && (
        <div className="border-stroke-soft-200 bg-bg-weak-25/40 text-paragraph-sm text-text-soft-400 rounded-xl border border-dashed p-10 text-center">
          …
        </div>
      )}

      {selectedId !== null && isError && !isFetching && (
        <div className="border-stroke-soft-200 bg-bg-weak-25/40 text-paragraph-sm text-text-soft-400 rounded-xl border border-dashed p-10 text-center">
          Error al cargar el contrato.
        </div>
      )}

      {contract && !isFetching && (
        <div className="flex flex-col gap-2">
          <h2 className="text-label-md text-text-strong-950">{contract.name}</h2>
          <ContractDetail locale={locale} contract={contract} />
        </div>
      )}
    </div>
  );
};
