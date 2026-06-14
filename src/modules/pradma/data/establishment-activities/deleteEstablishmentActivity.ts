import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';

const deleteEstablishmentActivity = (id: number) =>
  doFetch<void, void>({
    endpoint: endpointsPradma.deleteEstablishmentActivity,
    value: `/${id}`
  });

export const useDeleteEstablishmentActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEstablishmentActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITIES_SEARCH] });
    }
  });
};
