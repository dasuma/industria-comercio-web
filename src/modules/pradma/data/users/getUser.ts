import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { PradmaUser } from '../../models/user.interface';
import type { PradmaUserResponse } from '../../types/user.responses';
import { adaptUser } from './adapter';

const getUser = async (id: number): Promise<PradmaUser> => {
  const raw = await doFetch<void, PradmaUserResponse>({
    endpoint: endpointsPradma.getUser,
    value: `/${id}`
  });
  return adaptUser(raw);
};

export const useGetUser = (id: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_USER_DETAIL, id],
    queryFn: () => getUser(id!),
    enabled: id !== null
  });
