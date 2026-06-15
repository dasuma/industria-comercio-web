import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdatePradmaUserRequest } from '../../types/user.requests';
import type { PradmaUserResponse } from '../../types/user.responses';

interface UpdateUserVars {
  id: string;
  request: UpdatePradmaUserRequest;
}

const updateUser = ({ id, request }: UpdateUserVars) =>
  doFetch<UpdatePradmaUserRequest, PradmaUserResponse>({
    endpoint: endpointsPradma.updateUser,
    value: `/${id}`,
    params: request
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_USERS_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_USER_DETAIL] });
    }
  });
};
