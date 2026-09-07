'use client';

import { Skeleton } from '@dasuma/pradma-ui';
import { cn } from '@/utils/cn';
import { useGetEstablishment } from '../../data';

interface EstablishmentNameProps {
  establishmentId: number;
  className?: string;
}

// Mismo patrón que ClientName: la búsqueda de liquidaciones trae solo el id.
export const EstablishmentName = ({ establishmentId, className }: EstablishmentNameProps) => {
  const { data: establishment, isLoading, isError } = useGetEstablishment(establishmentId);

  if (isLoading) return <Skeleton.Root className="h-3.5 w-36" />;

  if (isError || !establishment) {
    return (
      <span className={cn('text-text-soft-400 tabular-nums', className)}>{establishmentId}</span>
    );
  }

  return (
    <span className={cn('flex min-w-0 flex-col', className)}>
      <span className="text-text-strong-950 truncate">{establishment.name}</span>
      <span className="text-text-soft-400 text-paragraph-xs tabular-nums">{establishment.id}</span>
    </span>
  );
};
