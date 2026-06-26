import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteActivityCategory = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteActivityCategory,
    value: `/${id}`
  });

export const useDeleteActivityCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteActivityCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORIES_SEARCH] });
    }
  });
};
