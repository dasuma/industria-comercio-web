import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BiaNetworkUser } from '../../models/user';
import type { PaginatedResponse } from '../../types/pagination';
import type { GetUsersParams } from '../../types/userRequests';
import type { UserResponse } from '../../types/userResponses';
import { adaptUsersResponse } from './adapter';

const buildQuery = (params: GetUsersParams): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.status) usp.set('status', params.status);
  if (params.referral_code) usp.set('referral_code', params.referral_code);
  if (params.tier_type) usp.set('tier_type', params.tier_type);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const getUsers = async (
  params: GetUsersParams
): Promise<PaginatedResponse<BiaNetworkUser>> => {
  const raw = await doFetch<void, PaginatedResponse<UserResponse>>({
    endpoint: {
      ...endpointsBianetwork.getUsers,
      url: `${endpointsBianetwork.getUsers.url}${buildQuery(params)}`
    }
  });
  return adaptUsersResponse(raw);
};

export const useGetUsers = (params: GetUsersParams) =>
  useQuery({
    queryKey: [QueryKeys.BIANETWORK_USERS, params],
    queryFn: () => getUsers(params),
    placeholderData: previous => previous
  });
