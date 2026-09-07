'use client';

import type { ElementType, ReactNode } from 'react';
import { Button, Skeleton } from '@dasuma/pradma-ui';
import { RiErrorWarningLine, RiInboxLine, RiSearchLine } from '@dasuma/pradma-ui/icons';
import { cn } from '@/utils/cn';

interface ListSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

// Skeleton de tabla: header + N filas. Reemplaza el "Cargando..." de texto
// plano (P5: Skeleton cuando el shell ya está montado y faltan datos).
export const ListSkeleton = ({ rows = 6, columns = 5, className }: ListSkeletonProps) => (
  <div
    role="status"
    aria-busy
    className={cn('ring-stroke-soft-200 overflow-hidden rounded-xl ring-1', className)}
  >
    <div className="bg-bg-weak-50 flex gap-4 px-4 py-3">
      {Array.from({ length: columns }, (_, i) => (
        <Skeleton.Root key={i} className="h-3 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }, (_, r) => (
      <div key={r} className="border-stroke-soft-200 flex gap-4 border-t px-4 py-3.5">
        {Array.from({ length: columns }, (_, c) => (
          <Skeleton.Root key={c} className={cn('h-3.5 flex-1', c === 0 && 'max-w-16')} />
        ))}
      </div>
    ))}
  </div>
);

type EmptyStateVariant = 'empty' | 'no-results' | 'error';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  icon?: ElementType;
  /** Acción principal (ej. "Crear contribuyente" o "Reintentar"). */
  action?: ReactNode;
  className?: string;
}

const ICONS: Record<EmptyStateVariant, ElementType> = {
  empty: RiInboxLine,
  'no-results': RiSearchLine,
  error: RiErrorWarningLine
};

export const EmptyState = ({
  variant = 'empty',
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) => {
  const Icon = icon ?? ICONS[variant];
  return (
    <div
      className={cn(
        'ring-stroke-soft-200 flex flex-col items-center gap-3 rounded-xl px-6 py-12 text-center ring-1',
        className
      )}
    >
      <span
        className={cn(
          'bg-bg-weak-50 flex size-11 items-center justify-center rounded-full',
          variant === 'error' ? 'text-error-base' : 'text-text-soft-400'
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-label-sm text-text-strong-950">{title}</p>
        {description ? (
          <p className="text-paragraph-sm text-text-sub-600 max-w-sm">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
};

interface RetryButtonProps {
  label: string;
  onClick: () => void;
}

// [R7] Reintentar acompaña a un estado de error → secondary basic.
export const RetryButton = ({ label, onClick }: RetryButtonProps) => (
  <Button.Root variant="basic" size="small" onClick={onClick}>
    {label}
  </Button.Root>
);
