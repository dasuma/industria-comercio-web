import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Client } from '../../models/client.interface';
import type { ClientResponse } from '../../types/client.responses';
import { adaptClient } from './adapter';

const getClient = async (id: number): Promise<Client> => {
  const raw = await doFetch<void, ClientResponse>({
    endpoint: endpointsPradma.getClient,
    value: `/${id}`
  });
  return adaptClient(raw);
};

export const useGetClient = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_CLIENT_DETAIL, id],
    queryFn: () => getClient(id!),
    enabled: id !== null
  });
