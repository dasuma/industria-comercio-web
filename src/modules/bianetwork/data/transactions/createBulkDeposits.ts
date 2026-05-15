import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { CreateBulkDepositsRequest, ManualDepositItem } from '../../types/transactionRequests';
import type { BulkDepositsResponse } from '../../types/transactionResponses';

const createBulkDeposits = (deposits: ManualDepositItem[]) =>
  doFetch<CreateBulkDepositsRequest, BulkDepositsResponse>({
    endpoint: endpointsBianetwork.createBulkDeposits,
    params: { deposits }
  });

export const useCreateBulkDeposits = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBulkDeposits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS] });
    }
  });
};
