'use client';

import { useMemo, useState } from 'react';
import { Button, Popover, SearchableListPanel } from '@dasuma/pradma-ui';
import { RiExpandUpDownLine } from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';

interface ActivityPickerProps {
  id?: string;
  /** Código de la actividad seleccionada ('' si no hay). */
  value: string;
  options: EstablishmentActivity[];
  onChange: (activity: EstablishmentActivity) => void;
  placeholder: string;
  noResultsLabel: string;
  hasError?: boolean;
}

const labelOf = (a: EstablishmentActivity): string =>
  a.activityName ? `${a.activityCode} — ${a.activityName}` : a.activityCode;

// Buscador de actividades para las filas "adicionales" de una liquidación.
// Mismo patrón que ClientPicker: Popover + SearchableListPanel filtrando en
// memoria por "código — nombre".
export const ActivityPicker = ({
  id,
  value,
  options,
  onChange,
  placeholder,
  noResultsLabel,
  hasError
}: ActivityPickerProps) => {
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => options.map(a => ({ id: a.activityCode, label: labelOf(a) })),
    [options]
  );
  const selected = options.find(a => a.activityCode === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root
          id={id}
          type="button"
          variant="basic"
          aria-invalid={hasError || undefined}
          className={cn(
            'w-full justify-between font-normal',
            hasError && 'ring-error-base',
            !selected && 'text-text-soft-400'
          )}
        >
          <span className="truncate">{selected ? labelOf(selected) : placeholder}</span>
          <Button.Icon as={RiExpandUpDownLine} />
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" className="p-0">
        <SearchableListPanel.Root<string | null>
          options={items}
          selectedId={value || null}
          searchPlaceholder={placeholder}
          noResultsLabel={noResultsLabel}
          width="w-[28rem]"
          onSelect={code => {
            const found = options.find(a => a.activityCode === code);
            if (found) onChange(found);
            setOpen(false);
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
};
