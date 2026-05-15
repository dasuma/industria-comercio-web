'use client';

import type { Locale } from '@/i18n/config';
import { useReportsParams } from '../../hooks/useReportsParams';
import { ReportFilters } from '../ReportFilters';
import { ReportsTable } from '../ReportsTable';
import { CreateReportModal } from '../CreateReportModal';

interface CgmReportViewProps {
  locale: Locale;
}

export const CgmReportView = ({ locale }: CgmReportViewProps) => {
  const { page, params, handleTypeChange, handleKindChange, handlePageChange } = useReportsParams();

  return (
    <section className="space-y-6">
      {/* Lift al nivel del PageHeader del shell (título + descripción): el shell
          renderiza el title block en `pt-5.5 + h-14` (~78px) seguido de
          children con `pt-8`. Con `-mt-16` (-64px) y `justify-end`, el FancyButton
          aterriza dentro de la franja del título, alineado a la derecha. El resto
          del contenido fluye normal porque `space-y-6` solo afecta gaps entre
          siblings, no la posición del primero. */}
      <div className="-mt-16 flex justify-end">
        <CreateReportModal locale={locale} />
      </div>

      <ReportFilters
        locale={locale}
        type={params.type}
        kind={params.kind}
        onTypeChange={handleTypeChange}
        onKindChange={handleKindChange}
      />

      <ReportsTable locale={locale} page={page} params={params} onPageChange={handlePageChange} />
    </section>
  );
};
