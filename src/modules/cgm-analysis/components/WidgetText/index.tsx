'use client';

import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@biaenergy/ui';
import { cn } from '@/utils/cn';
import type { TextWidget } from '../../models/cgm-analysis.interface';

interface WidgetTextProps {
  widget: TextWidget;
}

// Tooltip solo aparece cuando el header está realmente truncado.
// Detectamos midiendo scrollWidth > clientWidth en mount + resize.
// Renderizamos SIEMPRE el Tooltip wrapper (sino, al re-renderar agregando
// el wrapper, el <p> remontaría y el ResizeObserver perdería el elemento).
// `open={false}` suprime el tooltip cuando el texto cabe entero.
const TruncatedHeader = ({ text }: { text: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <Tooltip.Root open={truncated ? undefined : false}>
      <Tooltip.Trigger asChild>
        <p ref={ref} className="text-label-xs text-text-soft-400 truncate tracking-wider uppercase">
          {text}
        </p>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">{text}</Tooltip.Content>
    </Tooltip.Root>
  );
};

export const WidgetText = ({ widget }: WidgetTextProps) => {
  const { header, value_str, subheader, note, trend } = widget;

  return (
    <div className="bg-bg-white-0 border-stroke-soft-200 shadow-regular-sm flex h-full flex-col gap-4 rounded-2xl border p-5">
      <TruncatedHeader text={header} />

      <div className="flex flex-col gap-1">
        {/* DS `.bia-digit-group` (tokens.css §number pop-in): cada char entra */}
        {/* desde abajo con blur + overshoot, stagger de 70ms. `key` re-monta */}
        {/* para re-disparar cuando value_str cambia. */}
        <p key={value_str} className="text-title-h5 text-text-strong-950">
          <span className="bia-digit-group is-animating">
            {[...value_str].map((ch, i) => (
              <span key={`${i}-${ch}`} className="bia-digit" data-stagger={Math.min(i, 7)}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </span>
        </p>
        {/* !text-paragraph-xs por el body rule del DS (Tailwind v4) */}
        <p className="!text-paragraph-xs text-text-sub-600">{subheader}</p>
      </div>

      {(trend || note) && (
        // !text-paragraph-xs porque el body rule del DS gana sobre text-*
        // utilities en Tailwind v4 — el bang fuerza el 12px real.
        <div className="flex items-center gap-2">
          {trend && (
            // bg-*-lighter/40 = tinta extremadamente sutil debajo del glass.
            // El radial-gradient del glass-popup la atenúa aún más.
            <span
              className={cn(
                'glass-popup !text-paragraph-xs inline-flex items-center gap-1 rounded-md px-2 py-0.5',
                trend.color === 'green'
                  ? 'bg-success-lighter/40 text-success-base'
                  : 'bg-error-lighter/40 text-error-base'
              )}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value_str}
            </span>
          )}
          {note && <span className="!text-paragraph-xs text-text-sub-600">{note}</span>}
        </div>
      )}
    </div>
  );
};
