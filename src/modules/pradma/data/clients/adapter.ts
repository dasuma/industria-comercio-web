import type { DocumentType } from '../../models/shared';
import type { Client } from '../../models/client.interface';
import type { ClientResponse } from '../../types/client.responses';
import type { SearchResponse, ApiSearchResponse } from '../../types/search.types';

export const adaptClient = (raw: ClientResponse): Client => ({
  id: raw.id,
  name: raw.name,
  documentType: raw.document_type as DocumentType,
  address: raw.address,
  phone: raw.phone,
  email: raw.email,
  isCompany: raw.is_company,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
});

export const adaptClientsResponse = (
  raw: ApiSearchResponse<ClientResponse>
): SearchResponse<Client> => ({
  data: raw.data.map(adaptClient),
  total: raw.pagination.total,
  offset: raw.pagination.current_offset,
  limit: raw.pagination.current_limit
});
