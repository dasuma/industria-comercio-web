export interface ActivityCategoryResponse {
  id: number;
  activity_type_code: string;
  activity_type_name: string;
  year_initial: number;
  year_end: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
