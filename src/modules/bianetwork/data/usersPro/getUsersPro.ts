import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BiaNetworkUser } from '../../models/user';
import type { PaginatedResponse } from '../../types/pagination';
import type { GetUsersParams } from '../../types/userRequests';
import type { UserResponse } from '../../types/userResponses';
import { adaptUsersResponse } from '../users/adapter';

interface GetUsersProParams {
  limit?: number;
  offset?: number;
  status?: GetUsersParams['status'];
  referral_code?: string;
}

const buildQuery = (params: GetUsersProParams, extra: Record<string, string>): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.status) usp.set('status', params.status);
  if (params.referral_code) usp.set('referral_code', params.referral_code);
  Object.entries(extra).forEach(([k, v]) => usp.set(k, v));
  const query = usp.toString();
  return query ? `?${query}` : '';
};

const fetchPro = async (
  params: GetUsersProParams,
  extra: Record<string, string>
): Promise<PaginatedResponse<BiaNetworkUser>> => {
  const raw = await doFetch<void, PaginatedResponse<UserResponse>>({
    endpoint: {
      ...endpointsBianetwork.getUsers,
      url: `${endpointsBianetwork.getUsers.url}${buildQuery(params, extra)}`
    }
  });
  return adaptUsersResponse(raw);
};

// El producto fuente fusiona dos llamadas para "Usuarios Pro": `utm_term=pro`
// (los que se registraron desde campañas Pro) + `tier_type=pro` (los que ya
// pasaron a Pro). El backend no expone un endpoint combinado, así que el
// merge es client-side. Dedupea por id y suma `total_rows` aproximando al
// peor caso (algún solapamiento real haría el total quedar ligeramente sobre
// el real; aceptable para mostrar paginación).
export const getUsersPro = async (
  params: GetUsersProParams
): Promise<PaginatedResponse<BiaNetworkUser>> => {
  const [utmResp, tierResp] = await Promise.all([
    fetchPro(params, { utm_term: 'pro' }),
    fetchPro(params, { tier_type: 'pro' })
  ]);
  const merged = new Map<string, BiaNetworkUser>();
  utmResp.data.forEach(u => merged.set(u.id, u));
  tierResp.data.forEach(u => merged.set(u.id, u));
  return {
    data: [...merged.values()],
    total_rows: utmResp.total_rows + tierResp.total_rows,
    offset: params.offset ?? 0,
    limit: params.limit ?? merged.size
  };
};

export const useGetUsersPro = (params: GetUsersProParams) =>
  useQuery({
    queryKey: [QueryKeys.BIANETWORK_USERS_PRO, params],
    queryFn: () => getUsersPro(params),
    placeholderData: previous => previous
  });
