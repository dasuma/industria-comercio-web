import type { BiaNetworkPersonType, BiaNetworkStatus } from './shared';

export interface BiaNetworkAccount {
  id: string;
  date: string;
  fullName: string;
  email: string;
  phone: string | null;
  type: BiaNetworkPersonType;
  status: BiaNetworkStatus;
  referralCode: string;
}

export interface BiaNetworkAccountDetail extends BiaNetworkAccount {
  documentType: string;
  documentNumber: string;
  bankName: string | null;
  bankAccountType: string | null;
  bankAccountNumber: string | null;
  city: string | null;
  address: string | null;
  laftWarning: string | null;
  notes: string | null;
}
