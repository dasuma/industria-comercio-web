import { useMutation } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import { endpointsReportTito } from '../endpoints';
import type { ReportPayload, ReportResponse } from '../../models/report-tito.interface';

const getReport = (payload: ReportPayload) =>
  doFetch<ReportPayload, ReportResponse>({
    endpoint: endpointsReportTito.getReport,
    params: payload
  });

export const useGetReport = () => useMutation({ mutationFn: getReport });
