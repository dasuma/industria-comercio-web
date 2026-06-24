export interface InvoiceDetail {
  id: number;
  invoiceId: number;
  kind: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  establishmentId: number;
  year: number;
  status: string;
  presentationDate: string | null;
  expirationDate: string | null;
  total: number;
  details: InvoiceDetail[];
  createdAt: string;
  updatedAt: string;
}
