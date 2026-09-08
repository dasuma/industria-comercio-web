'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  CompactButton,
  FancyButton,
  Input,
  Label,
  Select,
  Switch,
  toast
} from '@dasuma/pradma-ui';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiErrorWarningFill
} from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';
import type { Locale } from '@/i18n/config';
import { INTL_LOCALES } from '@/i18n/config';
import { formatLongDate, formatNumber, interpolate } from '@/utils/format';
import { FormField } from '@/components/FormField';
import {
  useGetEstablishmentActivitiesByYear,
  useGetActivitiesByYear,
  useCreateSettlement,
  useCreateDraftInvoice,
  useSaveSettlement,
  useGetClient
} from '../../data';
import { useSettleYears } from '../../hooks/useSettleYears';
import { SETTLE_PERIOD_MONTHS, settlePeriod } from '../../utils/settlePeriod';
import type { Establishment } from '../../models/establishment.interface';
import type { EstablishmentActivity } from '../../models/establishment-activity.interface';
import type { PradmaDictionary } from '../../dictionaries';
import { SettlementSheet } from '../SettlementSheet';
import { CurrencyInput } from '../CurrencyInput';
import { ActivityPicker } from '../ActivityPicker';

interface EstablishmentSettleProps {
  establishment: Establishment;
  locale: Locale;
  dict: PradmaDictionary;
  /** Vuelve al historial sin calcular. */
  onBack: () => void;
  /** Se llama tras guardar la liquidación. */
  onSaved?: () => void;
}

/* ─── Constants & helpers ─── */

const TODAY = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = new Date().getFullYear();

const toInt = (v: string): number => {
  const n = parseInt(v.replace(/\D/g, '') || '0', 10);
  return isNaN(n) ? 0 : n;
};

// Grilla compartida por header, filas y footer de la tabla de actividades.
const ROW_GRID = 'grid grid-cols-[6rem_minmax(0,1fr)_13.75rem_2rem] items-center gap-4';

/* ─── Schema ─── */

const activitySchema = z.object({
  activityCode: z.string(),
  activityName: z.string(),
  /** Actividad registrada en el establecimiento (no se puede quitar). */
  isRegistered: z.boolean(),
  annualSales: z.string()
});

type FormValues = {
  presentationDate: string;
  settlementDate: string;
  signsBillboardsTax: boolean;
  fireBrigadeSurcharge: boolean;
  activities: z.infer<typeof activitySchema>[];
};

type FormControl = ReturnType<typeof useForm<FormValues>>['control'];
type SetValueFn = ReturnType<typeof useForm<FormValues>>['setValue'];

/* ─── EstablishmentSettle ─── */

// Flujo de liquidación en una sola pantalla: año → período derivado →
// ventas por actividad → impuestos → fechas (colapsadas) → calcular.
export const EstablishmentSettle = ({
  establishment,
  locale,
  dict,
  onBack,
  onSaved
}: EstablishmentSettleProps) => {
  const d = dict.settle;
  const intlLocale = INTL_LOCALES[locale];
  const [isGenerating, setIsGenerating] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [datesOpen, setDatesOpen] = useState(false);

  // Los mensajes salen del diccionario, por eso el schema vive dentro del componente.
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
    years: availableYears,
    isReady,
    refetch: refetchInvoices
  } = useSettleYears(establishment.id);
  const [yearOverride, setYearOverride] = useState<number | null>(null);
  const year = yearOverride ?? availableYears[0] ?? CURRENT_YEAR - 1;

  // El período siempre es el año calendario completo del año elegido.
  const { startDate, endDate } = settlePeriod(year);

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
  const watchedActivities = useWatch({ control, name: 'activities' });
  const [presentationDate, settlementDate] = useWatch({
    control,
    name: ['presentationDate', 'settlementDate']
  });
  const [signsTax, fireTax] = useWatch({
    control,
    name: ['signsBillboardsTax', 'fireBrigadeSurcharge']
  });

  useEffect(() => {
    if (activitiesData) {
      replace(
        activitiesData.map(a => ({
          activityCode: a.activityCode,
          activityName: a.activityName,
          isRegistered: true,
          annualSales: ''
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitiesData]);

  const totalSales = (watchedActivities ?? []).reduce((acc, a) => acc + toInt(a.annualSales), 0);

  const addActivity = () => {
    setActivitiesError(null);
    append({ activityCode: '', activityName: '', isRegistered: false, annualSales: '' });
  };

  const handleNewSettlement = () => {
    resetMutation();
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
      void refetchInvoices();
      handleNewSettlement();
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : d.result.saveError);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = handleSubmit(
    values => {
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
    },
    // Las fechas viven colapsadas: si fallan, abrimos el acordeón para que el
    // error se vea donde está el campo.
    () => setDatesOpen(true)
  );

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
  if (isReady && availableYears.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3">
        <Alert.Root status="success" size="small">
          {d.noYearAvailable}
        </Alert.Root>
        <Button.Root variant="basic" size="small" onClick={onBack}>
          <Button.Icon as={RiArrowLeftSLine} />
          {d.back}
        </Button.Root>
      </div>
    );
  }

  /* ── Derived labels ── */
  const monthsLabel = `${SETTLE_PERIOD_MONTHS} ${d.monthsPlural}`;
  const datesAreToday = presentationDate === TODAY && settlementDate === TODAY;
  const datesSummary = datesAreToday
    ? interpolate(d.dates.today, { date: formatLongDate(TODAY, intlLocale) })
    : interpolate(d.dates.custom, {
        presentation: formatLongDate(presentationDate, intlLocale),
        settlement: formatLongDate(settlementDate, intlLocale)
      });
  const activeTaxes = [
    signsTax ? d.activities.optionalTaxes.avisosTableros : null,
    fireTax ? d.activities.optionalTaxes.sobretasaBomberil : null
  ].filter((t): t is string => t !== null);
  const activitiesLabel =
    fields.length === 1
      ? d.summary.activity
      : interpolate(d.summary.activities, { count: fields.length });
  const summary = [String(year), monthsLabel, activitiesLabel, ...activeTaxes].join(' · ');
  const showRowErrors = activitiesError !== null;

  return (
    <section className="bg-bg-white-0 ring-stroke-soft-200 flex flex-col overflow-hidden rounded-xl ring-1">
      {/* ── Header: volver + título + año ── */}
      <header className="border-stroke-soft-200 flex flex-wrap items-center gap-3 border-b px-5 py-3.5">
        <CompactButton.Root variant="stroke" size="medium" onClick={onBack} aria-label={d.back}>
          <CompactButton.Icon as={RiArrowLeftSLine} />
        </CompactButton.Root>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-label-md text-text-strong-950">{d.title}</h3>
          <p className="text-paragraph-xs text-text-sub-600">{d.subtitle}</p>
        </div>
        {/* 1-de-N sobre 5+ años: Select del DS en vez de pills; el año elegido queda siempre visible en el trigger */}
        <div className="flex items-center gap-2">
          <Label.Root htmlFor="settle-year" className="text-paragraph-xs text-text-soft-400">
            {d.year}
          </Label.Root>
          <Select.Root
            value={String(year)}
            onValueChange={v => setYearOverride(Number(v))}
            variant="compact"
            size="small"
          >
            <Select.Trigger
              id="settle-year"
              className="text-label-sm text-text-strong-950 w-28 font-semibold tabular-nums"
            >
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {availableYears.map(y => (
                <Select.Item key={y} value={String(y)} className="tabular-nums">
                  {y}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-5">
        {/* ── Período: año calendario completo del año elegido ── */}
        <div className="bg-bg-weak-25 flex flex-col gap-1 rounded-xl px-4 py-3.5">
          <p className="text-subheading-2xs text-text-soft-400 uppercase">{d.period.title}</p>
          <p className="text-label-sm text-text-strong-950 tabular-nums">
            {formatLongDate(startDate, intlLocale)} → {formatLongDate(endDate, intlLocale)}
          </p>
          <p className="text-paragraph-xs text-text-sub-600">
            {monthsLabel} · {d.period.derived}
          </p>
        </div>

        {/* ── Actividades e ingresos ── */}
        <section className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-label-sm text-text-strong-950">{d.activitiesSection.title}</h4>
            <p className="text-paragraph-xs text-text-sub-600">{d.activitiesSection.hint}</p>
          </div>
          <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
            <div
              className={cn(
                ROW_GRID,
                'bg-bg-weak-25 text-subheading-2xs text-text-soft-400 px-4 py-2 uppercase'
              )}
            >
              <span />
              <span>{d.activitiesSection.columnActivity}</span>
              <span className="text-right">{d.activitiesSection.columnSales}</span>
              <span />
            </div>

            {fields.map((field, index) => (
              <ActivityRow
                key={field.id}
                index={index}
                isRegistered={field.isRegistered}
                control={control}
                setValue={setValue}
                dict={d}
                deleteLabel={dict.common.delete}
                allActivities={allActivities}
                showErrors={showRowErrors}
                onRemove={field.isRegistered ? undefined : () => remove(index)}
              />
            ))}

            {fields.length === 0 ? (
              <p className="text-paragraph-xs text-text-soft-400 border-stroke-soft-200 border-t px-4 py-3">
                {d.activitiesSection.empty}
              </p>
            ) : null}

            <div className="border-stroke-soft-200 bg-bg-weak-25 flex flex-wrap items-center justify-between gap-4 border-t py-2 pr-4 pl-2">
              <Button.Root variant="basic" mode="ghost" size="small" onClick={addActivity}>
                <Button.Icon as={RiAddLine} />
                {d.activities.add}
              </Button.Root>
              <p className="flex items-baseline gap-2.5">
                <span className="text-paragraph-xs text-text-sub-600">
                  {d.activitiesSection.total}
                </span>
                <span className="text-label-sm text-text-strong-950 tabular-nums">
                  $ {formatNumber(totalSales, intlLocale)}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Impuestos adicionales ── */}
        <section className="flex flex-col gap-2.5">
          <h4 className="text-label-sm text-text-strong-950">{d.taxesTitle}</h4>
          <div className="ring-stroke-soft-200 divide-stroke-soft-200 divide-y overflow-hidden rounded-xl ring-1">
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
        </section>

        {/* ── Fechas del documento: colapsadas, hoy por defecto ── */}
        <Accordion.Root
          type="single"
          collapsible
          value={datesOpen ? 'dates' : ''}
          onValueChange={v => setDatesOpen(v === 'dates')}
        >
          <Accordion.Item value="dates">
            <Accordion.Header>
              <Accordion.Trigger>
                <Accordion.Icon as={RiCalendarLine} />
                <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                  <span className="text-label-sm text-text-strong-950">{d.dates.title}</span>
                  <span className="text-paragraph-xs text-text-sub-600 tabular-nums">
                    {datesSummary}
                  </span>
                </span>
                <Accordion.Arrow />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="pt-4">
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
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        {activitiesError || isError ? (
          <Alert.Root status="error" size="small">
            <Alert.Icon as={RiErrorWarningFill} />
            {activitiesError ??
              (error instanceof Error && error.message ? error.message : dict.common.serverError)}
          </Alert.Root>
        ) : null}
      </div>

      {/* ── Footer: resumen + una sola acción ── */}
      <footer className="border-stroke-soft-200 bg-bg-weak-25 flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
        <p className="text-paragraph-xs text-text-sub-600 tabular-nums">{summary}</p>
        <div className="flex items-center gap-2.5">
          <Button.Root variant="basic" onClick={onBack} disabled={isPending}>
            {dict.common.cancel}
          </Button.Root>
          {/* [R7] única primary del flujo */}
          <FancyButton.Root
            onClick={onSubmit}
            state={isPending ? 'loading' : 'idle'}
            disabled={isPending}
          >
            {d.calculateFull}
          </FancyButton.Root>
        </div>
      </footer>
    </section>
  );
};

/* ─── ActivityRow ─── */

interface ActivityRowProps {
  index: number;
  isRegistered: boolean;
  control: FormControl;
  setValue: SetValueFn;
  dict: PradmaDictionary['settle'];
  deleteLabel: string;
  allActivities: EstablishmentActivity[];
  /** Tras un intento de calcular con filas incompletas. */
  showErrors: boolean;
  onRemove?: () => void;
}

const ActivityRow = ({
  index,
  isRegistered,
  control,
  setValue,
  dict: d,
  deleteLabel,
  allActivities,
  showErrors,
  onRemove
}: ActivityRowProps) => {
  const code = useWatch({ control, name: `activities.${index}.activityCode` });
  const name = useWatch({ control, name: `activities.${index}.activityName` });

  return (
    <div className={cn(ROW_GRID, 'border-stroke-soft-200 border-t px-4 py-2.5')}>
      <Badge.Root variant="light" size="small" color={isRegistered ? 'green' : 'gray'}>
        {isRegistered ? d.activitiesSection.registered : d.activitiesSection.additional}
      </Badge.Root>

      {isRegistered ? (
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-label-sm text-text-strong-950 shrink-0 tabular-nums">{code}</span>
          {name ? (
            <span className="text-paragraph-xs text-text-sub-600 truncate" title={name}>
              {name}
            </span>
          ) : (
            <span className="text-paragraph-xs text-text-soft-400 italic">
              {d.activitiesSection.noName}
            </span>
          )}
        </div>
      ) : (
        <ActivityPicker
          id={`act-code-${index}`}
          value={code}
          options={allActivities}
          placeholder={d.activitiesSection.searchPlaceholder}
          noResultsLabel={d.activitiesSection.noResults}
          hasError={showErrors && !code}
          onChange={activity => {
            setValue(`activities.${index}.activityCode`, activity.activityCode, {
              shouldValidate: true
            });
            setValue(`activities.${index}.activityName`, activity.activityName);
          }}
        />
      )}

      <Controller
        control={control}
        name={`activities.${index}.annualSales`}
        render={({ field: sales }) => (
          <CurrencyInput
            id={`annual-sales-${index}`}
            aria-label={d.activities.ventasAnuales}
            value={sales.value}
            onChange={sales.onChange}
            hasError={showErrors && toInt(sales.value) <= 0}
          />
        )}
      />

      {onRemove ? (
        <CompactButton.Root
          variant="ghost"
          size="medium"
          onClick={onRemove}
          aria-label={deleteLabel}
        >
          <CompactButton.Icon as={RiDeleteBinLine} />
        </CompactButton.Root>
      ) : (
        <span />
      )}
    </div>
  );
};

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
  <div className="flex items-center justify-between gap-3 px-4 py-3">
    <Label.Root htmlFor={id} className="text-paragraph-sm text-text-strong-950 min-w-0 flex-1">
      {label}
    </Label.Root>
    <Switch.Root id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);
