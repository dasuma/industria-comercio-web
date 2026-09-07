'use client';

import { useMemo, useState } from 'react';
import { Button, Popover, SearchableListPanel, Skeleton } from '@dasuma/pradma-ui';
import { RiExpandUpDownLine } from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';
import { useGetClient, useSearchClients } from '../../data';
import type { SearchRequest } from '../../types/search.types';

interface ClientPickerProps {
  id?: string;
  value: number | null;
  onChange: (clientId: number) => void;
  placeholder: string;
  searchPlaceholder: string;
  noResultsLabel: string;
  hasError?: boolean;
  disabled?: boolean;
}

// Trae los primeros 50 contribuyentes ordenados por nombre; el filtrado fino
// lo hace el SearchableListPanel en memoria sobre "nombre · id". Para
// padrones grandes alcanza como primer paso porque el usuario también puede
// tipear el id.
const SEARCH_PARAMS: SearchRequest = {
  filters: [],
  paginate: { offset: 0, limit: 50, sort: 'name' }
};

export const ClientPicker = ({
  id,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  noResultsLabel,
  hasError,
  disabled
}: ClientPickerProps) => {
  const [open, setOpen] = useState(false);
  const { data: selected, isLoading: loadingSelected } = useGetClient(value);
  const { data: results } = useSearchClients(SEARCH_PARAMS);

  const options = useMemo(() => {
    const list = results?.data ?? [];
    const withSelected =
      selected && !list.some(c => c.id === selected.id) ? [selected, ...list] : list;
    return withSelected.map(c => ({ id: c.id, label: `${c.name} · ${c.id}` }));
  }, [results, selected]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root
          id={id}
          type="button"
          variant="basic"
          disabled={disabled}
          aria-invalid={hasError || undefined}
          className={cn(
            'w-full justify-between font-normal',
            hasError && 'ring-error-base',
            !selected && 'text-text-soft-400'
          )}
        >
          {loadingSelected && value !== null ? (
            <Skeleton.Root className="h-3.5 w-32" />
          ) : (
            <span className="truncate">{selected ? selected.name : placeholder}</span>
          )}
          <Button.Icon as={RiExpandUpDownLine} />
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" className="p-0">
        <SearchableListPanel.Root
          options={options}
          selectedId={value}
          searchPlaceholder={searchPlaceholder}
          noResultsLabel={noResultsLabel}
          width="w-80"
          onSelect={clientId => {
            if (clientId !== null) onChange(clientId);
            setOpen(false);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
