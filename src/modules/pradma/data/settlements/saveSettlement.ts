import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type { SaveSettlementRequest } from '../../types/settlement.types';

const saveSettlement = (request: SaveSettlementRequest) =>
  doFetch<SaveSettlementRequest, void>({
    endpoint: endpointsPradma.saveSettlement,
    params: request
  });

export const useSaveSettlement = () =>
  useMutation({
    mutationFn: saveSettlement
  });
