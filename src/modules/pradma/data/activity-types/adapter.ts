import type { ActivityType } from '../../models/activity-type.interface';
import type { ActivityTypeResponse } from '../../types/activity-type.responses';
import type { SearchResponse } from '../../types/search.types';

export const adaptActivityType = (raw: ActivityTypeResponse): ActivityType => ({
  id: raw.id,
  activityCode: raw.activity_code,
  activityName: raw.activity_name,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptActivityTypesResponse = (
  raw: SearchResponse<ActivityTypeResponse>
): SearchResponse<ActivityType> => ({
  data: raw.data.map(adaptActivityType),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});
