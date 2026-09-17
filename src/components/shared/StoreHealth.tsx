'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';
import type { OnboardingProgress } from '@/data/mock/types';

interface HealthItem {
  key: keyof OnboardingProgress;
  label: string;
  href: string;
}

const healthItems: HealthItem[] = [
  { key: 'profileComplete', label: 'Complete your profile', href: '/partner/settings' },
  { key: 'storeCustomized', label: 'Customize your storefront', href: '/partner/store' },
  { key: 'packagesChosen', label: 'Choose your packages', href: '/partner/store' },
  { key: 'contentAdded', label: 'Add content to your store', href: '/partner/store' },
  { key: 'payoutsSetup', label: 'Set up payouts', href: '/partner/settings' },
  { key: 'storePublished', label: 'Publish your store', href: '/partner/store' },
  { key: 'storeShared', label: 'Share your store', href: '/partner/store' },
];

export function StoreHealth() {
  const router = useRouter();
  const { onboarding } = useMockAuth();

  const incomplete = healthItems.filter((item) => !onboarding[item.key]);
  const isReady = incomplete.length === 0;

  return (
    <Card className={cn('cv-card border', isReady ? 'border-emerald-200' : 'border-amber-200')}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          {isReady ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-cv-good" />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
          )}
          <div>
            <CardTitle className="text-sm font-bold text-cv-ink">Store Health</CardTitle>
            <p className={cn('text-xs font-bold', isReady ? 'text-cv-good' : 'text-amber-600')}>
              {isReady ? 'Ready — your store is good to go' : `Needs attention — ${incomplete.length} item${incomplete.length > 1 ? 's' : ''} remaining`}
            </p>
          </div>
        </div>
      </CardHeader>
      {incomplete.length > 0 && (
        <CardContent className="pt-0 space-y-1">
          {incomplete.map((item) => (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-cv-soft transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-sm text-cv-body">{item.label}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-cv-muted group-hover:text-cv-ink shrink-0 transition-colors" />
            </button>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
