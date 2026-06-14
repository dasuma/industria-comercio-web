export interface CreateClientRequest {
  name: string;
  number_identification: string;
  document_type: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  is_company: boolean;
}

export type UpdateClientRequest = CreateClientRequest;
