import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateDiscountRequest } from '../../types/discount.requests';
import type { DiscountResponse } from '../../types/discount.responses';

interface UpdateDiscountVars {
  id: number;
  request: UpdateDiscountRequest;
}

const updateDiscount = ({ id, request }: UpdateDiscountVars) =>
  doFetch<UpdateDiscountRequest, DiscountResponse>({
    endpoint: endpointsPradma.updateDiscount,
    value: `/${id}`,
    params: request
  });

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_DISCOUNTS_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_DISCOUNT_DETAIL] });
    }
  });
};
