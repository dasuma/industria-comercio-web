import type { DocumentType } from './shared';

export interface Client {
  id: number;
  name: string;
  documentType: DocumentType;
  address: string;
  phone: string;
  email: string;
  isCompany: boolean;
  createdAt: string;
  updatedAt: string;
}
