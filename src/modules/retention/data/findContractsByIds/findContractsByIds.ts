import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsRetention } from '../endpoints';
import type {
  FindContractsByIdsPayload,
  FindContractsByIdsResponse
} from '../../models/retention.interface';

const findContractsByIds = (ids: number[]) =>
  doFetch<FindContractsByIdsPayload, FindContractsByIdsResponse>({
    endpoint: endpointsRetention.findContractsByIds,
    params: { ids }
  });

export const useFindContractsByIds = (ids: number[]) =>
  useQuery({
    queryKey: [QueryKeys.RETENTION_CONTRACT_DETAIL, ids],
    queryFn: () => findContractsByIds(ids),
    enabled: ids.length > 0
  });
