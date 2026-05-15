import type { BiaNetworkStatus, BiaNetworkStatusAction } from '../models/shared';

export interface GetInvoicesParams {
  page?: number;
  page_size?: number;
  status?: BiaNetworkStatus;
}

export interface UpdateInvoiceStatusRequest {
  status: BiaNetworkStatusAction;
  denied_reason?: string;
}
