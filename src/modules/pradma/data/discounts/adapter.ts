import type { Discount } from '../../models/discount.interface';
import type { DiscountResponse } from '../../types/discount.responses';
import type { SearchResponse, ApiSearchResponse } from '../../types/search.types';

export const adaptDiscount = (raw: DiscountResponse): Discount => ({
  id: raw.id,
  year: raw.year,
  startDate: raw.start_date,
  endDate: raw.end_date,
  percentage: raw.percentage,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
});

export const adaptDiscountsResponse = (
  raw: ApiSearchResponse<DiscountResponse>
): SearchResponse<Discount> => ({
  data: raw.data.map(adaptDiscount),
  total: raw.pagination.total,
  offset: raw.pagination.current_offset,
  limit: raw.pagination.current_limit
});
