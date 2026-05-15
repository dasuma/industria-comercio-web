import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsRetention } from '../endpoints';
import type { ContractRate, GetContractRatesParams } from '../../models/retention.interface';

const getContractRates = (params: GetContractRatesParams) =>
  doFetch<GetContractRatesParams, ContractRate[]>({
    endpoint: endpointsRetention.getContractRates,
    params
  });

export const useGetContractRates = (params: GetContractRatesParams) =>
  useQuery({
    queryKey: [QueryKeys.RETENTION_CONTRACT_RATES, params],
    queryFn: () => getContractRates(params)
  });
