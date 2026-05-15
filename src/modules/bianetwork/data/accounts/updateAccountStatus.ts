import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { UpdateAccountStatusRequest } from '../../types/accountRequests';

interface UpdateAccountStatusVars {
  accountId: string;
  request: UpdateAccountStatusRequest;
}

const updateAccountStatus = ({ accountId, request }: UpdateAccountStatusVars) =>
  doFetch<UpdateAccountStatusRequest, void>({
    endpoint: endpointsBianetwork.updateAccountStatus,
    value: `/${accountId}/status`,
    params: request
  });

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAccountStatus,
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_ACCOUNTS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.BIANETWORK_ACCOUNT_DETAIL, vars.accountId]
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS] });
    }
  });
};
