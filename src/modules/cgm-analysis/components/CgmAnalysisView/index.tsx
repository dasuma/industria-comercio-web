'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { RiRestartLine, RiBarChartLine } from '@biaenergy/ui/icons';
import { Badge, Divider, FancyButton, Select, Tooltip, toast } from '@biaenergy/ui';
import type { Locale } from '@/i18n/config';
import { getCgmAnalysisDict } from '../../dictionaries';
import type { Contract, ReportPeriod } from '../../models/cgm-analysis.interface';
import { useClearWidgetsCache, useGetReport } from '../../data';
import { ContractSearch } from '../ContractSearch';
import { ContractInfo } from '../ContractInfo';
import { WidgetsGrid } from '../WidgetsGrid';
import { RefillModal } from '../RefillModal';
import { AnalysisModal } from '../AnalysisModal';
import { PdfModal } from '../PdfModal';

interface CgmAnalysisViewProps {
  locale: Locale;
}

const pad = (n: number) => String(n).padStart(2, '0');
const monthKeyOf = (year: number, month: number) => `${year}-${pad(month)}`;
const apiDateOf = (year: number, month: number) => `${monthKeyOf(year, month)}-01`;
const apiDateFromDate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const MONTH_OPTIONS_BACK = 24;

const today = new Date();
const CURRENT_YEAR = today.getFullYear();
const CURRENT_MONTH = today.getMonth() + 1;
const CURRENT_KEY = monthKeyOf(CURRENT_YEAR, CURRENT_MONTH);

// El backend de refill confirma con un 200 antes de procesar; damos ese delay
// para que los widgets reflejen el cambio antes de invalidar el cache.
const REFILL_DELAY_MS = 5_000;

export const CgmAnalysisView = ({ locale }: CgmAnalysisViewProps) => {
  const dict = getCgmAnalysisDict(locale);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [monthKey, setMonthKey] = useState(CURRENT_KEY);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isPdfOpen, setPdfOpen] = useState(false);

  const { mutate: clearCache, isPending: isClearing } = useClearWidgetsCache();
  const { mutate: getReport, isPending: isGenerating } = useGetReport();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const monthOptions = useMemo(() => {
    const items: { value: string; label: string }[] = [];
    for (let i = 0; i < MONTH_OPTIONS_BACK; i++) {
      const d = new Date(CURRENT_YEAR, CURRENT_MONTH - 1 - i, 1);
      const value = monthKeyOf(d.getFullYear(), d.getMonth() + 1);
      const label = d.toLocaleString(locale, { month: 'long', year: 'numeric' });
      items.push({ value, label });
    }
    return items;
  }, [locale]);

  const [year, month] = monthKey.split('-').map(Number) as [number, number];
  const date = apiDateOf(year, month);

  const handleSelectContract = (contract: Contract) => {
    setSelectedContract(contract);
    setPdfUrl(null);
  };

  const handleClearCache = (contractId: number) => {
    clearCache(
      { contractId, date },
      {
        onSuccess: () => toast.success(dict.refreshSuccess),
        onError: () => toast.error(dict.cacheError)
      }
    );
  };

  const handleAfterRefill = () => {
    if (!selectedContract) return;
    setIsRefreshing(true);
    const contractId = selectedContract.id;
    timerRef.current = setTimeout(() => {
      setIsRefreshing(false);
      clearCache({ contractId, date }, { onError: () => toast.error(dict.cacheError) });
    }, REFILL_DELAY_MS);
  };

  const handleAnalysisSubmit = (values: {
    startDate: Date;
    endDate: Date;
    period: ReportPeriod;
  }) => {
    if (!selectedContract) return;
    setFormOpen(false);
    setPdfUrl(null);
    getReport(
      {
        contract_id: selectedContract.id,
        start_date: apiDateFromDate(values.startDate),
        end_date: apiDateFromDate(values.endDate),
        period: values.period
      },
      {
        onSuccess: data => setPdfUrl(data.pdf_url),
        onError: () => toast.error(dict.analysis.error)
      }
    );
  };

  const handleRegenerate = () => {
    setPdfOpen(false);
    setPdfUrl(null);
    setFormOpen(true);
  };

  const forceLoading = isClearing || isRefreshing;

  const informeLabel = isGenerating
    ? dict.analysis.buttonLoading
    : pdfUrl
      ? dict.analysis.buttonReady
      : dict.analysis.button;

  const onInformeClick = () => {
    if (isGenerating) return;
    if (pdfUrl) setPdfOpen(true);
    else setFormOpen(true);
  };

  return (
    <section className="space-y-6">
      <div className="relative z-20">
        <p className="text-label-sm text-text-strong-950 mb-1.5">{dict.search.label}</p>
        <ContractSearch locale={locale} onSelect={handleSelectContract} />
        {selectedContract && (
          <>
            <div className="mt-8 flex items-center gap-3">
              <p className="text-label-xl text-text-strong-950">{selectedContract.name}</p>
              <Badge.Root variant="lighter" color="blue" size="small">
                ID: {selectedContract.id}
              </Badge.Root>
            </div>
            <div className="mt-1.5">
              <ContractInfo locale={locale} contract={selectedContract} />
            </div>
            <Divider.Root className="mt-3" />
          </>
        )}
      </div>

      {selectedContract ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Select.Root value={monthKey} onValueChange={setMonthKey}>
              <Select.Trigger className="w-[200px] capitalize">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {monthOptions.map(o => (
                  <Select.Item key={o.value} value={o.value} className="capitalize">
                    {o.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <div className="flex items-center gap-2">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <FancyButton.Root
                    type="button"
                    variant="basic"
                    size="xsmall"
                    disabled={forceLoading}
                    aria-label={dict.refreshTooltip}
                    onClick={() => handleClearCache(selectedContract.id)}
                  >
                    <FancyButton.Icon as={RiRestartLine} />
                  </FancyButton.Root>
                </Tooltip.Trigger>
                <Tooltip.Content>{dict.refreshTooltip}</Tooltip.Content>
              </Tooltip.Root>

              <RefillModal
                locale={locale}
                contract={selectedContract}
                onAfterRefill={handleAfterRefill}
              />

              <FancyButton.Root
                type="button"
                variant="primary"
                size="xsmall"
                disabled={isGenerating}
                onClick={onInformeClick}
              >
                <FancyButton.Icon as={RiBarChartLine} />
                {informeLabel}
              </FancyButton.Root>
            </div>
          </div>

          <WidgetsGrid contractId={selectedContract.id} date={date} forceLoading={forceLoading} />

          <AnalysisModal
            locale={locale}
            contract={selectedContract}
            open={isFormOpen}
            onOpenChange={setFormOpen}
            onSubmit={handleAnalysisSubmit}
            isPending={isGenerating}
          />
          {pdfUrl && (
            <PdfModal
              locale={locale}
              pdfUrl={pdfUrl}
              open={isPdfOpen}
              onOpenChange={setPdfOpen}
              onRegenerate={handleRegenerate}
            />
          )}
        </div>
      ) : (
        <p className="text-paragraph-sm text-text-sub-600">{dict.selectContractFirst}</p>
      )}
    </section>
  );
};
