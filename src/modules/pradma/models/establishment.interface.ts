export interface Establishment {
  id: number;
  registrationNumber: string;
  name: string;
  numberIdentification: string;
  documentType: string;
  clientId: number;
  address: string;
  phone: string;
  description: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
