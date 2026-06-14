import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { CreateActivityCategoryRequest } from '../../types/activity-category.requests';
import type { ActivityCategoryResponse } from '../../types/activity-category.responses';

const createActivityCategory = (request: CreateActivityCategoryRequest) =>
  doFetch<CreateActivityCategoryRequest, ActivityCategoryResponse>({
    endpoint: endpointsPradma.createActivityCategory,
    params: request
  });

export const useCreateActivityCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivityCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORIES_SEARCH] });
    }
  });
};
