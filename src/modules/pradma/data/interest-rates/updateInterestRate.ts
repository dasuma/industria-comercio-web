import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateInterestRateRequest } from '../../types/interest-rate.requests';
import type { InterestRateResponse } from '../../types/interest-rate.responses';

interface UpdateInterestRateVars {
  id: number;
  request: UpdateInterestRateRequest;
}

const updateInterestRate = ({ id, request }: UpdateInterestRateVars) =>
  doFetch<UpdateInterestRateRequest, InterestRateResponse>({
    endpoint: endpointsPradma.updateInterestRate,
    value: `/${id}`,
    params: request
  });

export const useUpdateInterestRate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInterestRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_INTEREST_RATES_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_INTEREST_RATE_DETAIL] });
    }
  });
};
