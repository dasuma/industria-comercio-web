import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateEstablishmentRequest } from '../../types/establishment.requests';
import type { EstablishmentResponse } from '../../types/establishment.responses';

const createEstablishment = (request: CreateEstablishmentRequest) =>
  doFetch<CreateEstablishmentRequest, EstablishmentResponse>({
    endpoint: endpointsPradma.createEstablishment,
    params: request
  });

export const useCreateEstablishment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEstablishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENTS_SEARCH] });
    }
  });
};
