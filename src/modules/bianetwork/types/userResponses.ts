/**
 * Tipos técnicos que reflejan el shape snake_case que devuelve la API.
 * El adapter los traduce a las entidades de dominio en `models/user.ts`.
 */

export interface UserAttachmentResponse {
  id: number;
  document_type: string;
  link: string;
  created_at: string;
}

export interface UserCompanyResponse {
  id: number;
  name: string;
  document_type: number;
  document_type_name: string;
  document_number: string;
  legal_representative_name: string;
  legal_representative_last_name: string;
  code_country: string;
  phone_number: string | null;
  email: string | null;
  user_id: string;
  legal_representative_document_type: number;
  legal_representative_document_type_name: string;
  legal_representative_document_number: string;
  legal_representative_phone_number: string;
  legal_representative_laft_warning: string;
  laft_warning: string;
  city: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: string;
  name: string;
  last_name: string;
  email: string;
  legal_subject: string;
  document_type: number;
  document_type_name: string;
  document_number: string;
  user_status: string;
  terms_accepted: boolean;
  terms_accepted_date: string;
  is_legal_representative: boolean;
  referral_code: string;
  tier_type?: string;
  earnings_per_kwh: number;
  laft_warning: string | null;
  company: UserCompanyResponse | null;
  attachments: UserAttachmentResponse[];
}
