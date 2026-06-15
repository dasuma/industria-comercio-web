'use client';

import { useEffect, useState, useCallback } from 'react';
import { Table, Pagination, Button, Input } from '@biaenergy/ui';
import { RiArrowLeftSLine, RiArrowRightSLine, RiSearchLine } from '@biaenergy/ui/icons';
import type { Locale } from '@/i18n/config';
import { getPradmaDict } from '../../dictionaries';
import { useSearchActivityCategories } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import type { SearchFilter } from '../../types/search.types';

interface ActivityCategoryListProps {
  locale: Locale;
}

export const ActivityCategoryList = ({ locale }: ActivityCategoryListProps) => {
  const dict = getPradmaDict(locale);
  const { columns } = dict.activityCategories;
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
    pageNumbers
  } = useSearchPagination({ defaultSort: 'id' });

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (value.trim()) {
        const f: SearchFilter[] = [
          {
            field: 'activity_type_name',
            value: `%${value.trim()}%`,
            operation: 'ilike',
            option: 'OR'
          },
          {
            field: 'activity_type_code',
            value: `%${value.trim()}%`,
            operation: 'ilike',
            option: 'OR'
          }
        ];
        setFilters(f);
      } else {
        setFilters([]);
      }
    },
    [setFilters]
  );

  const { data, isLoading, isError, refetch } = useSearchActivityCategories(searchParams);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Input.Root>
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

      {isLoading && (
        <p className="text-text-sub-600 py-8 text-center">{dict.activityCategories.loading}</p>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-text-sub-600">{dict.activityCategories.errorLoading}</p>
          <Button.Root variant="neutral" onClick={() => refetch()}>
            {dict.common.retry}
          </Button.Root>
        </div>
      )}

      {!isLoading && !isError && (!data || data.data.length === 0) && (
        <p className="text-text-sub-600 py-8 text-center">{dict.activityCategories.empty}</p>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>{columns.id}</Table.Head>
                <Table.Head>{columns.activityTypeCode}</Table.Head>
                <Table.Head>{columns.activityTypeName}</Table.Head>
                <Table.Head>{columns.yearInitial}</Table.Head>
                <Table.Head>{columns.yearEnd}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.data.map(cat => (
                <Table.Row key={cat.id}>
                  <Table.Cell>{cat.id}</Table.Cell>
                  <Table.Cell>{cat.activityTypeCode}</Table.Cell>
                  <Table.Cell>{cat.activityTypeName}</Table.Cell>
                  <Table.Cell>{cat.yearInitial}</Table.Cell>
                  <Table.Cell>{cat.yearEnd}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <div className="flex items-center justify-between">
            <p className="text-text-sub-600 text-sm">
              {dict.common.page} {currentPage} {dict.common.of} {totalPages}
            </p>
            <Pagination.Root>
              <Pagination.NavButton disabled={!hasPrevPage} onClick={prevPage}>
                <Pagination.NavIcon as={RiArrowLeftSLine} />
              </Pagination.NavButton>
              {pageNumbers.map((page, i) =>
                page === -1 ? (
                  <span key={`ellipsis-${i}`} className="text-text-sub-600 px-2">
                    &hellip;
                  </span>
                ) : (
                  <Pagination.Item
                    key={page}
                    current={page === currentPage}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Pagination.Item>
                )
              )}
              <Pagination.NavButton disabled={!hasNextPage} onClick={nextPage}>
                <Pagination.NavIcon as={RiArrowRightSLine} />
              </Pagination.NavButton>
            </Pagination.Root>
          </div>
        </>
      )}
    </div>
  );
};
