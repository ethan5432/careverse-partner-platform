'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6', className)}>
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">{eyebrow}</span>
          </div>
        )}
        <h1 className="text-2xl font-bold text-cv-ink tracking-tight">{title}</h1>
        {description && <p className="text-cv-muted text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
