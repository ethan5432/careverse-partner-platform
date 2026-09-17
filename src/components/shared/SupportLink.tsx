'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LifeBuoy, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportLinkProps {
  variant?: 'inline' | 'card' | 'button';
  label?: string;
  context?: string;
  className?: string;
}

export function SupportLink({ variant = 'inline', label = 'Contact Careverse Support', context, className }: SupportLinkProps) {
  const router = useRouter();

  if (variant === 'card') {
    return (
      <div className={cn('rounded-xl border border-cv-line bg-cv-soft/50 p-4', className)}>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <LifeBuoy className="h-4 w-4 text-cv-ink" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-cv-ink">Need help?</p>
            <p className="text-xs text-cv-muted mt-0.5">
              {context || 'Our team is here to help with any questions about your store, payouts, or account.'}
            </p>
            <button
              onClick={() => router.push('/partner/messages')}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-cv-ink hover:text-cv-good transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {label}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={() => router.push('/partner/messages')}
        className={cn('inline-flex items-center gap-1.5 rounded-full border border-cv-line px-3 py-1.5 text-xs font-bold text-cv-body hover:bg-cv-soft transition-colors', className)}
      >
        <LifeBuoy className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={() => router.push('/partner/messages')}
      className={cn('inline-flex items-center gap-1.5 text-xs font-bold text-cv-muted hover:text-cv-ink transition-colors', className)}
    >
      <LifeBuoy className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
