'use client';

import { useEffect, useState, useCallback } from 'react';
import { CompactButton, FancyButton, Table } from '@dasuma/pradma-ui';
import { RiAddLine, RiPencilLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { SearchInput } from '@/components/SearchInput';
import { EmptyState, ListSkeleton, RetryButton } from '@/components/ListState';
import { DataPagination } from '@/components/DataPagination';
import { clickableRowProps } from '@/utils/a11y';
import { interpolate } from '@/utils/format';
import { getPradmaDict } from '../../dictionaries';
import { useSearchActivityCategories } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import { ActivityCategoryPanel } from '../ActivityCategoryPanel';
import type { SearchFilter } from '../../types/search.types';

interface ActivityCategoryListProps {
  locale: Locale;
}

const buildFilters = (query: string): SearchFilter[] => {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return [
    { field: 'activity_type_name', value: trimmed, operation: 'ilike', option: 'OR' },
    { field: 'activity_type_code', value: trimmed, operation: 'ilike', option: 'OR' }
  ];
};

export const ActivityCategoryList = ({ locale }: ActivityCategoryListProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.activityCategories;
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const openCreate = () => {
    setSelectedId(null);
    setPanelOpen(true);
  };

  const openEdit = (id: number) => {
    setSelectedId(id);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedId(null);
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

  const { data, isLoading, isError, refetch } = useSearchActivityCategories(searchParams);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  const isEmpty = !isLoading && !isError && (!data || data.data.length === 0);
  const hasQuery = search.trim().length > 0;

  const createButton = (
    // [R7] acción protagonista del listado → FancyButton default
    <FancyButton.Root onClick={openCreate}>
      <FancyButton.Icon as={RiAddLine} />
      {d.create}
    </FancyButton.Root>
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder={d.searchPlaceholder}
            clearLabel={dict.common.clearSearch}
          />
          {createButton}
        </div>

        {isLoading && <ListSkeleton columns={6} />}

        {isError && (
          <EmptyState
            variant="error"
            title={dict.common.errorTitle}
            description={d.errorLoading}
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
          <EmptyState title={d.empty} description={dict.common.emptyHint} action={createButton} />
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head className="text-right">{d.columns.id}</Table.Head>
                  <Table.Head>{d.columns.activityTypeCode}</Table.Head>
                  <Table.Head>{d.columns.activityTypeName}</Table.Head>
                  <Table.Head className="text-right">{d.columns.yearInitial}</Table.Head>
                  <Table.Head className="text-right">{d.columns.yearEnd}</Table.Head>
                  <Table.Head className="text-right">{dict.common.actions}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.data.map(cat => (
                  <Table.Row key={cat.id} {...clickableRowProps(() => openEdit(cat.id))}>
                    <Table.Cell className="text-text-sub-600 text-right tabular-nums">
                      {cat.id}
                    </Table.Cell>
                    <Table.Cell className="text-text-strong-950 font-medium tabular-nums">
                      {cat.activityTypeCode}
                    </Table.Cell>
                    <Table.Cell>{cat.activityTypeName}</Table.Cell>
                    <Table.Cell className="text-right tabular-nums">{cat.yearInitial}</Table.Cell>
                    <Table.Cell className="text-right tabular-nums">{cat.yearEnd}</Table.Cell>
                    <Table.Cell className="text-right">
                      <CompactButton.Root
                        variant="ghost"
                        size="medium"
                        aria-label={dict.common.edit}
                        onClick={event => {
                          event.stopPropagation();
                          openEdit(cat.id);
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
        <ActivityCategoryPanel locale={locale} categoryId={selectedId} onClose={closePanel} />
      )}
    </>
  );
};
