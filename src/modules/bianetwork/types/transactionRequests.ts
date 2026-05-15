import type { BiaNetworkStatusAction } from '../models/shared';

export interface GetTransactionsParams {
  limit?: number;
  offset?: number;
  status?: string;
  referral_code?: string;
}

export interface UpdateTransactionStatusRequest {
  status: BiaNetworkStatusAction;
  note?: string;
  rejected_reason?: string;
}

export interface ManualDepositItem {
  referral_code: string;
  amount: number;
  note?: string;
}

export interface CreateBulkDepositsRequest {
  deposits: ManualDepositItem[];
}
