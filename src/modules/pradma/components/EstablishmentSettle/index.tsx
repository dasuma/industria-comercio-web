'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import {
  Button,
  CompactButton,
  FancyButton,
  Input,
  Label,
  Select,
  Switch,
  toast
} from '@biaenergy/ui';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine
} from '@biaenergy/ui/icons';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { APP_ROUTES } from '@/config/routes';
import { FormField } from '@/components/FormField';
import {
  useGetEstablishmentActivitiesByYear,
  useGetActivitiesByYear,
  useCreateSettlement,
  useCreateDraftInvoice,
  useSaveSettlement,
  useGetInvoicesByEstablishment,
  useGetClient
} from '../../data';
import type { Establishment } from '../../models/establishment.interface';
import type { PradmaDictionary } from '../../dictionaries';
import { SettlementSheet } from '../SettlementSheet';

interface EstablishmentSettleProps {
  establishment: Establishment;
  dict: PradmaDictionary;
}

/* ─── Constants & helpers ─── */

const TODAY = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = new Date().getFullYear();
// Can't settle the ongoing year — max is always the previous calendar year.
const MAX_SETTLE_YEAR = CURRENT_YEAR - 1;

const resolveStartDate = (e: Establishment, year: number): string =>
  new Date(e.startDate).getFullYear() === year ? e.startDate.slice(0, 10) : `${year}-01-01`;

const resolveEndDate = (e: Establishment, year: number): string => {
  if (!e.endDate) return `${year}-12-31`;
  return new Date(e.endDate).getFullYear() === year ? e.endDate.slice(0, 10) : `${year}-12-31`;
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
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);

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

/* ─── Schema ─── */

const activitySchema = z.object({
  activityCode: z.string().min(1),
  activityName: z.string(),
  isDefault: z.boolean(),
  annualSales: z.string().regex(/^\d*$/).default('0')
});

const schema = z.object({
  presentationDate: z
    .string()
    .min(1)
    .refine(v => v >= TODAY),
  settlementDate: z
    .string()
    .min(1)
    .refine(v => v >= TODAY),
  signsBillboardsTax: z.boolean(),
  fireBrigadeSurcharge: z.boolean(),
  activities: z.array(activitySchema)
});

type FormValues = z.infer<typeof schema>;
type SetValueFn = ReturnType<typeof useForm<FormValues>>['setValue'];

/* ─── EstablishmentSettle ─── */

export const EstablishmentSettle = ({ establishment, dict }: EstablishmentSettleProps) => {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const d = dict.settle;
  const router = useRouter();

  /* ── Client (needed for PDF) ── */
  const { data: client } = useGetClient(establishment.clientId);
  const { mutateAsync: createDraftInvoice } = useCreateDraftInvoice();
  const { mutateAsync: saveSettlement } = useSaveSettlement();

  /* ── Year selection ── */
  const { data: invoices = [], isSuccess: invoicesReady } = useGetInvoicesByEstablishment(
    establishment.id
  );

  // Compute which years are pending: from (lastPaidYear + 1) up to MAX_SETTLE_YEAR.
  // Before invoices load (invoices=[]) defaults to [MAX_SETTLE_YEAR] so the UI
  // is never empty while the query is in flight.
  const { availableYears, computedDefaultYear } = useMemo(() => {
    const paid = invoices.filter(inv => inv.status === 'paid');
    const lastPaid = paid.length > 0 ? Math.max(...paid.map(inv => inv.year)) : CURRENT_YEAR - 2;
    const firstPending = lastPaid + 1;
    const years: number[] = [];
    for (let y = firstPending; y <= MAX_SETTLE_YEAR; y++) years.push(y);
    return { availableYears: years, computedDefaultYear: years[0] ?? MAX_SETTLE_YEAR };
  }, [invoices]);

  // yearOverride is null until the user explicitly picks a year.
  const [yearOverride, setYearOverride] = useState<number | null>(null);
  const year = yearOverride ?? computedDefaultYear;

  // Dates derived from selected year + establishment bounds.
  const startDate = resolveStartDate(establishment, year);
  const endDate = resolveEndDate(establishment, year);
  const months = diffMonths(startDate, endDate);

  /* ── Activities for the selected year ── */
  const { data: activitiesData } = useGetEstablishmentActivitiesByYear(establishment.id, year);
  const { data: allActivitiesRaw = [] } = useGetActivitiesByYear(year);

  const allActivities = useMemo(() => {
    const seen = new Set<string>();
    return allActivitiesRaw.filter(a => {
      if (seen.has(a.activityCode)) return false;
      seen.add(a.activityCode);
      return true;
    });
  }, [allActivitiesRaw]);

  const {
    mutate: createSettlement,
    isPending,
    isError,
    error,
    data: result,
    reset: resetMutation
  } = useCreateSettlement();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset: resetForm
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      presentationDate: TODAY,
      settlementDate: TODAY,
      signsBillboardsTax: true,
      fireBrigadeSurcharge: true,
      activities: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: 'activities' });

  // Reset activities whenever the year changes (activitiesData will be re-fetched).
  useEffect(() => {
    if (activitiesData) {
      replace(
        activitiesData.map(a => ({
          activityCode: a.activityCode,
          activityName: a.activityName,
          isDefault: true,
          annualSales: '0'
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitiesData]);

  const copChangeActivity = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(`activities.${index}.annualSales`, e.target.value.replace(/\D/g, '') || '0'),
    [setValue]
  );

  const addActivity = () =>
    append({
      activityCode: '',
      activityName: '',
      isDefault: false,
      annualSales: '0'
    });

  const handleNewSettlement = () => {
    resetMutation();
    setStep(0);
    setYearOverride(null);
    resetForm();
  };

  const handleSavePdf = async () => {
    if (!result) return;
    setIsGenerating(true);
    try {
      const pdfYear = new Date(result.start_date + 'T12:00:00').getFullYear();
      const totalRow = [...result.rows].sort((a, b) => b.number - a.number)[0];
      const total = totalRow?.value ?? 0;

      const { id: invoiceId } = await createDraftInvoice({
        establishment_id: establishment.id,
        year: pdfYear,
        total,
        details: result.rows.map(r => ({
          kind: r.kind,
          name: r.name,
          amount: r.value,
          description: r.description || r.name,
          sort_index: r.number
        }))
      });

      const { generateSettlementPdf } = await import('../../utils/generateSettlementPdf');
      const blob = await generateSettlementPdf(result, establishment, client, invoiceId);

      const { uploadSettlementPdf } = await import('../../utils/uploadSettlementPdf');
      const blobUrl = await uploadSettlementPdf(blob, establishment, pdfYear);

      const filename = `liquidacion-${establishment.id}-${pdfYear}.pdf`;
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);

      await saveSettlement({ ...result, invoice_id: invoiceId, pdf_url: blobUrl });

      toast.success('Liquidación guardada correctamente.');
      router.push(APP_ROUTES.invoices);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo guardar la liquidación. Intentá de nuevo.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = handleSubmit(values => {
    createSettlement({
      establishment_id: establishment.id,
      start_date: startDate,
      end_date: endDate,
      presentation_date: values.presentationDate,
      settlement_date: values.settlementDate,
      signs_billboards_tax: values.signsBillboardsTax,
      fire_brigade_surcharge: values.fireBrigadeSurcharge,
      activities: values.activities.map(a => ({
        activity_code: a.activityCode,
        annual_sales: toInt(a.annualSales)
      }))
    });
  });

  /* ── Result view: overlay sheet ── */
  if (result) {
    return (
      <SettlementSheet
        mode="draft"
        data={result}
        establishment={establishment}
        isSaving={isGenerating}
        onSave={handleSavePdf}
        onClose={handleNewSettlement}
        saveLabel={d.result.downloadPdf}
        newLabel={d.result.newSettlement}
      />
    );
  }

  /* ── All caught up ── */
  if (invoicesReady && availableYears.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-text-sub-600 text-sm">{d.noYearAvailable}</p>
      </div>
    );
  }

  const STEPS = [d.steps.period, d.steps.activities];

  return (
    <div className="flex flex-col gap-5">
      {/* ── Stepper ── */}
      <Stepper steps={STEPS} current={step} />

      {/* ── Step 0: Período ── */}
      {step === 0 && (
        <div className="space-y-4">
          {/* Year selector */}
          <FormField id="settle-year" label={d.year} required>
            <Select.Root
              value={String(year)}
              onValueChange={v => {
                setYearOverride(Number(v));
                setStep(0);
              }}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {availableYears.map(y => (
                  <Select.Item key={y} value={String(y)}>
                    {y}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </FormField>

          {/* Date range — derived from selected year */}
          <div className="bg-bg-weak-50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <DateChip label={d.startDate} date={formatDate(startDate)} />
              <div className="flex shrink-0 flex-col items-center gap-1.5">
                <div className="bg-stroke-soft-200 h-px w-6" />
                <span className="bg-information-lighter text-information-dark rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">
                  {months}&nbsp;{months === 1 ? 'mes' : 'meses'}
                </span>
                <div className="bg-stroke-soft-200 h-px w-6" />
              </div>
              <DateChip label={d.endDate} date={formatDate(endDate)} />
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

          {/* Optional taxes */}
          <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
            <div className="bg-bg-weak-50 px-4 py-2.5">
              <p className="text-text-sub-600 text-[11px] font-semibold tracking-wider uppercase">
                {d.activities.optionalTaxes.title}
              </p>
            </div>
            <div className="divide-stroke-soft-200 divide-y">
              <Controller
                control={control}
                name="signsBillboardsTax"
                render={({ field }) => (
                  <SwitchRow
                    label={d.activities.optionalTaxes.avisosTableros}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="fireBrigadeSurcharge"
                render={({ field }) => (
                  <SwitchRow
                    label={d.activities.optionalTaxes.sobretasaBomberil}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: Actividades ── */}
      {step === 1 && (
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
      <div className="border-stroke-soft-200 flex flex-col gap-3 border-t pt-4">
        {isError && (
          <div className="bg-error-lighter ring-error-base/20 rounded-lg px-3 py-2.5 ring-1">
            <p className="text-error-dark text-xs font-semibold">
              {error instanceof Error ? error.message : dict.common.serverError}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
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
            <FancyButton.Root size="medium" onClick={onSubmit} disabled={isPending}>
              {isPending ? dict.common.saving : d.calculate}
            </FancyButton.Root>
          )}
        </div>
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
  onCopChange: (index: number) => React.ChangeEventHandler<HTMLInputElement>;
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
  const watchCode = useWatch({ control, name: `activities.${index}.activityCode` });
  const watchName = useWatch({ control, name: `activities.${index}.activityName` });

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
            <span className="text-text-sub-600 min-w-0 text-xs font-medium">
              {watchCode}
              {watchName ? ` — ${watchName}` : ''}
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
                    {a.activityCode} — {a.activityName}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      )}

      {/* Annual sales */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="text-text-sub-600 min-w-0 flex-1 text-xs leading-snug">
          {d.activities.ventasAnuales}
        </span>
        <Input.Root className="w-36 shrink-0">
          <Input.Wrapper>
            <Input.Input
              id={`annual-sales-${index}`}
              value={formatCop(annualSalesVal).replace(/\s/g, '').replace('$', '')}
              onChange={onCopChange(index)}
              inputMode="numeric"
              className="text-right text-xs"
            />
          </Input.Wrapper>
        </Input.Root>
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
