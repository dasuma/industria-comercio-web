import type { Locale } from '@/i18n/config';
import { getCgmAnalysisDict } from '../../dictionaries';
import type { Contract } from '../../models/cgm-analysis.interface';

interface ContractInfoProps {
  locale: Locale;
  contract: Contract;
}

export const ContractInfo = ({ locale, contract }: ContractInfoProps) => {
  const dict = getCgmAnalysisDict(locale);
  const d = dict.contractInfo;

  const dateOnly = (v: string) => v.slice(0, 10);

  const entries: { label: string; value: string | number | null | undefined }[] = [
    { label: d.startsAt, value: contract.starts_at ? dateOnly(contract.starts_at) : null },
    { label: d.sic, value: contract.sic },
    { label: d.consumptionAverage, value: contract.consumption_average },
    { label: d.sicAgpe, value: contract.sic_agpe },
    {
      label: d.billingEndsAt,
      value: contract.billing_ends_at ? dateOnly(contract.billing_ends_at) : null
    }
  ];

  const items = entries
    .filter(({ value }) => value !== null && value !== undefined && value !== 0 && value !== '')
    .map(({ label, value }) => `${label}: ${value}`);

  if (items.length === 0) return null;

  return <p className="text-paragraph-sm text-text-sub-600">{items.join(' · ')}</p>;
};
