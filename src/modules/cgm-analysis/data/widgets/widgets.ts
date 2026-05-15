import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsCgmAnalysis } from '../endpoints';
import type { WidgetsPayload, WidgetsResponse } from '../../models/cgm-analysis.interface';

const EMPTY_RESPONSE = 'widgets:empty';

const getWidgets = async (contractId: number, date: string): Promise<WidgetsResponse> => {
  const data = await doFetch<WidgetsPayload, WidgetsResponse>({
    endpoint: endpointsCgmAnalysis.widgets,
    params: { period: 'monthly', date, contract_ids: [contractId] }
  });
  if (!data?.length) throw new Error(EMPTY_RESPONSE);
  return data;
};

export const useGetWidgets = (contractId: number | null, date: string) =>
  useQuery({
    queryKey: [QueryKeys.CGM_ANALYSIS_WIDGETS, contractId, date],
    queryFn: () => getWidgets(contractId!, date),
    enabled: contractId !== null,
    retry: (failureCount, error) =>
      error instanceof Error && error.message === EMPTY_RESPONSE && failureCount < 2,
    retryDelay: 2_000
  });
