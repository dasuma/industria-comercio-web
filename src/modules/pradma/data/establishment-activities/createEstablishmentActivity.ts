import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateEstablishmentActivityRequest } from '../../types/establishment-activity.requests';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';

const createEstablishmentActivity = (request: CreateEstablishmentActivityRequest) =>
  doFetch<CreateEstablishmentActivityRequest, EstablishmentActivityResponse>({
    endpoint: endpointsPradma.createEstablishmentActivity,
    params: request
  });

export const useCreateEstablishmentActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEstablishmentActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITIES_SEARCH] });
    }
  });
};
