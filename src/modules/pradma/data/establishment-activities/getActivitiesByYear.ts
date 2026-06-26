import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';
import { adaptEstablishmentActivity } from './adapter';

const getActivitiesByYear = async (year: number): Promise<EstablishmentActivity[]> => {
  const raw = await doFetch<void, EstablishmentActivityResponse[]>({
    endpoint: endpointsPradma.getActivitiesByYear,
    value: `/${year}`
  });
  return raw.map(adaptEstablishmentActivity);
};

export const useGetActivitiesByYear = (year: number) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ACTIVITIES_BY_YEAR, year],
    queryFn: () => getActivitiesByYear(year)
  });
