import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { PradmaUser } from '../../models/user.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { PradmaUserResponse } from '../../types/user.responses';
import { adaptUsersResponse } from './adapter';

export const searchUsers = async (params: SearchRequest): Promise<SearchResponse<PradmaUser>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<PradmaUserResponse>>({
    endpoint: endpointsPradma.searchUsers,
    params
  });
  return adaptUsersResponse(raw);
};

export const useSearchUsers = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_USERS_SEARCH, params],
    queryFn: () => searchUsers(params),
    placeholderData: previous => previous
  });
