import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsPradma } from '../endpoints';
import type { Invoice } from '../../models/invoice.interface';
import type { InvoiceResponse } from '../../types/invoice.responses';
import { adaptInvoice } from './adapter';

const getInvoicesByEstablishment = async (establishmentId: number): Promise<Invoice[]> => {
  const raw = await doFetch<void, InvoiceResponse[]>({
    endpoint: endpointsPradma.getInvoicesByEstablishment,
    value: `/${establishmentId}`
  });
  return raw.map(adaptInvoice);
};

export const useGetInvoicesByEstablishment = (establishmentId: number | null) =>
  useQuery({
    queryKey: [QueryKeys.PRADMA_INVOICES_BY_ESTABLISHMENT, establishmentId],
    queryFn: () => getInvoicesByEstablishment(establishmentId!),
    enabled: establishmentId !== null
  });
