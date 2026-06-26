import type { UserRole } from '../../models/shared';
import type { PradmaUser } from '../../models/user.interface';
import type { PradmaUserResponse } from '../../types/user.responses';
import type { SearchResponse, ApiSearchResponse } from '../../types/search.types';

export const adaptUser = (raw: PradmaUserResponse): PradmaUser => ({
  id: raw.id,
  email: raw.email,
  role: raw.role as UserRole,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptUsersResponse = (
  raw: ApiSearchResponse<PradmaUserResponse>
): SearchResponse<PradmaUser> => ({
  data: raw.data.map(adaptUser),
  total: raw.pagination.total,
  offset: raw.pagination.current_offset,
  limit: raw.pagination.current_limit
});
