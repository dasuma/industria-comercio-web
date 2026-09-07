'use client';

import { useEffect, useState, useCallback } from 'react';
import { Badge, CompactButton, FancyButton, Table } from '@dasuma/pradma-ui';
import { RiAddLine, RiPencilLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState, ListSkeleton, RetryButton } from '@/components/ListState';
import { DataPagination } from '@/components/DataPagination';
import { clickableRowProps } from '@/utils/a11y';
import { interpolate } from '@/utils/format';
import { getPradmaDict } from '../../dictionaries';
import { useSearchClients } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import { ClientPanel } from '../ClientPanel';
import type { SearchFilter } from '../../types/search.types';

interface ClientListProps {
  locale: Locale;
}

const buildFilters = (query: string): SearchFilter[] => {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return [
    { field: 'name', value: trimmed, operation: 'ilike', option: 'OR' },
    ...(Number.isNaN(Number(trimmed))
      ? []
      : [{ field: 'id', value: Number(trimmed), operation: 'eq' as const, option: 'OR' as const }])
  ];
};

export const ClientList = ({ locale }: ClientListProps) => {
  const dict = getPradmaDict(locale);
  const { columns } = dict.clients;
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const openCreate = () => {
    setSelectedClientId(null);
    setPanelOpen(true);
  };

  const openEdit = (id: number) => {
    setSelectedClientId(id);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedClientId(null);
  };

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
      setFilters(buildFilters(value));
    },
    [setFilters]
  );

  const { data, isLoading, isError, refetch } = useSearchClients(searchParams);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  const isEmpty = !isLoading && !isError && (!data || data.data.length === 0);
  const hasQuery = search.trim().length > 0;

  const createButton = (
    // [R7] acción protagonista del listado → FancyButton default
    <FancyButton.Root onClick={openCreate}>
      <FancyButton.Icon as={RiAddLine} />
      {dict.clients.create}
    </FancyButton.Root>
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder={dict.clients.searchPlaceholder}
            clearLabel={dict.common.clearSearch}
          />
          {createButton}
        </div>

        {isLoading && <ListSkeleton columns={7} />}

        {isError && (
          <EmptyState
            variant="error"
            title={dict.common.errorTitle}
            description={dict.clients.errorLoading}
            action={<RetryButton label={dict.common.retry} onClick={() => void refetch()} />}
          />
        )}

        {isEmpty && hasQuery && (
          <EmptyState
            variant="no-results"
            title={dict.common.noResultsTitle}
            description={interpolate(dict.common.noResultsDescription, { query: search.trim() })}
          />
        )}

        {isEmpty && !hasQuery && (
          <EmptyState
            title={dict.clients.empty}
            description={dict.common.emptyHint}
            action={createButton}
          />
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head className="text-right">{columns.id}</Table.Head>
                  <Table.Head>{columns.name}</Table.Head>
                  <Table.Head>{columns.documentType}</Table.Head>
                  <Table.Head>{columns.email}</Table.Head>
                  <Table.Head>{columns.phone}</Table.Head>
                  <Table.Head>{columns.isCompany}</Table.Head>
                  <Table.Head className="text-right">{dict.common.actions}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.data.map(client => (
                  <Table.Row key={client.id} {...clickableRowProps(() => openEdit(client.id))}>
                    <Table.Cell className="text-text-sub-600 text-right tabular-nums">
                      {client.id}
                    </Table.Cell>
                    <Table.Cell className="text-text-strong-950 font-medium">
                      {client.name}
                    </Table.Cell>
                    <Table.Cell>{client.documentType}</Table.Cell>
                    <Table.Cell>{client.email || dict.common.notAvailable}</Table.Cell>
                    <Table.Cell className="tabular-nums">
                      {client.phone || dict.common.notAvailable}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge.Root variant="light" color={client.isCompany ? 'blue' : 'gray'}>
                        {client.isCompany ? dict.common.yes : dict.common.no}
                      </Badge.Root>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <CompactButton.Root
                        variant="ghost"
                        size="medium"
                        aria-label={dict.common.edit}
                        onClick={event => {
                          event.stopPropagation();
                          openEdit(client.id);
                        }}
                      >
                        <CompactButton.Icon as={RiPencilLine} />
                      </CompactButton.Root>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

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
        )}
      </div>

      {panelOpen && (
        <ClientPanel locale={locale} clientId={selectedClientId} onClose={closePanel} />
      )}
    </>
  );
};
