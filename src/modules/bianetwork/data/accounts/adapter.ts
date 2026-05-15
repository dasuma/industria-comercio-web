import {
  BIA_NETWORK_PERSON_TYPE,
  BIA_NETWORK_STATUS,
  type BiaNetworkPersonType,
  type BiaNetworkStatus
} from '../../models/shared';
import type { BiaNetworkAccount, BiaNetworkAccountDetail } from '../../models/account';
import type { PaginatedResponse } from '../../types/pagination';
import type { AccountDetailResponse, AccountResponse } from '../../types/accountResponses';

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

const normalizeStatus = (status: string): BiaNetworkStatus =>
  status === 'PENDING_MANUAL_VALIDATION'
    ? BIA_NETWORK_STATUS.PENDING
    : (status as BiaNetworkStatus);

export const adaptAccount = (raw: AccountResponse): BiaNetworkAccount => ({
  id: String(raw.id),
  date: raw.created_at,
  fullName: `${raw.name} ${raw.last_name}`.trim(),
  email: raw.email,
  phone: raw.phone_number,
  type: normalizePersonType(raw.legal_subject),
  status: normalizeStatus(raw.user_status),
  referralCode: raw.referral_code
});

export const adaptAccountsResponse = (
  raw: PaginatedResponse<AccountResponse>
): PaginatedResponse<BiaNetworkAccount> => ({
  data: raw.data.map(adaptAccount),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});

export const adaptAccountDetail = (raw: AccountDetailResponse): BiaNetworkAccountDetail => ({
  ...adaptAccount(raw),
  documentType: raw.document_type_name,
  documentNumber: raw.document_number,
  bankName: raw.bank_name,
  bankAccountType: raw.bank_account_type,
  bankAccountNumber: raw.bank_account_number,
  city: raw.city,
  address: raw.address,
  laftWarning: raw.laft_warning,
  notes: raw.notes
});
