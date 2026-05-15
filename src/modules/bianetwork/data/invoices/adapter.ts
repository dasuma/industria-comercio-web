import { type BiaNetworkStatus } from '../../models/shared';
import type { BiaNetworkInvoice } from '../../models/invoice';
import type { PaginatedResponse } from '../../types/pagination';
import type { InvoiceResponse, InvoicesPagedResponse } from '../../types/invoiceResponses';

const normalizeStatus = (status: string): BiaNetworkStatus => status as BiaNetworkStatus;

export const adaptInvoice = (raw: InvoiceResponse): BiaNetworkInvoice => ({
  id: String(raw.id),
  leadId: String(raw.lead_id),
  userId: String(raw.user_id),
  invoiceDocumentUrl: raw.invoice_document_url,
  status: normalizeStatus(raw.status),
  amount: raw.amount,
  deniedReason: raw.denied_reason,
  createdAt: raw.created_at,
  companyName: raw.company_name,
  nit: raw.nit,
  fullName: `${raw.name} ${raw.last_name}`.trim(),
  referralCode: raw.referral_code
});

// La API expone paginación page-based, pero internamente seguimos exponiendo
// `PaginatedResponse` (offset+limit) para que la UI use un único shape de
// pagination. Convertimos `page * page_size - page_size` → offset.
export const adaptInvoicesResponse = (
  raw: InvoicesPagedResponse
): PaginatedResponse<BiaNetworkInvoice> => ({
  data: raw.data.map(adaptInvoice),
  total_rows: raw.total_rows,
  offset: (raw.page - 1) * raw.page_size,
  limit: raw.page_size
});
