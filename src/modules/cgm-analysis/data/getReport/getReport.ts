import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsCgmAnalysis } from '../endpoints';
import type { ReportPayload, ReportResponse } from '../../models/cgm-analysis.interface';

const getReport = (payload: ReportPayload) =>
  doFetch<ReportPayload, ReportResponse>({
    endpoint: endpointsCgmAnalysis.getReport,
    params: payload
  });

export const useGetReport = () => useMutation({ mutationFn: getReport });
