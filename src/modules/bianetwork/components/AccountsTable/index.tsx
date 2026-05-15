'use client';

import { Badge, Table, Tooltip } from '@biaenergy/ui';
import { cn } from '@/utils/cn';
import { formatNumericDate } from '@/utils/format';
import type { BianetworkDictionary } from '../../dictionaries';
import { STATUS_BADGE_COLOR } from '../../models/shared';
import type { BiaNetworkAccount } from '../../models/account';

interface AccountsTableProps {
  data: BiaNetworkAccount[];
  loading: boolean;
  onRowClick?: (account: BiaNetworkAccount) => void;
  dict: BianetworkDictionary['accounts'];
  sharedDict: BianetworkDictionary['shared'];
  // Cuando está activo, la tabla se ajusta al 100% del contenedor y cada
  // columna toma una proporción fija (table-layout: fixed). El TruncatedCell
  // de cada celda ya trunca con ellipsis cuando el contenido excede.
  compact?: boolean;
}

// Ratios relativos por columna en modo compacto. Suma libre (los porcentajes
// se calculan a partir del total). Pesados por contenido típico: name/email
// más anchos, type más estrecho.
const COMPACT_COL_RATIOS = [1, 1, 1.4, 1.8, 1.2, 0.9, 1.2] as const;
const COMPACT_TOTAL = COMPACT_COL_RATIOS.reduce((a, b) => a + b, 0);

const TruncatedCell = ({
  full,
  children,
  className
}: {
  full: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <span className={cn('block min-w-0 truncate', className)}>{children ?? full}</span>
    </Tooltip.Trigger>
    <Tooltip.Content side="top">{full}</Tooltip.Content>
  </Tooltip.Root>
);

export const AccountsTable = ({
  data,
  loading,
  onRowClick,
  dict,
  sharedDict,
  compact = false
}: AccountsTableProps) => {
  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col gap-2" aria-busy="true" aria-live="polite">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-bg-weak-50 h-12 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="border-stroke-soft-200 text-text-sub-600 rounded-lg border p-6 text-center">
        {dict.empty}
      </p>
    );
  }

  return (
    <Table.Root style={compact ? { tableLayout: 'fixed', width: '100%' } : undefined}>
      {compact && (
        <colgroup>
          {COMPACT_COL_RATIOS.map((ratio, idx) => (
            <col key={idx} style={{ width: `${(ratio / COMPACT_TOTAL) * 100}%` }} />
          ))}
        </colgroup>
      )}
      <Table.Header>
        <Table.Row>
          <Table.Head>{dict.columns.id}</Table.Head>
          <Table.Head>{dict.columns.date}</Table.Head>
          <Table.Head>{dict.columns.name}</Table.Head>
          <Table.Head>{dict.columns.email}</Table.Head>
          <Table.Head>{dict.columns.phone}</Table.Head>
          <Table.Head>{dict.columns.type}</Table.Head>
          <Table.Head>{dict.columns.status}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(account => (
          <Table.Row
            key={account.id}
            onClick={onRowClick ? () => onRowClick(account) : undefined}
            className={onRowClick ? 'hover:bg-bg-weak-50 cursor-pointer' : undefined}
          >
            <Table.Cell className="text-text-sub-600">
              <TruncatedCell full={account.id}>{account.id.slice(0, 8)}…</TruncatedCell>
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={formatNumericDate(account.date)} />
            </Table.Cell>
            <Table.Cell className="text-text-strong-950 font-medium">
              <TruncatedCell full={account.fullName || '-'} />
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={account.email} />
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={account.phone ?? '-'} />
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={sharedDict.person_type_labels[account.type]} />
            </Table.Cell>
            <Table.Cell>
              <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[account.status]}>
                {sharedDict.status_labels[account.status]}
              </Badge.Root>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
