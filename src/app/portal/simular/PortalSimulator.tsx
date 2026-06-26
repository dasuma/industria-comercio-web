'use client';

import { Fragment, useCallback, useMemo, useState } from 'react';
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

const inputStyle = {
  borderColor: '#e2e8f0',
  background: '#f8fafc'
};

const inputClass =
  'w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all';

const useInputFocus = () => ({
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#1e4799';
    (e.target.style as CSSStyleDeclaration & { boxShadow: string }).boxShadow =
      '0 0 0 3px rgba(30,71,153,0.1)';
    e.target.style.background = '#fff';
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#e2e8f0';
    (e.target.style as CSSStyleDeclaration & { boxShadow: string }).boxShadow = 'none';
    e.target.style.background = '#f8fafc';
  }
});

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
  const inputFocus = useInputFocus();

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

  const STEPS = ['Período', 'Actividades'];

  return (
    <div
      className="w-full overflow-hidden rounded-2xl"
      style={{
        background: '#ffffff',
        boxShadow:
          '0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.07), 0 16px 32px -4px rgba(0,0,0,0.12)'
      }}
    >
      {/* ── Brand strip ── */}
      <div
        className="relative overflow-hidden px-7 pt-7 pb-6"
        style={{ background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-blue-300">Simulador de impuesto</p>
            <h2 className="text-base font-bold text-white">Industria y Comercio (I.C.A)</h2>
          </div>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div className="px-6 pt-5">
        <SimulatorStepper steps={STEPS} current={step} />
      </div>

      {/* ── Body ── */}
      <div className="px-6 pt-5 pb-6">
        {/* Step 0: Período */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            {/* Year selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sim-year" className="text-xs font-semibold text-slate-600">
                Año gravable
              </label>
              <select
                id="sim-year"
                value={year}
                onChange={e => {
                  setYear(Number(e.target.value));
                  setActivities([]);
                }}
                className={inputClass}
                style={inputStyle}
                {...inputFocus}
              >
                {AVAILABLE_YEARS.map(y => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Period chip */}
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs text-blue-700"
              style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-medium">
                Período: 01 enero {year} — 31 diciembre {year} (12 meses)
              </span>
            </div>

            {/* Optional taxes */}
            <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #e2e8f0' }}>
              <div style={{ background: '#f8fafc' }} className="px-4 py-2.5">
                <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  Sobretasas opcionales
                </p>
              </div>
              <SwitchRow
                label="Avisos y tableros"
                checked={signsBillboardsTax}
                onChange={setSignsBillboardsTax}
              />
              <div style={{ borderTop: '1px solid #f1f5f9' }}>
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
              <div
                className="rounded-xl px-4 py-8 text-center text-sm text-slate-400"
                style={{ border: '1px dashed #cbd5e1' }}
              >
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

            <button
              type="button"
              onClick={addActivity}
              className="flex items-center gap-2 self-start rounded-xl border px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
              style={{ borderColor: '#e2e8f0' }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Agregar actividad
            </button>
          </div>
        )}

        {/* Navigation */}
        <div
          className="mt-5 flex items-center justify-between border-t pt-4"
          style={{ borderColor: '#f1f5f9' }}
        >
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
            >
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)',
                boxShadow: '0 4px 14px rgba(30,71,153,0.3)'
              }}
            >
              Actividades →
            </button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {isError && (
                <p className="text-right text-xs text-red-600">
                  {error instanceof Error ? error.message : 'Error al calcular. Intentá de nuevo.'}
                </p>
              )}
              <button
                type="button"
                onClick={handleCalculate}
                disabled={isPending || !canCalculate}
                className="rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)',
                  boxShadow: '0 4px 14px rgba(30,71,153,0.3)'
                }}
              >
                {isPending ? 'Calculando…' : 'Calcular →'}
              </button>
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
  const inputFocus = useInputFocus();

  return (
    <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #e2e8f0' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: '#eff6ff' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
            style={{ background: '#1e4799' }}
          >
            Actividad {index + 1}
          </span>
          {activity.activityCode && (
            <span className="text-xs font-medium text-slate-500">
              {activity.activityCode}
              {activity.activityName ? ` — ${activity.activityName}` : ''}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 transition hover:text-red-500"
          aria-label="Eliminar actividad"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {/* Activity selector */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600">
            Actividad económica <span className="text-red-500">*</span>
          </label>
          <select
            value={activity.activityCode}
            onChange={e => {
              const found = allActivities.find(a => a.activityCode === e.target.value);
              onActivitySelect(e.target.value, found?.activityName ?? '');
            }}
            className={inputClass}
            style={inputStyle}
            {...inputFocus}
          >
            <option value="">Seleccioná una actividad…</option>
            {allActivities.map(a => (
              <option key={a.id} value={a.activityCode}>
                {a.activityCode} — {a.activityName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Annual sales */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className="flex-1 text-xs text-slate-500">Ventas anuales (COP)</span>
        <div className="w-36 shrink-0">
          <input
            type="text"
            value={formatCop(salesVal).replace(/\s/g, '').replace('$', '')}
            onChange={onSalesChange}
            inputMode="numeric"
            className="w-full rounded-xl border px-3 py-2 text-right text-xs text-slate-800 transition-all outline-none"
            style={inputStyle}
            {...inputFocus}
          />
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
    <span className="text-xs text-slate-600">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className="relative h-5 w-9 shrink-0 rounded-full transition-all duration-200"
      style={{ background: checked ? '#1e4799' : '#cbd5e1' }}
    >
      <span
        className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  </div>
);

/* ─── SimulatorStepper ─── */

const SimulatorStepper = ({ steps, current }: { steps: string[]; current: number }) => (
  <div className="flex items-start">
    {steps.map((label, i) => (
      <Fragment key={i}>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all"
            style={
              i === current
                ? { background: '#1e4799', color: '#fff' }
                : i < current
                  ? { background: '#16a34a', color: '#fff' }
                  : { background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }
            }
          >
            {i < current ? '✓' : i + 1}
          </div>
          <span
            className="text-center text-[11px] leading-tight font-medium"
            style={{ color: i === current ? '#0f172a' : '#94a3b8' }}
          >
            {label}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div
            className="mx-2 mt-3.5 h-px flex-1"
            style={{ background: i < current ? '#16a34a' : '#e2e8f0' }}
          />
        )}
      </Fragment>
    ))}
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
  <div
    className="w-full overflow-hidden rounded-2xl"
    style={{
      background: '#ffffff',
      boxShadow:
        '0 0 0 1px rgba(0,0,0,0.06), 0 4px 6px -1px rgba(0,0,0,0.07), 0 16px 32px -4px rgba(0,0,0,0.12)'
    }}
  >
    {/* Header */}
    <div
      className="relative overflow-hidden px-7 pt-6 pb-5"
      style={{ background: 'linear-gradient(135deg, #0f2952 0%, #1e4799 100%)' }}
    >
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-blue-300">Resultado de simulación</p>
          <h2 className="text-base font-bold text-white">
            {result.start_date.slice(0, 4)} — Estimación ICA
          </h2>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[11px] font-bold"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#bfdbfe' }}
        >
          Borrador
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-5 p-5">
      {/* Activities summary */}
      {result.activities.length > 0 && (
        <section>
          <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Actividades
          </p>
          <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #e2e8f0' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th className="px-3 py-2.5 text-left font-semibold text-slate-500">Actividad</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-slate-500">Tarifa ‰</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-slate-500">ICA</th>
                </tr>
              </thead>
              <tbody>
                {result.activities.map(a => (
                  <tr key={a.activity_code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold text-slate-800">{a.activity_code}</span>
                      <span className="ml-1 text-slate-400">{a.activity_name}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-500">{a.tariff_rate}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-800">
                      {formatCop(a.tax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Settlement rows */}
      <section>
        {result.activities.length > 0 && (
          <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Liquidación
          </p>
        )}
        <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #e2e8f0' }}>
          {result.rows.map(row => {
            const isTotal = TOTAL_KINDS.has(row.kind);
            const isSubtotal = SUBTOTAL_KINDS.has(row.kind);
            return (
              <div
                key={row.number}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  background: isTotal ? '#f0fdf4' : isSubtotal ? '#f8fafc' : '#fff'
                }}
              >
                <span
                  className="w-5 shrink-0 text-center text-[11px] font-bold"
                  style={{ color: isTotal ? '#16a34a' : '#cbd5e1' }}
                >
                  {row.number}
                </span>
                <span
                  className="flex-1 text-xs leading-snug"
                  style={{ color: isTotal ? '#15803d' : '#64748b' }}
                >
                  {row.name}
                </span>
                <span
                  className="shrink-0 text-right text-xs font-semibold tabular-nums"
                  style={{
                    color: isTotal ? '#15803d' : row.value === 0 ? '#cbd5e1' : '#0f172a',
                    fontSize: isTotal ? '0.875rem' : '0.75rem'
                  }}
                >
                  {row.value === 0 ? '—' : formatCop(row.value)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-[11px] leading-relaxed text-slate-400">
        * Esta es una estimación orientativa. El valor definitivo puede variar según los descuentos
        por pronto pago vigentes y la verificación de la información declarada.
      </p>

      {/* Actions */}
      <div className="flex justify-start border-t pt-4" style={{ borderColor: '#f1f5f9' }}>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50"
          style={{ borderColor: '#e2e8f0' }}
        >
          ↺ Nueva simulación
        </button>
      </div>
    </div>
  </div>
);
