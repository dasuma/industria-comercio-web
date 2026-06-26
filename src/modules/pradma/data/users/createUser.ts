import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreatePradmaUserRequest } from '../../types/user.requests';
import type { PradmaUserResponse } from '../../types/user.responses';

const createUser = (request: CreatePradmaUserRequest) =>
  doFetch<CreatePradmaUserRequest, PradmaUserResponse>({
    endpoint: endpointsPradma.createUser,
    params: request
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_USERS_SEARCH] });
    }
  });
};
