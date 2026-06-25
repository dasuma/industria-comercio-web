import type { Invoice, InvoiceDetail } from '../../models/invoice.interface';
import type { InvoiceDetailResponse, InvoiceResponse } from '../../types/invoice.responses';

export const adaptInvoiceDetail = (raw: InvoiceDetailResponse): InvoiceDetail => ({
  id: raw.id,
  invoiceId: raw.invoice_id,
  kind: raw.kind,
  amount: raw.amount,
  description: raw.description,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
});

export const adaptInvoice = (raw: InvoiceResponse): Invoice => ({
  id: raw.id,
  establishmentId: raw.establishment_id,
  year: raw.year,
  status: raw.status,
  presentationDate: raw.presentation_date,
  expirationDate: raw.expiration_date,
  total: raw.total,
  pdfUrl: raw.pdf_url,
  details: raw.details.map(adaptInvoiceDetail),
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
});
