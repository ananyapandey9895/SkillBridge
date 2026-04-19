import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingCardsProps {
  count?: number;
  className?: string;
}

export const LoadingCards: React.FC<LoadingCardsProps> = ({ count = 3, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-lg border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    ))}
  </div>
);

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => (
  <div className={cn('flex items-center justify-center py-20', className)}>
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
  </div>
);
