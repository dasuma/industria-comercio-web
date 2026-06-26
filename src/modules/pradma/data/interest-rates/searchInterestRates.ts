import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { InterestRate } from '../../models/interest-rate.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { InterestRateResponse } from '../../types/interest-rate.responses';
import { adaptInterestRatesResponse } from './adapter';

export const searchInterestRates = async (
  params: SearchRequest
): Promise<SearchResponse<InterestRate>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<InterestRateResponse>>({
    endpoint: endpointsPradma.searchInterestRates,
    params
  });
  return adaptInterestRatesResponse(raw);
};

export const useSearchInterestRates = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_INTEREST_RATES_SEARCH, params],
    queryFn: () => searchInterestRates(params),
    placeholderData: previous => previous
  });
