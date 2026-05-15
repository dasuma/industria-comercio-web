import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BiaNetworkAccountDetail } from '../../models/account';
import type { AccountDetailResponse } from '../../types/accountResponses';
import { adaptAccountDetail } from './adapter';

export const getAccountDetail = async (id: string): Promise<BiaNetworkAccountDetail> => {
  const raw = await doFetch<void, AccountDetailResponse>({
    endpoint: endpointsBianetwork.getAccountDetail,
    value: `/${id}`
  });
  return adaptAccountDetail(raw);
};

export const useGetAccountDetail = (id: string | null) =>
  useQuery({
    queryKey: [QueryKeys.BIANETWORK_ACCOUNT_DETAIL, id],
    queryFn: () => getAccountDetail(id as string),
    enabled: Boolean(id)
  });
