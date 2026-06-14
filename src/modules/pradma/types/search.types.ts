export interface SearchRequest {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface SearchResponse<T> {
  data: T[];
  total_rows: number;
  offset: number;
  limit: number;
}
