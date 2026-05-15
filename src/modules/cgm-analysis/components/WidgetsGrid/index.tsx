'use client';

import { useGetWidgets } from '../../data';
import type { GraphWidget, TextWidget } from '../../models/cgm-analysis.interface';
import { WidgetText } from '../WidgetText';
import { WidgetGraph } from '../WidgetGraph';

interface WidgetsGridProps {
  contractId: number;
  date: string;
  forceLoading?: boolean;
}

const colSpanClass: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
  8: 'col-span-8',
  9: 'col-span-9',
  10: 'col-span-10',
  11: 'col-span-11',
  12: 'col-span-12'
};

const EXCLUDED_KINDS = new Set(['variations', '', 'last-update-info']);

export const WidgetsGrid = ({ contractId, date, forceLoading }: WidgetsGridProps) => {
  const { data, isLoading, isFetching, isError } = useGetWidgets(contractId, date);

  if (isLoading || isFetching || forceLoading) {
    return (
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-bg-weak-50 border-stroke-soft-200 col-span-4 h-[120px] animate-pulse rounded-xl border"
          />
        ))}
      </div>
    );
  }

  if (isError || !data?.length) return null;

  const visible = data.filter(w => !EXCLUDED_KINDS.has(w.kind));
  if (!visible.length) return null;

  return (
    <div className="grid grid-cols-12 gap-4">
      {visible.map((widget, i) => {
        const span = colSpanClass[widget.grid_columns] ?? 'col-span-12';
        return (
          <div key={`${widget.kind}-${i}`} className={span}>
            {widget.type === 'text' ? (
              <WidgetText widget={widget as TextWidget} />
            ) : (
              <WidgetGraph widget={widget as GraphWidget} />
            )}
          </div>
        );
      })}
    </div>
  );
};
