import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Establishment } from '../../models/establishment.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { EstablishmentResponse } from '../../types/establishment.responses';
import { adaptEstablishmentsResponse } from './adapter';

export const searchEstablishments = async (
  params: SearchRequest
): Promise<SearchResponse<Establishment>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<EstablishmentResponse>>({
    endpoint: endpointsPradma.searchEstablishments,
    params
  });
  return adaptEstablishmentsResponse(raw);
};

export const useSearchEstablishments = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ESTABLISHMENTS_SEARCH, params],
    queryFn: () => searchEstablishments(params),
    placeholderData: previous => previous
  });
