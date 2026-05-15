'use client';

import { useId, useState } from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, Dropdown } from '@biaenergy/ui';
import { Chart, type ChartConfig } from '@biaenergy/ui/chart';
import { RiArrowDownSLine } from '@biaenergy/ui/icons';
import { cn } from '@/utils/cn';
import type { GraphSeries, GraphWidget } from '../../models/cgm-analysis.interface';

const FALLBACK_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)'
];

// Widgets cuyo "green" (primary) se lee mejor como barras (los demás se quedan
// como Line). Detectamos por header en ES/EN porque el `kind` del backend no
// distingue estos casos. El patrón `consumo por d[ií]a` exige "consumo" pegado
// a "por día" para no atrapar "Consumo promedio por hora por día" (ese se
// queda como área). Si en el futuro el backend etiqueta cada widget con un
// `chart_type`, este matching se reemplaza por el campo.
const BAR_KIND_RE =
  /(6\s*meses|6\s*months|por\s*semana|per\s*week|consumo\s+por\s+d[ií]a|consumption\s+per\s+day)/i;

const colorFor = (s: GraphSeries, idx: number) =>
  s.color ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

const buildConfig = (series: GraphSeries[]): ChartConfig =>
  Object.fromEntries(series.map((s, i) => [s.name, { label: s.name, color: colorFor(s, i) }]));

const formatYAxis = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
};

// Glass gradient compartido del DS (variants.tsx §BiaGlassGradient):
// top→bottom, white 4% top → solid 55% → black 2% bottom.
const GlassGradient = ({ id, color }: { id: string; color: string }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor={`color-mix(in oklch, white 4%, ${color})`} />
    <stop offset="55%" stopColor={color} />
    <stop offset="100%" stopColor={`color-mix(in oklch, black 2%, ${color})`} />
  </linearGradient>
);

export const WidgetGraph = ({ widget }: { widget: GraphWidget }) => {
  const { header, graph } = widget;
  const series = graph?.series ?? [];
  const xLabels = graph?.x_axis?.data ?? [];
  const yUnit = graph?.y_axis?.unit ?? '';

  const mainSeries = series[0];
  const comparisons = series.slice(1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [focused, setFocused] = useState<string | null>(null);

  const selectedComparison = comparisons[selectedIdx];
  const showsDataset =
    widget.kind === 'monthly-consumption-vs-historical' && comparisons.length > 1;

  const activeSeries = showsDataset ? [mainSeries, selectedComparison].filter(Boolean) : series;

  const data = xLabels.map((label, i) => {
    const point: Record<string, string | number> = { name: label };
    activeSeries.forEach(s => {
      point[s.name] = s.data[i] ?? 0;
    });
    return point;
  });

  const config = buildConfig(activeSeries);
  const visibleSeries = focused ? activeSeries.filter(s => s.name === focused) : activeSeries;

  const useBarLayout = BAR_KIND_RE.test(header);
  const reactId = useId().replace(/:/g, '');
  const gradientId = (key: string) => `bia-area-${reactId}-${key}`;

  // Render order: bars first (background), areas next, lines on top, así el
  // "promedio" siempre se ve por encima del relleno.
  const renderOrder = (s: GraphSeries, i: number): number => {
    if (useBarLayout && i === 0) return 0;
    if (s.type === 'area') return 1;
    return 2;
  };
  const orderedSeries = [...visibleSeries].sort(
    (a, b) => renderOrder(a, activeSeries.indexOf(a)) - renderOrder(b, activeSeries.indexOf(b))
  );

  return (
    // Outer del chart-con-título: en light mode mantenemos `bg-bg-weak-25`
    // (= neutral-50). En dark queremos un punto intermedio entre `weak-50`
    // (neutral-800, demasiado claro) y `weak-25` (neutral-900, un toque
    // oscuro de más): mezclamos ambos al 50% para aproximar un "neutral-850".
    // El DS no expone esta parada en su escala — si validamos, lo pedimos
    // como token (`bg-chart-frame` o similar).
    <div className="bg-bg-weak-25 flex h-full w-full flex-col rounded-2xl dark:bg-[color-mix(in_oklch,var(--color-neutral-800),var(--color-neutral-900))]">
      <div className="flex items-center justify-between gap-3 px-4 py-4.5">
        <div className="text-label-md text-text-strong-950">{header}</div>
        {showsDataset && (
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <Button.Root variant="basic" size="xxsmall">
                {selectedComparison?.name}
                <Button.Icon as={RiArrowDownSLine} />
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
              {comparisons.map((s, i) => (
                <Dropdown.Item
                  key={s.name}
                  onSelect={() => {
                    setSelectedIdx(i);
                    setFocused(null);
                  }}
                >
                  {s.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown.Root>
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2">
        <div className="border-stroke-soft-200 bg-bg-white-0 shadow-regular-sm flex flex-1 flex-col rounded-xl border p-4">
          <Chart.Container config={config} className="aspect-auto h-[240px] w-full">
            <ComposedChart data={data} margin={{ top: 16, right: 0, left: -8, bottom: 0 }}>
              <defs>
                {activeSeries.map((s, i) => {
                  if (useBarLayout && i === 0) return null;
                  const color = colorFor(s, i);
                  return (
                    <GlassGradient key={`${s.name}-grad`} id={gradientId(s.name)} color={color} />
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={40}
              />
              <Tooltip
                cursor={false}
                content={
                  <Chart.TooltipContent
                    indicator="dot"
                    formatter={value => `${formatYAxis(Number(value))}${yUnit ? ` ${yUnit}` : ''}`}
                  />
                }
              />
              {orderedSeries.map(s => {
                const apiIdx = activeSeries.indexOf(s);
                const color = colorFor(s, apiIdx);
                const isPrimaryBar = useBarLayout && apiIdx === 0;
                if (isPrimaryBar) {
                  return (
                    <Bar
                      key={s.name}
                      dataKey={s.name}
                      fill={color}
                      stroke={color}
                      strokeWidth={1}
                      radius={[6, 6, 0, 0]}
                      isAnimationActive
                    />
                  );
                }
                if (s.type === 'area') {
                  return (
                    <Area
                      key={s.name}
                      type="monotone"
                      dataKey={s.name}
                      stroke={color}
                      fill={`url(#${gradientId(s.name)})`}
                      fillOpacity={0.4}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                      connectNulls
                    />
                  );
                }
                return (
                  <Line
                    key={s.name}
                    type="monotone"
                    dataKey={s.name}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                    connectNulls
                  />
                );
              })}
            </ComposedChart>
          </Chart.Container>
          {activeSeries.length > 1 && (
            <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {activeSeries.map((s, i) => {
                const dimmed = focused !== null && focused !== s.name;
                return (
                  <li key={s.name}>
                    <button
                      type="button"
                      onClick={() => setFocused(cur => (cur === s.name ? null : s.name))}
                      aria-pressed={focused === s.name}
                      className={cn(
                        '!text-paragraph-xs text-text-sub-600 flex items-center gap-1.5 rounded-md px-1.5 py-0 transition-opacity',
                        dimmed && 'opacity-40'
                      )}
                    >
                      <span
                        className="size-2.5 rounded-[3px]"
                        style={{ backgroundColor: colorFor(s, i) }}
                      />
                      {s.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
