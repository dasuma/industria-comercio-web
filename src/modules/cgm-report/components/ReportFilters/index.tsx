'use client';

import { SegmentedControl, Select } from '@biaenergy/ui';
import type { Locale } from '@/i18n/config';
import { getCgmReportDict } from '../../dictionaries';
import {
  REPORT_KINDS,
  REPORT_TYPES,
  type ReportKind,
  type ReportType
} from '../../models/cgm-report.interface';

const ALL_VALUE = 'all';

interface ReportFiltersProps {
  locale: Locale;
  type: ReportType | undefined;
  kind: ReportKind | undefined;
  onTypeChange: (value: ReportType | undefined) => void;
  onKindChange: (value: ReportKind | undefined) => void;
}

export const ReportFilters = ({
  locale,
  type,
  kind,
  onTypeChange,
  onKindChange
}: ReportFiltersProps) => {
  const dict = getCgmReportDict(locale);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SegmentedControl.Root
        value={type ?? ALL_VALUE}
        onValueChange={v => onTypeChange(v === ALL_VALUE ? undefined : (v as ReportType))}
        size="medium"
      >
        <SegmentedControl.List>
          <SegmentedControl.Trigger value={ALL_VALUE}>{dict.filterAll}</SegmentedControl.Trigger>
          {REPORT_TYPES.map(t => (
            <SegmentedControl.Trigger key={t} value={t}>
              {dict.reportTypes[t]}
            </SegmentedControl.Trigger>
          ))}
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <Select.Root
        size="small"
        value={kind ?? ALL_VALUE}
        onValueChange={v => onKindChange(v === ALL_VALUE ? undefined : (v as ReportKind))}
      >
        {/* `w-fit` deja que el trigger se ajuste al ancho del texto del valor
            seleccionado. Cuando está en "Todos" mide poco; al elegir
            "Comercialización Backup" se expande. El `Select.Value` interno usa
            el span del Radix, así que el reflow es automático. */}
        <Select.Trigger className="w-fit">
          <Select.Value placeholder={dict.filterKindPlaceholder} />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value={ALL_VALUE}>{dict.filterAll}</Select.Item>
          {REPORT_KINDS.map(k => (
            <Select.Item key={k} value={k}>
              {dict.reportKinds[k]}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};
