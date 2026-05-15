import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsCgmReport } from '../endpoints';
import type { CreateReportPayload, CreateReportResponse } from '../../models/cgm-report.interface';

const createReport = (payload: CreateReportPayload) =>
  doFetch<CreateReportPayload, CreateReportResponse>({
    endpoint: endpointsCgmReport.create,
    params: payload
  });

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKeys.CGM_REPORTS_LIST] })
  });
};
