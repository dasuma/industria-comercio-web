import type { UserRole } from '../../models/shared';
import type { PradmaUser } from '../../models/user.interface';
import type { PradmaUserResponse } from '../../types/user.responses';
import type { SearchResponse } from '../../types/search.types';

export const adaptUser = (raw: PradmaUserResponse): PradmaUser => ({
  id: raw.id,
  email: raw.email,
  role: raw.role as UserRole,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptUsersResponse = (
  raw: SearchResponse<PradmaUserResponse>
): SearchResponse<PradmaUser> => ({
  data: raw.data.map(adaptUser),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});
