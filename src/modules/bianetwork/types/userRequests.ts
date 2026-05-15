import type { BiaNetworkStatus, BiaNetworkStatusAction, UserTier } from '../models/shared';

export interface GetUsersParams {
  limit?: number;
  offset?: number;
  status?: BiaNetworkStatus;
  referral_code?: string;
  tier_type?: UserTier;
}

export interface UpdateUserStatusRequest {
  status: BiaNetworkStatusAction;
  note?: string;
  approved_by?: string;
  rejected_reason?: string;
  updated_by?: string;
  tax_regime_id?: number;
}
