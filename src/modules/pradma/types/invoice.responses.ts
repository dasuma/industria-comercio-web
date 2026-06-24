export interface InvoiceDetailResponse {
  id: number;
  invoice_id: number;
  kind: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceResponse {
  id: number;
  establishment_id: number;
  year: number;
  status: string;
  presentation_date: string | null;
  expiration_date: string | null;
  total: number;
  details: InvoiceDetailResponse[];
  created_at: string;
  updated_at: string;
}
