import type { Locale } from '@/i18n/config';
import { getCgmRefillDict } from '../../dictionaries';
import type { Contract } from '../../models/cgm-refill.interface';

interface ContractInfoProps {
  locale: Locale;
  contract: Contract;
}

export const ContractInfo = ({ locale, contract }: ContractInfoProps) => {
  const dict = getCgmRefillDict(locale);
  const d = dict.contractInfo;

  const dateOnly = (v: string) => v.slice(0, 10);

  const optional: { label: string; value: string | number | null | undefined }[] = [
    { label: d.sicAgpe, value: contract.sic_agpe },
    { label: d.startsAt, value: contract.starts_at ? dateOnly(contract.starts_at) : null },
    {
      label: d.billingEndsAt,
      value: contract.billing_ends_at ? dateOnly(contract.billing_ends_at) : null
    },
    { label: d.consumptionAverage, value: contract.consumption_average }
  ];

  const fields: { label: string; value: string | number }[] = [
    { label: d.id, value: contract.id },
    { label: d.name, value: contract.name },
    { label: d.sic, value: contract.sic },
    ...optional
      .filter(({ value }) => value !== null && value !== undefined && value !== 0 && value !== '')
      .map(({ label, value }) => ({ label, value: value as string | number }))
  ];

  return (
    <div className="bg-bg-weak-50 border-stroke-soft-200 rounded-xl border p-4">
      <h2 className="text-label-sm text-text-strong-950 mb-3">{d.title}</h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-paragraph-xs text-text-sub-600">{label}</dt>
            <dd className="text-paragraph-sm text-text-strong-950 mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
