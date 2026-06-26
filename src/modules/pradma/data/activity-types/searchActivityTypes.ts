import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { ActivityType } from '../../models/activity-type.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { ActivityTypeResponse } from '../../types/activity-type.responses';
import { adaptActivityTypesResponse } from './adapter';

export const searchActivityTypes = async (
  params: SearchRequest
): Promise<SearchResponse<ActivityType>> => {
  const raw = await doFetch<SearchRequest, SearchResponse<ActivityTypeResponse>>({
    endpoint: endpointsPradma.searchActivityTypes,
    params
  });
  return adaptActivityTypesResponse(raw);
};

export const useSearchActivityTypes = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ACTIVITY_TYPES_SEARCH, params],
    queryFn: () => searchActivityTypes(params),
    placeholderData: previous => previous
  });
