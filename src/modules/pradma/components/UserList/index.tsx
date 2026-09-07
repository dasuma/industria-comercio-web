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
import { useSearchUsers } from '../../data';
import { useSearchPagination } from '../../hooks/useSearchPagination';
import { USER_ROLE, type UserRole } from '../../models/shared';
import { UserPanel } from '../UserPanel';
import type { SearchFilter } from '../../types/search.types';

interface UserListProps {
  locale: Locale;
}

const buildFilters = (query: string): SearchFilter[] => {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return [{ field: 'email', value: trimmed, operation: 'ilike', option: 'AND' }];
};

export const UserList = ({ locale }: UserListProps) => {
  const dict = getPradmaDict(locale);
  const d = dict.users;
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const openCreate = () => {
    setSelectedUserId(null);
    setPanelOpen(true);
  };

  const openEdit = (id: string) => {
    setSelectedUserId(id);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setSelectedUserId(null);
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

  const { data, isLoading, isError, refetch } = useSearchUsers(searchParams);

  useEffect(() => {
    if (data) setTotal(data.total);
  }, [data, setTotal]);

  const isEmpty = !isLoading && !isError && (!data || data.data.length === 0);
  const hasQuery = search.trim().length > 0;
  const roleLabel = (role: string): string => d.roles[role as UserRole] ?? role;

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

        {isLoading && <ListSkeleton columns={4} />}

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
                  <Table.Head>{d.columns.email}</Table.Head>
                  <Table.Head>{d.columns.role}</Table.Head>
                  <Table.Head>{d.columns.id}</Table.Head>
                  <Table.Head className="text-right">{dict.common.actions}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.data.map(user => (
                  <Table.Row key={user.id} {...clickableRowProps(() => openEdit(user.id))}>
                    <Table.Cell className="text-text-strong-950 font-medium">
                      {user.email}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge.Root
                        variant="light"
                        color={user.role === USER_ROLE.ADMIN ? 'blue' : 'gray'}
                      >
                        {roleLabel(user.role)}
                      </Badge.Root>
                    </Table.Cell>
                    <Table.Cell className="text-text-soft-400 font-mono text-xs">
                      {user.id}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      <CompactButton.Root
                        variant="ghost"
                        size="medium"
                        aria-label={dict.common.edit}
                        onClick={event => {
                          event.stopPropagation();
                          openEdit(user.id);
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

      {panelOpen && <UserPanel locale={locale} userId={selectedUserId} onClose={closePanel} />}
    </>
  );
};
