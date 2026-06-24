import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { CreateSettlementRequest, SettlementResponse } from '../../types/settlement.types';

const createSettlement = (request: CreateSettlementRequest) =>
  doFetch<CreateSettlementRequest, SettlementResponse>({
    endpoint: endpointsPradma.createSettlement,
    params: request
  });

export const useCreateSettlement = () =>
  useMutation({
    mutationFn: createSettlement
  });
