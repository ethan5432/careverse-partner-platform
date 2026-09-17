'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Loader2, AlertCircle, PencilLine } from 'lucide-react';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export function SaveStateBadge({ status, className }: { status: SaveStatus; className?: string }) {
  const config = {
    idle: { icon: null, label: '', className: '' },
    dirty: { icon: PencilLine, label: 'Unsaved changes', className: 'text-amber-600 bg-amber-50' },
    saving: { icon: Loader2, label: 'Saving...', className: 'text-blue-600 bg-blue-50' },
    saved: { icon: Check, label: 'Saved', className: 'text-cv-good bg-emerald-50' },
    error: { icon: AlertCircle, label: 'Error saving', className: 'text-cv-red bg-red-50' },
  }[status];

  if (status === 'idle') return null;

  const Icon = config.icon!;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold', config.className, className)}>
      <Icon className={cn('h-3.5 w-3.5', status === 'saving' && 'animate-spin')} />
      {config.label}
    </span>
  );
}

export function UnsavedChangesGuard({ isDirty, onSave, onDiscard }: { isDirty: boolean; onSave: () => void; onDiscard: () => void }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  React.useEffect(() => {
    const handler = (e: PopStateEvent) => {
      if (isDirty && !show) {
        setShow(true);
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isDirty, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="cv-card rounded-2xl bg-white p-6 max-w-sm w-full mx-4 space-y-4">
        <div>
          <h3 className="text-base font-bold text-cv-ink">Unsaved changes</h3>
          <p className="text-sm text-cv-muted mt-1">You have unsaved changes. Would you like to save them before leaving?</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => { setShow(false); onDiscard(); }} className="rounded-full border border-cv-line px-4 py-2 text-sm font-bold text-cv-body hover:bg-cv-soft transition-colors">Discard</button>
          <button onClick={() => { setShow(false); onSave(); }} className="rounded-full bg-cv-ink text-white px-4 py-2 text-sm font-bold hover:bg-cv-ink/90 transition-colors">Save changes</button>
        </div>
      </div>
    </div>
  );
}
