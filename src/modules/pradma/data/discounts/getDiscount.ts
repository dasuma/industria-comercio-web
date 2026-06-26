import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Discount } from '../../models/discount.interface';
import type { DiscountResponse } from '../../types/discount.responses';
import { adaptDiscount } from './adapter';

const getDiscount = async (id: number): Promise<Discount> => {
  const raw = await doFetch<void, DiscountResponse>({
    endpoint: endpointsPradma.getDiscount,
    value: `/${id}`
  });
  return adaptDiscount(raw);
};

export const useGetDiscount = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_DISCOUNT_DETAIL, id],
    queryFn: () => getDiscount(id!),
    enabled: id !== null
  });
