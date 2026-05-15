'use client';

import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoaderBrand, Pagination, SwitchRoot } from '@biaenergy/ui';
import { showToast } from '@/core/feedback/toast';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { Locale } from '@/i18n/config';
import { getBianetworkDict } from '../../dictionaries';
import { useGetUsers } from '../../data/users/getUsers';
import { useUpgradeUserToPro } from '../../data/users/upgradeUserToPro';
import { BIA_NETWORK_STATUS, USER_TIER } from '../../models/shared';
import type { BiaNetworkUser } from '../../models/user';
import {
  USER_STATUS_FILTER,
  USER_STATUS_FILTERS,
  isApiStatus,
  type UserStatusFilter
} from '../../models/userFilters';
import { BiaNetworkSearch } from '../BiaNetworkSearch';
import { StatusFilters } from '../StatusFilters';
import { UsersTable } from '../UsersTable';
import { UserDetailModal } from '../UserDetailModal';
import { UpgradeToProModal } from '../UpgradeToProModal';

interface UsersMainProps {
  locale: Locale;
}

const PAGE_SIZE = 10;
// Cuántos números de página mostrar en la pagination antes/después del actual.
// Más allá colapsamos con ellipsis (similar al patrón clásico de tablas).
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

export const UsersMain = ({ locale }: UsersMainProps) => {
  const fullDict = getBianetworkDict(locale);
  const dict = fullDict.users;
  const sharedDict = fullDict.shared;

  // El query de búsqueda vive en la URL (param `?ref=`) — lo escribe el
  // componente `BiaNetworkSearch` del layout y lo leemos acá. URL-driven
  // permite bookmarks y mantiene state entre tabs sin un store global.
  const searchParams = useSearchParams();
  const referralSearch = searchParams?.get('ref')?.trim() ?? '';

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>(USER_STATUS_FILTER.ALL);
  const [lastSearch, setLastSearch] = useState(referralSearch);
  const [selectedUser, setSelectedUser] = useState<BiaNetworkUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [upgradeUser, setUpgradeUser] = useState<BiaNetworkUser | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const compactSwitchId = useId();

  // Reset page a 1 cuando cambia la búsqueda — patrón "adjust state during
  // render" recomendado por React (no useEffect): React detecta el set y
  // re-renderiza con los valores actualizados sin commitear el render anterior.
  if (lastSearch !== referralSearch) {
    setLastSearch(referralSearch);
    setPage(1);
  }

  const queryParams = useMemo(
    () => ({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      status: isApiStatus(statusFilter) ? statusFilter : undefined,
      referral_code: referralSearch || undefined,
      tier_type: USER_TIER.NORMAL
    }),
    [page, statusFilter, referralSearch]
  );

  const { data, isLoading, isError } = useGetUsers(queryParams);
  const upgradeMutation = useUpgradeUserToPro();

  const users = useMemo(() => data?.data ?? [], [data?.data]);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((data?.total_rows ?? 0) / PAGE_SIZE)),
    [data?.total_rows]
  );

  const pendingCount = useMemo(
    () => users.filter(user => user.status === BIA_NETWORK_STATUS.PENDING).length,
    [users]
  );

  const pageList = useMemo(() => buildPageList(page, totalPages), [page, totalPages]);

  const handleStatusChange = useCallback((next: UserStatusFilter) => {
    setStatusFilter(next);
    setPage(1);
  }, []);

  const handleRowClick = useCallback((user: BiaNetworkUser) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  }, []);

  // No limpiamos `selectedUser` al cerrar — el modal usa `if (!user) return null;`
  // y limpiar instantáneamente desmontaría el Modal de Radix antes de que pueda
  // correr la animación de exit. El user queda en state hasta que se seleccione
  // otro (o el componente padre se desmonte). Mismo para upgradeUser.
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handleUpgradeRequest = useCallback((user: BiaNetworkUser) => {
    setUpgradeUser(user);
    setIsUpgradeOpen(true);
  }, []);

  const handleCloseUpgrade = useCallback(() => {
    setIsUpgradeOpen(false);
  }, []);

  const handleConfirmUpgrade = useCallback(() => {
    if (!upgradeUser) return;
    upgradeMutation.mutate(upgradeUser.id, {
      onSuccess: () => {
        showToast('success', dict.upgrade_modal.success);
        handleCloseUpgrade();
      },
      onError: e => {
        showToast('error', e instanceof Error ? e.message : dict.upgrade_modal.error);
      }
    });
  }, [upgradeUser, upgradeMutation, dict, handleCloseUpgrade]);

  // Initial load: no hay data todavía. El PageHeader del shell sigue mostrando
  // título + descripción; acá renderizamos el contenido (filters + table +
  // pagination) detrás del loader, ambos en mismo container con fade
  // crossfaded. Para refetches no aplica — `placeholderData: previous`
  // mantiene rows visibles durante el fetch sin disparar el loader.
  const isInitialLoading = isLoading && users.length === 0;

  // Tras `isInitialLoading=false`, dejamos el loader montado 240ms para que
  // alcance a animar el fade-out + scale-down antes de unmount.
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
        <div className="flex items-center justify-between gap-3">
          <StatusFilters
            selectedStatus={statusFilter}
            onStatusChange={handleStatusChange}
            pendingCount={pendingCount}
            availableStatuses={USER_STATUS_FILTERS}
            labels={{
              [USER_STATUS_FILTER.ALL]: dict.status_filters.all,
              [USER_STATUS_FILTER.PENDING]: dict.status_filters.pending,
              [USER_STATUS_FILTER.APPROVED]: dict.status_filters.approved,
              [USER_STATUS_FILTER.DENIED]: dict.status_filters.denied,
              [USER_STATUS_FILTER.ON_HOLD]: dict.status_filters.on_hold
            }}
          />
          <BiaNetworkSearch locale={locale} />
        </div>

        {isError && (
          <div role="alert" className="border-error-base text-error-base rounded-lg border p-4">
            {dict.list_error}
          </div>
        )}

        <UsersTable
          data={users}
          loading={isLoading}
          onRowClick={handleRowClick}
          onUpgradeToPro={handleUpgradeRequest}
          dict={dict}
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
              aria-label={dict.pagination.previous}
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
              aria-label={dict.pagination.next}
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            >
              <Pagination.NavIcon as={RiArrowRightSLine} />
            </Pagination.NavButton>
          </Pagination.Root>
        </div>

        <UserDetailModal
          isOpen={isDetailOpen}
          user={selectedUser}
          onClose={handleCloseDetail}
          dict={dict}
        />

        <UpgradeToProModal
          isOpen={isUpgradeOpen}
          user={upgradeUser}
          loading={upgradeMutation.isPending}
          onClose={handleCloseUpgrade}
          onConfirm={handleConfirmUpgrade}
          dict={dict}
        />
      </div>

      {/* Loader overlay: cuando arranca el initial load se ve a opacity 1 +
          scale 1. Al llegar la data, fade-out 220ms + scale a 0.94 (sensación
          de "alejarse"). El content corre el fade-in en paralelo. Se desmonta
          240ms después para permitir que termine el transition. */}
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
