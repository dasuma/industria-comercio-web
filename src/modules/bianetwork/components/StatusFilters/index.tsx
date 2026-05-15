'use client';

import { Badge, Button } from '@biaenergy/ui';
import { cn } from '@/utils/cn';
import { USER_STATUS_FILTER, type UserStatusFilter } from '../../models/userFilters';

interface StatusFiltersProps<TStatus extends string = UserStatusFilter> {
  selectedStatus: TStatus;
  onStatusChange: (status: TStatus) => void;
  pendingCount: number;
  availableStatuses: readonly TStatus[];
  labels: Record<TStatus, string>;
  pendingValue?: TStatus;
}

// "Filtro fuerte" del DS — patrón documentado en
// `apps/docs/content/docs/actions/button.mdx`. Sobre `Button.Root variant="basic"
// size="xsmall"` aplicamos un gradient dark + texto blanco + ring `text-sub-600`
// cuando está seleccionado. Hover-overrides con `!important` mantienen el
// visual "pegado" sin hover effect — el contraste fuerte ya tira del ojo.
const SELECTED_FUERTE_CLASS = [
  'bg-gradient-to-b from-neutral-600 to-neutral-950 dark:from-neutral-200 dark:to-neutral-0',
  'text-text-white-0 shadow-none',
  'ring-text-sub-600 dark:ring-neutral-300',
  'hover:!from-neutral-600 hover:!to-neutral-950 dark:hover:!from-neutral-200 dark:hover:!to-neutral-0',
  'hover:!text-text-white-0 hover:!ring-text-sub-600 dark:hover:!ring-neutral-300 hover:!shadow-none'
].join(' ');

export const StatusFilters = <TStatus extends string = UserStatusFilter>({
  selectedStatus,
  onStatusChange,
  pendingCount,
  availableStatuses,
  labels,
  pendingValue = USER_STATUS_FILTER.PENDING as TStatus
}: StatusFiltersProps<TStatus>) => {
  return (
    // pl-3 hace que el borde izquierdo del primer botón quede alineado con el
    // arranque de "Usuarios" en los top tabs (la List vive con `pl-3`); el
    // padding interno del Button (px-2.5) deja el TEXTO un toque a la derecha.
    <div className="flex flex-wrap items-center gap-2 pl-3">
      {availableStatuses.map(value => {
        const isActive = value === selectedStatus;
        const showPendingBadge = value === pendingValue && pendingCount > 0;
        return (
          <Button.Root
            key={value}
            type="button"
            variant="basic"
            size="xsmall"
            className={cn(isActive && SELECTED_FUERTE_CLASS)}
            onClick={() => onStatusChange(value)}
          >
            <span>{labels[value]}</span>
            {showPendingBadge && (
              <Badge.Root variant="lighter" color="orange" size="small">
                {pendingCount}
              </Badge.Root>
            )}
          </Button.Root>
        );
      })}
    </div>
  );
};
