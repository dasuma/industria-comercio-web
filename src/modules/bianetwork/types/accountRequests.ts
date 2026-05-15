import type { BiaNetworkStatus, BiaNetworkStatusAction } from '../models/shared';

export interface GetAccountsParams {
  limit?: number;
  offset?: number;
  status?: BiaNetworkStatus;
  referral_code?: string;
}

export interface UpdateAccountStatusRequest {
  status: BiaNetworkStatusAction;
  note?: string;
  rejected_reason?: string;
}
