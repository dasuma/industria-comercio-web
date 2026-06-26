import type { InterestRate } from '../../models/interest-rate.interface';
import type { InterestRateResponse } from '../../types/interest-rate.responses';
import type { SearchResponse, ApiSearchResponse } from '../../types/search.types';

export const adaptInterestRate = (raw: InterestRateResponse): InterestRate => ({
  id: raw.id,
  year: raw.year,
  startDate: raw.start_date,
  endDate: raw.end_date,
  rateValue1: raw.rate_value_1,
  rateValue2: raw.rate_value_2,
  rateValue3: raw.rate_value_3,
  percentage: raw.percentage,
  surchargePercentage: raw.surcharge_percentage,
  interestPercentage: raw.interest_percentage,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
});

export const adaptInterestRatesResponse = (
  raw: ApiSearchResponse<InterestRateResponse>
): SearchResponse<InterestRate> => ({
  data: raw.data.map(adaptInterestRate),
  total: raw.pagination.total,
  offset: raw.pagination.current_offset,
  limit: raw.pagination.current_limit
});
