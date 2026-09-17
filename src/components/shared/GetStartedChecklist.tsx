'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  User, Store, Package, Video, Wallet, Rocket, Share2,
  CheckCircle2, Circle, ArrowRight, type LucideIcon,
} from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import type { OnboardingProgress } from '@/data/mock/types';

interface ChecklistItem {
  key: keyof OnboardingProgress;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const checklistItems: ChecklistItem[] = [
  { key: 'profileComplete', label: 'Complete your profile', description: 'Add your name, bio, and photo', icon: User, href: '/partner/settings' },
  { key: 'storeCustomized', label: 'Customize your store', description: 'Set your storefront name and branding', icon: Store, href: '/partner/store' },
  { key: 'packagesChosen', label: 'Choose your packages', description: 'Select which Careverse plans to feature', icon: Package, href: '/partner/store' },
  { key: 'contentAdded', label: 'Add your content', description: 'Add videos or content blocks to your store', icon: Video, href: '/partner/store' },
  { key: 'payoutsSetup', label: 'Set up payouts', description: 'Configure how you receive commission payouts', icon: Wallet, href: '/partner/settings' },
  { key: 'storePublished', label: 'Publish your store', description: 'Make your storefront live and public', icon: Rocket, href: '/partner/store' },
  { key: 'storeShared', label: 'Share your store', description: 'Share your storefront link with your audience', icon: Share2, href: '/partner/store' },
];

export function GetStartedChecklist() {
  const router = useRouter();
  const { onboarding, updateOnboarding, isOnboardingComplete } = useMockAuth();

  const completedCount = Object.values(onboarding).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className="cv-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-cv-ink">Get started</CardTitle>
            <p className="text-xs text-cv-muted mt-0.5">
              Complete these steps to launch your store and start earning
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-cv-ink">{progressPct}%</p>
            <p className="text-[10px] font-bold uppercase text-cv-muted">{completedCount}/{totalCount} done</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-cv-soft overflow-hidden">
          <div
            className="h-full bg-cv-good rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-1">
          {checklistItems.map((item) => {
            const isDone = onboarding[item.key];
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <button
                  onClick={() => router.push(item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all group',
                    isDone ? 'bg-emerald-50/50' : 'hover:bg-cv-soft'
                  )}
                >
                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-cv-good" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-soft group-hover:bg-white transition-colors">
                        <Icon className="h-4 w-4 text-cv-ink" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-bold transition-colors',
                      isDone ? 'text-cv-muted line-through' : 'text-cv-ink'
                    )}>
                      {item.label}
                    </p>
                    {!isDone && (
                      <p className="text-xs text-cv-muted mt-0.5">{item.description}</p>
                    )}
                  </div>
                  {!isDone && (
                    <ArrowRight className="h-4 w-4 text-cv-muted group-hover:text-cv-ink shrink-0 transition-colors" />
                  )}
                  {isDone && !onboarding[item.key] === false && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateOnboarding({ [item.key]: false });
                      }}
                      className="text-[10px] font-bold text-cv-muted hover:text-cv-ink shrink-0"
                    >
                      Undo
                    </button>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {isOnboardingComplete() && (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cv-good" />
            <p className="text-sm font-bold text-cv-good">All set! Your store is ready to go.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
