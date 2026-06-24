import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';
import { adaptEstablishmentActivity } from './adapter';

const getEstablishmentActivitiesByYear = async (
  establishmentId: number,
  year: number
): Promise<EstablishmentActivity[]> => {
  const raw = await doFetch<void, EstablishmentActivityResponse[]>({
    endpoint: endpointsPradma.getEstablishmentActivitiesByYear,
    value: `/${establishmentId}/year/${year}`
  });
  return raw.map(adaptEstablishmentActivity);
};

export const useGetEstablishmentActivitiesByYear = (establishmentId: number | null, year: number) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITIES_BY_YEAR, establishmentId, year],
    queryFn: () => getEstablishmentActivitiesByYear(establishmentId!, year),
    enabled: establishmentId !== null
  });
