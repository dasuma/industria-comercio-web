import { BIA_NETWORK_STATUS } from './shared';

export const USER_STATUS_FILTER = {
  ALL: 'ALL',
  PENDING: BIA_NETWORK_STATUS.PENDING,
  APPROVED: BIA_NETWORK_STATUS.APPROVED,
  DENIED: BIA_NETWORK_STATUS.DENIED,
  ON_HOLD: BIA_NETWORK_STATUS.ON_HOLD
} as const;
export type UserStatusFilter = (typeof USER_STATUS_FILTER)[keyof typeof USER_STATUS_FILTER];
export type UserApiStatusFilter = Exclude<UserStatusFilter, typeof USER_STATUS_FILTER.ALL>;
export const USER_STATUS_FILTERS: readonly UserStatusFilter[] = Object.values(USER_STATUS_FILTER);

/**
 * Si el filtro es 'ALL' no se manda al backend (no filtra por status).
 */
export const isApiStatus = (filter: UserStatusFilter): filter is UserApiStatusFilter =>
  filter !== USER_STATUS_FILTER.ALL;

export const USER_MODAL_ACTION = {
  APPROVED: BIA_NETWORK_STATUS.APPROVED,
  ON_HOLD: BIA_NETWORK_STATUS.ON_HOLD,
  DENIED: BIA_NETWORK_STATUS.DENIED
} as const;
export type UserModalAction = (typeof USER_MODAL_ACTION)[keyof typeof USER_MODAL_ACTION];
export const USER_MODAL_ACTIONS: readonly UserModalAction[] = Object.values(USER_MODAL_ACTION);
