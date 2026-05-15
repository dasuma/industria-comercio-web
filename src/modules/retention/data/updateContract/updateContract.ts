import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsRetention } from '../endpoints';
import type { RetentionContract } from '../../models/retention.interface';

export const useUpdateContract = () =>
  useMutation({
    mutationFn: (payload: Partial<RetentionContract> & { id: number }) =>
      doFetch<typeof payload, RetentionContract>({
        endpoint: {
          ...endpointsRetention.updateContract,
          url: `${endpointsRetention.updateContract.url}/${payload.id}`
        },
        params: payload
      })
  });
