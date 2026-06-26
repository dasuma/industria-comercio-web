import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Discount } from '../../models/discount.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { DiscountResponse } from '../../types/discount.responses';
import { adaptDiscountsResponse } from './adapter';

export const searchDiscounts = async (params: SearchRequest): Promise<SearchResponse<Discount>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<DiscountResponse>>({
    endpoint: endpointsPradma.searchDiscounts,
    params
  });
  return adaptDiscountsResponse(raw);
};

export const useSearchDiscounts = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_DISCOUNTS_SEARCH, params],
    queryFn: () => searchDiscounts(params),
    placeholderData: previous => previous
  });
