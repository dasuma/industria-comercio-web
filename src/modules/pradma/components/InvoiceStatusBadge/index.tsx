import { StatusBadge } from '@dasuma/pradma-ui';

type BadgeStatus = 'completed' | 'pending' | 'failed' | 'disabled';

// Mapa único estado de liquidación → semántica del StatusBadge del DS. Antes
// había tres copias de STATUS_STYLES con colores a mano.
const STATUS_MAP: Record<string, BadgeStatus> = {
  paid: 'completed',
  pending: 'pending',
  created: 'pending',
  overdue: 'failed',
  expired: 'failed',
  draft: 'disabled'
};

interface InvoiceStatusBadgeProps {
  status: string;
  /** Texto ya traducido (dict.invoices.status[status]). */
  label: string;
  className?: string;
}

export const InvoiceStatusBadge = ({ status, label, className }: InvoiceStatusBadgeProps) => {
  const mapped = STATUS_MAP[status] ?? 'pending';
  return (
    <StatusBadge.Root status={mapped} className={className}>
      <StatusBadge.Dot status={mapped} />
      {label}
    </StatusBadge.Root>
  );
};
