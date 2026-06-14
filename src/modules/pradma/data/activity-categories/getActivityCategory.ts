import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { ActivityCategory } from '../../models/activity-category.interface';
import type { ActivityCategoryResponse } from '../../types/activity-category.responses';
import { adaptActivityCategory } from './adapter';

const getActivityCategory = async (id: number): Promise<ActivityCategory> => {
  const raw = await doFetch<void, ActivityCategoryResponse>({
    endpoint: endpointsPradma.getActivityCategory,
    value: `/${id}`
  });
  return adaptActivityCategory(raw);
};

export const useGetActivityCategory = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ACTIVITY_CATEGORY_DETAIL, id],
    queryFn: () => getActivityCategory(id!),
    enabled: id !== null
  });
