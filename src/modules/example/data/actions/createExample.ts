import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsExample } from '../endpoints';
import type { CreateExampleRequest, CreateExampleResponse } from '../../types/example.types';

const createExample = (params: CreateExampleRequest) =>
  doFetch<CreateExampleRequest, CreateExampleResponse>({
    endpoint: endpointsExample.create,
    params
  });

export const useCreateExample = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExample,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.EXAMPLE_LIST] })
  });
};
