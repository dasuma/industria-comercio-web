'use client';

import { useState, useCallback } from 'react';
import type { ReportKind, ReportType } from '../models/cgm-report.interface';
import type { GetReportsParams } from '../data/getReports/getReports';

const DEFAULT_LIMIT = 10;

export const useReportsParams = () => {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<ReportType | undefined>(undefined);
  const [kind, setKind] = useState<ReportKind | undefined>(undefined);

  const handleTypeChange = useCallback((value: ReportType | undefined) => {
    setType(value);
    setPage(1);
  }, []);

  const handleKindChange = useCallback((value: ReportKind | undefined) => {
    setKind(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const params: GetReportsParams = {
    type,
    kind,
    limit: DEFAULT_LIMIT,
    offset: (page - 1) * DEFAULT_LIMIT
  };

  return {
    page,
    params,
    handleTypeChange,
    handleKindChange,
    handlePageChange
  };
};
