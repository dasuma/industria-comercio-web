'use client';

import { Skeleton } from '@dasuma/pradma-ui';
import { cn } from '@/utils/cn';
import { useGetClient } from '../../data';

interface ClientNameProps {
  clientId: number;
  className?: string;
}

// Resuelve el nombre del contribuyente a partir del id. La búsqueda de
// establecimientos no trae el join, así que cada fila pide su cliente; React
// Query cachea por id, por lo que las filas repetidas no generan requests.
export const ClientName = ({ clientId, className }: ClientNameProps) => {
  const { data: client, isLoading, isError } = useGetClient(clientId);

  if (isLoading) return <Skeleton.Root className="h-3.5 w-32" />;

  if (isError || !client) {
    return <span className={cn('text-text-soft-400 tabular-nums', className)}>{clientId}</span>;
  }

  return (
    <span className={cn('flex min-w-0 flex-col', className)}>
      <span className="text-text-strong-950 truncate">{client.name}</span>
      <span className="text-text-soft-400 text-paragraph-xs tabular-nums">{client.id}</span>
    </span>
  );
};
