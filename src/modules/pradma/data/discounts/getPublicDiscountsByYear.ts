import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { Discount } from '../../models/discount.interface';
import type { SearchRequest, ApiSearchResponse } from '../../types/search.types';
import type { DiscountResponse } from '../../types/discount.responses';
import { adaptDiscountsResponse } from './adapter';

export const getPublicDiscountsByYear = async (year: number): Promise<Discount[]> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<DiscountResponse>>({
    endpoint: endpointsPradma.searchDiscountsPublic,
    params: {
      filters: [{ field: 'year', value: year, operation: 'eq', option: 'AND' }],
      paginate: { offset: 0, limit: 50, sort: 'start_date asc' }
    }
  });
  return adaptDiscountsResponse(raw).data;
};
