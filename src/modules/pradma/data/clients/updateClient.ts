import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateClientRequest } from '../../types/client.requests';
import type { ClientResponse } from '../../types/client.responses';

interface UpdateClientVars {
  id: number;
  request: UpdateClientRequest;
}

const updateClient = ({ id, request }: UpdateClientVars) =>
  doFetch<UpdateClientRequest, ClientResponse>({
    endpoint: endpointsPradma.updateClient,
    value: `/${id}`,
    params: request
  });

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_CLIENTS_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_CLIENT_DETAIL] });
    }
  });
};
