import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteActivityType = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteActivityType,
    value: `/${id}`
  });

export const useDeleteActivityType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_TYPES_SEARCH] });
    }
  });
};
