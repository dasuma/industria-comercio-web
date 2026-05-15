import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsExample } from '../endpoints';
import type { Example } from '../../models/example.interface';

export const getExamples = () => doFetch<void, Example[]>({ endpoint: endpointsExample.list });

export const useGetExamples = () =>
  useQuery({
    queryKey: [QueryKeys.EXAMPLE_LIST],
    queryFn: getExamples
  });
