import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteSanction = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteSanction,
    value: `/${id}`
  });

export const useDeleteSanction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSanction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_SANCTIONS_SEARCH] });
    }
  });
};
