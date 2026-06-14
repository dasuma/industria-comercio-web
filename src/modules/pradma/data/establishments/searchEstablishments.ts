import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Establishment } from '../../models/establishment.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { EstablishmentResponse } from '../../types/establishment.responses';
import { adaptEstablishmentsResponse } from './adapter';

const buildQuery = (params: SearchRequest): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.search) usp.set('search', params.search);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const searchEstablishments = async (
  params: SearchRequest
): Promise<SearchResponse<Establishment>> => {
  const raw = await doFetch<void, SearchResponse<EstablishmentResponse>>({
    endpoint: {
      ...endpointsPradma.searchEstablishments,
      url: `${endpointsPradma.searchEstablishments.url}${buildQuery(params)}`
    }
  });
  return adaptEstablishmentsResponse(raw);
};

export const useSearchEstablishments = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ESTABLISHMENTS_SEARCH, params],
    queryFn: () => searchEstablishments(params),
    placeholderData: previous => previous
  });
