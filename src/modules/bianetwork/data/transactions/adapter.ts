import {
  BIA_NETWORK_PERSON_TYPE,
  BIA_NETWORK_STATUS,
  type BiaNetworkPersonType,
  type BiaNetworkStatus
} from '../../models/shared';
import type {
  BiaNetworkTransaction,
  BiaNetworkTransactionAttachment
} from '../../models/transaction';
import type { PaginatedResponse } from '../../types/pagination';
import type {
  TransactionAttachmentResponse,
  TransactionResponse
} from '../../types/transactionResponses';

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

const normalizeStatus = (status: string): BiaNetworkStatus => {
  if (status === 'PENDING_MANUAL_VALIDATION') return BIA_NETWORK_STATUS.PENDING;
  if (status === 'IN_TRANSIT') return BIA_NETWORK_STATUS.IN_TRANSIT;
  return status as BiaNetworkStatus;
};

const adaptAttachment = (raw: TransactionAttachmentResponse): BiaNetworkTransactionAttachment => ({
  id: raw.id,
  documentType: raw.document_type,
  link: raw.link,
  createdAt: raw.created_at
});

export const adaptTransaction = (raw: TransactionResponse): BiaNetworkTransaction => ({
  id: String(raw.id),
  date: raw.created_at,
  fullName: `${raw.name} ${raw.last_name}`.trim(),
  email: raw.email,
  phone: raw.phone_number,
  type: normalizePersonType(raw.legal_subject),
  status: normalizeStatus(raw.status),
  amount: raw.amount,
  referralCode: raw.referral_code,
  attachments: raw.attachments?.map(adaptAttachment) ?? []
});

export const adaptTransactionsResponse = (
  raw: PaginatedResponse<TransactionResponse>
): PaginatedResponse<BiaNetworkTransaction> => ({
  data: raw.data.map(adaptTransaction),
  total_rows: raw.total_rows,
  offset: raw.offset,
  limit: raw.limit
});
