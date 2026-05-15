import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsCgmRefill } from '../endpoints';
import type { WidgetsPayload } from '../../models/cgm-refill.interface';

interface ClearCacheParams {
  contractId: number;
  date: string;
}

export const useClearWidgetsCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, date }: ClearCacheParams) =>
      doFetch<WidgetsPayload, void>({
        endpoint: endpointsCgmRefill.clearWidgetsCache,
        params: { period: 'monthly', date, contract_ids: [contractId] }
      }),
    onSuccess: (_, { contractId, date }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CGM_REFILL_WIDGETS, contractId, date]
      });
    }
  });
};
