'use client';

import { useEffect, useState, useCallback } from 'react';
import { CompactButton, FancyButton, Table } from '@dasuma/pradma-ui';
import { RiAddLine, RiPencilLine } from '@dasuma/pradma-ui/icons';
import type { Locale } from '@/i18n/config';
import { SearchInput } from '@/components/SearchInput';
import { ListSkeleton, EmptyState, RetryButton } from '@/components/ListState';
import { DataPagination } from '@/components/DataPagination';
import { clickableRowProps } from '@/utils/a11y';
import { formatNumericDate, formatPercent, interpolate } from '@/utils/format';
import { getPradmaDict } from '../../dictionaries';
import { useSearchDiscounts } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import type { SearchFilter } from '../../types/search.types';
import { DiscountPanel } from '../DiscountPanel';

interface DiscountListProps {
  locale: Locale;
}

const COLUMN_COUNT = 6;

export const DiscountList = ({ locale }: DiscountListProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.discounts;
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
  } = useSearchPagination({ defaultSort: 'year desc' });

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      const trimmed = value.trim();
      if (trimmed && !isNaN(Number(trimmed))) {
        const f: SearchFilter[] = [
          { field: 'year', value: Number(trimmed), operation: 'eq', option: 'OR' }
        ];
        setFilters(f);
      } else {
        setFilters([]);
      }
    },
    [setFilters]
  );

  const { data, isLoading, isError, refetch } = useSearchDiscounts(searchParams);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  const isEmpty = !isLoading && !isError && (!data || data.data.length === 0);
  const createButton = (
    // [R7] crear es la acción protagonista del listado → FancyButton default
    <FancyButton.Root onClick={openCreate}>
      <FancyButton.Icon as={RiAddLine} />
      {d.create}
    </FancyButton.Root>
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={handleSearch}
            placeholder={dict.common.searchByYear}
            clearLabel={dict.common.clearSearch}
            inputMode="numeric"
          />
          {createButton}
        </div>

        {isLoading && <ListSkeleton columns={COLUMN_COUNT} />}

        {isError && (
          <EmptyState
            variant="error"
            title={dict.common.errorTitle}
            description={d.errorLoading}
            action={<RetryButton label={dict.common.retry} onClick={() => refetch()} />}
          />
        )}

        {isEmpty &&
          (search.trim() ? (
            <EmptyState
              variant="no-results"
              title={dict.common.noResultsTitle}
              description={interpolate(dict.common.noResultsDescription, { query: search.trim() })}
            />
          ) : (
            <EmptyState title={d.empty} description={dict.common.emptyHint} action={createButton} />
          ))}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>{d.columns.id}</Table.Head>
                  <Table.Head>{d.columns.year}</Table.Head>
                  <Table.Head>{d.columns.startDate}</Table.Head>
                  <Table.Head>{d.columns.endDate}</Table.Head>
                  <Table.Head className="text-right">{d.columns.percentage}</Table.Head>
                  <Table.Head className="w-12 text-right">
                    <span className="sr-only">{dict.common.actions}</span>
                  </Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.data.map(discount => (
                  <Table.Row key={discount.id} {...clickableRowProps(() => openEdit(discount.id))}>
                    <Table.Cell className="text-text-soft-400 tabular-nums">
                      {discount.id}
                    </Table.Cell>
                    <Table.Cell className="text-text-strong-950 font-medium tabular-nums">
                      {discount.year}
                    </Table.Cell>
                    <Table.Cell className="tabular-nums">
                      {formatNumericDate(discount.startDate)}
                    </Table.Cell>
                    <Table.Cell className="tabular-nums">
                      {formatNumericDate(discount.endDate)}
                    </Table.Cell>
                    <Table.Cell className="text-right tabular-nums">
                      {formatPercent(discount.percentage)}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <CompactButton.Root
                        variant="ghost"
                        size="medium"
                        aria-label={dict.common.edit}
                        onClick={e => {
                          e.stopPropagation();
                          openEdit(discount.id);
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

      {panelOpen && <DiscountPanel locale={locale} discountId={selectedId} onClose={closePanel} />}
    </>
  );
};
