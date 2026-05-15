'use client';

import { Badge, Table, Tooltip } from '@biaenergy/ui';
import { cn } from '@/utils/cn';
import { formatCurrency, formatNumericDate } from '@/utils/format';
import type { BianetworkDictionary } from '../../dictionaries';
import { STATUS_BADGE_COLOR } from '../../models/shared';
import type { BiaNetworkTransaction } from '../../models/transaction';

interface TransactionsTableProps {
  data: BiaNetworkTransaction[];
  loading: boolean;
  onRowClick?: (transaction: BiaNetworkTransaction) => void;
  dict: BianetworkDictionary['transactions'];
  sharedDict: BianetworkDictionary['shared'];
  compact?: boolean;
}

const COMPACT_COL_RATIOS = [1, 1, 1.4, 1.8, 1.1, 0.9, 1.2] as const;
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

export const TransactionsTable = ({
  data,
  loading,
  onRowClick,
  dict,
  sharedDict,
  compact = false
}: TransactionsTableProps) => {
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
          <Table.Head>{dict.columns.amount}</Table.Head>
          <Table.Head>{dict.columns.type}</Table.Head>
          <Table.Head>{dict.columns.status}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(tx => (
          <Table.Row
            key={tx.id}
            onClick={onRowClick ? () => onRowClick(tx) : undefined}
            className={onRowClick ? 'hover:bg-bg-weak-50 cursor-pointer' : undefined}
          >
            <Table.Cell className="text-text-sub-600">
              <TruncatedCell full={tx.id}>{tx.id.slice(0, 8)}…</TruncatedCell>
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={formatNumericDate(tx.date)} />
            </Table.Cell>
            <Table.Cell className="text-text-strong-950 font-medium">
              <TruncatedCell full={tx.fullName || '-'} />
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={tx.email} />
            </Table.Cell>
            <Table.Cell className="font-medium">
              <TruncatedCell full={formatCurrency(tx.amount)} />
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={sharedDict.person_type_labels[tx.type]} />
            </Table.Cell>
            <Table.Cell>
              <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[tx.status]}>
                {sharedDict.status_labels[tx.status]}
              </Badge.Root>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
