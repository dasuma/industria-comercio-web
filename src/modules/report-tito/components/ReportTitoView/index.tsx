'use client';

import { useState } from 'react';
import { toast } from '@biaenergy/ui';
import type { Locale } from '@/i18n/config';
import { ContractSearch, ContractInfo } from '@modules/cgm-refill';
import type { Contract } from '@modules/cgm-refill';
import { getReportTitoDict } from '../../dictionaries';
import { useGetReport } from '../../data';
import type { ReportPeriod } from '../../models/report-tito.interface';
import { AnalysisForm, toDateStr } from '../AnalysisForm';
import { PdfViewer } from '../PdfViewer';

interface ReportTitoViewProps {
  locale: Locale;
}

export const ReportTitoView = ({ locale }: ReportTitoViewProps) => {
  const dict = getReportTitoDict(locale);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { mutate, isPending } = useGetReport();

  const handleSubmit = (values: { startDate: Date; endDate: Date; period: ReportPeriod }) => {
    if (!selectedContract) return;
    setPdfUrl(null);
    mutate(
      {
        contract_id: selectedContract.id,
        start_date: toDateStr(values.startDate),
        end_date: toDateStr(values.endDate),
        period: values.period
      },
      {
        onSuccess: data => setPdfUrl(data.pdf_url),
        onError: () => toast.error(dict.form.error)
      }
    );
  };

  return (
    <section className="space-y-6">
      <h1 className="text-heading-h5 text-text-strong-950">{dict.title}</h1>

      <div>
        <p className="text-label-sm text-text-strong-950 mb-1.5">{dict.search.label}</p>
        <ContractSearch
          locale={locale}
          onSelect={contract => {
            setSelectedContract(contract);
            setPdfUrl(null);
          }}
        />
      </div>

      {selectedContract ? (
        <>
          <ContractInfo locale={locale} contract={selectedContract} />
          <AnalysisForm
            locale={locale}
            contract={selectedContract}
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </>
      ) : (
        <p className="text-paragraph-sm text-text-sub-600">{dict.form.selectContractFirst}</p>
      )}

      {pdfUrl && <PdfViewer pdfUrl={pdfUrl} dict={dict.pdf} />}
    </section>
  );
};
