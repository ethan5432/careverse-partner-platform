'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  DollarSign, TrendingUp, Wallet, Search, Eye, Plus, Copy, Pause, Play, Archive,
  RotateCcw, Target, Users, Layers, BarChart3, Calculator, ArrowRight, ChevronRight,
  Gift, Zap, FileText, History, AlertCircle, CheckCircle2, Info,
} from 'lucide-react';
import { mockCommissions, mockPartners, mockProducts, mockStorefronts, getPartnerIdByEmail } from '@/data/mock';
import type { CommissionStatus, MockCommission, PartnerType } from '@/data/mock/types';
import {
  loadCampaigns, saveCampaigns, createCampaign, duplicateCampaign, addCampaignVersion,
  getDefaultEconomics, calculateEconomics, resolveEffectiveCommission, getSimulatedPerformance,
  getCampaignsForPartner,
  type CommissionCampaign, type CampaignStatus, type CommissionBasis, type CommissionStructureType,
  type ProductScope, type PartnerScope, type VolumeTier, type CommissionRule, type ProductEconomics,
} from '@/lib/commission-campaigns';
import { CampaignEditor } from './_components/CampaignEditor';
import { CampaignDetail } from './_components/CampaignDetail';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (n: number) => `${(n * 100).toFixed(0)}%`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type AdminTab = 'overview' | 'campaigns' | 'rules' | 'partners' | 'tiers' | 'earnings';

const statusColors: Record<CampaignStatus, string> = {
  DRAFT: 'bg-amber-50 text-amber-600',
  SCHEDULED: 'bg-blue-50 text-blue-600',
  ACTIVE: 'bg-emerald-50 text-cv-good',
  PAUSED: 'bg-cv-soft text-cv-muted',
  ENDED: 'bg-cv-soft text-cv-body',
  ARCHIVED: 'bg-cv-soft text-cv-muted',
};

function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const cls = statusColors[status];
  const labels: Record<CampaignStatus, string> = {
    DRAFT: 'Draft', SCHEDULED: 'Scheduled', ACTIVE: 'Active', PAUSED: 'Paused', ENDED: 'Ended', ARCHIVED: 'Archived',
  };
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold', cls)}>{labels[status]}</span>;
}

export default function AdminCommissionsPage() {
  const [campaigns, setCampaigns] = useState<CommissionCampaign[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loaded, setLoaded] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CommissionCampaign | null>(null);
  const [detailCampaign, setDetailCampaign] = useState<CommissionCampaign | null>(null);

  useEffect(() => {
    setCampaigns(loadCampaigns());
    setLoaded(true);
  }, []);

  const persistCampaigns = useCallback((updated: CommissionCampaign[]) => {
    setCampaigns(updated);
    saveCampaigns(updated);
  }, []);

  const handleSaveCampaign = (campaign: CommissionCampaign, isNew: boolean) => {
    if (isNew) {
      persistCampaigns([...campaigns, campaign]);
    } else {
      persistCampaigns(campaigns.map(c => c.id === campaign.id ? campaign : c));
    }
    setEditorOpen(false);
    setEditingCampaign(null);
  };

  const handleDuplicate = (campaign: CommissionCampaign) => {
    persistCampaigns([...campaigns, duplicateCampaign(campaign)]);
  };

  const handleStatusChange = (id: string, status: CampaignStatus) => {
    const now = new Date().toISOString();
    persistCampaigns(campaigns.map(c =>
      c.id === id
        ? {
            ...c,
            status,
            history: [...c.history, { id: `h-${Date.now()}`, timestamp: now, action: status, description: `Status changed to ${status}`, actor: 'Admin' }],
            updatedAt: now,
          }
        : c
    ));
  };

  const partnerMap = useMemo(() => {
    const m = new Map<string, { name: string; avatarColor: string; type: PartnerType }>();
    mockPartners.forEach(p => m.set(p.id, { name: p.name, avatarColor: p.avatarColor, type: p.type }));
    return m;
  }, []);

  const productMap = useMemo(() => {
    const m = new Map<string, { name: string; price: number }>();
    mockProducts.forEach(p => m.set(p.id, { name: p.name, price: p.price }));
    return m;
  }, []);

  // ─── Overview metrics ──────────────────────────────────────────────────────

  const overviewStats = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
    const partnersWithCustomTerms = new Set<string>();
    campaigns.forEach(c => {
      if (c.partnerScope === 'SELECTED') c.partnerIds.forEach(id => partnersWithCustomTerms.add(id));
      Object.keys(c.rule.customPartnerRates).forEach(id => partnersWithCustomTerms.add(id));
    });
    const pending = mockCommissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commission, 0);
    const approved = mockCommissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commission, 0);
    const avgRate = campaigns.length > 0
      ? campaigns.filter(c => c.status === 'ACTIVE').reduce((s, c) => s + c.rule.defaultRate, 0) / Math.max(campaigns.filter(c => c.status === 'ACTIVE').length, 1)
      : 0.20;
    const totalRevenue = mockCommissions.reduce((s, c) => s + c.saleAmount, 0);
    const totalCommission = mockCommissions.reduce((s, c) => s + c.commission, 0);
    const contributionMargin = totalRevenue * 0.5;
    const marginAfterCommission = contributionMargin - totalCommission;
    return {
      activeCampaigns,
      partnersWithCustomTerms: partnersWithCustomTerms.size,
      pending,
      approved,
      commissionLiability: pending + approved,
      avgRate,
      contributionMarginAfterCommission: marginAfterCommission,
    };
  }, [campaigns]);

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commissions"
        title="Campaign & Commission Management"
        description="Create commission campaigns, assign products and partners, manage volume tiers, and understand margin economics."
        actions={
          <Button
            className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold"
            onClick={() => { setEditingCampaign(null); setEditorOpen(true); }}
          >
            <Plus className="h-4 w-4" /> Create campaign
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview" className="gap-1.5 text-xs"><BarChart3 className="h-3.5 w-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-1.5 text-xs"><Target className="h-3.5 w-3.5" /> Campaigns</TabsTrigger>
          <TabsTrigger value="rules" className="gap-1.5 text-xs"><Layers className="h-3.5 w-3.5" /> Commission Rules</TabsTrigger>
          <TabsTrigger value="partners" className="gap-1.5 text-xs"><Users className="h-3.5 w-3.5" /> Partners</TabsTrigger>
          <TabsTrigger value="tiers" className="gap-1.5 text-xs"><TrendingUp className="h-3.5 w-3.5" /> Tiers</TabsTrigger>
          <TabsTrigger value="earnings" className="gap-1.5 text-xs"><Wallet className="h-3.5 w-3.5" /> Earnings</TabsTrigger>
        </TabsList>

        {/* ─── Overview Tab ─── */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Active Campaigns" value={overviewStats.activeCampaigns} icon={Target} description="Currently running" />
            <StatCard label="Partners with Custom Terms" value={overviewStats.partnersWithCustomTerms} icon={Users} description="Non-standard rates" />
            <StatCard label="Commission Liability" value={fmtMoney(overviewStats.commissionLiability)} icon={Wallet} description="Pending + approved" />
            <StatCard label="Pending Commissions" value={fmtMoney(overviewStats.pending)} icon={TrendingUp} description="Awaiting approval" />
            <StatCard label="Approved Commissions" value={fmtMoney(overviewStats.approved)} icon={CheckCircle2} description="Ready for payout" />
            <StatCard label="Avg Commission Rate" value={fmtPct(overviewStats.avgRate)} icon={Calculator} description="Across active campaigns" />
          </div>

          <Card className="cv-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-cv-muted" />
                <p className="text-sm font-bold text-cv-ink">Contribution Margin After Commission</p>
              </div>
              <p className="text-2xl font-bold text-cv-ink">{fmtMoney(overviewStats.contributionMarginAfterCommission)}</p>
              <p className="text-xs text-cv-muted mt-1">Estimated margin retained after all partner commissions are paid</p>
            </CardContent>
          </Card>

          <Card className="cv-card">
            <CardContent className="p-5">
              <p className="text-sm font-bold text-cv-ink mb-3">Commission Precedence</p>
              <div className="space-y-2">
                {[
                  { n: 1, label: 'Partner-specific campaign', desc: 'Custom negotiated terms for an individual partner' },
                  { n: 2, label: 'Partner + product campaign', desc: 'Custom rate for a specific partner on a specific product' },
                  { n: 3, label: 'Active product promotion', desc: 'Product-specific commission for all partners of a type' },
                  { n: 4, label: 'Partner volume tier', desc: 'Tiered rate based on qualifying membership volume' },
                  { n: 5, label: 'Partner-type campaign', desc: 'Default rate for all creators or all businesses' },
                  { n: 6, label: 'Global default', desc: 'Fallback 20% of revenue if no campaign matches' },
                ].map(r => (
                  <div key={r.n} className="flex items-start gap-3 rounded-lg bg-cv-soft p-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cv-ink text-white text-xs font-bold shrink-0">{r.n}</span>
                    <div>
                      <p className="text-sm font-bold text-cv-ink">{r.label}</p>
                      <p className="text-xs text-cv-muted">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Campaigns Tab ─── */}
        <TabsContent value="campaigns" className="mt-6 space-y-4">
          {campaigns.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No commission campaigns yet."
              description="Create a campaign to define custom partner economics."
            />
          ) : (
            <CampaignList
              campaigns={campaigns}
              partnerMap={partnerMap}
              productMap={productMap}
              onView={setDetailCampaign}
              onEdit={(c) => { setEditingCampaign(c); setEditorOpen(true); }}
              onDuplicate={handleDuplicate}
              onStatusChange={handleStatusChange}
            />
          )}
        </TabsContent>

        {/* ─── Rules Tab ─── */}
        <TabsContent value="rules" className="mt-6 space-y-4">
          <RulesTab campaigns={campaigns} productMap={productMap} partnerMap={partnerMap} />
        </TabsContent>

        {/* ─── Partners Tab ─── */}
        <TabsContent value="partners" className="mt-6 space-y-4">
          <PartnersTab campaigns={campaigns} partnerMap={partnerMap} />
        </TabsContent>

        {/* ─── Tiers Tab ─── */}
        <TabsContent value="tiers" className="mt-6 space-y-4">
          <TiersTab campaigns={campaigns} partnerMap={partnerMap} />
        </TabsContent>

        {/* ─── Earnings Tab ─── */}
        <TabsContent value="earnings" className="mt-6 space-y-4">
          <EarningsTab campaigns={campaigns} partnerMap={partnerMap} />
        </TabsContent>
      </Tabs>

      {/* Campaign Editor */}
      {editorOpen && (
        <CampaignEditor
          campaign={editingCampaign}
          onSave={handleSaveCampaign}
          onClose={() => { setEditorOpen(false); setEditingCampaign(null); }}
        />
      )}

      {/* Campaign Detail */}
      {detailCampaign && (
        <CampaignDetail
          campaign={detailCampaign}
          partnerMap={partnerMap}
          productMap={productMap}
          onClose={() => setDetailCampaign(null)}
          onEdit={(c) => { setDetailCampaign(null); setEditingCampaign(c); setEditorOpen(true); }}
        />
      )}
    </div>
  );
}

// ─── Campaign List ───────────────────────────────────────────────────────────

function CampaignList({
  campaigns, partnerMap, productMap, onView, onEdit, onDuplicate, onStatusChange,
}: {
  campaigns: CommissionCampaign[];
  partnerMap: Map<string, { name: string; avatarColor: string; type: PartnerType }>;
  productMap: Map<string, { name: string; price: number }>;
  onView: (c: CommissionCampaign) => void;
  onEdit: (c: CommissionCampaign) => void;
  onDuplicate: (c: CommissionCampaign) => void;
  onStatusChange: (id: string, status: CampaignStatus) => void;
}) {
  return (
    <Card className="cv-card overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-cv-line hover:bg-transparent">
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Campaign</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Products</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Partners</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Structure</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Dates</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map(c => {
                const productNames = c.productScope === 'ALL' ? ['All products'] : c.productIds.map(id => productMap.get(id)?.name || '?');
                const partnerNames = c.partnerScope === 'ALL_TYPE'
                  ? [`All ${c.partnerType === 'CREATOR' ? 'Creators' : c.partnerType === 'BUSINESS' ? 'Businesses' : 'Partners'}`]
                  : c.partnerIds.map(id => partnerMap.get(id)?.name || '?');
                const structureLabel = c.rule.structureType === 'FLAT' ? `${fmtPct(c.rule.defaultRate)} flat`
                  : c.rule.structureType === 'TIERS' ? `${c.rule.tiers.length} tiers`
                  : c.rule.structureType === 'CUSTOM_PARTNER' ? 'Custom partner'
                  : c.rule.fixedAmount ? `$${c.rule.fixedAmount} fixed` : 'Custom';
                return (
                  <TableRow key={c.id} className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors" onClick={() => onView(c)}>
                    <TableCell>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-cv-ink truncate">{c.name}</p>
                          {c.isSpecial && <Badge variant="secondary" className="text-[9px] py-0 px-1.5"><Zap className="h-2.5 w-2.5 mr-0.5" />Special</Badge>}
                        </div>
                        <p className="text-xs text-cv-muted truncate">{c.internalDescription || 'No description'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {productNames.slice(0, 2).map((n, i) => (
                          <span key={i} className="rounded bg-cv-soft px-1.5 py-0.5 text-[10px] font-bold text-cv-body">{n}</span>
                        ))}
                        {productNames.length > 2 && <span className="text-[10px] text-cv-muted">+{productNames.length - 2}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {partnerNames.slice(0, 2).map((n, i) => (
                          <span key={i} className="text-xs text-cv-body">{n}</span>
                        ))}
                        {partnerNames.length > 2 && <span className="text-[10px] text-cv-muted">+{partnerNames.length - 2}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-cv-ink">{structureLabel}</span>
                      <span className="text-[10px] text-cv-muted block">{c.rule.basis.toLowerCase()}-based</span>
                    </TableCell>
                    <TableCell><CampaignStatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-xs text-cv-muted">
                      <p>{fmtDate(c.startDate)}</p>
                      {c.endDate && <p>→ {fmtDate(c.endDate)}</p>}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onView(c)} className="rounded-lg p-1.5 hover:bg-cv-soft" title="View"><Eye className="h-3.5 w-3.5 text-cv-body" /></button>
                        <button onClick={() => onEdit(c)} className="rounded-lg p-1.5 hover:bg-cv-soft" title="Edit"><FileText className="h-3.5 w-3.5 text-cv-body" /></button>
                        <button onClick={() => onDuplicate(c)} className="rounded-lg p-1.5 hover:bg-cv-soft" title="Duplicate"><Copy className="h-3.5 w-3.5 text-cv-body" /></button>
                        {c.status === 'ACTIVE' && (
                          <button onClick={() => onStatusChange(c.id, 'PAUSED')} className="rounded-lg p-1.5 hover:bg-cv-soft" title="Pause"><Pause className="h-3.5 w-3.5 text-cv-body" /></button>
                        )}
                        {c.status === 'PAUSED' && (
                          <button onClick={() => onStatusChange(c.id, 'ACTIVE')} className="rounded-lg p-1.5 hover:bg-cv-soft" title="Resume"><Play className="h-3.5 w-3.5 text-cv-good" /></button>
                        )}
                        {(c.status === 'ACTIVE' || c.status === 'PAUSED') && (
                          <button onClick={() => onStatusChange(c.id, 'ENDED')} className="rounded-lg p-1.5 hover:bg-cv-soft" title="End"><Archive className="h-3.5 w-3.5 text-cv-muted" /></button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Rules Tab ───────────────────────────────────────────────────────────────

function RulesTab({
  campaigns, productMap, partnerMap,
}: {
  campaigns: CommissionCampaign[];
  productMap: Map<string, { name: string; price: number }>;
  partnerMap: Map<string, { name: string; avatarColor: string; type: PartnerType }>;
}) {
  const [selectedPartner, setSelectedPartner] = useState(mockPartners[0]?.id || '');
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]?.id || '');
  const [qualifying, setQualifying] = useState(15);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const effective = useMemo(() => {
    const partner = mockPartners.find(p => p.id === selectedPartner);
    if (!partner) return null;
    return resolveEffectiveCommission(campaigns, selectedPartner, partner.type, selectedProduct, qualifying, date);
  }, [campaigns, selectedPartner, selectedProduct, qualifying, date]);

  const product = mockProducts.find(p => p.id === selectedProduct);

  return (
    <div className="space-y-4">
      <Card className="cv-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-4 w-4 text-cv-muted" />
            <p className="text-sm font-bold text-cv-ink">Effective Commission Lookup</p>
          </div>
          <p className="text-xs text-cv-muted mb-4">Select a partner, product, and date to see exactly which commission rule applies and why.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-xs font-bold uppercase text-cv-muted mb-1">Partner</Label>
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger className="cv-input h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockPartners.filter(p => p.status === 'ACTIVE').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-cv-muted mb-1">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="cv-input h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {mockProducts.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-cv-muted mb-1">Qualifying Memberships</Label>
              <Input type="number" value={qualifying} onChange={e => setQualifying(parseInt(e.target.value) || 0)} className="cv-input h-10" />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-cv-muted mb-1">Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="cv-input h-10" />
            </div>
          </div>

          {effective && (
            <div className="mt-5 rounded-xl border border-cv-line p-4 bg-cv-soft/50">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="h-4 w-4 text-cv-ink" />
                <p className="text-sm font-bold text-cv-ink">Effective Commission</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <RuleField label="Campaign" value={effective.campaignName} />
                <RuleField label="Commission Basis" value={effective.basis.toLowerCase()} />
                <RuleField label="Commission Rate" value={fmtPct(effective.rate)} />
                <RuleField label="Tier" value={effective.tier || 'None'} />
                <RuleField label="Product" value={product?.name || selectedProduct} />
                {effective.campaign && (
                  <RuleField label="Partner Scope" value={
                    effective.campaign.partnerScope === 'ALL_TYPE'
                      ? `All ${effective.campaign.partnerType?.toLowerCase() || 'partners'}`
                      : `${effective.campaign.partnerIds.length} selected`
                  } />
                )}
              </div>
              <div className="mt-3 rounded-lg bg-white p-3 border border-cv-line">
                <p className="text-xs font-bold text-cv-ink">Why this rule applies</p>
                <p className="text-xs text-cv-body mt-1">{effective.reason}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="cv-card">
        <CardContent className="p-5">
          <p className="text-sm font-bold text-cv-ink mb-3">All Commission Rules</p>
          <div className="space-y-3">
            {campaigns.filter(c => c.status === 'ACTIVE').map(c => (
              <div key={c.id} className="rounded-xl border border-cv-line p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-cv-ink">{c.name}</p>
                  <CampaignStatusBadge status={c.status} />
                </div>
                <div className="grid gap-2 sm:grid-cols-3 text-xs">
                  <div><span className="text-cv-muted">Basis:</span> <span className="font-bold text-cv-body">{c.rule.basis.toLowerCase()}</span></div>
                  <div><span className="text-cv-muted">Structure:</span> <span className="font-bold text-cv-body">{c.rule.structureType.replace('_', ' ').toLowerCase()}</span></div>
                  <div><span className="text-cv-muted">Default rate:</span> <span className="font-bold text-cv-body">{fmtPct(c.rule.defaultRate)}</span></div>
                </div>
                {c.rule.tiers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.rule.tiers.map(t => (
                      <span key={t.id} className="rounded bg-cv-soft px-2 py-0.5 text-[10px] font-bold text-cv-body">
                        {t.minQualifying}-{t.maxQualifying ?? '∞'}: {fmtPct(t.rate)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RuleField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3 border border-cv-line">
      <p className="text-[10px] font-bold uppercase tracking-wider text-cv-muted">{label}</p>
      <p className="text-sm font-bold text-cv-ink mt-0.5">{value}</p>
    </div>
  );
}

// ─── Partners Tab ────────────────────────────────────────────────────────────

function PartnersTab({
  campaigns, partnerMap,
}: {
  campaigns: CommissionCampaign[];
  partnerMap: Map<string, { name: string; avatarColor: string; type: PartnerType }>;
}) {
  const partnerCampaigns = useMemo(() => {
    return mockPartners.map(partner => {
      const applicable = getCampaignsForPartner(campaigns, partner.id, partner.type);
      const customRate = campaigns.find(c => c.rule.customPartnerRates[partner.id])?.rule.customPartnerRates[partner.id];
      return { partner, campaigns: applicable, customRate };
    });
  }, [campaigns]);

  return (
    <Card className="cv-card overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-cv-line hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Standard Rate</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Custom Rate</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Applicable Campaigns</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Qualifying Memberships</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnerCampaigns.map(({ partner, campaigns: applicable, customRate }) => (
              <TableRow key={partner.id} className="border-cv-line">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar name={partner.name} color={partner.avatarColor} size={28} />
                    <span className="text-sm font-bold text-cv-ink">{partner.name}</span>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs text-cv-body">{partner.type === 'CREATOR' ? 'Creator' : 'Business'}</span></TableCell>
                <TableCell><span className="text-xs font-bold text-cv-body">{fmtPct(0.20)}</span></TableCell>
                <TableCell>
                  {customRate ? <span className="text-xs font-bold text-cv-ink">{fmtPct(customRate)}</span> : <span className="text-xs text-cv-muted">—</span>}
                </TableCell>
                <TableCell>
                  {applicable.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {applicable.map(c => (
                        <span key={c.id} className="rounded bg-cv-soft px-1.5 py-0.5 text-[10px] font-bold text-cv-body">{c.name}</span>
                      ))}
                    </div>
                  ) : <span className="text-xs text-cv-muted">Standard terms only</span>}
                </TableCell>
                <TableCell><span className="text-sm font-bold text-cv-body tabular-nums">{partner.conversions}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── Tiers Tab ───────────────────────────────────────────────────────────────

function TiersTab({
  campaigns, partnerMap,
}: {
  campaigns: CommissionCampaign[];
  partnerMap: Map<string, { name: string; avatarColor: string; type: PartnerType }>;
}) {
  const tierCampaigns = campaigns.filter(c => c.rule.structureType === 'TIERS');

  return (
    <div className="space-y-4">
      <Card className="cv-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-cv-muted" />
            <p className="text-sm font-bold text-cv-ink">How Volume Tiers Work</p>
          </div>
          <p className="text-xs text-cv-body">Volume tiers measure the overall qualifying commissionable membership volume of the partner. A qualifying purchase only counts when the sale is confirmed and the customer has been billed by the billing partner. Tiers are <strong>prospective</strong> — previous qualifying purchases keep the rate that applied when they occurred; future purchases use the newly achieved tier rate.</p>
        </CardContent>
      </Card>

      {tierCampaigns.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No volume tier campaigns" description="Create a campaign with volume tiers to set progressive commission rates." />
      ) : (
        tierCampaigns.map(c => (
          <Card key={c.id} className="cv-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-cv-ink">{c.name}</p>
                  <p className="text-xs text-cv-muted">{c.internalDescription}</p>
                </div>
                <CampaignStatusBadge status={c.status} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {c.rule.tiers.map(t => (
                  <div key={t.id} className="rounded-xl border border-cv-line p-4 text-center">
                    <p className="text-xs font-bold uppercase text-cv-muted">{t.minQualifying}–{t.maxQualifying ?? '∞'}</p>
                    <p className="text-2xl font-bold text-cv-ink mt-1">{fmtPct(t.rate)}</p>
                    <p className="text-[10px] text-cv-muted mt-1">qualifying memberships</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs text-amber-800"><strong>Prospective only:</strong> When a partner reaches a new tier, previous qualifying purchases keep their original rate. New purchases use the new tier rate. No retroactive repricing.</p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// ─── Earnings Tab ────────────────────────────────────────────────────────────

function EarningsTab({
  campaigns, partnerMap,
}: {
  campaigns: CommissionCampaign[];
  partnerMap: Map<string, { name: string; avatarColor: string; type: PartnerType }>;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CommissionStatus>('ALL');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockCommissions.filter(c => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesSearch = !q || c.partnerName.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const pending = mockCommissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commission, 0);
    const approved = mockCommissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commission, 0);
    const paid = mockCommissions.filter(c => c.status === 'PAID').reduce((s, c) => s + c.commission, 0);
    return { pending, approved, paid };
  }, []);

  const statusToBadge = (status: CommissionStatus) => status.toLowerCase() as 'pending' | 'approved' | 'paid' | 'reversed';

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={fmtMoney(stats.pending)} icon={TrendingUp} description="Awaiting approval" />
        <StatCard label="Approved" value={fmtMoney(stats.approved)} icon={Wallet} description="Ready for payout" />
        <StatCard label="Paid" value={fmtMoney(stats.paid)} icon={DollarSign} description="Settled to partners" />
      </div>

      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
              {(['ALL', 'PENDING', 'APPROVED', 'PAID', 'REVERSED'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-bold transition-colors', statusFilter === s ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink')}>
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input placeholder="Search partner, plan..." value={search} onChange={e => setSearch(e.target.value)} className="cv-input pl-9 h-11" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState icon={DollarSign} title="No commissions found" description="Try a different search or status filter." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Package</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Rate</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.id} className="border-cv-line hover:bg-cv-soft/60 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.partnerName} color={partnerMap.get(c.partnerId)?.avatarColor} size={28} />
                          <span className="text-sm font-bold text-cv-ink">{c.partnerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{fmtMoney2(c.saleAmount)}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney2(c.commission)}</TableCell>
                      <TableCell className="text-xs text-cv-muted">{fmtPct(c.rate)}</TableCell>
                      <TableCell><StatusBadge status={statusToBadge(c.status)} /></TableCell>
                      <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
