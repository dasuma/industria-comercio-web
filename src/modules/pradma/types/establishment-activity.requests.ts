export interface CreateEstablishmentActivityRequest {
  establishment_id: number;
  activity_code: string;
  valor: number;
  start_date: string;
  end_date?: string | null;
}

export type UpdateEstablishmentActivityRequest = CreateEstablishmentActivityRequest;
