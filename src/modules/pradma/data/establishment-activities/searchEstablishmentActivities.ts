import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';
import { adaptEstablishmentActivitiesResponse } from './adapter';

export const searchEstablishmentActivities = async (
  params: SearchRequest
): Promise<SearchResponse<EstablishmentActivity>> => {
  const raw = await doFetch<SearchRequest, SearchResponse<EstablishmentActivityResponse>>({
    endpoint: endpointsPradma.searchEstablishmentActivities,
    params
  });
  return adaptEstablishmentActivitiesResponse(raw);
};

export const useSearchEstablishmentActivities = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITIES_SEARCH, params],
    queryFn: () => searchEstablishmentActivities(params),
    placeholderData: previous => previous
  });
