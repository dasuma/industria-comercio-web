'use client';

import { Fragment, useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  CompactButton,
  FancyButton,
  HorizontalStepper,
  Input,
  Label,
  Select,
  Switch,
  Table
} from '@dasuma/pradma-ui';
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalculatorLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiErrorWarningFill,
  RiRefreshLine
} from '@dasuma/pradma-ui/icons';
import { useSimulateSettlement, useGetPublicActivitiesByYear } from '@modules/pradma';
import type { SettlementResponse, EstablishmentActivity } from '@modules/pradma';

/* ─── Constants ─── */

const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR = CURRENT_YEAR - 1;
const MIN_YEAR = 2020;

const AVAILABLE_YEARS: number[] = [];
for (let y = MAX_YEAR; y >= MIN_YEAR; y--) AVAILABLE_YEARS.push(y);

const TOTAL_KINDS = new Set(['gross_total', 'balance_due', 'amount_payable', 'total_payable']);
const SUBTOTAL_KINDS = new Set(['subtotal_tax']);

const STEPS = ['Período', 'Actividades'];

/* ─── Helpers ─── */

const formatCop = (v: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(v);

const toInt = (v: string): number => {
  const n = parseInt(v.replace(/\D/g, '') || '0', 10);
  return isNaN(n) ? 0 : n;
};

/* ─── Activity row type ─── */

interface ActivityRow {
  id: string;
  activityCode: string;
  activityName: string;
  annualSales: string;
}

/* ─── PortalSimulator ─── */

export const PortalSimulator = () => {
  const [step, setStep] = useState(0);
  const [year, setYear] = useState(MAX_YEAR);
  const [signsBillboardsTax, setSignsBillboardsTax] = useState(true);
  const [fireBrigadeSurcharge, setFireBrigadeSurcharge] = useState(true);
  const [activities, setActivities] = useState<ActivityRow[]>([]);

  const { data: allActivitiesRaw = [] } = useGetPublicActivitiesByYear(year);

  const allActivities = useMemo(() => {
    const seen = new Set<string>();
    return allActivitiesRaw.filter(a => {
      if (seen.has(a.activityCode)) return false;
      seen.add(a.activityCode);
      return true;
    });
  }, [allActivitiesRaw]);

  const {
    mutate: simulate,
    isPending,
    isError,
    error,
    data: result,
    reset: resetMutation
  } = useSimulateSettlement();

  const addActivity = () =>
    setActivities(prev => [
      ...prev,
      { id: `${Date.now()}`, activityCode: '', activityName: '', annualSales: '0' }
    ]);

  const removeActivity = (id: string) => setActivities(prev => prev.filter(a => a.id !== id));

  const updateActivity = useCallback(
    (id: string, field: keyof ActivityRow, value: string) =>
      setActivities(prev => prev.map(a => (a.id === id ? { ...a, [field]: value } : a))),
    []
  );

  const handleSalesChange = useCallback(
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      updateActivity(id, 'annualSales', e.target.value.replace(/\D/g, '') || '0'),
    [updateActivity]
  );

  const handleCalculate = () => {
    simulate({
      start_date: `${year}-01-01`,
      end_date: `${year}-12-31`,
      signs_billboards_tax: signsBillboardsTax,
      fire_brigade_surcharge: fireBrigadeSurcharge,
      activities: activities
        .filter(a => a.activityCode)
        .map(a => ({
          activity_code: a.activityCode,
          annual_sales: toInt(a.annualSales)
        }))
    });
  };

  const handleReset = () => {
    resetMutation();
    setStep(0);
    setActivities([]);
  };

  const canCalculate = activities.some(a => a.activityCode && toInt(a.annualSales) > 0);

  /* ── Result view ── */
  if (result) {
    return <SimulatorResult result={result} onReset={handleReset} />;
  }

  const getStepState = (i: number): 'completed' | 'active' | 'default' =>
    i < step ? 'completed' : i === step ? 'active' : 'default';

  return (
    <div className="bg-bg-white-0 ring-stroke-soft-200 overflow-hidden rounded-2xl ring-1">
      {/* ── Header ── */}
      <div className="border-stroke-soft-200 flex items-center gap-3 border-b px-6 py-5">
        <div className="bg-bg-weak-50 text-text-sub-600 flex size-10 shrink-0 items-center justify-center rounded-xl">
          <RiCalculatorLine className="size-5" />
        </div>
        <div>
          <p className="text-text-soft-400 text-subheading-2xs uppercase">Simulador de impuesto</p>
          <h2 className="text-text-strong-950 text-label-md">Industria y Comercio (I.C.A)</h2>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="px-6 pt-5">
        <HorizontalStepper.Root>
          {STEPS.map((label, i) => (
            <Fragment key={label}>
              <button type="button" onClick={() => setStep(i)} className="cursor-pointer">
                <HorizontalStepper.Item state={getStepState(i)}>
                  <HorizontalStepper.ItemIndicator>{i + 1}</HorizontalStepper.ItemIndicator>
                  <span className="hidden sm:inline">{label}</span>
                </HorizontalStepper.Item>
              </button>
              {i < STEPS.length - 1 && <HorizontalStepper.SeparatorIcon />}
            </Fragment>
          ))}
        </HorizontalStepper.Root>
      </div>

      {/* ── Body ── */}
      <div className="px-6 pt-5 pb-6">
        {/* Step 0: Período */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label.Root htmlFor="sim-year">Año gravable</Label.Root>
              <Select.Root
                value={String(year)}
                onValueChange={v => {
                  setYear(Number(v));
                  setActivities([]);
                }}
              >
                <Select.Trigger id="sim-year">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {AVAILABLE_YEARS.map(y => (
                    <Select.Item key={y} value={String(y)}>
                      {y}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            <Alert.Root status="information" size="small">
              <Alert.Icon as={RiCalendarLine} />
              Período: 01 enero {year} — 31 diciembre {year} (12 meses)
            </Alert.Root>

            {/* Optional taxes */}
            <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
              <div className="bg-bg-weak-50 px-4 py-2.5">
                <p className="text-text-sub-600 text-subheading-2xs uppercase">
                  Sobretasas opcionales
                </p>
              </div>
              <SwitchRow
                label="Avisos y tableros"
                checked={signsBillboardsTax}
                onChange={setSignsBillboardsTax}
              />
              <div className="border-stroke-soft-200 border-t">
                <SwitchRow
                  label="Sobretasa bomberil"
                  checked={fireBrigadeSurcharge}
                  onChange={setFireBrigadeSurcharge}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Actividades */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            {activities.length === 0 && (
              <div className="border-stroke-soft-200 text-text-soft-400 text-paragraph-sm rounded-xl border border-dashed px-4 py-8 text-center">
                Agregá al menos una actividad económica para calcular el impuesto.
              </div>
            )}

            {activities.map((act, index) => (
              <ActivityCard
                key={act.id}
                index={index}
                activity={act}
                allActivities={allActivities}
                onSalesChange={handleSalesChange(act.id)}
                onActivitySelect={(code, name) => {
                  updateActivity(act.id, 'activityCode', code);
                  updateActivity(act.id, 'activityName', name);
                }}
                onRemove={() => removeActivity(act.id)}
              />
            ))}

            <Button.Root variant="basic" mode="stroke" className="self-start" onClick={addActivity}>
              <Button.Icon as={RiAddLine} />
              Agregar actividad
            </Button.Root>
          </div>
        )}

        {/* Navigation */}
        <div className="border-stroke-soft-200 mt-5 flex items-center justify-between border-t pt-4">
          {step > 0 ? (
            <Button.Root variant="basic" mode="ghost" onClick={() => setStep(s => s - 1)}>
              <Button.Icon as={RiArrowLeftSLine} />
              Anterior
            </Button.Root>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <FancyButton.Root variant="primary" onClick={() => setStep(s => s + 1)}>
              Actividades
              <FancyButton.Icon as={RiArrowRightSLine} />
            </FancyButton.Root>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {isError && (
                <Alert.Root status="error" size="small">
                  <Alert.Icon as={RiErrorWarningFill} />
                  {error instanceof Error ? error.message : 'Error al calcular. Intentá de nuevo.'}
                </Alert.Root>
              )}
              <FancyButton.Root
                variant="primary"
                onClick={handleCalculate}
                disabled={isPending || !canCalculate}
              >
                {isPending ? 'Calculando…' : 'Calcular'}
                <FancyButton.Icon as={RiArrowRightSLine} />
              </FancyButton.Root>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── ActivityCard ─── */

interface ActivityCardProps {
  index: number;
  activity: ActivityRow;
  allActivities: EstablishmentActivity[];
  onSalesChange: React.ChangeEventHandler<HTMLInputElement>;
  onActivitySelect: (code: string, name: string) => void;
  onRemove: () => void;
}

const ActivityCard = ({
  index,
  activity,
  allActivities,
  onSalesChange,
  onActivitySelect,
  onRemove
}: ActivityCardProps) => {
  const salesVal = toInt(activity.annualSales);

  return (
    <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
      {/* Header */}
      <div className="bg-bg-weak-50 flex items-center justify-between gap-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Badge.Root variant="light" color="blue">
            Actividad {index + 1}
          </Badge.Root>
          {activity.activityCode && (
            <span className="text-text-sub-600 text-paragraph-xs">
              {activity.activityCode}
              {activity.activityName ? ` — ${activity.activityName}` : ''}
            </span>
          )}
        </div>
        <CompactButton.Root
          variant="ghost"
          size="medium"
          onClick={onRemove}
          aria-label="Eliminar actividad"
        >
          <CompactButton.Icon as={RiDeleteBinLine} />
        </CompactButton.Root>
      </div>

      {/* Activity selector */}
      <div className="border-stroke-soft-200 flex flex-col gap-1 border-b px-4 py-3">
        <Label.Root>
          Actividad económica
          <Label.Asterisk />
        </Label.Root>
        <Select.Root
          value={activity.activityCode}
          onValueChange={v => {
            const found = allActivities.find(a => a.activityCode === v);
            onActivitySelect(v, found?.activityName ?? '');
          }}
        >
          <Select.Trigger>
            <Select.Value placeholder="Seleccioná una actividad…" />
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

      {/* Annual sales */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="text-text-sub-600 text-paragraph-xs flex-1">Ventas anuales (COP)</span>
        <div className="w-40 shrink-0">
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                type="text"
                value={formatCop(salesVal).replace(/\s/g, '').replace('$', '')}
                onChange={onSalesChange}
                inputMode="numeric"
                className="text-right"
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
    </div>
  );
};

/* ─── SwitchRow ─── */

const SwitchRow = ({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3 px-4 py-3">
    <span className="text-text-sub-600 text-paragraph-sm">{label}</span>
    <Switch.Root checked={checked} onCheckedChange={onChange} />
  </div>
);

/* ─── SimulatorResult ─── */

const SimulatorResult = ({
  result,
  onReset
}: {
  result: SettlementResponse;
  onReset: () => void;
}) => (
  <div className="bg-bg-white-0 ring-stroke-soft-200 overflow-hidden rounded-2xl ring-1">
    {/* Header */}
    <div className="border-stroke-soft-200 flex items-center justify-between gap-3 border-b px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="bg-bg-weak-50 text-text-sub-600 flex size-10 shrink-0 items-center justify-center rounded-xl">
          <RiCalculatorLine className="size-5" />
        </div>
        <div>
          <p className="text-text-soft-400 text-subheading-2xs uppercase">
            Resultado de simulación
          </p>
          <h2 className="text-text-strong-950 text-label-md">
            {result.start_date.slice(0, 4)} — Estimación ICA
          </h2>
        </div>
      </div>
      <Badge.Root variant="light" color="gray">
        Borrador
      </Badge.Root>
    </div>

    <div className="flex flex-col gap-5 p-5">
      {/* Activities summary */}
      {result.activities.length > 0 && (
        <section>
          <p className="text-text-sub-600 text-subheading-2xs mb-2 uppercase">Actividades</p>
          <div className="ring-stroke-soft-200 overflow-hidden rounded-xl ring-1">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Actividad</Table.Head>
                  <Table.Head className="text-right">Tarifa ‰</Table.Head>
                  <Table.Head className="text-right">ICA</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {result.activities.map(a => (
                  <Table.Row key={a.activity_code}>
                    <Table.Cell>
                      <span className="text-text-strong-950 font-medium">{a.activity_code}</span>
                      <span className="text-text-soft-400 ml-1">{a.activity_name}</span>
                    </Table.Cell>
                    <Table.Cell className="text-text-sub-600 text-right">
                      {a.tariff_rate}
                    </Table.Cell>
                    <Table.Cell className="text-text-strong-950 text-right font-medium">
                      {formatCop(a.tax)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        </section>
      )}

      {/* Settlement rows */}
      <section>
        {result.activities.length > 0 && (
          <p className="text-text-sub-600 text-subheading-2xs mb-2 uppercase">Liquidación</p>
        )}
        <div className="ring-stroke-soft-200 divide-stroke-soft-200 divide-y overflow-hidden rounded-xl ring-1">
          {result.rows.map(row => {
            const isTotal = TOTAL_KINDS.has(row.kind);
            const isSubtotal = SUBTOTAL_KINDS.has(row.kind);
            return (
              <div
                key={row.number}
                className={`flex items-center gap-3 px-4 py-2.5 ${
                  isTotal || isSubtotal ? 'bg-bg-weak-50' : 'bg-bg-white-0'
                }`}
              >
                <span
                  className={`text-paragraph-xs w-5 shrink-0 text-center font-medium ${
                    isTotal ? 'text-success-base' : 'text-text-disabled-300'
                  }`}
                >
                  {row.number}
                </span>
                <span
                  className={`text-paragraph-xs flex-1 leading-snug ${
                    isTotal ? 'text-success-base font-medium' : 'text-text-sub-600'
                  }`}
                >
                  {row.name}
                </span>
                <span
                  className={`shrink-0 text-right font-semibold tabular-nums ${
                    isTotal
                      ? 'text-success-base text-label-sm'
                      : row.value === 0
                        ? 'text-text-disabled-300 text-paragraph-xs'
                        : 'text-text-strong-950 text-paragraph-xs'
                  }`}
                >
                  {row.value === 0 ? '—' : formatCop(row.value)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-text-soft-400 text-paragraph-xs leading-relaxed">
        * Esta es una estimación orientativa. El valor definitivo puede variar según los descuentos
        por pronto pago vigentes y la verificación de la información declarada.
      </p>

      {/* Actions */}
      <div className="border-stroke-soft-200 flex justify-start border-t pt-4">
        <Button.Root variant="basic" onClick={onReset}>
          <Button.Icon as={RiRefreshLine} />
          Nueva simulación
        </Button.Root>
      </div>
    </div>
  </div>
);
