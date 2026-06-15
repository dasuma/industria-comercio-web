import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Client } from '../../models/client.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { ClientResponse } from '../../types/client.responses';
import { adaptClientsResponse } from './adapter';

export const searchClients = async (params: SearchRequest): Promise<SearchResponse<Client>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<ClientResponse>>({
    endpoint: endpointsPradma.searchClients,
    params
  });
  return adaptClientsResponse(raw);
};

export const useSearchClients = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_CLIENTS_SEARCH, params],
    queryFn: () => searchClients(params),
    placeholderData: previous => previous
  });
