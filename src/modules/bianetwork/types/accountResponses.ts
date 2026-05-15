/**
 * Tipos técnicos snake_case devueltos por la API. El adapter los traduce a la
 * entidad de dominio en `models/account.ts`.
 */

export interface AccountResponse {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  legal_subject: string;
  user_status: string;
  referral_code: string;
  created_at: string;
}

export interface AccountDetailResponse extends AccountResponse {
  document_type_name: string;
  document_number: string;
  bank_name: string | null;
  bank_account_type: string | null;
  bank_account_number: string | null;
  city: string | null;
  address: string | null;
  laft_warning: string | null;
  notes: string | null;
}
