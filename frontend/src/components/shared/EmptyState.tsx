import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
    </div>
    <p className="text-sm font-medium text-foreground mb-1">{title}</p>
    {description && (
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
