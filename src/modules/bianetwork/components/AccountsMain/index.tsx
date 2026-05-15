'use client';

import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { LoaderBrand, Pagination, SwitchRoot } from '@biaenergy/ui';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { Locale } from '@/i18n/config';
import { getBianetworkDict } from '../../dictionaries';
import { useGetAccounts } from '../../data/accounts/getAccounts';
import { BIA_NETWORK_STATUS } from '../../models/shared';
import type { BiaNetworkAccount } from '../../models/account';
import {
  USER_STATUS_FILTER,
  USER_STATUS_FILTERS,
  isApiStatus,
  type UserStatusFilter
} from '../../models/userFilters';
import { StatusFilters } from '../StatusFilters';
import { AccountsTable } from '../AccountsTable';
import { AccountDetailModal } from '../AccountDetailModal';

interface AccountsMainProps {
  locale: Locale;
}

const PAGE_SIZE = 10;
const PAGE_WINDOW = 1;

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

export const AccountsMain = ({ locale }: AccountsMainProps) => {
  const dict = getBianetworkDict(locale);
  const accountsDict = dict.accounts;
  const sharedDict = dict.shared;

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>(USER_STATUS_FILTER.ALL);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const compactSwitchId = useId();

  const queryParams = useMemo(
    () => ({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      status: isApiStatus(statusFilter) ? statusFilter : undefined
    }),
    [page, statusFilter]
  );

  const { data, isLoading, isError } = useGetAccounts(queryParams);
  const accounts = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.total_rows ?? 0) / PAGE_SIZE)),
    [data?.total_rows]
  );
  const pendingCount = useMemo(
    () => accounts.filter(a => a.status === BIA_NETWORK_STATUS.PENDING).length,
    [accounts]
  );
  const pageList = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);

  const handleStatusChange = useCallback((next: UserStatusFilter) => {
    setStatusFilter(next);
    setPage(1);
  }, []);

  const handleRowClick = useCallback((account: BiaNetworkAccount) => {
    setSelectedAccountId(account.id);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const isInitialLoading = isLoading && accounts.length === 0;
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    if (isInitialLoading) return;
    const t = setTimeout(() => setShowLoader(false), 240);
    return () => clearTimeout(t);
  }, [isInitialLoading]);

  return (
    <div className="relative">
      <div
        className={cn(
          'flex flex-col gap-5 transition-opacity duration-300 ease-out',
          isInitialLoading ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden={isInitialLoading}
      >
        <StatusFilters
          selectedStatus={statusFilter}
          onStatusChange={handleStatusChange}
          pendingCount={pendingCount}
          availableStatuses={USER_STATUS_FILTERS}
          labels={{
            [USER_STATUS_FILTER.ALL]: sharedDict.status_filters.all,
            [USER_STATUS_FILTER.PENDING]: sharedDict.status_filters.pending,
            [USER_STATUS_FILTER.APPROVED]: sharedDict.status_filters.approved,
            [USER_STATUS_FILTER.DENIED]: sharedDict.status_filters.denied,
            [USER_STATUS_FILTER.ON_HOLD]: sharedDict.status_filters.on_hold
          }}
        />

        {isError && (
          <div role="alert" className="border-error-base text-error-base rounded-lg border p-4">
            {accountsDict.list_error}
          </div>
        )}

        <AccountsTable
          data={accounts}
          loading={isLoading}
          onRowClick={handleRowClick}
          dict={accountsDict}
          sharedDict={sharedDict}
          compact={compact}
        />

        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor={compactSwitchId}
            className="text-text-sub-600 text-label-sm flex cursor-pointer items-center gap-2 select-none"
          >
            <SwitchRoot id={compactSwitchId} checked={compact} onCheckedChange={setCompact} />
            {sharedDict.compact_mode}
          </label>

          <Pagination.Root variant="basic">
            <Pagination.NavButton
              type="button"
              aria-label={sharedDict.pagination.previous}
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
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
                  onClick={() => setPage(entry)}
                >
                  {entry}
                </Pagination.Item>
              )
            )}
            <Pagination.NavButton
              type="button"
              aria-label={sharedDict.pagination.next}
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            >
              <Pagination.NavIcon as={RiArrowRightSLine} />
            </Pagination.NavButton>
          </Pagination.Root>
        </div>

        <AccountDetailModal
          isOpen={isDetailOpen}
          accountId={selectedAccountId}
          onClose={handleCloseDetail}
          dict={accountsDict}
          sharedDict={sharedDict}
        />
      </div>

      {showLoader && (
        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex min-h-[40vh] items-center justify-center',
            '[transition:opacity_220ms_ease-out,transform_220ms_ease-out]',
            isInitialLoading ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-0'
          )}
          aria-hidden={!isInitialLoading}
        >
          <LoaderBrand.Pill size="md" />
        </div>
      )}
    </div>
  );
};
