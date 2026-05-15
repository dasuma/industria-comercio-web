import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BiaNetworkTransaction } from '../../models/transaction';
import type { PaginatedResponse } from '../../types/pagination';
import type { GetTransactionsParams } from '../../types/transactionRequests';
import type { TransactionResponse } from '../../types/transactionResponses';
import { adaptTransactionsResponse } from './adapter';

const buildQuery = (params: GetTransactionsParams): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.status) usp.set('status', params.status);
  if (params.referral_code) usp.set('referral_code', params.referral_code);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const getTransactions = async (
  params: GetTransactionsParams
): Promise<PaginatedResponse<BiaNetworkTransaction>> => {
  const raw = await doFetch<void, PaginatedResponse<TransactionResponse>>({
    endpoint: {
      ...endpointsBianetwork.getTransactions,
      url: `${endpointsBianetwork.getTransactions.url}${buildQuery(params)}`
    }
  });
  return adaptTransactionsResponse(raw);
};

export const useGetTransactions = (params: GetTransactionsParams) =>
  useQuery({
    queryKey: [QueryKeys.BIANETWORK_TRANSACTIONS, params],
    queryFn: () => getTransactions(params),
    placeholderData: previous => previous
  });
