import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteEstablishment = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteEstablishment,
    value: `/${id}`
  });

export const useDeleteEstablishment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEstablishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENTS_SEARCH] });
    }
  });
};
