import type { BiaNetworkStatus } from './shared';

export interface BiaNetworkInvoice {
  id: string;
  leadId: string;
  userId: string;
  invoiceDocumentUrl: string;
  status: BiaNetworkStatus;
  amount: number;
  deniedReason: string | null;
  createdAt: string;
  companyName: string | null;
  nit: string | null;
  fullName: string;
  referralCode: string;
}
