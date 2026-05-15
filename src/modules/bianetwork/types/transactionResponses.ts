/**
 * Tipos técnicos snake_case devueltos por la API de transacciones. El adapter
 * los traduce a la entidad de dominio en `models/transaction.ts`.
 */

export interface TransactionAttachmentResponse {
  id: number;
  document_type: string;
  link: string;
  created_at: string;
}

export interface TransactionResponse {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  legal_subject: string;
  status: string;
  amount: number;
  referral_code: string;
  attachments: TransactionAttachmentResponse[];
  created_at: string;
}

export interface BulkDepositsResponse {
  succeeded: number;
  failed: number;
  errors?: Array<{ referral_code: string; message: string }>;
}
