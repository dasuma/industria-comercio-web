import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { SettlementActivityRequest } from '../../types/settlement.types';
import type { SettlementResponse } from '../../types/settlement.types';

export interface SimulateSettlementRequest {
  start_date: string;
  end_date: string;
  signs_billboards_tax?: boolean;
  fire_brigade_surcharge?: boolean;
  activities: SettlementActivityRequest[];
}

const simulateSettlement = (request: SimulateSettlementRequest) =>
  doFetch<SimulateSettlementRequest, SettlementResponse>({
    endpoint: endpointsPradma.simulateSettlement,
    params: request
  });

export const useSimulateSettlement = () =>
  useMutation({
    mutationFn: simulateSettlement
  });
