import { BIA_NETWORK_STATUS, type BiaNetworkPersonType, type BiaNetworkStatus } from './shared';

// La API de transacciones expone valores propios para algunos statuses (ej.
// `PENDING_MANUAL_VALIDATION`). El adapter normaliza al enum común y los
// requests al backend usan estas constantes para mappear de vuelta.
export const TRANSACTION_API_STATUS = {
  PENDING_MANUAL_VALIDATION: 'PENDING_MANUAL_VALIDATION',
  IN_TRANSIT: 'IN_TRANSIT',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  ACTION_REQUIRED_USER: 'ACTION_REQUIRED_USER'
} as const;

export interface BiaNetworkTransactionAttachment {
  id: number;
  documentType: string;
  link: string;
  createdAt: string;
}

export interface BiaNetworkTransaction {
  id: string;
  date: string;
  fullName: string;
  email: string;
  phone: string | null;
  type: BiaNetworkPersonType;
  status: BiaNetworkStatus;
  amount: number;
  referralCode: string;
  attachments: BiaNetworkTransactionAttachment[];
}

// Mapping del valor mostrado en UI → status que la API espera al filtrar.
// PENDING en UI = PENDING_MANUAL_VALIDATION en backend.
export const TRANSACTION_STATUS_TO_API: Record<string, string> = {
  [BIA_NETWORK_STATUS.PENDING]: TRANSACTION_API_STATUS.PENDING_MANUAL_VALIDATION,
  [BIA_NETWORK_STATUS.APPROVED]: TRANSACTION_API_STATUS.IN_TRANSIT
};
