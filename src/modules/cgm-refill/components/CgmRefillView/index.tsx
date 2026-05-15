'use client';

import { useState, useEffect, useRef } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine, RiRefreshLine } from '@biaenergy/ui/icons';
import { Button, toast } from '@biaenergy/ui';
import type { Locale } from '@/i18n/config';
import { getCgmRefillDict } from '../../dictionaries';
import type { Contract } from '../../models/cgm-refill.interface';
import { useClearWidgetsCache } from '../../data';
import { ContractSearch } from '../ContractSearch';
import { ContractInfo } from '../ContractInfo';
import { WidgetsGrid } from '../WidgetsGrid';
import { RefillModal } from '../RefillModal';

interface CgmRefillViewProps {
  locale: Locale;
}

const today = new Date();
const CURRENT_YEAR = today.getFullYear();
const CURRENT_MONTH = today.getMonth() + 1;

const toDateStr = (year: number, month: number): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${year}-${pad(month)}-01`;
};

const REFILL_DELAY_MS = 5_000;

export const CgmRefillView = ({ locale }: CgmRefillViewProps) => {
  const dict = getCgmRefillDict(locale);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { mutate: clearCache, isPending: isClearing } = useClearWidgetsCache();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const isCurrentMonth = year === CURRENT_YEAR && month === CURRENT_MONTH;
  const date = toDateStr(year, month);

  const prevMonth = () => {
    if (month === 1) {
      setYear(y => y - 1);
      setMonth(12);
    } else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 12) {
      setYear(y => y + 1);
      setMonth(1);
    } else setMonth(m => m + 1);
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleString(locale, {
    month: 'long',
    year: 'numeric'
  });

  const handleClearCache = (contractId: number) => {
    clearCache(
      { contractId, date },
      {
        onSuccess: () => toast.success(dict.refreshCache),
        onError: () => toast.error(dict.form.error)
      }
    );
  };

  const handleAfterRefill = () => {
    if (!selectedContract) return;
    setIsRefreshing(true);
    const contractId = selectedContract.id;
    timerRef.current = setTimeout(() => {
      setIsRefreshing(false);
      clearCache({ contractId, date }, { onError: () => toast.error(dict.form.error) });
    }, REFILL_DELAY_MS);
  };

  const forceLoading = isClearing || isRefreshing;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading-h5 text-text-strong-950">{dict.title}</h1>
        {selectedContract && (
          <div className="flex items-center gap-2">
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="medium"
              disabled={forceLoading}
              onClick={() => handleClearCache(selectedContract.id)}
            >
              <Button.Icon as={RiRefreshLine} />
              {dict.refreshCache}
            </Button.Root>
            <RefillModal
              locale={locale}
              contract={selectedContract}
              onAfterRefill={handleAfterRefill}
            />
          </div>
        )}
      </div>

      <div>
        <p className="text-label-sm text-text-strong-950 mb-1.5">{dict.search.label}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ContractSearch locale={locale} onSelect={setSelectedContract} />
          </div>

          <div className="border-stroke-soft-200 flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1.5">
            <button
              type="button"
              onClick={prevMonth}
              className="text-text-sub-600 hover:text-text-strong-950 transition-colors"
            >
              <RiArrowLeftSLine className="h-4 w-4" />
            </button>
            <span className="text-paragraph-sm text-text-strong-950 min-w-[130px] text-center capitalize">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="text-text-sub-600 hover:text-text-strong-950 disabled:text-text-disabled-300 transition-colors"
            >
              <RiArrowRightSLine className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedContract ? (
        <div className="space-y-4">
          <ContractInfo locale={locale} contract={selectedContract} />
          <WidgetsGrid contractId={selectedContract.id} date={date} forceLoading={forceLoading} />
        </div>
      ) : (
        <p className="text-paragraph-sm text-text-sub-600">{dict.form.selectContractFirst}</p>
      )}
    </section>
  );
};
