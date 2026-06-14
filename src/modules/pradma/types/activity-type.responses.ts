export interface ActivityTypeResponse {
  id: number;
  name: string;
  code: string;
  rate: number;
  activity_category_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
