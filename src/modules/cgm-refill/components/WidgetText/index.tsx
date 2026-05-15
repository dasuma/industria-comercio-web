import { cn } from '@/utils/cn';
import type { TextWidget } from '../../models/cgm-refill.interface';

interface WidgetTextProps {
  widget: TextWidget;
}

export const WidgetText = ({ widget }: WidgetTextProps) => {
  const { header, value_str, subheader, note, trend } = widget;

  return (
    <div className="bg-bg-white-0 border-stroke-soft-200 flex h-full flex-col gap-3 rounded-xl border p-4">
      <p className="text-paragraph-xs text-text-sub-600 truncate">{header}</p>

      <div className="flex flex-col gap-1">
        <p className="text-heading-h4 text-text-strong-950">{value_str}</p>
        <p className="text-paragraph-sm text-text-sub-600">{subheader}</p>
      </div>

      {(trend || note) && (
        <div className="flex items-center gap-1.5">
          {trend && (
            <span
              className={cn(
                'text-label-xs',
                trend.color === 'green' ? 'text-success-base' : 'text-error-base'
              )}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value_str}
            </span>
          )}
          {note && <span className="text-paragraph-xs text-text-sub-600">{note}</span>}
        </div>
      )}
    </div>
  );
};
