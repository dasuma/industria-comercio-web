'use client';

import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { FancyButton, LoaderBrand, Pagination, SwitchRoot } from '@biaenergy/ui';
import { RiAddLine, RiArrowLeftSLine, RiArrowRightSLine, RiUploadLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { Locale } from '@/i18n/config';
import { getBianetworkDict } from '../../dictionaries';
import { useGetTransactions } from '../../data/transactions/getTransactions';
import { BIA_NETWORK_STATUS } from '../../models/shared';
import { TRANSACTION_STATUS_TO_API, type BiaNetworkTransaction } from '../../models/transaction';
import {
  USER_STATUS_FILTER,
  USER_STATUS_FILTERS,
  isApiStatus,
  type UserStatusFilter
} from '../../models/userFilters';
import { StatusFilters } from '../StatusFilters';
import { TransactionsTable } from '../TransactionsTable';
import { TransactionDetailModal } from '../TransactionDetailModal';
import { GenerateDepositModal } from '../GenerateDepositModal';

interface TransactionsMainProps {
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

// Para Transacciones, los valores de filtro UI (`PENDING`, `APPROVED`) se
// traducen al status que la API entiende (`PENDING_MANUAL_VALIDATION`,
// `IN_TRANSIT`). Mapeo en transaction.ts.
const mapStatusToApi = (filter: UserStatusFilter): string | undefined => {
  if (!isApiStatus(filter)) return undefined;
  return TRANSACTION_STATUS_TO_API[filter] ?? filter;
};

export const TransactionsMain = ({ locale }: TransactionsMainProps) => {
  const dict = getBianetworkDict(locale);
  const txDict = dict.transactions;
  const sharedDict = dict.shared;
  const generateDict = dict.generate_deposit_modal;

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>(USER_STATUS_FILTER.ALL);
  const [selected, setSelected] = useState<BiaNetworkTransaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [depositMode, setDepositMode] = useState<'manual' | 'excel' | null>(null);
  const [compact, setCompact] = useState(false);
  const compactSwitchId = useId();

  const queryParams = useMemo(
    () => ({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      status: mapStatusToApi(statusFilter)
    }),
    [page, statusFilter]
  );

  const { data, isLoading, isError } = useGetTransactions(queryParams);
  const transactions = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.total_rows ?? 0) / PAGE_SIZE)),
    [data?.total_rows]
  );
  const pendingCount = useMemo(
    () => transactions.filter(t => t.status === BIA_NETWORK_STATUS.PENDING).length,
    [transactions]
  );
  const pageList = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);

  const handleStatusChange = useCallback((next: UserStatusFilter) => {
    setStatusFilter(next);
    setPage(1);
  }, []);

  const handleRowClick = useCallback((tx: BiaNetworkTransaction) => {
    setSelected(tx);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => setIsDetailOpen(false), []);

  const isInitialLoading = isLoading && transactions.length === 0;
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    if (isInitialLoading) return;
    const t = setTimeout(() => setShowLoader(false), 240);
    return () => clearTimeout(t);
  }, [isInitialLoading]);

  // Statuses que aplican a Transacciones: ALL, PENDING (PENDING_MANUAL_VALIDATION),
  // APPROVED (IN_TRANSIT), DENIED. Excluimos ON_HOLD (no existe en la API).
  const transactionStatuses = USER_STATUS_FILTERS.filter(
    s => s !== USER_STATUS_FILTER.ON_HOLD
  ) as readonly UserStatusFilter[];

  return (
    <div className="relative">
      <div
        className={cn(
          'flex flex-col gap-5 transition-opacity duration-300 ease-out',
          isInitialLoading ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden={isInitialLoading}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <StatusFilters
            selectedStatus={statusFilter}
            onStatusChange={handleStatusChange}
            pendingCount={pendingCount}
            availableStatuses={transactionStatuses}
            labels={{
              [USER_STATUS_FILTER.ALL]: sharedDict.status_filters.all,
              [USER_STATUS_FILTER.PENDING]: sharedDict.status_filters.pending,
              [USER_STATUS_FILTER.APPROVED]: sharedDict.status_filters.approved,
              [USER_STATUS_FILTER.DENIED]: sharedDict.status_filters.denied,
              [USER_STATUS_FILTER.ON_HOLD]: sharedDict.status_filters.on_hold
            }}
          />

          <div className="flex gap-2">
            <FancyButton.Root
              type="button"
              variant="basic"
              size="xsmall"
              onClick={() => setDepositMode('manual')}
            >
              <FancyButton.Icon as={RiAddLine} />
              {txDict.btn_create_manual}
            </FancyButton.Root>
            <FancyButton.Root
              type="button"
              variant="basic"
              size="xsmall"
              onClick={() => setDepositMode('excel')}
            >
              <FancyButton.Icon as={RiUploadLine} />
              {txDict.btn_upload_excel}
            </FancyButton.Root>
          </div>
        </div>

        {isError && (
          <div role="alert" className="border-error-base text-error-base rounded-lg border p-4">
            {txDict.list_error}
          </div>
        )}

        <TransactionsTable
          data={transactions}
          loading={isLoading}
          onRowClick={handleRowClick}
          dict={txDict}
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

        <TransactionDetailModal
          isOpen={isDetailOpen}
          transaction={selected}
          onClose={handleCloseDetail}
          dict={txDict}
          sharedDict={sharedDict}
        />

        <GenerateDepositModal
          isOpen={depositMode !== null}
          initialMode={depositMode ?? 'manual'}
          onClose={() => setDepositMode(null)}
          dict={generateDict}
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
