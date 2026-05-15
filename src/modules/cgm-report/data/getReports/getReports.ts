import { useQuery } from '@tanstack/react-query';
import { doFetch } from '@/http_client';
import QueryKeys from '@data/core/QueryKeys';
import { endpointsCgmReport } from '../endpoints';
import type {
  CgmReport,
  PaginatedResponse,
  ReportKind,
  ReportType
} from '../../models/cgm-report.interface';

export interface GetReportsParams {
  type?: ReportType;
  kind?: ReportKind;
  limit: number;
  offset: number;
}

const getReports = (params: GetReportsParams) => {
  const searchParams = new URLSearchParams();
  if (params.type) searchParams.set('type', params.type);
  if (params.kind) searchParams.set('kind', params.kind);
  searchParams.set('limit', String(params.limit));
  searchParams.set('offset', String(params.offset));

  return doFetch<void, PaginatedResponse<CgmReport>>({
    endpoint: endpointsCgmReport.list,
    value: `?${searchParams.toString()}`
  });
};

export const useGetReports = (params: GetReportsParams) =>
  useQuery({
    queryKey: [QueryKeys.CGM_REPORTS_LIST, params.type, params.kind, params.limit, params.offset],
    queryFn: () => getReports(params)
  });
