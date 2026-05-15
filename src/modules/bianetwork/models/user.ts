import type { BiaNetworkPersonType, BiaNetworkStatus } from './shared';

export interface BiaNetworkAttachment {
  id: number;
  documentType: string;
  link: string;
  createdAt: string;
}

export interface BiaNetworkCompany {
  id: number;
  name: string;
  documentType: number;
  documentTypeName: string;
  documentNumber: string;
  legalRepresentativeName: string;
  legalRepresentativeLastName: string;
  codeCountry: string;
  phoneNumber: string | null;
  email: string | null;
  userId: string;
  legalRepresentativeDocumentType: number;
  legalRepresentativeDocumentTypeName: string;
  legalRepresentativeDocumentNumber: string;
  legalRepresentativePhoneNumber: string;
  legalRepresentativeLaftWarning: string;
  laftWarning: string;
  city: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface BiaNetworkUser {
  id: string;
  name: string;
  lastName: string;
  fullName: string;
  email: string;
  type: BiaNetworkPersonType;
  documentType: number;
  documentTypeName: string;
  documentNumber: string;
  status: BiaNetworkStatus;
  termsAccepted: boolean;
  termsAcceptedDate: string;
  isLegalRepresentative: boolean;
  referralCode: string;
  tierType?: string;
  earningsPerKwh: number;
  laftWarning: string | null;
  company: BiaNetworkCompany | null;
  attachments: BiaNetworkAttachment[];
}
