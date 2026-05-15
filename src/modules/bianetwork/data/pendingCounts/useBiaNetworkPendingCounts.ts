import { useQueries } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import { BIA_NETWORK_STATUS } from '../../models/shared';
import { TRANSACTION_API_STATUS } from '../../models/transaction';
import type { PaginatedResponse } from '../../types/pagination';
import type { InvoicesPagedResponse } from '../../types/invoiceResponses';

const STALE_TIME = 30_000;

interface CountResponse {
  total_rows: number;
}

const fetchCount = async (url: string): Promise<number> => {
  const raw = await doFetch<void, CountResponse>({
    endpoint: { ...endpointsBianetwork.getUsers, url }
  });
  return raw.total_rows ?? 0;
};

const fetchUsersPendingCount = async (extra: Record<string, string>): Promise<number> => {
  const usp = new URLSearchParams({ status: BIA_NETWORK_STATUS.PENDING, limit: '1', offset: '0' });
  Object.entries(extra).forEach(([k, v]) => usp.set(k, v));
  const url = `${endpointsBianetwork.getUsers.url}?${usp.toString()}`;
  return fetchCount(url);
};

const fetchUsersProPendingCount = async (): Promise<number> => {
  const [a, b] = await Promise.all([
    fetchUsersPendingCount({ utm_term: 'pro' }),
    fetchUsersPendingCount({ tier_type: 'pro' })
  ]);
  return a + b;
};

const fetchAccountsPendingCount = async (): Promise<number> => {
  const usp = new URLSearchParams({ status: BIA_NETWORK_STATUS.PENDING, limit: '1', offset: '0' });
  const url = `${endpointsBianetwork.getAccounts.url}?${usp.toString()}`;
  const raw = await doFetch<void, PaginatedResponse<unknown>>({
    endpoint: { ...endpointsBianetwork.getAccounts, url }
  });
  return raw.total_rows ?? 0;
};

const fetchTransactionsPendingCount = async (): Promise<number> => {
  const usp = new URLSearchParams({
    status: TRANSACTION_API_STATUS.PENDING_MANUAL_VALIDATION,
    limit: '1',
    offset: '0'
  });
  const url = `${endpointsBianetwork.getTransactions.url}?${usp.toString()}`;
  const raw = await doFetch<void, PaginatedResponse<unknown>>({
    endpoint: { ...endpointsBianetwork.getTransactions, url }
  });
  return raw.total_rows ?? 0;
};

const fetchInvoicesPendingCount = async (): Promise<number> => {
  const usp = new URLSearchParams({
    status: BIA_NETWORK_STATUS.PENDING,
    page: '1',
    page_size: '1'
  });
  const url = `${endpointsBianetwork.getInvoices.url}?${usp.toString()}`;
  const raw = await doFetch<void, InvoicesPagedResponse>({
    endpoint: { ...endpointsBianetwork.getInvoices, url }
  });
  return raw.total_rows ?? 0;
};

export interface BiaNetworkPendingCounts {
  users: number;
  usersPro: number;
  accounts: number;
  transactions: number;
  invoices: number;
}

// Fires 5 small `?status=PENDING&limit=1` requests in parallel and reads
// `total_rows` from each. Cached por 30s para no spamear el backend al
// navegar entre tabs. Las mutations de cada tab invalidan
// `BIANETWORK_PENDING_COUNTS` para mantener el badge fresco.
export const useBiaNetworkPendingCounts = (): BiaNetworkPendingCounts => {
  const results = useQueries({
    queries: [
      {
        queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS, 'users'],
        queryFn: () => fetchUsersPendingCount({ tier_type: 'normal' }),
        staleTime: STALE_TIME
      },
      {
        queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS, 'usersPro'],
        queryFn: fetchUsersProPendingCount,
        staleTime: STALE_TIME
      },
      {
        queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS, 'accounts'],
        queryFn: fetchAccountsPendingCount,
        staleTime: STALE_TIME
      },
      {
        queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS, 'transactions'],
        queryFn: fetchTransactionsPendingCount,
        staleTime: STALE_TIME
      },
      {
        queryKey: [QueryKeys.BIANETWORK_PENDING_COUNTS, 'invoices'],
        queryFn: fetchInvoicesPendingCount,
        staleTime: STALE_TIME
      }
    ]
  });

  return {
    users: results[0]?.data ?? 0,
    usersPro: results[1]?.data ?? 0,
    accounts: results[2]?.data ?? 0,
    transactions: results[3]?.data ?? 0,
    invoices: results[4]?.data ?? 0
  };
};
