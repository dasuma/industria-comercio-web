import type { DocumentType } from '../../models/shared';
import type { Client } from '../../models/client.interface';
import type { ClientResponse } from '../../types/client.responses';
import type { SearchResponse } from '../../types/search.types';

export const adaptClient = (raw: ClientResponse): Client => ({
  id: raw.id,
  name: raw.name,
  numberIdentification: raw.number_identification,
  documentType: raw.document_type as DocumentType,
  nit: raw.nit,
  address: raw.address,
  phone: raw.phone,
  email: raw.email,
  isCompany: raw.is_company,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  deletedAt: raw.deleted_at
});

export const adaptClientsResponse = (
  raw: SearchResponse<ClientResponse>
): SearchResponse<Client> => ({
  data: raw.data.map(adaptClient),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});
