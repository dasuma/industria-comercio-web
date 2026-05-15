import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsRetention } from '../endpoints';
import type { ContractRec } from '../../models/retention.interface';

const getContractRecs = (contractId: number) =>
  doFetch<undefined, ContractRec[]>({
    endpoint: endpointsRetention.getContractRecs,
    value: `?contract_id=${contractId}`
  });

export const useGetContractRecs = (contractId: number) =>
  useQuery({
    queryKey: [QueryKeys.RETENTION_RECS, contractId],
    queryFn: () => getContractRecs(contractId),
    enabled: contractId > 0
  });
