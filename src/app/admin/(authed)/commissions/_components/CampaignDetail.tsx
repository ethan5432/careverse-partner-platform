'use client';

import React, { useMemo, useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/shared/EmptyState';
import { Avatar } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';
import { FileText, History, TrendingUp, DollarSign, Users, Package, Calculator, BarChart3 } from 'lucide-react';
import { mockProducts, mockPartners } from '@/data/mock';
import type { PartnerType } from '@/data/mock/types';
import {
  calculateEconomics, getSimulatedPerformance,
  type CommissionCampaign, type CampaignStatus,
} from '@/lib/commission-campaigns';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (n: number) => `${(n * 100).toFixed(0)}%`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const statusColors: Record<CampaignStatus, string> = {
  DRAFT: 'bg-amber-50 text-amber-600', SCHEDULED: 'bg-blue-50 text-blue-600', ACTIVE: 'bg-emerald-50 text-cv-good',
  PAUSED: 'bg-cv-soft text-cv-muted', ENDED: 'bg-cv-soft text-cv-body', ARCHIVED: 'bg-cv-soft text-cv-muted',
};

export function CampaignDetail({
  campaign, partnerMap, productMap, onClose, onEdit,
}: {
  campaign: CommissionCampaign;
  partnerMap: Map<string, { name: string; avatarColor: string; type: PartnerType }>;
  productMap: Map<string, { name: string; price: number }>;
  onClose: () => void;
  onEdit: (c: CommissionCampaign) => void;
}) {
  const perf = useMemo(() => getSimulatedPerformance(campaign), [campaign]);
  const productNames = campaign.productScope === 'ALL' ? ['All products'] : campaign.productIds.map(id => productMap.get(id)?.name || '?');
  const partnerNames = campaign.partnerScope === 'ALL_TYPE'
    ? [`All ${campaign.partnerType === 'CREATOR' ? 'Creators' : campaign.partnerType === 'BUSINESS' ? 'Businesses' : 'Partners'}`]
    : campaign.partnerIds.map(id => partnerMap.get(id)?.name || '?');

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto cv-card border-cv-line rounded-2xl bg-white p-0">
        <DialogHeader className="p-6 pb-4 border-b border-cv-line sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div>
              <DialogTitle className="text-lg font-bold text-cv-ink">{campaign.name}</DialogTitle>
              <DialogDescription className="text-sm text-cv-muted">{campaign.internalDescription || 'No description'}</DialogDescription>
            </div>
            <span className={cn('ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold', statusColors[campaign.status])}>{campaign.status.charAt(0) + campaign.status.slice(1).toLowerCase()}</span>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Tabs defaultValue="overview">
            <TabsList className="bg-cv-soft h-auto p-1 flex flex-wrap gap-1">
              <TabsTrigger value="overview" className="text-xs"><BarChart3 className="h-3.5 w-3.5 mr-1" /> Overview</TabsTrigger>
              <TabsTrigger value="products" className="text-xs"><Package className="h-3.5 w-3.5 mr-1" /> Products</TabsTrigger>
              <TabsTrigger value="partners" className="text-xs"><Users className="h-3.5 w-3.5 mr-1" /> Partners</TabsTrigger>
              <TabsTrigger value="commission" className="text-xs"><DollarSign className="h-3.5 w-3.5 mr-1" /> Commission</TabsTrigger>
              <TabsTrigger value="tiers" className="text-xs"><TrendingUp className="h-3.5 w-3.5 mr-1" /> Tiers</TabsTrigger>
              <TabsTrigger value="economics" className="text-xs"><Calculator className="h-3.5 w-3.5 mr-1" /> Economics</TabsTrigger>
              <TabsTrigger value="performance" className="text-xs"><TrendingUp className="h-3.5 w-3.5 mr-1" /> Performance</TabsTrigger>
              <TabsTrigger value="history" className="text-xs"><History className="h-3.5 w-3.5 mr-1" /> History</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <DetailField label="Name" value={campaign.name} />
                <DetailField label="Status" value={campaign.status.charAt(0) + campaign.status.slice(1).toLowerCase()} />
                <DetailField label="Start date" value={fmtDate(campaign.startDate)} />
                <DetailField label="End date" value={campaign.endDate ? fmtDate(campaign.endDate) : 'No end date'} />
                <DetailField label="Commission basis" value={campaign.rule.basis.toLowerCase()} />
                <DetailField label="Default rate" value={fmtPct(campaign.rule.defaultRate)} />
              </div>
              {campaign.internalDescription && (
                <div className="rounded-xl bg-cv-soft p-3"><p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Internal Description</p><p className="text-sm text-cv-body">{campaign.internalDescription}</p></div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft text-xs" onClick={() => onEdit(campaign)}><FileText className="h-3.5 w-3.5" /> Edit campaign</Button>
              </div>
            </TabsContent>

            {/* Products */}
            <TabsContent value="products" className="mt-4">
              {campaign.productScope === 'ALL' ? (
                <div className="rounded-xl bg-cv-soft p-4"><p className="text-sm text-cv-body">This campaign applies to <strong>all Careverse catalog products</strong>.</p></div>
              ) : campaign.productIds.length === 0 ? (
                <EmptyState icon={Package} title="No assigned products" description="Add products from the Careverse catalog." />
              ) : (
                <div className="space-y-2">
                  {campaign.productIds.map(pid => {
                    const product = mockProducts.find(p => p.id === pid);
                    if (!product) return null;
                    return (
                      <div key={pid} className="flex items-center justify-between rounded-xl bg-cv-soft p-3">
                        <div><p className="text-sm font-bold text-cv-ink">{product.name}</p><p className="text-xs text-cv-muted">${product.price}/mo · {product.billingType.toLowerCase()}</p></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Partners */}
            <TabsContent value="partners" className="mt-4">
              {campaign.partnerScope === 'ALL_TYPE' ? (
                <div className="rounded-xl bg-cv-soft p-4"><p className="text-sm text-cv-body">This campaign applies to <strong>all {campaign.partnerType === 'CREATOR' ? 'Creators' : 'Businesses / Agencies'}</strong>.</p></div>
              ) : campaign.partnerIds.length === 0 ? (
                <EmptyState icon={Users} title="No assigned partners" description="Choose which partners receive these terms." />
              ) : (
                <div className="space-y-2">
                  {campaign.partnerIds.map(pid => {
                    const partner = mockPartners.find(p => p.id === pid);
                    if (!partner) return null;
                    const customRate = campaign.rule.customPartnerRates[pid];
                    return (
                      <div key={pid} className="flex items-center gap-3 rounded-xl bg-cv-soft p-3">
                        <Avatar name={partner.name} color={partner.avatarColor} size={32} />
                        <div className="flex-1"><p className="text-sm font-bold text-cv-ink">{partner.name}</p><p className="text-xs text-cv-muted">{partner.type === 'CREATOR' ? 'Creator' : 'Business / Agency'} · {partner.conversions} conversions</p></div>
                        {customRate !== undefined && <span className="text-xs font-bold text-cv-ink">{fmtPct(customRate)}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Commission */}
            <TabsContent value="commission" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <DetailField label="Structure type" value={campaign.rule.structureType.replace('_', ' ').toLowerCase()} />
                <DetailField label="Basis" value={campaign.rule.basis.toLowerCase()} />
                <DetailField label="Default rate" value={fmtPct(campaign.rule.defaultRate)} />
                {campaign.rule.fixedAmount !== null && <DetailField label="Fixed amount" value={fmtMoney2(campaign.rule.fixedAmount)} />}
              </div>
              {Object.keys(campaign.rule.customPartnerRates).length > 0 && (
                <div className="rounded-xl border border-cv-line p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Custom Partner Rates</p>
                  <div className="space-y-2">
                    {Object.entries(campaign.rule.customPartnerRates).map(([pid, rate]) => (
                      <div key={pid} className="flex items-center justify-between">
                        <span className="text-sm text-cv-body">{partnerMap.get(pid)?.name || pid}</span>
                        <span className="text-sm font-bold text-cv-ink">{fmtPct(rate)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {campaign.rule.bonuses.length > 0 && (
                <div className="rounded-xl border border-cv-line p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Bonuses</p>
                  {campaign.rule.bonuses.map(b => (
                    <div key={b.id} className="flex items-center justify-between">
                      <span className="text-sm text-cv-body">{b.description}</span>
                      <span className="text-sm font-bold text-cv-ink">+{fmtMoney2(b.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tiers */}
            <TabsContent value="tiers" className="mt-4">
              {campaign.rule.tiers.length === 0 ? (
                <EmptyState icon={TrendingUp} title="No volume tiers" description="This campaign uses a flat commission rate." />
              ) : (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {campaign.rule.tiers.map(t => (
                      <div key={t.id} className="rounded-xl border border-cv-line p-4 text-center">
                        <p className="text-xs font-bold uppercase text-cv-muted">{t.minQualifying}–{t.maxQualifying ?? '∞'}</p>
                        <p className="text-2xl font-bold text-cv-ink mt-1">{fmtPct(t.rate)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs text-amber-800"><strong>Prospective only:</strong> Previous qualifying purchases keep their original rate. Future purchases use the new tier rate.</p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Economics */}
            <TabsContent value="economics" className="mt-4">
              {campaign.economics.length === 0 ? (
                <EmptyState icon={Calculator} title="No economics configured" description="Add products to configure margin economics." />
              ) : (
                <div className="space-y-3">
                  {campaign.economics.map(econ => {
                    const product = mockProducts.find(p => p.id === econ.productId);
                    const calc = calculateEconomics(econ, campaign.rule.defaultRate);
                    return (
                      <Card key={econ.productId} className="border border-cv-line">
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-bold text-cv-ink">{product?.name || econ.productId}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <EconRow label="Customer price" value={fmtMoney2(econ.customerPrice)} />
                            <EconRow label="Net revenue" value={fmtMoney2(econ.netRevenue)} />
                            <EconRow label="Processing fee" value={fmtMoney2(econ.processingFee)} />
                            <EconRow label="Provider cost" value={fmtMoney2(econ.providerCost)} />
                            <EconRow label="Margin before commission" value={fmtMoney2(calc.contributionBeforeCommission)} />
                            <EconRow label="Partner commission" value={fmtMoney2(calc.partnerCommission)} />
                            <EconRow label="Careverse contribution" value={fmtMoney2(calc.careverseContribution)} highlight />
                            <EconRow label="Margin retained" value={fmtPct(calc.marginRetained)} />
                          </div>
                          {econ.minCareverseContribution !== null && (
                            <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 mt-2">
                              <p className="text-xs text-amber-800">Min Careverse contribution: <strong>{fmtMoney2(econ.minCareverseContribution)}</strong> · Max allowed rate: <strong>{calc.maxAllowedRate !== null ? fmtPct(calc.maxAllowedRate) : 'N/A'}</strong></p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <PerfStat label="Qualifying Memberships" value={String(perf.qualifyingMemberships)} />
                <PerfStat label="Revenue Generated" value={fmtMoney(perf.revenueGenerated)} />
                <PerfStat label="Partner Commissions" value={fmtMoney(perf.partnerCommissions)} />
                <PerfStat label="Margin Before" value={fmtMoney(perf.contributionBeforeCommission)} />
                <PerfStat label="Margin After" value={fmtMoney(perf.contributionAfterCommission)} />
                <PerfStat label="Avg Commission" value={fmtMoney2(perf.averageCommission)} />
              </div>
              {perf.topPartners.length > 0 && (
                <div className="rounded-xl border border-cv-line p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Top Participating Partners</p>
                  <Table>
                    <TableHeader><TableRow><TableHead className="text-xs">Partner</TableHead><TableHead className="text-xs text-right">Memberships</TableHead><TableHead className="text-xs text-right">Commission</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {perf.topPartners.map(tp => (
                        <TableRow key={tp.partnerId}>
                          <TableCell className="text-sm">{tp.partnerName}</TableCell>
                          <TableCell className="text-right text-sm">{tp.memberships}</TableCell>
                          <TableCell className="text-right text-sm font-bold">{fmtMoney2(tp.commission)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* History */}
            <TabsContent value="history" className="mt-4">
              <div className="space-y-2">
                {campaign.history.map(h => (
                  <div key={h.id} className="flex items-start gap-3 rounded-xl border border-cv-line p-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cv-soft shrink-0"><History className="h-3.5 w-3.5 text-cv-muted" /></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-cv-ink">{h.action}</p>
                        <span className="text-xs text-cv-muted">{fmtDate(h.timestamp)}</span>
                      </div>
                      <p className="text-xs text-cv-body">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {campaign.versions.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Campaign Versions</p>
                  <Table>
                    <TableHeader><TableRow><TableHead className="text-xs">Version</TableHead><TableHead className="text-xs">Effective</TableHead><TableHead className="text-xs">Rate</TableHead><TableHead className="text-xs">Changes</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {campaign.versions.map(v => (
                        <TableRow key={v.version}>
                          <TableCell className="text-sm font-bold">v{v.version}</TableCell>
                          <TableCell className="text-xs text-cv-muted">{fmtDate(v.effectiveFrom)}{v.effectiveTo ? ` → ${fmtDate(v.effectiveTo)}` : ' → present'}</TableCell>
                          <TableCell className="text-sm font-bold">{fmtPct(v.rule.defaultRate)}</TableCell>
                          <TableCell className="text-xs text-cv-body">{v.changeDescription}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (<div className="rounded-xl bg-cv-soft p-3"><p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">{label}</p><p className="text-sm font-bold text-cv-ink">{value}</p></div>);
}
function EconRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (<div className="flex justify-between rounded-lg bg-cv-soft px-3 py-1.5"><span className="text-cv-muted">{label}</span><span className={cn('font-bold', highlight ? 'text-cv-good' : 'text-cv-ink')}>{value}</span></div>);
}
function PerfStat({ label, value }: { label: string; value: string }) {
  return (<div className="rounded-xl bg-cv-soft p-3"><p className="text-xs font-bold uppercase tracking-wider text-cv-muted">{label}</p><p className="text-lg font-bold text-cv-ink mt-1">{value}</p></div>);
}
