export interface ClientResponse {
  id: number;
  name: string;
  number_identification: string;
  document_type: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
  is_company: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
