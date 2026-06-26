import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateInterestRateRequest } from '../../types/interest-rate.requests';
import type { InterestRateResponse } from '../../types/interest-rate.responses';

const createInterestRate = (request: CreateInterestRateRequest) =>
  doFetch<CreateInterestRateRequest, InterestRateResponse>({
    endpoint: endpointsPradma.createInterestRate,
    params: request
  });

export const useCreateInterestRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInterestRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_INTEREST_RATES_SEARCH] });
    }
  });
};
