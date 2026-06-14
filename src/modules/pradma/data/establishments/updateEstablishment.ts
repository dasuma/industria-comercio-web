import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateEstablishmentRequest } from '../../types/establishment.requests';
import type { EstablishmentResponse } from '../../types/establishment.responses';

interface UpdateEstablishmentVars {
  id: number;
  request: UpdateEstablishmentRequest;
}

const updateEstablishment = ({ id, request }: UpdateEstablishmentVars) =>
  doFetch<UpdateEstablishmentRequest, EstablishmentResponse>({
    endpoint: endpointsPradma.updateEstablishment,
    value: `/${id}`,
    params: request
  });

export const useUpdateEstablishment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEstablishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENTS_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_DETAIL] });
    }
  });
};
