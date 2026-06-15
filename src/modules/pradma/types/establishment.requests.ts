export interface CreateEstablishmentRequest {
  registration_number: string;
  name: string;
  number_identification: string;
  document_type: string;
  client_id: number;
  address: string;
  phone: string;
  description: string;
  start_date: string;
  end_date?: string | null;
}

export type UpdateEstablishmentRequest = CreateEstablishmentRequest;
