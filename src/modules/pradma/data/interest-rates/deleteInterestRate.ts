import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteInterestRate = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteInterestRate,
    value: `/${id}`
  });

export const useDeleteInterestRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInterestRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_INTEREST_RATES_SEARCH] });
    }
  });
};
