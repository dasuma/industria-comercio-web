import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsCgmAnalysis } from '../endpoints';
import type { RefillPayload, RefillResponse } from '../../models/cgm-analysis.interface';

const refill = (payload: RefillPayload) =>
  doFetch<RefillPayload, RefillResponse>({
    endpoint: endpointsCgmAnalysis.refill,
    params: payload
  });

export const useRefill = () =>
  useMutation({
    mutationFn: refill
  });
