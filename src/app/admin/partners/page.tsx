'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Users, Search, UserPlus, ArrowLeftRight, DollarSign, TrendingUp,
  Store, MessageSquare, StickyNote, Settings, Activity as ActivityIcon,
} from 'lucide-react';
import {
  mockPartners, mockConversions, mockCommissions, mockStorefronts,
  adminDashboardStats,
} from '@/data/mock';
import type { MockPartner, PartnerType, PartnerStatus } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const partnerStatusMap: Record<PartnerStatus, 'active' | 'pending' | 'incomplete' | 'suspended'> = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INCOMPLETE: 'incomplete',
  SUSPENDED: 'suspended',
};

type TypeFilter = 'ALL' | PartnerType;
const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'CREATOR', label: 'Creator' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'NETWORK', label: 'Network' },
];

export default function AdminPartnersPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockPartners.filter((p) => {
      const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.storefrontName.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [search, typeFilter]);

  const selectedPartner = mockPartners.find((p) => p.id === selectedId) || null;

  const stats = useMemo(() => {
    const active = mockPartners.filter((p) => p.status === 'ACTIVE').length;
    const pending = mockPartners.filter((p) => p.status === 'PENDING').length;
    const revenue = mockPartners.reduce((s, p) => s + p.revenue, 0);
    return { total: mockPartners.length, active, pending, revenue };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Partners"
        title="Partner CRM"
        description="Manage creators, businesses, and networks across the platform."
        actions={
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90" size="sm">
            <UserPlus className="h-4 w-4" />
            Add Partner
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Partners" value={stats.total} icon={Users} description={`${stats.active} active`} />
        <StatCard label="Active" value={stats.active} icon={ArrowLeftRight} description="In good standing" />
        <StatCard label="Pending" value={stats.pending} icon={TrendingUp} description="Awaiting review" />
        <StatCard label="Partner Revenue" value={fmtMoney(stats.revenue)} icon={DollarSign} description="All time" />
      </div>

      {/* Filters */}
      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input
                placeholder="Search partners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cv-input pl-9 h-11"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
              {typeFilters.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTypeFilter(t.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                    typeFilter === t.value
                      ? 'bg-white text-cv-ink shadow-sm'
                      : 'text-cv-muted hover:text-cv-ink'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No partners found"
              description="Try a different search or filter to see partners."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors"
                    onClick={() => setSelectedId(p.id)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.name} color={p.avatarColor} size={32} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-cv-ink truncate">{p.name}</p>
                          <p className="text-xs text-cv-muted truncate">{p.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-cv-body">{p.type}</span>
                    </TableCell>
                    <TableCell><StatusBadge status={partnerStatusMap[p.status]} /></TableCell>
                    <TableCell className="text-sm text-cv-body">{p.storefrontName}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney(p.commission)}</TableCell>
                    <TableCell className="text-xs text-cv-muted">{fmtDate(p.joinedDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Partner detail dialog */}
      <PartnerDialog partner={selectedPartner} onClose={() => setSelectedId(null)} />
    </div>
  );
}

function PartnerDialog({ partner, onClose }: { partner: MockPartner | null; onClose: () => void }) {
  const open = !!partner;

  const partnerConversions = useMemo(
    () => (partner ? mockConversions.filter((c) => c.partnerId === partner.id) : []),
    [partner]
  );
  const partnerCommissions = useMemo(
    () => (partner ? mockCommissions.filter((c) => c.partnerId === partner.id) : []),
    [partner]
  );
  const partnerStorefront = useMemo(
    () => (partner ? mockStorefronts.find((s) => s.partnerId === partner.id) || null : null),
    [partner]
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto cv-card border-cv-line rounded-2xl bg-white p-0">
        {partner && (
          <>
            <DialogHeader className="p-6 pb-4 border-b border-cv-line">
              <div className="flex items-center gap-3">
                <Avatar name={partner.name} color={partner.avatarColor} size={44} />
                <div>
                  <DialogTitle className="text-lg font-bold text-cv-ink">{partner.name}</DialogTitle>
                  <DialogDescription className="text-sm text-cv-muted">{partner.email}</DialogDescription>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={partnerStatusMap[partner.status]} />
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 pb-6">
              <Tabs defaultValue="overview">
                <TabsList className="bg-cv-soft h-auto p-1 flex flex-wrap gap-1">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                  <TabsTrigger value="conversions" className="text-xs">Conversions</TabsTrigger>
                  <TabsTrigger value="commissions" className="text-xs">Commissions</TabsTrigger>
                  <TabsTrigger value="storefront" className="text-xs">Storefront</TabsTrigger>
                  <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField label="Name" value={partner.name} />
                    <DetailField label="Email" value={partner.email} />
                    <DetailField label="Type" value={partner.type} />
                    <DetailField label="Status" value={<StatusBadge status={partnerStatusMap[partner.status]} />} />
                    <DetailField label="Joined" value={fmtDate(partner.joinedDate)} />
                    <DetailField label="Last Active" value={fmtDate(partner.lastActive)} />
                    <DetailField label="Conversions" value={String(partner.conversions)} />
                    <DetailField label="Revenue" value={fmtMoney(partner.revenue)} />
                    <DetailField label="Commission" value={fmtMoney(partner.commission)} />
                    <DetailField label="Storefront" value={partner.storefrontName} />
                  </div>
                </TabsContent>

                {/* Activity */}
                <TabsContent value="activity" className="mt-4">
                  {partnerConversions.length === 0 ? (
                    <EmptyState icon={ActivityIcon} title="No recent activity" description="Conversions will appear here." />
                  ) : (
                    <div className="space-y-2">
                      {partnerConversions.slice(0, 6).map((c) => (
                        <div key={c.id} className="flex items-center justify-between rounded-xl bg-cv-soft p-3">
                          <div>
                            <p className="text-sm font-bold text-cv-ink">{c.plan}</p>
                            <p className="text-xs text-cv-muted">{fmtDate(c.date)} · {c.attributionSource}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-cv-ink">${c.saleAmount}</p>
                            <p className="text-xs text-cv-muted">{fmtMoney(c.commission)} comm.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Conversions */}
                <TabsContent value="conversions" className="mt-4">
                  {partnerConversions.length === 0 ? (
                    <EmptyState icon={ArrowLeftRight} title="No conversions" description="This partner has no conversions yet." />
                  ) : (
                    <div className="rounded-xl border border-cv-line overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-cv-line hover:bg-transparent">
                            <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {partnerConversions.map((c) => (
                            <TableRow key={c.id} className="border-cv-line">
                              <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                              <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                              <TableCell className="text-right text-sm text-cv-body">{fmtMoney(c.commission)}</TableCell>
                              <TableCell><StatusBadge status={c.status.toLowerCase() as any} /></TableCell>
                              <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* Commissions */}
                <TabsContent value="commissions" className="mt-4">
                  {partnerCommissions.length === 0 ? (
                    <EmptyState icon={DollarSign} title="No commissions" description="This partner has no commissions yet." />
                  ) : (
                    <div className="rounded-xl border border-cv-line overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-cv-line hover:bg-transparent">
                            <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted">Rule</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                            <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {partnerCommissions.map((c) => (
                            <TableRow key={c.id} className="border-cv-line">
                              <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                              <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                              <TableCell className="text-xs text-cv-muted">{c.commissionRule}</TableCell>
                              <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.commission)}</TableCell>
                              <TableCell><StatusBadge status={c.status.toLowerCase() as any} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                {/* Storefront */}
                <TabsContent value="storefront" className="mt-4">
                  {partnerStorefront ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Name" value={partnerStorefront.name} />
                        <DetailField label="URL" value={partnerStorefront.url} />
                        <DetailField label="Status" value={<StatusBadge status={partnerStorefront.status.toLowerCase() as any} />} />
                        <DetailField label="Domain" value={
                          partnerStorefront.customDomain
                            ? <span className="flex items-center gap-2"><span>{partnerStorefront.customDomain}</span><StatusBadge status={partnerStorefront.domainStatus.toLowerCase() as any} /></span>
                            : <StatusBadge status="none" />
                        } />
                        <DetailField label="Visitors" value={String(partnerStorefront.visitors)} />
                        <DetailField label="Conversions" value={String(partnerStorefront.conversions)} />
                        <DetailField label="Revenue" value={fmtMoney(partnerStorefront.revenue)} />
                        <DetailField label="Commission" value={fmtMoney(partnerStorefront.commission)} />
                      </div>
                      {partnerStorefront.introCopy && (
                        <div className="rounded-xl bg-cv-soft p-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Intro Copy</p>
                          <p className="text-sm text-cv-body">{partnerStorefront.introCopy}</p>
                        </div>
                      )}
                      <div className="rounded-xl bg-cv-soft p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Packages</p>
                        <div className="flex flex-wrap gap-2">
                          {partnerStorefront.packages.length === 0 ? (
                            <span className="text-sm text-cv-muted">No packages</span>
                          ) : (
                            partnerStorefront.packages.map((pkg) => (
                              <span key={pkg} className="rounded-lg border border-cv-line bg-white px-2.5 py-1 text-xs font-bold text-cv-ink">{pkg}</span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState icon={Store} title="No storefront" description="This partner has not set up a storefront." />
                  )}
                </TabsContent>

                {/* Messages */}
                <TabsContent value="messages" className="mt-4">
                  <EmptyState
                    icon={MessageSquare}
                    title="Messages"
                    description="Direct messages with this partner will appear here."
                  />
                </TabsContent>

                {/* Notes */}
                <TabsContent value="notes" className="mt-4">
                  <EmptyState
                    icon={StickyNote}
                    title="Notes"
                    description="Internal notes about this partner will appear here."
                  />
                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings" className="mt-4">
                  <EmptyState
                    icon={Settings}
                    title="Settings"
                    description="Partner account settings and permissions will appear here."
                  />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-cv-soft p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">{label}</p>
      <div className="text-sm font-bold text-cv-ink">{value}</div>
    </div>
  );
}
