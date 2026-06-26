import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteDiscount = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteDiscount,
    value: `/${id}`
  });

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_DISCOUNTS_SEARCH] });
    }
  });
};
