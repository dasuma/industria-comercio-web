'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { SearchRequest, SearchFilter } from '../types/search.types';

const DEFAULT_LIMIT = 10;
const MAX_VISIBLE_PAGES = 7;
const ELLIPSIS = -1;

interface UseSearchPaginationOptions {
  defaultSort?: string;
  defaultLimit?: number;
}

interface UseSearchPaginationReturn {
  searchParams: SearchRequest;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setTotal: (total: number) => void;
  setFilters: (filters: SearchFilter[]) => void;
  pageNumbers: number[];
}

function buildPageNumbers(current: number, total: number): number[] {
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: number[] = [1];

  if (current > 3) {
    pages.push(ELLIPSIS);
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push(ELLIPSIS);
  }

  pages.push(total);

  return pages;
}

export function useSearchPagination(
  options: UseSearchPaginationOptions = {}
): UseSearchPaginationReturn {
  const { defaultSort = 'id', defaultLimit = DEFAULT_LIMIT } = options;

  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [filters, setFiltersState] = useState<SearchFilter[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setOffset(0);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(total / defaultLimit));
  const currentPage = Math.floor(offset / defaultLimit) + 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const searchParams: SearchRequest = useMemo(
    () => ({
      filters,
      paginate: { offset, limit: defaultLimit, sort: defaultSort }
    }),
    [filters, offset, defaultLimit, defaultSort]
  );

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setOffset((clamped - 1) * defaultLimit);
    },
    [totalPages, defaultLimit]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) goToPage(currentPage + 1);
  }, [hasNextPage, currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) goToPage(currentPage - 1);
  }, [hasPrevPage, currentPage, goToPage]);

  const pageNumbers = useMemo(
    () => buildPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const setFilters = useCallback((newFilters: SearchFilter[]) => {
    setFiltersState(newFilters);
  }, []);

  return {
    searchParams,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    setTotal,
    setFilters,
    pageNumbers
  };
}
