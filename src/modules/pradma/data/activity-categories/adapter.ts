import type { ActivityCategory } from '../../models/activity-category.interface';
import type { ActivityCategoryResponse } from '../../types/activity-category.responses';
import type { SearchResponse } from '../../types/search.types';

export const adaptActivityCategory = (raw: ActivityCategoryResponse): ActivityCategory => ({
  id: raw.id,
  name: raw.name,
  code: raw.code,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptActivityCategoriesResponse = (
  raw: SearchResponse<ActivityCategoryResponse>
): SearchResponse<ActivityCategory> => ({
  data: raw.data.map(adaptActivityCategory),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});
