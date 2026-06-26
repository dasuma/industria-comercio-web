import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';
import { adaptEstablishmentActivity } from './adapter';

const getPublicActivitiesByYear = async (year: number): Promise<EstablishmentActivity[]> => {
  const raw = await doFetch<void, EstablishmentActivityResponse[]>({
    endpoint: endpointsPradma.getActivitiesByYearPublic,
    value: `/${year}`
  });
  return raw.map(adaptEstablishmentActivity);
};

export const useGetPublicActivitiesByYear = (year: number) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_PUBLIC_ACTIVITIES_BY_YEAR, year],
    queryFn: () => getPublicActivitiesByYear(year)
  });
