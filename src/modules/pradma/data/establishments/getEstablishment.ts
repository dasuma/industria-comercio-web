import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Establishment } from '../../models/establishment.interface';
import type { EstablishmentResponse } from '../../types/establishment.responses';
import { adaptEstablishment } from './adapter';

const getEstablishment = async (id: number): Promise<Establishment> => {
  const raw = await doFetch<void, EstablishmentResponse>({
    endpoint: endpointsPradma.getEstablishment,
    value: `/${id}`
  });
  return adaptEstablishment(raw);
};

export const useGetEstablishment = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_ESTABLISHMENT_DETAIL, id],
    queryFn: () => getEstablishment(id!),
    enabled: id !== null
  });
