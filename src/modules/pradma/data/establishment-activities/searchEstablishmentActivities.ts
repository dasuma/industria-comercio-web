import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';
import { adaptEstablishmentActivitiesResponse } from './adapter';

const buildQuery = (params: SearchRequest): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.search) usp.set('search', params.search);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const searchEstablishmentActivities = async (
  params: SearchRequest
): Promise<SearchResponse<EstablishmentActivity>> => {
  const raw = await doFetch<void, SearchResponse<EstablishmentActivityResponse>>({
    endpoint: {
      ...endpointsPradma.searchEstablishmentActivities,
      url: `${endpointsPradma.searchEstablishmentActivities.url}${buildQuery(params)}`
    }
  });
  return adaptEstablishmentActivitiesResponse(raw);
};

export const useSearchEstablishmentActivities = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITIES_SEARCH, params],
    queryFn: () => searchEstablishmentActivities(params),
    placeholderData: previous => previous
  });
