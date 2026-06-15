export interface CreateActivityCategoryRequest {
  activity_type_code: string;
  activity_type_name: string;
  year_initial: number;
  year_end: number;
}

export type UpdateActivityCategoryRequest = CreateActivityCategoryRequest;
