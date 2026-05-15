import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { UpdateInvoiceStatusRequest } from '../../types/invoiceRequests';

interface UpdateInvoiceStatusVars {
  invoiceId: string;
  request: UpdateInvoiceStatusRequest;
}

const updateInvoiceStatus = ({ invoiceId, request }: UpdateInvoiceStatusVars) =>
  doFetch<UpdateInvoiceStatusRequest, void>({
    endpoint: endpointsBianetwork.updateInvoiceStatus,
    value: `/${invoiceId}/status`,
    params: request
  });

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInvoiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_INVOICES] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS] });
    }
  });
};
