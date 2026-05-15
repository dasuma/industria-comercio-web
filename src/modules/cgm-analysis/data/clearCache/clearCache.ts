import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsCgmAnalysis } from '../endpoints';
import type { WidgetsPayload } from '../../models/cgm-analysis.interface';

interface ClearCacheParams {
  contractId: number;
  date: string;
}

export const useClearWidgetsCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, date }: ClearCacheParams) =>
      doFetch<WidgetsPayload, void>({
        endpoint: endpointsCgmAnalysis.clearWidgetsCache,
        params: { period: 'monthly', date, contract_ids: [contractId] }
      }),
    onSuccess: (_, { contractId, date }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CGM_ANALYSIS_WIDGETS, contractId, date]
      });
    }
  });
};
