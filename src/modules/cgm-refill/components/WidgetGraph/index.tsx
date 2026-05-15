'use client';

import { useState } from 'react';
import { Popover } from '@biaenergy/ui';
import { RiArrowDownSLine, RiArrowUpSLine, RiCheckLine } from '@biaenergy/ui/icons';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/utils/cn';
import type { GraphSeries, GraphWidget } from '../../models/cgm-refill.interface';

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
  yUnit: string;
}

const CustomTooltip = ({ active, payload, label, yUnit }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-white-0 border-stroke-soft-200 rounded-lg border px-3 py-2 shadow-md">
      {label && <p className="text-paragraph-xs text-text-sub-600 mb-1.5">{label}</p>}
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-paragraph-xs text-text-sub-600">{entry.name}</span>
          <span className="text-paragraph-xs text-text-strong-950 ml-auto pl-3 font-medium">
            {formatYAxis(entry.value)} {yUnit}
          </span>
        </div>
      ))}
    </div>
  );
};

interface LegendEntry {
  value: string;
  color?: string;
}

const CustomLegend = ({ payload }: { payload?: LegendEntry[] }) => {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {payload.map(entry => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-paragraph-xs text-text-strong-950">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const formatYAxis = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
};

const renderSeries = (s: GraphSeries) =>
  s.type === 'area' ? (
    <Area
      key={s.name}
      type="monotone"
      dataKey={s.name}
      stroke={s.color}
      fill={s.color}
      fillOpacity={0.15}
      strokeWidth={2}
      dot={false}
      activeDot={{ r: 4 }}
    />
  ) : (
    <Line
      key={s.name}
      type="monotone"
      dataKey={s.name}
      stroke={s.color}
      strokeWidth={2}
      dot={false}
      activeDot={{ r: 4 }}
    />
  );

export const WidgetGraph = ({ widget }: { widget: GraphWidget }) => {
  const { header, graph } = widget;
  const series = graph?.series ?? [];
  const xLabels = graph?.x_axis?.data ?? [];
  const yUnit = graph?.y_axis?.unit ?? '';

  const mainSeries = series[0];
  const comparisons = series.slice(1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [open, setOpen] = useState(false);

  const selectedComparison = comparisons[selectedIdx];
  const activeSeries =
    widget.kind === 'monthly-consumption-vs-historical'
      ? [mainSeries, selectedComparison].filter(Boolean)
      : series;

  const data = xLabels.map((label, i) => {
    const point: Record<string, string | number> = { name: label };
    activeSeries.forEach(s => {
      point[s.name] = s.data[i] ?? 0;
    });
    return point;
  });

  const legendPayload = activeSeries.map(s => ({ value: s.name, color: s.color }));

  return (
    <div className="bg-bg-white-0 border-stroke-soft-200 flex h-full flex-col gap-3 rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-label-sm text-text-strong-950">{header}</p>

        <div className="flex items-center gap-2">
          {yUnit && <span className="text-paragraph-xs text-text-sub-600">{yUnit}</span>}

          {comparisons.length > 1 && widget.kind === 'monthly-consumption-vs-historical' && (
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className={cn(
                    'border-stroke-soft-200 flex items-center gap-1 rounded-lg border px-2.5 py-1.5 transition-colors',
                    'text-paragraph-xs text-text-strong-950 hover:bg-bg-weak-50'
                  )}
                >
                  <span>{selectedComparison?.name ?? ''}</span>
                  {open ? (
                    <RiArrowUpSLine className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <RiArrowDownSLine className="h-3.5 w-3.5 shrink-0" />
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Content align="end" className="w-56 p-1">
                {comparisons.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => {
                      setSelectedIdx(i);
                      setOpen(false);
                    }}
                    className="hover:bg-bg-weak-50 flex w-full items-start justify-between gap-2 rounded-md px-3 py-2 text-left transition-colors"
                  >
                    <div>
                      <p className="text-paragraph-sm text-text-strong-950">{s.name}</p>
                      {s.note && <p className="text-paragraph-xs text-text-sub-600">{s.note}</p>}
                    </div>
                    {selectedIdx === i && (
                      <RiCheckLine className="text-primary-base mt-0.5 h-4 w-4 shrink-0" />
                    )}
                  </button>
                ))}
              </Popover.Content>
            </Popover.Root>
          )}
        </div>
      </div>

      <CustomLegend payload={legendPayload} />

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-stroke-soft-200)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--color-text-sub-600)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: 'var(--color-text-sub-600)' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              content={(props: any) => <CustomTooltip {...props} yUnit={yUnit} />}
            />
            {activeSeries.map(renderSeries)}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
