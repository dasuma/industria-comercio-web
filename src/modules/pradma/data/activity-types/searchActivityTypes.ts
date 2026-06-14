import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { ActivityType } from '../../models/activity-type.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { ActivityTypeResponse } from '../../types/activity-type.responses';
import { adaptActivityTypesResponse } from './adapter';

const buildQuery = (params: SearchRequest): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.search) usp.set('search', params.search);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const searchActivityTypes = async (
  params: SearchRequest
): Promise<SearchResponse<ActivityType>> => {
  const raw = await doFetch<void, SearchResponse<ActivityTypeResponse>>({
    endpoint: {
      ...endpointsPradma.searchActivityTypes,
      url: `${endpointsPradma.searchActivityTypes.url}${buildQuery(params)}`
    }
  });
  return adaptActivityTypesResponse(raw);
};

export const useSearchActivityTypes = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ACTIVITY_TYPES_SEARCH, params],
    queryFn: () => searchActivityTypes(params),
    placeholderData: previous => previous
  });
