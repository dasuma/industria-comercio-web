'use client';

import { useEffect, useCallback, useState } from 'react';
import { Button, Input, Pagination, Table } from '@biaenergy/ui';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { Locale } from '@/i18n/config';
import { getPradmaDict } from '../../dictionaries';
import { useSearchInvoices } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import type { SearchFilter } from '../../types/search.types';

interface InvoiceListProps {
  locale: Locale;
}

const formatCop = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(iso + 'T12:00:00'));
};

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-bg-weak-50 text-text-sub-600',
  pending: 'bg-warning-lighter text-warning-dark',
  paid: 'bg-success-lighter text-success-dark',
  overdue: 'bg-error-lighter text-error-dark'
};

export const InvoiceList = ({ locale }: InvoiceListProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.invoices;
  const [search, setSearch] = useState('');

  const {
    searchParams,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    setTotal,
    setFilters,
    pageNumbers,
    goToPage
  } = useSearchPagination({ defaultSort: 'id' });

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      const trimmed = value.trim();
      if (!trimmed) return setFilters([]);
      const f: SearchFilter[] = [
        ...(isNaN(Number(trimmed))
          ? []
          : [
              {
                field: 'establishment_id',
                value: Number(trimmed),
                operation: 'eq' as const,
                option: 'OR' as const
              },
              {
                field: 'id',
                value: Number(trimmed),
                operation: 'eq' as const,
                option: 'OR' as const
              }
            ]),
        {
          field: 'year',
          value: trimmed,
          operation: 'ilike' as const,
          option: 'OR' as const
        }
      ];
      setFilters(f);
    },
    [setFilters]
  );

  const { data, isLoading, isError } = useSearchInvoices(searchParams);

  useEffect(() => {
    if (data?.total !== undefined) setTotal(data.total);
  }, [data?.total, setTotal]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <Input.Root className="max-w-72">
          <Input.Wrapper>
            <Input.Icon as={RiSearchLine} />
            <Input.Input
              placeholder={dict.common.search}
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </Input.Wrapper>
        </Input.Root>
      </div>

      {/* Table */}
      <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
        {isLoading ? (
          <p className="text-text-sub-600 px-4 py-8 text-center text-sm">{d.loading}</p>
        ) : isError ? (
          <p className="text-error-dark px-4 py-8 text-center text-sm">{d.errorLoading}</p>
        ) : !data?.data.length ? (
          <p className="text-text-sub-600 px-4 py-8 text-center text-sm">{d.empty}</p>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>{d.columns.id}</Table.Head>
                <Table.Head>{d.columns.establishment}</Table.Head>
                <Table.Head>{d.columns.year}</Table.Head>
                <Table.Head>{d.columns.status}</Table.Head>
                <Table.Head>{d.columns.presentationDate}</Table.Head>
                <Table.Head className="text-right">{d.columns.total}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.data.map(inv => (
                <Table.Row key={inv.id}>
                  <Table.Cell className="text-text-soft-400 font-mono text-xs">{inv.id}</Table.Cell>
                  <Table.Cell className="text-text-sub-600 text-xs">
                    {inv.establishmentId}
                  </Table.Cell>
                  <Table.Cell className="font-medium">{inv.year}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                        STATUS_STYLES[inv.status] ?? STATUS_STYLES.pending
                      )}
                    >
                      {d.status[inv.status as keyof typeof d.status] ?? inv.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-text-sub-600 text-xs">
                    {formatDate(inv.presentationDate)}
                  </Table.Cell>
                  <Table.Cell className="text-right font-medium tabular-nums">
                    {formatCop(inv.total)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-text-sub-600 text-xs">
            {dict.common.page} {currentPage} {dict.common.of} {totalPages}
          </p>
          <Pagination.Root>
            <Pagination.Prev asChild>
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="small"
                onClick={prevPage}
                disabled={!hasPrevPage}
              >
                <Button.Icon as={RiArrowLeftSLine} />
              </Button.Root>
            </Pagination.Prev>
            {pageNumbers.map((n, i) =>
              n === -1 ? (
                <Pagination.Ellipsis key={`e-${i}`} />
              ) : (
                <Pagination.Item key={n} asChild>
                  <Button.Root
                    variant="neutral"
                    mode={n === currentPage ? 'filled' : 'ghost'}
                    size="small"
                    onClick={() => goToPage(n)}
                  >
                    {n}
                  </Button.Root>
                </Pagination.Item>
              )
            )}
            <Pagination.Next asChild>
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="small"
                onClick={nextPage}
                disabled={!hasNextPage}
              >
                <Button.Icon as={RiArrowRightSLine} />
              </Button.Root>
            </Pagination.Next>
          </Pagination.Root>
        </div>
      )}
    </div>
  );
};
