export interface CreateEstablishmentRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
  client_id: number;
}

export type UpdateEstablishmentRequest = CreateEstablishmentRequest;
