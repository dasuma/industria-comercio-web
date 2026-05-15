import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BiaNetworkInvoice } from '../../models/invoice';
import type { PaginatedResponse } from '../../types/pagination';
import type { GetInvoicesParams } from '../../types/invoiceRequests';
import type { InvoicesPagedResponse } from '../../types/invoiceResponses';
import { adaptInvoicesResponse } from './adapter';

const buildQuery = (params: GetInvoicesParams): string => {
  const usp = new URLSearchParams();
  if (params.page !== undefined) usp.set('page', String(params.page));
  if (params.page_size !== undefined) usp.set('page_size', String(params.page_size));
  if (params.status) usp.set('status', params.status);
  const query = usp.toString();
  return query ? `?${query}` : '';
};

export const getInvoices = async (
  params: GetInvoicesParams
): Promise<PaginatedResponse<BiaNetworkInvoice>> => {
  const raw = await doFetch<void, InvoicesPagedResponse>({
    endpoint: {
      ...endpointsBianetwork.getInvoices,
      url: `${endpointsBianetwork.getInvoices.url}${buildQuery(params)}`
    }
  });
  return adaptInvoicesResponse(raw);
};

export const useGetInvoices = (params: GetInvoicesParams) =>
  useQuery({
    queryKey: [QueryKeys.BIANETWORK_INVOICES, params],
    queryFn: () => getInvoices(params),
    placeholderData: previous => previous
  });
