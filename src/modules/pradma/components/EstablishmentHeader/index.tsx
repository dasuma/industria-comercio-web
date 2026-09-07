'use client';

import type { ReactNode } from 'react';
import { Button, Skeleton, StatusBadge } from '@dasuma/pradma-ui';
import { RiPencilLine } from '@dasuma/pradma-ui/icons';
import { formatLongDate, interpolate } from '@/utils/format';
import type { Client } from '../../models/client.interface';
import type { Establishment } from '../../models/establishment.interface';
import type { PradmaDictionary } from '../../dictionaries';

interface EstablishmentHeaderProps {
  establishment: Establishment;
  client: Client | undefined;
  lastPaidYear: number | null;
  intlLocale: string;
  dict: PradmaDictionary;
  onEdit: () => void;
}

const isActive = (establishment: Establishment): boolean =>
  !establishment.endDate || new Date(establishment.endDate).getTime() >= Date.now();

// Cabecera compacta del establecimiento: reemplaza al formulario siempre
// abierto. Los datos se editan desde la tab "Datos" (botón Editar datos).
export const EstablishmentHeader = ({
  establishment,
  client,
  lastPaidYear,
  intlLocale,
  dict,
  onEdit
}: EstablishmentHeaderProps) => {
  const h = dict.establishments.header;
  const active = isActive(establishment);
  const status = active ? 'completed' : 'disabled';

  const subline = [
    establishment.address,
    establishment.phone,
    interpolate(h.since, { date: formatLongDate(establishment.startDate, intlLocale) })
  ]
    .filter(Boolean)
    .join(' · ');

  const document = [establishment.documentType, establishment.numberIdentification]
    .filter(Boolean)
    .join(' ');

  return (
    <section className="bg-bg-white-0 ring-stroke-soft-200 flex flex-col gap-4 rounded-xl p-5 ring-1">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="text-label-lg text-text-strong-950 truncate">{establishment.name}</h2>
            <StatusBadge.Root status={status}>
              <StatusBadge.Dot status={status} />
              {active ? h.active : h.inactive}
            </StatusBadge.Root>
          </div>
          <p className="text-paragraph-sm text-text-sub-600">{subline}</p>
        </div>
        {/* [R7] editar es secundario; la primary de la pantalla es liquidar */}
        <Button.Root variant="basic" size="small" onClick={onEdit}>
          <Button.Icon as={RiPencilLine} />
          {h.editData}
        </Button.Root>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Meta label={h.client}>
          {client ? (
            `${client.name} · ${client.documentType} ${client.id}`
          ) : (
            <Skeleton.Root className="h-3.5 w-32" />
          )}
        </Meta>
        <Meta label={h.registration} muted={!establishment.registrationNumber}>
          {establishment.registrationNumber || dict.common.notAvailable}
        </Meta>
        <Meta label={h.document} muted={!document}>
          {document || dict.common.notAvailable}
        </Meta>
        <Meta label={h.lastPaid} muted={lastPaidYear === null}>
          {lastPaidYear ?? dict.common.notAvailable}
        </Meta>
      </dl>
    </section>
  );
};

const Meta = ({
  label,
  muted,
  children
}: {
  label: string;
  muted?: boolean;
  children: ReactNode;
}) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <dt className="text-paragraph-xs text-text-sub-600">{label}</dt>
    <dd
      className={`text-label-sm truncate tabular-nums ${muted ? 'text-text-soft-400' : 'text-text-strong-950'}`}
    >
      {children}
    </dd>
  </div>
);
