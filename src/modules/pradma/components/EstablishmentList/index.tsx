'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CompactButton, FancyButton, Table } from '@dasuma/pradma-ui';
import { RiAddLine, RiPencilLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { APP_ROUTES } from '@/config/routes';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState, ListSkeleton, RetryButton } from '@/components/ListState';
import { DataPagination } from '@/components/DataPagination';
import { clickableRowProps } from '@/utils/a11y';
import { formatNumericDate, interpolate } from '@/utils/format';
import { getPradmaDict } from '../../dictionaries';
import { useSearchEstablishments } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import type { SearchFilter } from '../../types/search.types';
import { ClientName } from '../ClientName';

interface EstablishmentListProps {
  locale: Locale;
}

const COLUMNS = 8;

export const EstablishmentList = ({ locale }: EstablishmentListProps) => {
  const dict = getPradmaDict(locale);
  const { columns } = dict.establishments;
  const router = useRouter();
  const [search, setSearch] = useState('');

  const {
    searchParams,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    setTotal,
    setFilters,
    pageNumbers,
    total,
    pageSize
  } = useSearchPagination({ defaultSort: 'id' });

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      const trimmed = value.trim();
      if (!trimmed) {
        setFilters([]);
        return;
      }
      const f: SearchFilter[] = [
        { field: 'name', value: trimmed, operation: 'ilike', option: 'OR' },
        ...(isNaN(Number(trimmed))
          ? []
          : [
              {
                field: 'id',
                value: Number(trimmed),
                operation: 'eq' as const,
                option: 'OR' as const
              }
            ])
      ];
      setFilters(f);
    },
    [setFilters]
  );

  const { data, isLoading, isError, refetch } = useSearchEstablishments(searchParams);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  const openDetail = (id: number) => router.push(`${APP_ROUTES.establishments}/${id}`);
  const isEmpty = !isLoading && !isError && (!data || data.data.length === 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder={dict.establishments.searchPlaceholder}
          clearLabel={dict.common.clearSearch}
        />
        {/* [R7] única acción protagonista de la pantalla */}
        <FancyButton.Root onClick={() => router.push(`${APP_ROUTES.establishments}/new`)}>
          <FancyButton.Icon as={RiAddLine} />
          {dict.establishments.create}
        </FancyButton.Root>
      </div>

      {isLoading ? <ListSkeleton columns={COLUMNS} /> : null}

      {isError ? (
        <EmptyState
          variant="error"
          title={dict.common.errorTitle}
          description={dict.establishments.errorLoading}
          action={<RetryButton label={dict.common.retry} onClick={() => void refetch()} />}
        />
      ) : null}

      {isEmpty ? (
        search ? (
          <EmptyState
            variant="no-results"
            title={dict.common.noResultsTitle}
            description={interpolate(dict.common.noResultsDescription, { query: search })}
          />
        ) : (
          <EmptyState title={dict.establishments.empty} description={dict.common.emptyHint} />
        )
      ) : null}

      {!isLoading && !isError && data && data.data.length > 0 ? (
        <>
          <div className="ring-stroke-soft-200 overflow-x-auto rounded-xl ring-1">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>{columns.id}</Table.Head>
                  <Table.Head>{columns.registrationNumber}</Table.Head>
                  <Table.Head>{columns.name}</Table.Head>
                  <Table.Head>{columns.clientId}</Table.Head>
                  <Table.Head>{columns.address}</Table.Head>
                  <Table.Head>{columns.phone}</Table.Head>
                  <Table.Head>{columns.startDate}</Table.Head>
                  <Table.Head className="w-12">
                    <span className="sr-only">{dict.common.actions}</span>
                  </Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.data.map(est => (
                  <Table.Row key={est.id} {...clickableRowProps(() => openDetail(est.id))}>
                    <Table.Cell className="text-text-soft-400 tabular-nums">{est.id}</Table.Cell>
                    <Table.Cell className="tabular-nums">
                      {est.registrationNumber || dict.common.notAvailable}
                    </Table.Cell>
                    <Table.Cell className="text-text-strong-950 font-medium">{est.name}</Table.Cell>
                    <Table.Cell>
                      <ClientName clientId={est.clientId} />
                    </Table.Cell>
                    <Table.Cell className="text-text-sub-600">{est.address}</Table.Cell>
                    <Table.Cell className="text-text-sub-600 tabular-nums">
                      {est.phone || dict.common.notAvailable}
                    </Table.Cell>
                    <Table.Cell className="text-text-sub-600 tabular-nums">
                      {formatNumericDate(est.startDate)}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <CompactButton.Root
                        variant="ghost"
                        size="medium"
                        aria-label={dict.common.edit}
                        onClick={e => {
                          e.stopPropagation();
                          openDetail(est.id);
                        }}
                      >
                        <CompactButton.Icon as={RiPencilLine} />
                      </CompactButton.Root>
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
    </div>
  );
};
