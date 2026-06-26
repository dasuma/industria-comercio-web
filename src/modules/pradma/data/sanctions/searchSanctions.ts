import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Sanction } from '../../models/sanction.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { SanctionResponse } from '../../types/sanction.responses';
import { adaptSanctionsResponse } from './adapter';

export const searchSanctions = async (params: SearchRequest): Promise<SearchResponse<Sanction>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<SanctionResponse>>({
    endpoint: endpointsPradma.searchSanctions,
    params
  });
  return adaptSanctionsResponse(raw);
};

export const useSearchSanctions = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_SANCTIONS_SEARCH, params],
    queryFn: () => searchSanctions(params),
    placeholderData: previous => previous
  });
