'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cv-soft mb-4">
        <Icon className="h-6 w-6 text-cv-muted" />
      </div>
      <p className="text-base font-bold text-cv-ink">{title}</p>
      {description && <p className="text-sm text-cv-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableContainer({ children, className }: DataTableProps) {
  return (
    <div className={cn('rounded-2xl border border-cv-line bg-white overflow-hidden', className)}>
      {children}
    </div>
  );
}
