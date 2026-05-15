import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { UpdateUserStatusRequest } from '../../types/userRequests';

interface UpdateUserStatusVars {
  userId: string;
  request: UpdateUserStatusRequest;
}

const updateUserStatus = ({ userId, request }: UpdateUserStatusVars) =>
  doFetch<UpdateUserStatusRequest, void>({
    endpoint: endpointsBianetwork.updateUserStatus,
    value: `/${userId}/status`,
    params: request
  });

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_USERS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_USERS_PRO] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS] });
    }
  });
};
