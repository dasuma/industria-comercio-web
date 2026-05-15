import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BiaNetworkAccount } from '../../models/account';
import type { PaginatedResponse } from '../../types/pagination';
import type { GetAccountsParams } from '../../types/accountRequests';
import type { AccountResponse } from '../../types/accountResponses';
import { adaptAccountsResponse } from './adapter';

const buildQuery = (params: GetAccountsParams): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.status) usp.set('status', params.status);
  if (params.referral_code) usp.set('referral_code', params.referral_code);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const getAccounts = async (
  params: GetAccountsParams
): Promise<PaginatedResponse<BiaNetworkAccount>> => {
  const raw = await doFetch<void, PaginatedResponse<AccountResponse>>({
    endpoint: {
      ...endpointsBianetwork.getAccounts,
      url: `${endpointsBianetwork.getAccounts.url}${buildQuery(params)}`
    }
  });
  return adaptAccountsResponse(raw);
};

export const useGetAccounts = (params: GetAccountsParams) =>
  useQuery({
    queryKey: [QueryKeys.BIANETWORK_ACCOUNTS, params],
    queryFn: () => getAccounts(params),
    placeholderData: previous => previous
  });
