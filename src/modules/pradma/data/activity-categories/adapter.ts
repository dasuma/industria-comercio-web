import type { ActivityCategory } from '../../models/activity-category.interface';
import type { ActivityCategoryResponse } from '../../types/activity-category.responses';
import type { SearchResponse, ApiSearchResponse } from '../../types/search.types';

export const adaptActivityCategory = (raw: ActivityCategoryResponse): ActivityCategory => ({
  id: raw.id,
  activityTypeCode: raw.activity_type_code,
  activityTypeName: raw.activity_type_name,
  yearInitial: raw.year_initial,
  yearEnd: raw.year_end,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptActivityCategoriesResponse = (
  raw: ApiSearchResponse<ActivityCategoryResponse>
): SearchResponse<ActivityCategory> => ({
  data: raw.data.map(adaptActivityCategory),
  total: raw.pagination.total,
  offset: raw.pagination.current_offset,
  limit: raw.pagination.current_limit
});
