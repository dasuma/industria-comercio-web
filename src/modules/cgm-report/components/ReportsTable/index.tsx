'use client';

import { useId, useMemo, useState } from 'react';
import { Badge, CompactButton, Pagination, SwitchRoot, Table } from '@biaenergy/ui';
import { RiArrowLeftSLine, RiArrowRightSLine, RiDownloadLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { formatDate } from '@/utils/format';
import { getCgmReportDict } from '../../dictionaries';
import { useGetReports } from '../../data';
import type { GetReportsParams } from '../../data/getReports/getReports';

const STATUS_COLOR = {
  PENDING: 'orange',
  PROCESSING: 'blue',
  COMPLETED: 'green',
  FAILED: 'red',
  NOTIFIED: 'purple'
} as const;

const PAGE_WINDOW = 1;
const COMPACT_COL_RATIOS = [0.35, 0.6, 1.1, 1.1, 0.9, 1.2, 1, 0.8] as const;
const COMPACT_TOTAL = COMPACT_COL_RATIOS.reduce((a, b) => a + b, 0);

const buildPageList = (current: number, total: number): (number | 'ellipsis')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current]);
  for (let i = 1; i <= PAGE_WINDOW; i += 1) {
    if (current - i > 1) pages.add(current - i);
    if (current + i < total) pages.add(current + i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const value = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && value - prev > 1) result.push('ellipsis');
    result.push(value);
  }
  return result;
};

interface ReportsTableProps {
  locale: Locale;
  page: number;
  params: GetReportsParams;
  onPageChange: (page: number) => void;
}

export const ReportsTable = ({ locale, page, params, onPageChange }: ReportsTableProps) => {
  const dict = getCgmReportDict(locale);
  const { data, isLoading } = useGetReports(params);
  const [compact, setCompact] = useState(false);
  const compactSwitchId = useId();

  const reports = data?.data ?? [];
  const total = data?.pagination.total ?? 0;
  const limit = data?.pagination.current_limit ?? params.limit;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const pageList = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);

  if (!isLoading && reports.length === 0) {
    return <p className="text-paragraph-sm text-text-sub-600 py-8 text-center">{dict.empty}</p>;
  }

  return (
    <div className="space-y-4">
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
            {/* Acción de descarga — sin label visible. El icono ya comunica la
                función; sr-only para que screen readers la anuncien. !px-2 baja
                el padding default del Head para que el ancho 0.35 alcance. */}
            <Table.Head className="!px-2 text-center">
              <span className="sr-only">{dict.columns.download}</span>
            </Table.Head>
            <Table.Head>{dict.columns.id}</Table.Head>
            <Table.Head>{dict.columns.reportDate}</Table.Head>
            <Table.Head>{dict.columns.createdAt}</Table.Head>
            <Table.Head>{dict.columns.type}</Table.Head>
            <Table.Head>{dict.columns.kind}</Table.Head>
            <Table.Head>{dict.columns.status}</Table.Head>
            <Table.Head>{dict.columns.contracts}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {reports.map(report => (
            <Table.Row key={report.id}>
              <Table.Cell className="!px-2 text-center">
                {report.url ? (
                  <CompactButton.Root variant="ghost" size="medium" asChild className="mx-auto">
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={dict.columns.download}
                    >
                      <CompactButton.Icon
                        as={RiDownloadLine}
                        className="!text-text-soft-400 !size-4"
                      />
                    </a>
                  </CompactButton.Root>
                ) : (
                  <span className="text-text-soft-400">—</span>
                )}
              </Table.Cell>
              <Table.Cell>{report.id}</Table.Cell>
              <Table.Cell>
                {report.report_date ? formatDate(report.report_date, locale) : '—'}
              </Table.Cell>
              <Table.Cell>{formatDate(report.created_at, locale)}</Table.Cell>
              <Table.Cell>
                <Badge.Root variant="lighter" color="blue">
                  {dict.reportTypes[report.type]}
                </Badge.Root>
              </Table.Cell>
              <Table.Cell>{dict.reportKinds[report.kind]}</Table.Cell>
              <Table.Cell>
                <Badge.Root variant="lighter" color={STATUS_COLOR[report.status]}>
                  {dict.reportStatus[report.status]}
                </Badge.Root>
              </Table.Cell>
              <Table.Cell>{report.count_contract}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={compactSwitchId}
          className="text-text-sub-600 text-label-sm flex cursor-pointer items-center gap-2 select-none"
        >
          <SwitchRoot id={compactSwitchId} checked={compact} onCheckedChange={setCompact} />
          {dict.compactMode}
        </label>

        {totalPages > 1 && (
          <Pagination.Root variant="basic">
            <Pagination.NavButton
              type="button"
              aria-label={dict.pagination.previous}
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              <Pagination.NavIcon as={RiArrowLeftSLine} />
            </Pagination.NavButton>
            {pageList.map((entry, idx) =>
              entry === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  aria-hidden
                  className="text-text-soft-400 text-label-sm px-1"
                >
                  …
                </span>
              ) : (
                <Pagination.Item
                  key={entry}
                  type="button"
                  current={entry === page}
                  aria-current={entry === page ? 'page' : undefined}
                  onClick={() => onPageChange(entry)}
                >
                  {entry}
                </Pagination.Item>
              )
            )}
            <Pagination.NavButton
              type="button"
              aria-label={dict.pagination.next}
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            >
              <Pagination.NavIcon as={RiArrowRightSLine} />
            </Pagination.NavButton>
          </Pagination.Root>
        )}
      </div>
    </div>
  );
};
