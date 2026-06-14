import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { PradmaUser } from '../../models/user.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { PradmaUserResponse } from '../../types/user.responses';
import { adaptUsersResponse } from './adapter';

const buildQuery = (params: SearchRequest): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.search) usp.set('search', params.search);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const searchUsers = async (params: SearchRequest): Promise<SearchResponse<PradmaUser>> => {
  const raw = await doFetch<void, SearchResponse<PradmaUserResponse>>({
    endpoint: {
      ...endpointsPradma.searchUsers,
      url: `${endpointsPradma.searchUsers.url}${buildQuery(params)}`
    }
  });
  return adaptUsersResponse(raw);
};

export const useSearchUsers = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_USERS_SEARCH, params],
    queryFn: () => searchUsers(params),
    placeholderData: previous => previous
  });
