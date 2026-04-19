import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RequestStatus, SessionStatus } from '@/types';

type AnyStatus = RequestStatus | SessionStatus;

const statusConfig: Record<AnyStatus, { label: string; className: string }> = {
  [RequestStatus.PENDING]: {
    label: 'Pending',
    className: 'border-border text-muted-foreground bg-background',
  },
  [RequestStatus.ACCEPTED]: {
    label: 'Accepted',
    className: 'border-foreground bg-foreground text-background',
  },
  [RequestStatus.REJECTED]: {
    label: 'Rejected',
    className: 'border-border text-muted-foreground bg-muted line-through',
  },
  [SessionStatus.SCHEDULED]: {
    label: 'Scheduled',
    className: 'border-border text-muted-foreground bg-background',
  },
  [SessionStatus.ACTIVE]: {
    label: 'Active',
    className: 'border-foreground bg-foreground text-background',
  },
  [SessionStatus.COMPLETED]: {
    label: 'Completed',
    className: 'border-border text-secondary-foreground bg-secondary',
  },
  [SessionStatus.CANCELLED]: {
    label: 'Cancelled',
    className: 'border-border text-muted-foreground bg-muted line-through',
  },
};

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={cn('section-label font-medium tracking-wide px-2 py-0.5', config.className, className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
