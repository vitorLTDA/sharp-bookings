import { cn } from '@/lib/utils';
import { AppointmentStatus } from '@/lib/mockDashboardData';

interface StatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  paid: {
    label: 'Paid',
    className: 'bg-success/10 text-success border-success/20',
  },
  unpaid: {
    label: 'Unpaid',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  canceled: {
    label: 'Canceled',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
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
