import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Client } from '../../models/client.interface';
import type { SearchRequest, SearchResponse } from '../../types/search.types';
import type { ClientResponse } from '../../types/client.responses';
import { adaptClientsResponse } from './adapter';

const buildQuery = (params: SearchRequest): string => {
  const usp = new URLSearchParams();
  if (params.limit !== undefined) usp.set('limit', String(params.limit));
  if (params.offset !== undefined) usp.set('offset', String(params.offset));
  if (params.search) usp.set('search', params.search);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const searchClients = async (
  params: SearchRequest
): Promise<SearchResponse<Client>> => {
  const raw = await doFetch<void, SearchResponse<ClientResponse>>({
    endpoint: {
      ...endpointsPradma.searchClients,
      url: `${endpointsPradma.searchClients.url}${buildQuery(params)}`
    }
  });
  return adaptClientsResponse(raw);
};

export const useSearchClients = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_CLIENTS_SEARCH, params],
    queryFn: () => searchClients(params),
    placeholderData: previous => previous
  });
