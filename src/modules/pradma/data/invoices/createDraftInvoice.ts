import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsPradma } from '../endpoints';
import type {
  CreateDraftInvoiceRequest,
  CreateDraftInvoiceResponse
} from '../../types/settlement.types';

const createDraftInvoice = (request: CreateDraftInvoiceRequest) =>
  doFetch<CreateDraftInvoiceRequest, CreateDraftInvoiceResponse>({
    endpoint: endpointsPradma.createDraftInvoice,
    params: request
  });

export const useCreateDraftInvoice = () =>
  useMutation({
    mutationFn: createDraftInvoice
  });
