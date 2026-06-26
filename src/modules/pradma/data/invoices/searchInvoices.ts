import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Invoice } from '../../models/invoice.interface';
import type { SearchRequest, SearchResponse, ApiSearchResponse } from '../../types/search.types';
import type { InvoiceResponse } from '../../types/invoice.responses';
import { adaptInvoice } from './adapter';

const searchInvoices = async (params: SearchRequest): Promise<SearchResponse<Invoice>> => {
  const raw = await doFetch<SearchRequest, ApiSearchResponse<InvoiceResponse>>({
    endpoint: endpointsPradma.searchInvoices,
    params
  });
  return {
    data: raw.data.map(adaptInvoice),
    total: raw.pagination.total,
    offset: raw.pagination.current_offset,
    limit: raw.pagination.current_limit
  };
};

export const useSearchInvoices = (params: SearchRequest) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_INVOICES_SEARCH, params],
    queryFn: () => searchInvoices(params),
    placeholderData: previous => previous
  });
