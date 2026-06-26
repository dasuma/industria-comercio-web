export interface CreateClientRequest {
  id: number;
  name: string;
  document_type: string;
  address: string;
  phone: string;
  email: string;
  is_company: boolean;
}

export interface UpdateClientRequest {
  name: string;
  document_type: string;
  address: string;
  phone: string;
  email: string;
  is_company: boolean;
}
