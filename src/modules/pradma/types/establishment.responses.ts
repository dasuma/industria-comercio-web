export interface EstablishmentResponse {
  id: number;
  registration_number: string;
  name: string;
  number_identification: string;
  document_type: string;
  client_id: number;
  address: string;
  phone: string;
  description: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
