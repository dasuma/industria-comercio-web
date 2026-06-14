import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { ActivityType } from '../../models/activity-type.interface';
import type { ActivityTypeResponse } from '../../types/activity-type.responses';
import { adaptActivityType } from './adapter';

const getActivityType = async (id: number): Promise<ActivityType> => {
  const raw = await doFetch<void, ActivityTypeResponse>({
    endpoint: endpointsPradma.getActivityType,
    value: `/${id}`
  });
  return adaptActivityType(raw);
};

export const useGetActivityType = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ACTIVITY_TYPE_DETAIL, id],
    queryFn: () => getActivityType(id!),
    enabled: id !== null
  });
