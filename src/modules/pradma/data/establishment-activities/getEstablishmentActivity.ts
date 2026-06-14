import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';
import { adaptEstablishmentActivity } from './adapter';

const getEstablishmentActivity = async (id: number): Promise<EstablishmentActivity> => {
  const raw = await doFetch<void, EstablishmentActivityResponse>({
    endpoint: endpointsPradma.getEstablishmentActivity,
    value: `/${id}`
  });
  return adaptEstablishmentActivity(raw);
};

export const useGetEstablishmentActivity = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_ACTIVITY_DETAIL, id],
    queryFn: () => getEstablishmentActivity(id!),
    enabled: id !== null
  });
