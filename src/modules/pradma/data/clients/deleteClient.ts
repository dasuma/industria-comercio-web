import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteClient = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteClient,
    value: `/${id}`
  });

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_CLIENTS_SEARCH] });
    }
  });
};
