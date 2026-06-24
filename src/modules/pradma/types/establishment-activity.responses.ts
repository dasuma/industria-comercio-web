export interface EstablishmentActivityResponse {
  id: number;
  establishment_id: number;
  activity_code: string;
  activity_name: string;
  valor: number;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
