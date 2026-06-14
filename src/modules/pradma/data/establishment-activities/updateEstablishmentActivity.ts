import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateEstablishmentActivityRequest } from '../../types/establishment-activity.requests';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';

interface UpdateEstablishmentActivityVars {
  id: number;
  request: UpdateEstablishmentActivityRequest;
}

const updateEstablishmentActivity = ({ id, request }: UpdateEstablishmentActivityVars) =>
  doFetch<UpdateEstablishmentActivityRequest, EstablishmentActivityResponse>({
    endpoint: endpointsPradma.updateEstablishmentActivity,
    value: `/${id}`,
    params: request
  });

export const useUpdateEstablishmentActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEstablishmentActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITIES_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITY_DETAIL] });
    }
  });
};
