import type { Establishment } from '../../models/establishment.interface';
import type { EstablishmentResponse } from '../../types/establishment.responses';
import type { SearchResponse, ApiSearchResponse } from '../../types/search.types';

export const adaptEstablishment = (raw: EstablishmentResponse): Establishment => ({
  id: raw.id,
  registrationNumber: raw.registration_number,
  name: raw.name,
  numberIdentification: raw.number_identification,
  documentType: raw.document_type,
  clientId: raw.client_id,
  address: raw.address,
  phone: raw.phone,
  description: raw.description,
  startDate: raw.start_date,
  endDate: raw.end_date,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptEstablishmentsResponse = (
  raw: ApiSearchResponse<EstablishmentResponse>
): SearchResponse<Establishment> => ({
  data: raw.data.map(adaptEstablishment),
  total: raw.pagination.total,
  offset: raw.pagination.current_offset,
  limit: raw.pagination.current_limit
});
