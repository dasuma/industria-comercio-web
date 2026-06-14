import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateActivityTypeRequest } from '../../types/activity-type.requests';
import type { ActivityTypeResponse } from '../../types/activity-type.responses';

interface UpdateActivityTypeVars {
  id: number;
  request: UpdateActivityTypeRequest;
}

const updateActivityType = ({ id, request }: UpdateActivityTypeVars) =>
  doFetch<UpdateActivityTypeRequest, ActivityTypeResponse>({
    endpoint: endpointsPradma.updateActivityType,
    value: `/${id}`,
    params: request
  });

export const useUpdateActivityType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActivityType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_TYPES_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_TYPE_DETAIL] });
    }
  });
};
