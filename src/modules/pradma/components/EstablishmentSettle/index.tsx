'use client';

import { Fragment, useEffect, useState } from 'react';
import { useForm, useWatch, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { Button, CompactButton, FancyButton, Input, Label, Select, Switch } from '@biaenergy/ui';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine
} from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import { FormField } from '@/components/FormField';
import { useGetEstablishmentActivitiesByYear, useGetActivitiesByYear } from '../../data';
import type { Establishment } from '../../models/establishment.interface';
import type { PradmaDictionary } from '../../dictionaries';

interface EstablishmentSettleProps {
  establishment: Establishment;
  dict: PradmaDictionary;
}

/* ─── Constants & helpers ─── */

const TODAY = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = new Date().getFullYear();

const resolveStartDate = (e: Establishment): string =>
  new Date(e.startDate).getFullYear() === CURRENT_YEAR
    ? e.startDate.slice(0, 10)
    : `${CURRENT_YEAR}-01-01`;

const resolveEndDate = (e: Establishment): string => {
  if (!e.endDate) return `${CURRENT_YEAR}-12-31`;
  return new Date(e.endDate).getFullYear() === CURRENT_YEAR
    ? e.endDate.slice(0, 10)
    : `${CURRENT_YEAR}-12-31`;
};

const diffMonths = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return Math.min(
    12,
    Math.max(0, (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1)
  );
};

const formatCop = (value: number): string =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);

const formatDate = (iso: string): string => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(iso + 'T12:00:00'));
};

const toInt = (v: string): number => {
  const n = parseInt(v.replace(/\D/g, '') || '0', 10);
  return isNaN(n) ? 0 : n;
};

const truncate = (str: string, max = 32): string =>
  str.length > max ? `${str.slice(0, max)}…` : str;

const stripRowNum = (s: string) => s.replace(/^\d+ - /, '');

/* ─── Schema ─── */

const rowSchema = z.string().regex(/^\d*$/).default('0');

const activitySchema = z.object({
  activityCode: z.string(),
  activityName: z.string(),
  isDefault: z.boolean(),
  annualSales: rowSchema,
  gamesTax: rowSchema,
  lessCreditBalance: rowSchema,
  lessAdvancePayment: rowSchema,
  lessWithholdings: rowSchema,
  signsBillboardsTax: z.boolean(),
  fireBrigadeSurcharge: z.boolean(),
  cmgrdStamp: z.boolean(),
  noveltyValue: rowSchema
});

const schema = z.object({
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  presentationDate: z
    .string()
    .min(1)
    .refine(v => v >= TODAY),
  settlementDate: z
    .string()
    .min(1)
    .refine(v => v >= TODAY),
  totalNationwideIncome: rowSchema,
  lessIncomeOutsideMunicipality: rowSchema,
  lessReturnsRebatesDiscounts: rowSchema,
  lessExportIncome: rowSchema,
  lessFixedAssetsIncome: rowSchema,
  lessExcludedNonTaxableIncome: rowSchema,
  lessExemptActivities: rowSchema,
  activities: z.array(activitySchema)
});

type FormValues = z.infer<typeof schema>;
type SetValueFn = ReturnType<typeof useForm<FormValues>>['setValue'];

interface GravableRowDef {
  id: string;
  num: number;
  label: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  isCalc?: boolean;
  isTotal?: boolean;
  op: '+' | '−' | '=';
}

/* ─── EstablishmentSettle ─── */

export const EstablishmentSettle = ({ establishment, dict }: EstablishmentSettleProps) => {
  const [step, setStep] = useState(0);
  const d = dict.settle;

  const { data: activitiesData } = useGetEstablishmentActivitiesByYear(
    establishment.id,
    CURRENT_YEAR
  );
  const { data: allActivities = [] } = useGetActivitiesByYear(CURRENT_YEAR);

  const { register, handleSubmit, control, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      startDate: resolveStartDate(establishment),
      endDate: resolveEndDate(establishment),
      presentationDate: TODAY,
      settlementDate: TODAY,
      totalNationwideIncome: '0',
      lessIncomeOutsideMunicipality: '0',
      lessReturnsRebatesDiscounts: '0',
      lessExportIncome: '0',
      lessFixedAssetsIncome: '0',
      lessExcludedNonTaxableIncome: '0',
      lessExemptActivities: '0',
      activities: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: 'activities' });

  useEffect(() => {
    if (activitiesData && fields.length === 0) {
      replace(
        activitiesData.map(a => ({
          activityCode: a.activityCode,
          activityName: a.activityName,
          isDefault: true,
          annualSales: '0',
          gamesTax: '0',
          lessCreditBalance: '0',
          lessAdvancePayment: '0',
          lessWithholdings: '0',
          signsBillboardsTax: true,
          fireBrigadeSurcharge: true,
          cmgrdStamp: false,
          noveltyValue: '0'
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitiesData]);

  /* Derived values (row numbers per official tax form) */
  const watchStart = useWatch({ control, name: 'startDate' });
  const watchEnd = useWatch({ control, name: 'endDate' });
  const months = diffMonths(watchStart, watchEnd);

  const r8 = toInt(useWatch({ control, name: 'totalNationwideIncome' }));
  const r9 = toInt(useWatch({ control, name: 'lessIncomeOutsideMunicipality' }));
  const r11 = toInt(useWatch({ control, name: 'lessReturnsRebatesDiscounts' }));
  const r12 = toInt(useWatch({ control, name: 'lessExportIncome' }));
  const r13 = toInt(useWatch({ control, name: 'lessFixedAssetsIncome' }));
  const r14 = toInt(useWatch({ control, name: 'lessExcludedNonTaxableIncome' }));
  const r15 = toInt(useWatch({ control, name: 'lessExemptActivities' }));
  const r10 = Math.max(0, r8 - r9);
  const r16 = Math.max(0, r10 - r11 - r12 - r13 - r14 - r15);

  const copChange =
    (name: Parameters<typeof setValue>[0]) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(name, e.target.value.replace(/\D/g, '') || '0', { shouldValidate: true });

  const copChangeActivity =
    (index: number, field: keyof FormValues['activities'][0]) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(
        `activities.${index}.${field}` as Parameters<typeof setValue>[0],
        e.target.value.replace(/\D/g, '') || '0'
      );

  const addActivity = () =>
    append({
      activityCode: '',
      activityName: '',
      isDefault: false,
      annualSales: '0',
      gamesTax: '0',
      lessCreditBalance: '0',
      lessAdvancePayment: '0',
      lessWithholdings: '0',
      signsBillboardsTax: true,
      fireBrigadeSurcharge: true,
      cmgrdStamp: false,
      noveltyValue: '0'
    });

  const onSubmit = handleSubmit(_values => {
    // TODO: llamar al endpoint de liquidación cuando esté disponible
    // Payload shape (see buildPayload helper below for reference)
  });

  const STEPS = [d.steps.period, d.baseGravable.title, d.steps.activities];

  const gravableRows: GravableRowDef[] = [
    {
      id: 'row-8',
      num: 8,
      label: stripRowNum(d.baseGravable.row8),
      value: formatCop(r8),
      onChange: copChange('totalNationwideIncome'),
      op: '+'
    },
    {
      id: 'row-9',
      num: 9,
      label: stripRowNum(d.baseGravable.row9),
      value: formatCop(r9),
      onChange: copChange('lessIncomeOutsideMunicipality'),
      op: '−'
    },
    {
      id: 'row-10',
      num: 10,
      label: stripRowNum(d.baseGravable.row10),
      value: formatCop(r10),
      isCalc: true,
      op: '='
    },
    {
      id: 'row-11',
      num: 11,
      label: stripRowNum(d.baseGravable.row11),
      value: formatCop(r11),
      onChange: copChange('lessReturnsRebatesDiscounts'),
      op: '−'
    },
    {
      id: 'row-12',
      num: 12,
      label: stripRowNum(d.baseGravable.row12),
      value: formatCop(r12),
      onChange: copChange('lessExportIncome'),
      op: '−'
    },
    {
      id: 'row-13',
      num: 13,
      label: stripRowNum(d.baseGravable.row13),
      value: formatCop(r13),
      onChange: copChange('lessFixedAssetsIncome'),
      op: '−'
    },
    {
      id: 'row-14',
      num: 14,
      label: stripRowNum(d.baseGravable.row14),
      value: formatCop(r14),
      onChange: copChange('lessExcludedNonTaxableIncome'),
      op: '−'
    },
    {
      id: 'row-15',
      num: 15,
      label: stripRowNum(d.baseGravable.row15),
      value: formatCop(r15),
      onChange: copChange('lessExemptActivities'),
      op: '−'
    },
    {
      id: 'row-16',
      num: 16,
      label: stripRowNum(d.baseGravable.row16),
      value: formatCop(r16),
      isTotal: true,
      op: '='
    }
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* ── Stepper ── */}
      <Stepper steps={STEPS} current={step} />

      {/* ── Step 0: Período ── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="bg-bg-weak-50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <DateChip label={d.startDate} date={formatDate(watchStart)} />
              <div className="flex shrink-0 flex-col items-center gap-1.5">
                <div className="bg-stroke-soft-200 h-px w-6" />
                <span className="bg-information-lighter text-information-base rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">
                  {months}&nbsp;{months === 1 ? 'mes' : 'meses'}
                </span>
                <div className="bg-stroke-soft-200 h-px w-6" />
              </div>
              <DateChip label={d.endDate} date={formatDate(watchEnd)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField id="settle-presentation" label={d.presentationDate} required>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="settle-presentation"
                    type="date"
                    min={TODAY}
                    {...register('presentationDate')}
                  />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
            <FormField id="settle-settlement" label={d.settlementDate} required>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="settle-settlement"
                    type="date"
                    min={TODAY}
                    {...register('settlementDate')}
                  />
                </Input.Wrapper>
              </Input.Root>
            </FormField>
          </div>
        </div>
      )}

      {/* ── Step 1: Base gravable ── */}
      {step === 1 && (
        <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
          {gravableRows.map(row => (
            <GravableRow key={row.id} {...row} />
          ))}
        </div>
      )}

      {/* ── Step 2: Actividades ── */}
      {step === 2 && (
        <>
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <ActivityCard
                key={field.id}
                index={index}
                field={field}
                control={control}
                setValue={setValue}
                dict={d}
                allActivities={allActivities}
                onCopChange={copChangeActivity}
                onRemove={field.isDefault ? undefined : () => remove(index)}
              />
            ))}
          </div>
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="small"
            onClick={addActivity}
            className="self-start"
          >
            <Button.Icon as={RiAddLine} />
            {d.activities.add}
          </Button.Root>
        </>
      )}

      {/* ── Navigation ── */}
      <div className="border-stroke-soft-200 flex items-center justify-between border-t pt-4">
        {step > 0 ? (
          <Button.Root variant="neutral" mode="ghost" onClick={() => setStep(s => s - 1)}>
            <Button.Icon as={RiArrowLeftSLine} />
            {dict.common.back}
          </Button.Root>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <FancyButton.Root size="medium" onClick={() => setStep(s => s + 1)}>
            {STEPS[step + 1]}
            <FancyButton.Icon as={RiArrowRightSLine} />
          </FancyButton.Root>
        ) : (
          <FancyButton.Root size="medium" onClick={onSubmit}>
            {d.calculate}
          </FancyButton.Root>
        )}
      </div>
    </div>
  );
};

/* ─── ActivityCard ─── */

interface ActivityCardProps {
  index: number;
  field: FormValues['activities'][0] & { id: string };
  control: ReturnType<typeof useForm<FormValues>>['control'];
  setValue: SetValueFn;
  dict: PradmaDictionary['settle'];
  allActivities: import('../../models/establishment-activity.interface').EstablishmentActivity[];
  onCopChange: (
    index: number,
    field: keyof FormValues['activities'][0]
  ) => React.ChangeEventHandler<HTMLInputElement>;
  onRemove?: () => void;
}

const ActivityCard = ({
  index,
  field,
  control,
  setValue,
  dict: d,
  allActivities,
  onCopChange,
  onRemove
}: ActivityCardProps) => {
  const annualSalesVal = toInt(useWatch({ control, name: `activities.${index}.annualSales` }));
  const gamesTaxVal = toInt(useWatch({ control, name: `activities.${index}.gamesTax` }));
  const creditBalanceVal = toInt(
    useWatch({ control, name: `activities.${index}.lessCreditBalance` })
  );
  const advancePaymentVal = toInt(
    useWatch({ control, name: `activities.${index}.lessAdvancePayment` })
  );
  const withholdingsVal = toInt(
    useWatch({ control, name: `activities.${index}.lessWithholdings` })
  );
  const watchCode = useWatch({ control, name: `activities.${index}.activityCode` });
  const watchName = useWatch({ control, name: `activities.${index}.activityName` });
  const watchNoveltyValue = toInt(useWatch({ control, name: `activities.${index}.noveltyValue` }));
  const watchSignsTax = useWatch({ control, name: `activities.${index}.signsBillboardsTax` });
  const watchFireBrigade = useWatch({ control, name: `activities.${index}.fireBrigadeSurcharge` });
  const watchCmgrd = useWatch({ control, name: `activities.${index}.cmgrdStamp` });

  return (
    <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-2.5',
          field.isDefault ? 'bg-success-lighter' : 'bg-information-lighter'
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              'shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold',
              field.isDefault
                ? 'bg-success-base text-static-white'
                : 'bg-information-base text-static-white'
            )}
          >
            {field.isDefault
              ? d.activities.defaultActivity
              : `${d.activities.activity} ${index + 1}`}
          </span>
          {watchCode && (
            <span className="text-text-sub-600 min-w-0 truncate text-xs font-medium">
              {watchCode}
              {watchName ? ` — ${truncate(watchName, 28)}` : ''}
            </span>
          )}
        </div>
        {onRemove && (
          <CompactButton.Root
            variant="ghost"
            size="medium"
            onClick={onRemove}
            className="ml-2 shrink-0"
          >
            <CompactButton.Icon as={RiDeleteBinLine} />
          </CompactButton.Root>
        )}
      </div>

      {/* Activity selector (non-default only) */}
      {!field.isDefault && (
        <div className="border-stroke-soft-200 border-b px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <Label.Root htmlFor={`act-code-${index}`}>
              {d.activities.activityCode}
              <Label.Asterisk />
            </Label.Root>
            <Select.Root
              value={watchCode}
              onValueChange={v => {
                const found = allActivities.find(a => a.activityCode === v);
                setValue(`activities.${index}.activityCode`, v, { shouldValidate: true });
                setValue(`activities.${index}.activityName`, found?.activityName ?? '');
              }}
            >
              <Select.Trigger>
                <Select.Value placeholder={d.activities.selectActivity} />
              </Select.Trigger>
              <Select.Content>
                {allActivities.map(a => (
                  <Select.Item key={a.id} value={a.activityCode}>
                    {a.activityCode} — {truncate(a.activityName)}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      )}

      {/* Numeric rows */}
      <div className="divide-stroke-soft-200 divide-y">
        <ActivityRow
          id={`annual-sales-${index}`}
          label={d.activities.ventasAnuales}
          value={formatCop(annualSalesVal)}
          onChange={onCopChange(index, 'annualSales')}
        />
        <ActivityRow
          id={`games-tax-${index}`}
          label={d.activities.impuestoJuegos}
          value={formatCop(gamesTaxVal)}
          onChange={onCopChange(index, 'gamesTax')}
        />
        <ActivityRow
          id={`credit-balance-${index}`}
          label={d.activities.menosSaldo}
          value={formatCop(creditBalanceVal)}
          onChange={onCopChange(index, 'lessCreditBalance')}
        />
        <ActivityRow
          id={`advance-pay-${index}`}
          label={d.activities.menosAnticipo}
          value={formatCop(advancePaymentVal)}
          onChange={onCopChange(index, 'lessAdvancePayment')}
        />
        <ActivityRow
          id={`withholdings-${index}`}
          label={d.activities.menosRetenciones}
          value={formatCop(withholdingsVal)}
          onChange={onCopChange(index, 'lessWithholdings')}
        />
      </div>

      {/* Optional taxes */}
      <div className="border-stroke-soft-200 border-t">
        <div className="bg-bg-weak-50 px-4 py-2">
          <p className="text-text-sub-600 text-[11px] font-semibold tracking-wider uppercase">
            {d.activities.optionalTaxes.title}
          </p>
        </div>
        <div className="divide-stroke-soft-200 divide-y">
          <SwitchRow
            label={d.activities.optionalTaxes.avisosTableros}
            checked={watchSignsTax}
            onCheckedChange={v => setValue(`activities.${index}.signsBillboardsTax`, v)}
          />
          <SwitchRow
            label={d.activities.optionalTaxes.sobretasaBomberil}
            checked={watchFireBrigade}
            onCheckedChange={v => setValue(`activities.${index}.fireBrigadeSurcharge`, v)}
          />
          <SwitchRow
            label={d.activities.optionalTaxes.estampillaCMGRD}
            checked={watchCmgrd}
            onCheckedChange={v => setValue(`activities.${index}.cmgrdStamp`, v)}
          />
          <ActivityRow
            id={`novelty-value-${index}`}
            label={d.activities.optionalTaxes.valorNovedad}
            value={formatCop(watchNoveltyValue)}
            onChange={onCopChange(index, 'noveltyValue')}
          />
        </div>
      </div>
    </div>
  );
};

/* ─── Stepper ─── */

const Stepper = ({ steps, current }: { steps: string[]; current: number }) => (
  <div className="flex items-start">
    {steps.map((label, i) => (
      <Fragment key={i}>
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
              i === current && 'bg-text-strong-950 text-bg-white-0',
              i < current && 'bg-success-base text-static-white',
              i > current && 'bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 ring-1'
            )}
          >
            {i + 1}
          </div>
          <span
            className={cn(
              'text-center text-[11px] leading-tight font-medium',
              i === current ? 'text-text-strong-950' : 'text-text-sub-600'
            )}
          >
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div
            className={cn(
              'mx-2 mt-3.5 h-px flex-1',
              i < current ? 'bg-success-base' : 'bg-stroke-soft-200'
            )}
          />
        )}
      </Fragment>
    ))}
  </div>
);

/* ─── DateChip ─── */

const DateChip = ({ label, date }: { label: string; date: string }) => (
  <div className="bg-bg-white-0 ring-stroke-soft-200 flex-1 rounded-xl px-4 py-3 ring-1">
    <p className="text-text-soft-400 mb-1 text-[10px] font-semibold tracking-widest uppercase">
      {label}
    </p>
    <p className="text-text-strong-950 text-sm font-semibold">{date}</p>
  </div>
);

/* ─── GravableRow ─── */

const GravableRow = ({ num, label, value, onChange, isCalc, isTotal, op }: GravableRowDef) => {
  const editable = !isCalc && !isTotal;
  return (
    <div
      className={cn(
        'border-stroke-soft-200 flex items-center gap-3 border-b px-4 py-2.5 last:border-0',
        isCalc && 'bg-information-lighter',
        isTotal && 'bg-success-lighter'
      )}
    >
      <span
        className={cn(
          'w-4 shrink-0 text-center text-xs font-bold',
          isCalc ? 'text-information-base' : isTotal ? 'text-success-base' : 'text-text-soft-400'
        )}
      >
        {op}
      </span>
      <span
        className={cn(
          'w-5 shrink-0 text-center text-[11px] font-bold',
          isCalc ? 'text-information-base' : isTotal ? 'text-success-base' : 'text-text-sub-600'
        )}
      >
        {num}
      </span>
      <span className="text-text-sub-600 min-w-0 flex-1 text-xs leading-snug">{label}</span>
      <Input.Root className="w-32 shrink-0">
        <Input.Wrapper>
          <Input.Input
            id={`row-input-${num}`}
            value={value}
            onChange={onChange}
            inputMode="numeric"
            disabled={!editable}
            readOnly={!editable}
            className="text-right text-xs"
          />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
};

/* ─── ActivityRow ─── */

interface ActivityRowProps {
  id: string;
  label: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ActivityRow = ({ id, label, value, onChange }: ActivityRowProps) => (
  <div className="flex items-center gap-3 px-4 py-2.5">
    <span className="text-text-sub-600 min-w-0 flex-1 text-xs leading-snug">{label}</span>
    <Input.Root className="w-32 shrink-0">
      <Input.Wrapper>
        <Input.Input
          id={id}
          value={value}
          onChange={onChange}
          inputMode="numeric"
          className="text-right text-xs"
        />
      </Input.Wrapper>
    </Input.Root>
  </div>
);

/* ─── SwitchRow ─── */

const SwitchRow = ({
  label,
  checked,
  onCheckedChange
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3 px-4 py-2.5">
    <span className="text-text-sub-600 min-w-0 flex-1 text-xs">{label}</span>
    <Switch.Root checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);
