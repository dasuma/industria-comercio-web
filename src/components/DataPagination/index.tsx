'use client';

import { Pagination } from '@dasuma/pradma-ui';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@dasuma/pradma-ui/icons';
import { interpolate } from '@/utils/format';

const ELLIPSIS = -1;

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  total: number;
  pageSize: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPage: (page: number) => void;
  /** Ej. "{from}–{to} de {total}" */
  rangeLabel: string;
  prevLabel: string;
  nextLabel: string;
}

// Pie de listado: rango visible ("1–10 de 42") + controles. Los controles
// solo aparecen cuando hay más de una página; el conteo siempre, porque
// responde "¿cuántos hay?" aunque quepan en una pantalla.
export const DataPagination = ({
  currentPage,
  totalPages,
  pageNumbers,
  total,
  pageSize,
  hasPrevPage,
  hasNextPage,
  onPrev,
  onNext,
  onPage,
  rangeLabel,
  prevLabel,
  nextLabel
}: DataPaginationProps) => {
  if (total === 0) return null;
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-paragraph-xs text-text-sub-600 tabular-nums">
        {interpolate(rangeLabel, { from, to, total })}
      </p>
      {totalPages > 1 ? (
        <Pagination.Root>
          <Pagination.NavButton disabled={!hasPrevPage} onClick={onPrev} aria-label={prevLabel}>
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>
          {pageNumbers.map((page, i) =>
            page === ELLIPSIS ? (
              <span key={`ellipsis-${i}`} className="text-text-soft-400 px-1.5 text-xs">
                &hellip;
              </span>
            ) : (
              <Pagination.Item
                key={page}
                current={page === currentPage}
                onClick={() => onPage(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Pagination.Item>
            )
          )}
          <Pagination.NavButton disabled={!hasNextPage} onClick={onNext} aria-label={nextLabel}>
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
        </Pagination.Root>
      ) : null}
    </div>
  );
};
