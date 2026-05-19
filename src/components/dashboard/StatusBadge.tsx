import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  BOOKED: {
    label: 'Pago',
    className: 'bg-success/10 text-success border-success/20',
  },
  RESERVED: {
    label: 'Não Pago',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  CANCELED: {
    label: 'Cancelado',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  COMPLETED: {
    label: 'Concluído',
    className: 'bg-success/10 text-success border-success/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
