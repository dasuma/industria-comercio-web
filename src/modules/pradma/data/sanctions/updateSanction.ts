import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateSanctionRequest } from '../../types/sanction.requests';
import type { SanctionResponse } from '../../types/sanction.responses';

interface UpdateSanctionVars {
  id: number;
  request: UpdateSanctionRequest;
}

const updateSanction = ({ id, request }: UpdateSanctionVars) =>
  doFetch<UpdateSanctionRequest, SanctionResponse>({
    endpoint: endpointsPradma.updateSanction,
    value: `/${id}`,
    params: request
  });

export const useUpdateSanction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSanction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_SANCTIONS_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_SANCTION_DETAIL] });
    }
  });
};
