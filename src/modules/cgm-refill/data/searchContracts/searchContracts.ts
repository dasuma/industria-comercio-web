import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsCgmRefill } from '../endpoints';
import type {
  SearchContractField,
  SearchContractOperation,
  SearchContractsPayload,
  SearchContractsResponse
} from '../../models/cgm-refill.interface';

const FIELD_OPERATION: Record<SearchContractField, SearchContractOperation> = {
  id: 'eq',
  name: 'ilike',
  sic: 'ilike'
};

const searchContracts = (field: SearchContractField, value: string) => {
  const payload: SearchContractsPayload = {
    filters: [{ field, value, operation: FIELD_OPERATION[field], option: 'AND' }],
    paginate: { limit: 20, offset: 0, sort: 'id' }
  };
  return doFetch<SearchContractsPayload, SearchContractsResponse>({
    endpoint: endpointsCgmRefill.searchContracts,
    params: payload
  });
};

export const useSearchContracts = (field: SearchContractField, value: string) =>
  useQuery({
    queryKey: [QueryKeys.CGM_REFILL_SEARCH, field, value],
    queryFn: () => searchContracts(field, value),
    enabled: value.trim().length >= 1
  });
