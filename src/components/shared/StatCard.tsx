'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendUp = true, description, className }: StatCardProps) {
  return (
    <Card className={cn('cv-card border-cv-line', className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">{label}</span>
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-soft">
              <Icon className="h-4 w-4 text-cv-ink" />
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-cv-ink">{value}</div>
        <div className="mt-1.5 flex items-center gap-2">
          {trend && (
            <span className={cn(
              'inline-flex items-center gap-1 text-xs font-bold',
              trendUp ? 'text-cv-good' : 'text-cv-red'
            )}>
              {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend}
            </span>
          )}
          {description && <span className="text-xs text-cv-muted">{description}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
