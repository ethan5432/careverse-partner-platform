'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Zap, TrendingUp, Target, Calendar } from 'lucide-react';
import { mockProducts } from '@/data/mock';
import type { PartnerType } from '@/data/mock/types';
import {
  loadCampaigns, getCampaignsForPartner,
  type CommissionCampaign,
} from '@/lib/commission-campaigns';

const fmtPct = (n: number) => `${(n * 100).toFixed(0)}%`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function PartnerCampaignOffers({
  partnerId,
  partnerType,
  qualifyingMemberships,
}: {
  partnerId: string;
  partnerType: PartnerType;
  qualifyingMemberships: number;
}) {
  const campaigns = useMemo(() => loadCampaigns(), []);
  const applicable = useMemo(
    () => getCampaignsForPartner(campaigns, partnerId, partnerType),
    [campaigns, partnerId, partnerType],
  );

  if (applicable.length === 0) return null;

  return (
    <Card className="cv-card border-cv-ink/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-cv-ink" />
          <CardTitle className="text-sm font-bold text-cv-ink uppercase tracking-wider">
            {partnerType === 'CREATOR' ? 'Your Commission Offers' : 'Your Commercial Terms'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {applicable.map(c => {
          const product = c.productIds.length > 0 ? mockProducts.find(p => p.id === c.productIds[0]) : null;
          const isTiered = c.rule.structureType === 'TIERS';
          const currentTier = isTiered ? c.rule.tiers.find(t =>
            qualifyingMemberships >= t.minQualifying && (t.maxQualifying === null || qualifyingMemberships <= t.maxQualifying)
          ) : null;
          const nextTier = isTiered ? c.rule.tiers.find(t => t.minQualifying > qualifyingMemberships) : null;
          const progressPct = currentTier && nextTier
            ? ((qualifyingMemberships - currentTier.minQualifying) / (nextTier.minQualifying - currentTier.minQualifying)) * 100
            : 0;

          return (
            <div key={c.id} className="rounded-xl border border-cv-line p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-cv-ink">{product?.name || 'All Products'}</p>
                    {c.isSpecial && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-600">
                        <Zap className="h-2.5 w-2.5" /> Special
                      </span>
                    )}
                  </div>
                  {c.endDate && (
                    <p className="text-[10px] text-cv-muted flex items-center gap-1 mt-0.5">
                      <Calendar className="h-2.5 w-2.5" /> Ends {fmtDate(c.endDate)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cv-ink">
                    {c.rule.structureType === 'FIXED_AMOUNT'
                      ? `$${c.rule.fixedAmount}`
                      : fmtPct(currentTier?.rate ?? c.rule.defaultRate)}
                  </p>
                  <p className="text-[10px] text-cv-muted">{c.rule.basis.toLowerCase()}</p>
                </div>
              </div>

              {isTiered && currentTier && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cv-muted">Your progress</span>
                    <span className="font-bold text-cv-ink">{qualifyingMemberships} qualifying</span>
                  </div>
                  <Progress value={Math.min(progressPct, 100)} className="h-2" />
                  {nextTier && (
                    <p className="text-[10px] text-cv-muted">
                      Next tier: {nextTier.minQualifying} memberships → {fmtPct(nextTier.rate)}
                    </p>
                  )}
                  <p className="text-[10px] text-cv-muted bg-cv-soft rounded-lg p-2">
                    Volume is based on your overall qualifying membership purchases. Tier increases are prospective — previous purchases keep their original rate.
                  </p>
                </div>
              )}

              {c.rule.bonuses.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.rule.bonuses.map(b => (
                    <span key={b.id} className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-cv-good">
                      +${b.amount} after {b.threshold} qualifying
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
