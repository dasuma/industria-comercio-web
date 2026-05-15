'use client';

import { Badge, Table, Tooltip } from '@biaenergy/ui';
import { cn } from '@/utils/cn';
import { formatCurrency, formatNumericDate } from '@/utils/format';
import type { BianetworkDictionary } from '../../dictionaries';
import { STATUS_BADGE_COLOR } from '../../models/shared';
import type { BiaNetworkInvoice } from '../../models/invoice';

interface InvoicesTableProps {
  data: BiaNetworkInvoice[];
  loading: boolean;
  onRowClick?: (invoice: BiaNetworkInvoice) => void;
  dict: BianetworkDictionary['invoices'];
  sharedDict: BianetworkDictionary['shared'];
  compact?: boolean;
}

const COMPACT_COL_RATIOS = [1, 1, 1.4, 1.6, 1.1, 1.2] as const;
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

export const InvoicesTable = ({
  data,
  loading,
  onRowClick,
  dict,
  sharedDict,
  compact = false
}: InvoicesTableProps) => {
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
          <Table.Head>{dict.columns.company}</Table.Head>
          <Table.Head>{dict.columns.amount}</Table.Head>
          <Table.Head>{dict.columns.status}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(invoice => (
          <Table.Row
            key={invoice.id}
            onClick={onRowClick ? () => onRowClick(invoice) : undefined}
            className={onRowClick ? 'hover:bg-bg-weak-50 cursor-pointer' : undefined}
          >
            <Table.Cell className="text-text-sub-600">
              <TruncatedCell full={invoice.id}>{invoice.id.slice(0, 8)}…</TruncatedCell>
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={formatNumericDate(invoice.createdAt)} />
            </Table.Cell>
            <Table.Cell className="text-text-strong-950 font-medium">
              <TruncatedCell full={invoice.fullName || '-'} />
            </Table.Cell>
            <Table.Cell>
              <TruncatedCell full={invoice.companyName ?? '-'} />
            </Table.Cell>
            <Table.Cell className="font-medium">
              <TruncatedCell full={formatCurrency(invoice.amount)} />
            </Table.Cell>
            <Table.Cell>
              <Badge.Root variant="lighter" color={STATUS_BADGE_COLOR[invoice.status]}>
                {sharedDict.status_labels[invoice.status]}
              </Badge.Root>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
