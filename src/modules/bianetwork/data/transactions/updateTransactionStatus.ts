import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { UpdateTransactionStatusRequest } from '../../types/transactionRequests';

interface UpdateTransactionStatusVars {
  transactionId: string;
  request: UpdateTransactionStatusRequest;
}

const updateTransactionStatus = ({ transactionId, request }: UpdateTransactionStatusVars) =>
  doFetch<UpdateTransactionStatusRequest, void>({
    endpoint: endpointsBianetwork.updateTransactionStatus,
    value: `/${transactionId}/status`,
    params: request
  });

export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransactionStatus,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_TRANSACTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BIANETWORK_TRANSACTION_DETAIL, vars.transactionId]
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS] });
    }
  });
};
