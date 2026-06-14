import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { UpdateActivityCategoryRequest } from '../../types/activity-category.requests';
import type { ActivityCategoryResponse } from '../../types/activity-category.responses';

interface UpdateActivityCategoryVars {
  id: number;
  request: UpdateActivityCategoryRequest;
}

const updateActivityCategory = ({ id, request }: UpdateActivityCategoryVars) =>
  doFetch<UpdateActivityCategoryRequest, ActivityCategoryResponse>({
    endpoint: endpointsPradma.updateActivityCategory,
    value: `/${id}`,
    params: request
  });

export const useUpdateActivityCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateActivityCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORIES_SEARCH] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORY_DETAIL] });
    }
  });
};
