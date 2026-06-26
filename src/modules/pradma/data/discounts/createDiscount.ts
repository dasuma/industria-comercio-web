import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateDiscountRequest } from '../../types/discount.requests';
import type { DiscountResponse } from '../../types/discount.responses';

const createDiscount = (request: CreateDiscountRequest) =>
  doFetch<CreateDiscountRequest, DiscountResponse>({
    endpoint: endpointsPradma.createDiscount,
    params: request
  });

export const useCreateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_DISCOUNTS_SEARCH] });
    }
  });
};
