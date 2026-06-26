import type { Sanction } from '../../models/sanction.interface';
import type { SanctionResponse } from '../../types/sanction.responses';
import type { SearchResponse, ApiSearchResponse } from '../../types/search.types';

export const adaptSanction = (raw: SanctionResponse): Sanction => ({
  id: raw.id,
  year: raw.year,
  percentage: raw.percentage,
  minSanction: raw.min_sanction,
  minSanctionAlt: raw.min_sanction_alt,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
});

export const adaptSanctionsResponse = (
  raw: ApiSearchResponse<SanctionResponse>
): SearchResponse<Sanction> => ({
  data: raw.data.map(adaptSanction),
  total: raw.pagination.total,
  offset: raw.pagination.current_offset,
  limit: raw.pagination.current_limit
});
