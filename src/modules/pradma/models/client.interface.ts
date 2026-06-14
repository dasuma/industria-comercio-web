import type { DocumentType } from './shared';

export interface Client {
  id: number;
  name: string;
  numberIdentification: string;
  documentType: DocumentType;
  nit: string;
  address: string;
  phone: string;
  email: string;
  isCompany: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
