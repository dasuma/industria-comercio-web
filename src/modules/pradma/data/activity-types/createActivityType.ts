import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateActivityTypeRequest } from '../../types/activity-type.requests';
import type { ActivityTypeResponse } from '../../types/activity-type.responses';

const createActivityType = (request: CreateActivityTypeRequest) =>
  doFetch<CreateActivityTypeRequest, ActivityTypeResponse>({
    endpoint: endpointsPradma.createActivityType,
    params: request
  });

export const useCreateActivityType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_TYPES_SEARCH] });
    }
  });
};
