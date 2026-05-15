import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsBianetwork } from '../endpoints';
import type { BiaNetworkTransaction } from '../../models/transaction';
import type { TransactionResponse } from '../../types/transactionResponses';
import { adaptTransaction } from './adapter';

export const getTransactionDetail = async (id: string): Promise<BiaNetworkTransaction> => {
  const raw = await doFetch<void, TransactionResponse>({
    endpoint: endpointsBianetwork.getTransactionDetail,
    value: `/${id}`
  });
  return adaptTransaction(raw);
};

export const useGetTransactionDetail = (id: string | null) =>
  useQuery({
    queryKey: [QueryKeys.BIANETWORK_TRANSACTION_DETAIL, id],
    queryFn: () => getTransactionDetail(id as string),
    enabled: Boolean(id)
  });
