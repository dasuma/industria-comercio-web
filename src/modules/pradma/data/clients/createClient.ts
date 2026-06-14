import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateClientRequest } from '../../types/client.requests';
import type { ClientResponse } from '../../types/client.responses';

const createClient = (request: CreateClientRequest) =>
  doFetch<CreateClientRequest, ClientResponse>({
    endpoint: endpointsPradma.createClient,
    params: request
  });

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_CLIENTS_SEARCH] });
    }
  });
};
