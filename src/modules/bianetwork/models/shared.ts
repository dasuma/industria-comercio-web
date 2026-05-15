export const BIA_NETWORK_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  ON_HOLD: 'ON_HOLD',
  IN_TRANSIT: 'IN_TRANSIT',
  ACTION_REQUIRED_USER: 'ACTION_REQUIRED_USER'
} as const;
export type BiaNetworkStatus = (typeof BIA_NETWORK_STATUS)[keyof typeof BIA_NETWORK_STATUS];
export const BIA_NETWORK_STATUSES = Object.values(BIA_NETWORK_STATUS);

export const BIA_NETWORK_STATUS_ACTION = {
  APPROVED: 'APPROVED',
  ON_HOLD: 'ON_HOLD',
  DENIED: 'DENIED',
  IN_TRANSIT: 'IN_TRANSIT'
} as const;
export type BiaNetworkStatusAction =
  (typeof BIA_NETWORK_STATUS_ACTION)[keyof typeof BIA_NETWORK_STATUS_ACTION];

export const BIA_NETWORK_PERSON_TYPE = {
  NATURAL: 'Natural',
  LEGAL: 'Legal'
} as const;
export type BiaNetworkPersonType =
  (typeof BIA_NETWORK_PERSON_TYPE)[keyof typeof BIA_NETWORK_PERSON_TYPE];

export const USER_TIER = {
  NORMAL: 'normal',
  PRO: 'pro'
} as const;
export type UserTier = (typeof USER_TIER)[keyof typeof USER_TIER];

export type BadgeStatusColor = 'gray' | 'green' | 'orange' | 'red' | 'blue' | 'purple';

export const STATUS_BADGE_COLOR: Record<BiaNetworkStatus, BadgeStatusColor> = {
  [BIA_NETWORK_STATUS.PENDING]: 'orange',
  [BIA_NETWORK_STATUS.APPROVED]: 'green',
  [BIA_NETWORK_STATUS.DENIED]: 'red',
  [BIA_NETWORK_STATUS.ON_HOLD]: 'orange',
  [BIA_NETWORK_STATUS.IN_TRANSIT]: 'blue',
  [BIA_NETWORK_STATUS.ACTION_REQUIRED_USER]: 'purple'
};
