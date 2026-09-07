'use client';

import { useEffect, useCallback, useState } from 'react';
import { Button, Table } from '@dasuma/pradma-ui';
import type { Locale } from '@/i18n/config';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState, ListSkeleton, RetryButton } from '@/components/ListState';
import { DataPagination } from '@/components/DataPagination';
import { clickableRowProps } from '@/utils/a11y';
import { formatCurrency, formatNumericDate, interpolate } from '@/utils/format';
import { getPradmaDict } from '../../dictionaries';
import { useGetEstablishment, useSearchInvoices } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import type { Invoice } from '../../models/invoice.interface';
import type { SearchFilter } from '../../types/search.types';
import { InvoiceStatusBadge } from '../InvoiceStatusBadge';
import { EstablishmentName } from '../EstablishmentName';
import { SettlementSheet } from '../SettlementSheet';

interface InvoiceListProps {
  locale: Locale;
}

// Estados filtrables en la lista global; 'created' y 'expired' son variantes
// internas de pending/overdue y no ameritan chip propio.
const STATUS_FILTERS = ['draft', 'pending', 'paid', 'overdue'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number] | null;

const COLUMNS = 6;

const buildFilters = (search: string, status: StatusFilter): SearchFilter[] => {
  const trimmed = search.trim();
  const filters: SearchFilter[] = [];
  if (trimmed) {
    const asNumber = Number(trimmed);
    if (!isNaN(asNumber)) {
      filters.push(
        { field: 'id', value: asNumber, operation: 'eq', option: 'OR' },
        { field: 'establishment_id', value: asNumber, operation: 'eq', option: 'OR' },
        { field: 'year', value: asNumber, operation: 'eq', option: 'OR' }
      );
    }
  }
  if (status) filters.push({ field: 'status', value: status, operation: 'eq', option: 'AND' });
  return filters;
};

export const InvoiceList = ({ locale }: InvoiceListProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.invoices;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>(null);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const { data: selectedEstablishment } = useGetEstablishment(selected?.establishmentId ?? null);

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
    goToPage,
    total,
    pageSize
  } = useSearchPagination({ defaultSort: 'id desc' });

  const applyFilters = useCallback(
    (nextSearch: string, nextStatus: StatusFilter) => {
      setFilters(buildFilters(nextSearch, nextStatus));
    },
    [setFilters]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      applyFilters(value, status);
    },
    [applyFilters, status]
  );

  const toggleStatus = (value: StatusFilter) => {
    const next = status === value ? null : value;
    setStatus(next);
    applyFilters(search, next);
  };

  const { data, isLoading, isError, refetch } = useSearchInvoices(searchParams);

  useEffect(() => {
    if (data?.total !== undefined) setTotal(data.total);
  }, [data?.total, setTotal]);

  const statusLabel = (value: string): string => d.status[value as keyof typeof d.status] ?? value;

  const hasActiveFilters = Boolean(search.trim()) || status !== null;
  const isEmpty = !isLoading && !isError && !data?.data.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder={d.searchPlaceholder}
          clearLabel={dict.common.clearSearch}
          inputMode="numeric"
        />
        {/* [P8] filtros toggleables: Button basic small con data-state */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={d.columns.status}>
          <Button.Root
            variant="basic"
            size="small"
            data-state={status === null ? 'on' : 'off'}
            onClick={() => toggleStatus(null)}
          >
            {d.filters.all}
          </Button.Root>
          {STATUS_FILTERS.map(value => (
            <Button.Root
              key={value}
              variant="basic"
              size="small"
              data-state={status === value ? 'on' : 'off'}
              onClick={() => toggleStatus(value)}
            >
              {statusLabel(value)}
            </Button.Root>
          ))}
        </div>
      </div>

      {isLoading ? <ListSkeleton columns={COLUMNS} /> : null}

      {isError ? (
        <EmptyState
          variant="error"
          title={dict.common.errorTitle}
          description={d.errorLoading}
          action={<RetryButton label={dict.common.retry} onClick={() => void refetch()} />}
        />
      ) : null}

      {isEmpty ? (
        hasActiveFilters ? (
          <EmptyState
            variant="no-results"
            title={dict.common.noResultsTitle}
            description={
              search.trim()
                ? interpolate(dict.common.noResultsDescription, { query: search.trim() })
                : undefined
            }
          />
        ) : (
          <EmptyState title={d.empty} description={d.emptyHint} />
        )
      ) : null}

      {!isLoading && !isError && data && data.data.length > 0 ? (
        <>
          <div className="ring-stroke-soft-200 overflow-x-auto rounded-xl ring-1">
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
                  <Table.Row key={inv.id} {...clickableRowProps(() => setSelected(inv))}>
                    <Table.Cell className="text-text-soft-400 tabular-nums">{inv.id}</Table.Cell>
                    <Table.Cell>
                      <EstablishmentName establishmentId={inv.establishmentId} />
                    </Table.Cell>
                    <Table.Cell className="text-text-strong-950 font-medium tabular-nums">
                      {inv.year}
                    </Table.Cell>
                    <Table.Cell>
                      <InvoiceStatusBadge status={inv.status} label={statusLabel(inv.status)} />
                    </Table.Cell>
                    <Table.Cell className="text-text-sub-600 tabular-nums">
                      {formatNumericDate(inv.presentationDate)}
                    </Table.Cell>
                    <Table.Cell className="text-text-strong-950 text-right font-medium tabular-nums">
                      {formatCurrency(inv.total)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>

          <DataPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            total={total}
            pageSize={pageSize}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            onPrev={prevPage}
            onNext={nextPage}
            onPage={goToPage}
            rangeLabel={dict.common.rangeLabel}
            prevLabel={dict.common.prevPage}
            nextLabel={dict.common.nextPage}
          />
        </>
      ) : null}

      {selected && selectedEstablishment ? (
        <SettlementSheet
          mode="saved"
          invoice={selected}
          establishment={selectedEstablishment}
          dict={dict}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
};
