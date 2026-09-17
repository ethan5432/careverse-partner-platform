'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FlaskConical, Store, Package, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { icon: Store, label: 'View your store', description: 'See what your customers see when they visit your storefront.' },
  { icon: Package, label: 'Pick a package', description: 'Choose a Careverse plan and review the details.' },
  { icon: CreditCard, label: 'Go through checkout', description: 'Walk through the mock checkout flow as a customer would.' },
  { icon: CheckCircle2, label: 'See the confirmation', description: 'Review the order confirmation page your customers receive.' },
];

export function TestStoreDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const handleStart = () => {
    onOpenChange(false);
    setStep(0);
    router.push('/storefront');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setStep(0); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft mb-2">
            <FlaskConical className="h-5 w-5 text-cv-ink" />
          </div>
          <DialogTitle className="text-lg font-bold text-cv-ink">Test your store</DialogTitle>
          <DialogDescription className="text-sm text-cv-muted">
            Walk through the complete customer journey: store, package, checkout, and confirmation. No real payment will be processed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-3 rounded-xl p-3 transition-colors',
                  i === step ? 'bg-cv-soft' : 'bg-transparent'
                )}
              >
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  i < step ? 'bg-emerald-50' : i === step ? 'bg-cv-ink text-white' : 'bg-cv-soft'
                )}>
                  {i < step ? <CheckCircle2 className="h-4 w-4 text-cv-good" /> : <Icon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-cv-ink">{s.label}</p>
                  <p className="text-xs text-cv-muted mt-0.5">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="cv-btn-primary rounded-full" onClick={handleStart}>
            Start test <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
