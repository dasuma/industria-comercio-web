/**
 * API de Lead Invoices: paginación page-based, no offset-based como otros
 * endpoints. El response es un array directo + headers de paginación; el
 * adapter normaliza al PaginatedResponse compartido.
 */

export interface InvoiceResponse {
  id: string;
  lead_id: string;
  user_id: string;
  invoice_document_url: string;
  status: string;
  amount: number;
  denied_reason: string | null;
  created_at: string;
  company_name: string | null;
  nit: string | null;
  name: string;
  last_name: string;
  referral_code: string;
}

export interface InvoicesPagedResponse {
  data: InvoiceResponse[];
  total_rows: number;
  page: number;
  page_size: number;
}
