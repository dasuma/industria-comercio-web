import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateSanctionRequest } from '../../types/sanction.requests';
import type { SanctionResponse } from '../../types/sanction.responses';

const createSanction = (request: CreateSanctionRequest) =>
  doFetch<CreateSanctionRequest, SanctionResponse>({
    endpoint: endpointsPradma.createSanction,
    params: request
  });

export const useCreateSanction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSanction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_SANCTIONS_SEARCH] });
    }
  });
};
