import {
  BIA_NETWORK_PERSON_TYPE,
  BIA_NETWORK_STATUS,
  type BiaNetworkPersonType,
  type BiaNetworkStatus
} from '../../models/shared';
import type { BiaNetworkAttachment, BiaNetworkCompany, BiaNetworkUser } from '../../models/user';
import type { PaginatedResponse } from '../../types/pagination';
import type {
  UserAttachmentResponse,
  UserCompanyResponse,
  UserResponse
} from '../../types/userResponses';

const normalizeStatus = (status: string): BiaNetworkStatus =>
  status === 'PENDING_MANUAL_VALIDATION'
    ? BIA_NETWORK_STATUS.PENDING
    : (status as BiaNetworkStatus);

const LEGAL_PERSON_TOKENS = [
  'jurídica',
  'juridica',
  'persona_juridica',
  'legal_person',
  'legal',
  'juridic'
];

const normalizePersonType = (legalSubject: string): BiaNetworkPersonType => {
  const value = (legalSubject || '').toLowerCase().trim();
  if (LEGAL_PERSON_TOKENS.some(token => value.includes(token))) {
    return BIA_NETWORK_PERSON_TYPE.LEGAL;
  }
  return BIA_NETWORK_PERSON_TYPE.NATURAL;
};

const adaptCompany = (raw: UserCompanyResponse): BiaNetworkCompany => ({
  id: raw.id,
  name: raw.name,
  documentType: raw.document_type,
  documentTypeName: raw.document_type_name,
  documentNumber: raw.document_number,
  legalRepresentativeName: raw.legal_representative_name,
  legalRepresentativeLastName: raw.legal_representative_last_name,
  codeCountry: raw.code_country,
  phoneNumber: raw.phone_number,
  email: raw.email,
  userId: raw.user_id,
  legalRepresentativeDocumentType: raw.legal_representative_document_type,
  legalRepresentativeDocumentTypeName: raw.legal_representative_document_type_name,
  legalRepresentativeDocumentNumber: raw.legal_representative_document_number,
  legalRepresentativePhoneNumber: raw.legal_representative_phone_number,
  legalRepresentativeLaftWarning: raw.legal_representative_laft_warning,
  laftWarning: raw.laft_warning,
  city: raw.city,
  address: raw.address,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at
});

const adaptAttachment = (raw: UserAttachmentResponse): BiaNetworkAttachment => ({
  id: raw.id,
  documentType: raw.document_type,
  link: raw.link,
  createdAt: raw.created_at
});

export const adaptUser = (raw: UserResponse): BiaNetworkUser => ({
  id: raw.id,
  name: raw.name,
  lastName: raw.last_name,
  fullName: `${raw.name} ${raw.last_name}`.trim(),
  email: raw.email,
  type: normalizePersonType(raw.legal_subject),
  documentType: raw.document_type,
  documentTypeName: raw.document_type_name,
  documentNumber: raw.document_number,
  status: normalizeStatus(raw.user_status),
  termsAccepted: raw.terms_accepted,
  termsAcceptedDate: raw.terms_accepted_date,
  isLegalRepresentative: raw.is_legal_representative,
  referralCode: raw.referral_code,
  tierType: raw.tier_type,
  earningsPerKwh: raw.earnings_per_kwh,
  laftWarning: raw.laft_warning ?? null,
  company: raw.company ? adaptCompany(raw.company) : null,
  attachments: raw.attachments?.map(adaptAttachment) ?? []
});

export const adaptUsersResponse = (
  raw: PaginatedResponse<UserResponse>
): PaginatedResponse<BiaNetworkUser> => ({
  data: raw.data.map(adaptUser),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});
