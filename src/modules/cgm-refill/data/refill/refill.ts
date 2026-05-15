import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsCgmRefill } from '../endpoints';
import type { RefillPayload, RefillResponse } from '../../models/cgm-refill.interface';

const refill = (payload: RefillPayload) =>
  doFetch<RefillPayload, RefillResponse>({
    endpoint: endpointsCgmRefill.refill,
    params: payload
  });

export const useRefill = () =>
  useMutation({
    mutationFn: refill
  });
