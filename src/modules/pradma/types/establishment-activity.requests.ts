export interface CreateEstablishmentActivityRequest {
  establishment_id: number;
  activity_type_id: number;
  start_date: string;
  end_date?: string | null;
}

export type UpdateEstablishmentActivityRequest = CreateEstablishmentActivityRequest;
