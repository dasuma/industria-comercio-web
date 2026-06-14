import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { EstablishmentActivityResponse } from '../../types/establishment-activity.responses';
import type { SearchResponse } from '../../types/search.types';

export const adaptEstablishmentActivity = (raw: EstablishmentActivityResponse): EstablishmentActivity => ({
  id: raw.id,
  establishmentId: raw.establishment_id,
  activityTypeId: raw.activity_type_id,
  startDate: raw.start_date,
  endDate: raw.end_date,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptEstablishmentActivitiesResponse = (
  raw: SearchResponse<EstablishmentActivityResponse>
): SearchResponse<EstablishmentActivity> => ({
  data: raw.data.map(adaptEstablishmentActivity),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});
