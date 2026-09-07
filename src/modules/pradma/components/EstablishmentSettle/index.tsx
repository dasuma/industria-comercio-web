'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import {
  Alert,
  Button,
  CompactButton,
  FancyButton,
  HorizontalStepper,
  Input,
  Label,
  Select,
  Switch,
  toast
} from '@dasuma/pradma-ui';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiErrorWarningFill
} from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';
import { formatLongDate } from '@/utils/format';
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
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { PradmaDictionary } from '../../dictionaries';
import { SettlementSheet } from '../SettlementSheet';
import { CurrencyInput } from '../CurrencyInput';

interface EstablishmentSettleProps {
  establishment: Establishment;
  dict: PradmaDictionary;
  /** Se llama tras guardar la liquidación; el padre decide a qué tab ir. */
  onSaved?: () => void;
}

/* ─── Constants & helpers ─── */

const TODAY = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = new Date().getFullYear();
// No se puede liquidar el año en curso — el máximo es siempre el anterior.
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

const toInt = (v: string): number => {
  const n = parseInt(v.replace(/\D/g, '') || '0', 10);
  return isNaN(n) ? 0 : n;
};

/* ─── Schema ─── */

const activitySchema = z.object({
  activityCode: z.string(),
  activityName: z.string(),
  isDefault: z.boolean(),
  annualSales: z.string()
});

type FormValues = {
  presentationDate: string;
  settlementDate: string;
  signsBillboardsTax: boolean;
  fireBrigadeSurcharge: boolean;
  activities: z.infer<typeof activitySchema>[];
};

type SetValueFn = ReturnType<typeof useForm<FormValues>>['setValue'];

/* ─── EstablishmentSettle ─── */

export const EstablishmentSettle = ({ establishment, dict, onSaved }: EstablishmentSettleProps) => {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const d = dict.settle;

  // Los mensajes salen del diccionario, por eso el schema vive dentro del
  // componente. Antes se validaba sin mensajes y los Hints nunca aparecían.
  const schema = useMemo(
    () =>
      z.object({
        presentationDate: z
          .string()
          .min(1, d.errors.presentationDateRequired)
          .refine(v => v >= TODAY, d.errors.presentationDateFuture),
        settlementDate: z
          .string()
          .min(1, d.errors.settlementDateRequired)
          .refine(v => v >= TODAY, d.errors.settlementDateFuture),
        signsBillboardsTax: z.boolean(),
        fireBrigadeSurcharge: z.boolean(),
        activities: z.array(activitySchema)
      }),
    [d.errors]
  );

  /* ── Client (needed for PDF) ── */
  const { data: client } = useGetClient(establishment.clientId);
  const { mutateAsync: createDraftInvoice } = useCreateDraftInvoice();
  const { mutateAsync: saveSettlement } = useSaveSettlement();

  /* ── Year selection ── */
  const {
    data: invoices = [],
    isSuccess: invoicesReady,
    refetch: refetchInvoices
  } = useGetInvoicesByEstablishment(establishment.id);

  const { availableYears, computedDefaultYear } = useMemo(() => {
    const paid = invoices.filter(inv => inv.status === 'paid');
    const lastPaid = paid.length > 0 ? Math.max(...paid.map(inv => inv.year)) : CURRENT_YEAR - 2;
    const firstPending = lastPaid + 1;
    const years: number[] = [];
    for (let y = firstPending; y <= MAX_SETTLE_YEAR; y++) years.push(y);
    return { availableYears: years, computedDefaultYear: years[0] ?? MAX_SETTLE_YEAR };
  }, [invoices]);

  const [yearOverride, setYearOverride] = useState<number | null>(null);
  const year = yearOverride ?? computedDefaultYear;

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
    reset: resetForm,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      presentationDate: TODAY,
      settlementDate: TODAY,
      signsBillboardsTax: true,
      fireBrigadeSurcharge: true,
      activities: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: 'activities' });

  useEffect(() => {
    if (activitiesData) {
      replace(
        activitiesData.map(a => ({
          activityCode: a.activityCode,
          activityName: a.activityName,
          isDefault: true,
          annualSales: ''
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitiesData]);

  const addActivity = () => {
    setActivitiesError(null);
    append({ activityCode: '', activityName: '', isDefault: false, annualSales: '' });
  };

  const handleNewSettlement = () => {
    resetMutation();
    setStep(0);
    setYearOverride(null);
    setActivitiesError(null);
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

      toast.success(d.result.saved);
      // Nos quedamos en el establecimiento: refrescamos sus liquidaciones y
      // dejamos que el padre cambie al tab correspondiente.
      void refetchInvoices();
      handleNewSettlement();
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : d.result.saveError);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = handleSubmit(values => {
    const invalid = values.activities.some(a => !a.activityCode || toInt(a.annualSales) <= 0);
    if (invalid || values.activities.length === 0) {
      setActivitiesError(d.errors.activitiesInvalid);
      return;
    }
    setActivitiesError(null);
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

  // Antes de pasar a actividades validamos las fechas para que el error se
  // vea donde está el campo, no en el paso siguiente.
  const goToActivities = handleSubmit(() => setStep(1));

  /* ── Result view: overlay sheet ── */
  if (result) {
    return (
      <SettlementSheet
        mode="draft"
        data={result}
        establishment={establishment}
        dict={dict}
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
      <Alert.Root status="success" size="small">
        {d.noYearAvailable}
      </Alert.Root>
    );
  }

  const STEPS = [d.steps.period, d.steps.activities];
  const stepState = (i: number): 'completed' | 'active' | 'default' =>
    i < step ? 'completed' : i === step ? 'active' : 'default';

  return (
    <div className="flex flex-col gap-5">
      <HorizontalStepper.Root>
        {STEPS.map((label, i) => (
          <Fragment key={label}>
            <HorizontalStepper.Item state={stepState(i)}>
              <HorizontalStepper.ItemIndicator>{i + 1}</HorizontalStepper.ItemIndicator>
              {label}
            </HorizontalStepper.Item>
            {i < STEPS.length - 1 ? <HorizontalStepper.SeparatorIcon /> : null}
          </Fragment>
        ))}
      </HorizontalStepper.Root>

      {/* ── Step 0: Período ── */}
      {step === 0 ? (
        <div className="flex flex-col gap-4">
          <FormField id="settle-year" label={d.year} required>
            <Select.Root
              value={String(year)}
              onValueChange={v => {
                setYearOverride(Number(v));
                setStep(0);
              }}
            >
              <Select.Trigger id="settle-year">
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

          {/* Rango derivado del año + fechas del establecimiento */}
          <div className="bg-bg-weak-50 flex items-center gap-3 rounded-xl p-3">
            <DateChip label={d.startDate} date={formatLongDate(startDate)} />
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <div className="bg-stroke-soft-200 h-px w-6" />
              <span className="bg-information-lighter text-information-dark text-label-xs rounded-full px-2.5 py-1 whitespace-nowrap tabular-nums">
                {months} {months === 1 ? d.month : d.monthsPlural}
              </span>
              <div className="bg-stroke-soft-200 h-px w-6" />
            </div>
            <DateChip label={d.endDate} date={formatLongDate(endDate)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="settle-presentation"
              label={d.presentationDate}
              required
              error={errors.presentationDate?.message}
            >
              <Input.Root hasError={Boolean(errors.presentationDate)}>
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
            <FormField
              id="settle-settlement"
              label={d.settlementDate}
              required
              error={errors.settlementDate?.message}
            >
              <Input.Root hasError={Boolean(errors.settlementDate)}>
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

          {/* Impuestos opcionales */}
          <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
            <div className="bg-bg-weak-50 px-4 py-2.5">
              <p className="text-subheading-2xs text-text-sub-600 uppercase">
                {d.activities.optionalTaxes.title}
              </p>
            </div>
            <div className="divide-stroke-soft-200 divide-y">
              <Controller
                control={control}
                name="signsBillboardsTax"
                render={({ field }) => (
                  <SwitchRow
                    id="settle-signs"
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
                    id="settle-fire"
                    label={d.activities.optionalTaxes.sobretasaBomberil}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Step 1: Actividades ── */}
      {step === 1 ? (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <ActivityCard
              key={field.id}
              index={index}
              field={field}
              control={control}
              setValue={setValue}
              dict={d}
              deleteLabel={dict.common.delete}
              allActivities={allActivities}
              onRemove={field.isDefault ? undefined : () => remove(index)}
            />
          ))}
          <Button.Root variant="basic" size="small" onClick={addActivity} className="self-start">
            <Button.Icon as={RiAddLine} />
            {d.activities.add}
          </Button.Root>
        </div>
      ) : null}

      {/* ── Navegación ── */}
      <div className="border-stroke-soft-200 flex flex-col gap-3 border-t pt-4">
        {activitiesError || isError ? (
          <Alert.Root status="error" size="small">
            <Alert.Icon as={RiErrorWarningFill} />
            {activitiesError ??
              (error instanceof Error && error.message ? error.message : dict.common.serverError)}
          </Alert.Root>
        ) : null}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <Button.Root variant="basic" mode="ghost" onClick={() => setStep(s => s - 1)}>
              <Button.Icon as={RiArrowLeftSLine} />
              {dict.common.back}
            </Button.Root>
          ) : (
            <div />
          )}

          {/* [R7] una sola primary por paso */}
          {step < STEPS.length - 1 ? (
            <FancyButton.Root size="medium" onClick={goToActivities}>
              {STEPS[step + 1]}
              <FancyButton.Icon as={RiArrowRightSLine} />
            </FancyButton.Root>
          ) : (
            <FancyButton.Root
              size="medium"
              onClick={onSubmit}
              state={isPending ? 'loading' : 'idle'}
              disabled={isPending}
            >
              {d.calculate}
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
  field: FormValues['activities'][number] & { id: string };
  control: ReturnType<typeof useForm<FormValues>>['control'];
  setValue: SetValueFn;
  dict: PradmaDictionary['settle'];
  deleteLabel: string;
  allActivities: EstablishmentActivity[];
  onRemove?: () => void;
}

const ActivityCard = ({
  index,
  field,
  control,
  setValue,
  dict: d,
  deleteLabel,
  allActivities,
  onRemove
}: ActivityCardProps) => {
  const watchCode = useWatch({ control, name: `activities.${index}.activityCode` });
  const watchName = useWatch({ control, name: `activities.${index}.activityName` });

  return (
    <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
      <div
        className={cn(
          'flex items-center justify-between gap-2 px-4 py-2.5',
          field.isDefault ? 'bg-success-lighter' : 'bg-bg-weak-50'
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              'text-label-xs shrink-0 rounded-md px-2 py-0.5',
              field.isDefault
                ? 'bg-success-base text-static-white'
                : 'bg-bg-white-0 text-text-sub-600 ring-stroke-soft-200 ring-1'
            )}
          >
            {field.isDefault
              ? d.activities.defaultActivity
              : `${d.activities.activity} ${index + 1}`}
          </span>
          {watchCode ? (
            <span className="text-paragraph-xs text-text-sub-600 min-w-0 truncate">
              {watchCode}
              {watchName ? ` — ${watchName}` : ''}
            </span>
          ) : null}
        </div>
        {onRemove ? (
          <CompactButton.Root
            variant="ghost"
            size="medium"
            onClick={onRemove}
            aria-label={deleteLabel}
            className="shrink-0"
          >
            <CompactButton.Icon as={RiDeleteBinLine} />
          </CompactButton.Root>
        ) : null}
      </div>

      {!field.isDefault ? (
        <div className="border-stroke-soft-200 border-b px-4 py-3">
          <div className="flex flex-col gap-1">
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
              <Select.Trigger id={`act-code-${index}`}>
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
      ) : null}

      <div className="flex items-center gap-3 px-4 py-2.5">
        <Label.Root
          htmlFor={`annual-sales-${index}`}
          className="text-paragraph-xs text-text-sub-600 min-w-0 flex-1"
        >
          {d.activities.ventasAnuales}
          <Label.Asterisk />
        </Label.Root>
        <Controller
          control={control}
          name={`activities.${index}.annualSales`}
          render={({ field: salesField }) => (
            <CurrencyInput
              id={`annual-sales-${index}`}
              value={salesField.value}
              onChange={salesField.onChange}
              className="w-44 shrink-0"
            />
          )}
        />
      </div>
    </div>
  );
};

/* ─── DateChip ─── */

const DateChip = ({ label, date }: { label: string; date: string }) => (
  <div className="bg-bg-white-0 ring-stroke-soft-200 flex-1 rounded-lg px-3 py-2.5 ring-1">
    <p className="text-subheading-2xs text-text-soft-400 mb-0.5 uppercase">{label}</p>
    <p className="text-label-sm text-text-strong-950 tabular-nums">{date}</p>
  </div>
);

/* ─── SwitchRow ─── */

const SwitchRow = ({
  id,
  label,
  checked,
  onCheckedChange
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3 px-4 py-2.5">
    <Label.Root htmlFor={id} className="text-paragraph-xs text-text-sub-600 min-w-0 flex-1">
      {label}
    </Label.Root>
    <Switch.Root id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);
