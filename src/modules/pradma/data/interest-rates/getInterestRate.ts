import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { InterestRate } from '../../models/interest-rate.interface';
import type { InterestRateResponse } from '../../types/interest-rate.responses';
import { adaptInterestRate } from './adapter';

const getInterestRate = async (id: number): Promise<InterestRate> => {
  const raw = await doFetch<void, InterestRateResponse>({
    endpoint: endpointsPradma.getInterestRate,
    value: `/${id}`
  });
  return adaptInterestRate(raw);
};

export const useGetInterestRate = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_INTEREST_RATE_DETAIL, id],
    queryFn: () => getInterestRate(id!),
    enabled: id !== null
  });
