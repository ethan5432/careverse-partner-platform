'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type StatusVariant = 'pending' | 'approved' | 'paid' | 'reversed' | 'active' | 'suspended' | 'incomplete' | 'live' | 'draft' | 'processing' | 'failed' | 'available' | 'connected' | 'none';

const statusConfig: Record<StatusVariant, { label: string; className: string; dot: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  approved: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  paid: { label: 'Paid', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  reversed: { label: 'Reversed', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  active: { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  suspended: { label: 'Suspended', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  incomplete: { label: 'Incomplete', className: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  live: { label: 'Live', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  processing: { label: 'Processing', className: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  failed: { label: 'Failed', className: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  available: { label: 'Available', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  connected: { label: 'Connected', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  none: { label: 'None', className: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
};

export function StatusBadge({ status, label, className }: { status: StatusVariant; label?: string; className?: string }) {
  const config = statusConfig[status] || statusConfig.draft;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
      config.className,
      className
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {label || config.label}
    </span>
  );
}

export function Avatar({ name, color, size = 36 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color || '#18191D',
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}
