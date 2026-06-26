import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Sanction } from '../../models/sanction.interface';
import type { SanctionResponse } from '../../types/sanction.responses';
import { adaptSanction } from './adapter';

const getSanction = async (id: number): Promise<Sanction> => {
  const raw = await doFetch<void, SanctionResponse>({
    endpoint: endpointsPradma.getSanction,
    value: `/${id}`
  });
  return adaptSanction(raw);
};

export const useGetSanction = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_SANCTION_DETAIL, id],
    queryFn: () => getSanction(id!),
    enabled: id !== null
  });
