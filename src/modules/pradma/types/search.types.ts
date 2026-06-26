export type FilterOperation =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'not_in'
  | 'like'
  | 'not_like'
  | 'ilike'
  | 'is_null'
  | 'is_not_null';

export type FilterOption = 'AND' | 'OR';

export interface SearchFilter {
  field: string;
  value: unknown;
  operation: FilterOperation;
  option: FilterOption;
}

export interface Paginate {
  offset: number;
  limit: number;
  sort: string;
}

export interface SearchRequest {
  filters: SearchFilter[];
  paginate: Paginate;
}

export interface SearchResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

export interface ApiPagination {
  total: number;
  previous: string | null;
  next: string | null;
  current_limit: number;
  current_offset: number;
  current_sort: string;
}

export interface ApiSearchResponse<T> {
  data: T[];
  pagination: ApiPagination;
}
