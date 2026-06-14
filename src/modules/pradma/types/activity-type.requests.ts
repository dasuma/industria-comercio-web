export interface CreateActivityTypeRequest {
  name: string;
  code: string;
  rate: number;
  activity_category_id: number;
}

export type UpdateActivityTypeRequest = CreateActivityTypeRequest;
