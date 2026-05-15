'use client';

import { useState } from 'react';
import { Input, Select } from '@biaenergy/ui';
import { RiSearchLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { useSearchContracts } from '../../data';
import { getCgmAnalysisDict } from '../../dictionaries';
import type { Contract, SearchContractField } from '../../models/cgm-analysis.interface';

const FIELDS: SearchContractField[] = ['id', 'name', 'sic'];

interface ContractSearchProps {
  locale: Locale;
  onSelect: (contract: Contract) => void;
}

export const ContractSearch = ({ locale, onSelect }: ContractSearchProps) => {
  const dict = getCgmAnalysisDict(locale);
  const s = dict.search;

  const [field, setField] = useState<SearchContractField>('id');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useSearchContracts(field, query);
  const results = data?.data ?? [];

  const handleSelect = (contract: Contract) => {
    onSelect(contract);
    setQuery('');
    setOpen(false);
  };

  const handleFieldChange = (value: string) => {
    setField(value as SearchContractField);
    setQuery('');
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <Select.Root value={field} onValueChange={handleFieldChange}>
          <Select.Trigger className="w-32 shrink-0">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {FIELDS.map(f => (
              <Select.Item key={f} value={f}>
                {s.fields[f]}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <div className="relative flex-1">
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                placeholder={s.placeholder}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
              />
            </Input.Wrapper>
          </Input.Root>

          {open && query.trim().length >= 1 && (
            <div className="bg-bg-white-0 border-stroke-soft-200 absolute z-50 mt-1 w-full rounded-lg border shadow-lg">
              {isFetching ? (
                <p className="text-paragraph-sm text-text-sub-600 px-3 py-2">{s.searching}</p>
              ) : results.length === 0 ? (
                <p className="text-paragraph-sm text-text-sub-600 px-3 py-2">{s.noResults}</p>
              ) : (
                <ul>
                  {results.map(contract => (
                    <li key={contract.id}>
                      <button
                        type="button"
                        className="hover:bg-bg-weak-50 w-full px-3 py-2 text-left transition-colors"
                        onMouseDown={() => handleSelect(contract)}
                      >
                        <span className="text-paragraph-sm text-text-strong-950 block">
                          {contract.name}
                        </span>
                        <span className="text-paragraph-xs text-text-sub-600 block">
                          SIC: {contract.sic} · ID: {contract.id}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
