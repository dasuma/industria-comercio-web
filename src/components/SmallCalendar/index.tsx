'use client';

import type { ComponentProps } from 'react';
import { Datepicker } from '@biaenergy/ui';
import { cn } from '@/utils/cn';

type CalendarProps = ComponentProps<typeof Datepicker.Calendar>;

// Versión compacta del Datepicker del DS (size-8 en lugar de size-10, gaps
// más chicos, padding del caption reducido). Mantenemos el resto de los
// estilos por defecto del DS — solo override de tamaños. Candidato a
// promoverlo al DS como variante `size="small"`.
const SMALL_CLASSNAMES: NonNullable<CalendarProps['classNames']> = {
  caption_start: 'p-3',
  caption_end: 'p-3',
  caption:
    'flex justify-center items-center relative rounded-lg bg-bg-soft-200 dark:bg-bg-weak-50 h-7',
  caption_label: 'text-label-xs text-text-sub-600 select-none',
  head_cell:
    'text-text-sub-600 dark:text-text-soft-400 text-label-xs uppercase size-8 flex items-center justify-center text-center select-none',
  head_row: 'flex gap-1.5',
  row: 'grid grid-flow-col auto-cols-auto w-full mt-1.5 gap-1.5',
  cell: cn(
    'group/cell relative size-8 shrink-0 select-none p-0',
    'before:absolute before:inset-y-0 before:bg-bg-weak-50 before:hidden dark:before:bg-primary-alpha-10',
    '[&:has(.day-range-middle)]:before:block [&:has(.day-range-middle)]:before:left-0 [&:has(.day-range-middle)]:before:-right-1.5',
    '[&:has(.day-range-start:not(.day-range-end))]:before:block [&:has(.day-range-start:not(.day-range-end))]:before:left-1/2 [&:has(.day-range-start:not(.day-range-end))]:before:-right-1.5',
    '[&:has(.day-range-end:not(.day-range-start))]:before:block [&:has(.day-range-end:not(.day-range-start))]:before:left-0 [&:has(.day-range-end:not(.day-range-start))]:before:right-1/2'
  ),
  day: cn(
    'flex size-8 shrink-0 items-center justify-center rounded-lg text-center text-label-xs text-text-sub-600 outline-none',
    'transition-[background-color,background-image,color,box-shadow,border-color,transform] duration-200 ease-out',
    '[&:not([aria-selected])]:hover:bg-bg-soft-200 dark:[&:not([aria-selected])]:hover:bg-bg-weak-50 [&:not([aria-selected])]:hover:text-text-strong-950',
    'aria-[selected]:bg-bg-strong-950 aria-[selected]:text-text-white-0',
    'aria-[selected]:bg-[image:linear-gradient(to_bottom,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_60%)] dark:aria-[selected]:bg-[image:linear-gradient(to_bottom,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0)_60%)]',
    'aria-[selected]:bg-clip-padding aria-[selected]:isolate',
    'aria-[selected]:border aria-[selected]:border-stroke-strong-950 aria-[selected]:rounded-xl',
    'aria-[selected]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] dark:aria-[selected]:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.18)]',
    'aria-[selected]:scale-105',
    'focus:outline-none focus-visible:bg-bg-weak-50 focus-visible:text-text-strong-950'
  )
};

export const SmallCalendar = ({ classNames, ...props }: CalendarProps) => (
  <Datepicker.Calendar {...props} classNames={{ ...SMALL_CLASSNAMES, ...classNames }} />
);
