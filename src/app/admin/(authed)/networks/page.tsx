'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Network, Users, DollarSign, TrendingUp, Search, ChevronRight, Activity, Eye } from 'lucide-react';
import { mockNetworks } from '@/data/mock';
import type { MockNetwork, MockNetworkPartner, MockNetworkActivity, NetworkStatus } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type StatusFilter = 'ALL' | NetworkStatus;
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const activityIconColor: Record<MockNetworkActivity['type'], string> = {
  PARTNER_JOINED: 'text-cv-good bg-emerald-50',
  CONVERSION: 'text-cv-ink bg-cv-soft',
  PAYOUT: 'text-cv-good bg-emerald-50',
  STOREFRONT_PUBLISHED: 'text-cv-ink bg-cv-soft',
  COMMISSION: 'text-cv-ink bg-cv-soft',
};

export default function AdminNetworksPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selected, setSelected] = useState<MockNetwork | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockNetworks.filter((n) => {
      const matchesStatus = statusFilter === 'ALL' || n.status === statusFilter;
      const matchesSearch = !q || n.name.toLowerCase().includes(q) || n.ownerName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const totalNetworks = mockNetworks.length;
  const totalPartners = mockNetworks.reduce((s, n) => s + n.activePartnerCount, 0);
  const totalRevenue = mockNetworks.reduce((s, n) => s + n.revenue, 0);
  const totalEarnings = mockNetworks.reduce((s, n) => s + n.networkEarnings, 0);

  const networkStatusBadge = (s: NetworkStatus) =>
    s.toLowerCase() as 'active' | 'pending' | 'suspended';

  const partnerStatusBadge = (s: string) =>
    s.toLowerCase() as 'active' | 'pending' | 'suspended';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Networks"
        title="Partner Networks"
        description="Multi-partner networks managed on the Careverse platform, with aggregate revenue and sub-partner rosters."
        actions={<Button className="cv-btn-primary cv-btn-sm rounded-full"><Network className="h-4 w-4" /> New Network</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Networks" value={totalNetworks} icon={Network} description="All networks" />
        <StatCard label="Active Partners" value={totalPartners} icon={Users} trend="+4" trendUp description="Across networks" />
        <StatCard label="Total Revenue" value={fmtMoney(totalRevenue)} icon={DollarSign} trend="+18%" trendUp description="All time" />
        <StatCard label="Network Earnings" value={fmtMoney(totalEarnings)} icon={TrendingUp} trend="+15%" trendUp description="Network share" />
      </div>

      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <TabsList className="bg-cv-soft h-auto p-1 flex flex-wrap gap-1">
                {statusFilters.map((f) => (
                  <TabsTrigger key={f.value} value={f.value} className="text-xs">{f.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input placeholder="Search network or owner..." value={search} onChange={(e) => setSearch(e.target.value)} className="cv-input pl-9 h-11" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState icon={Network} title="No networks found" description="Try a different search or status filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Network</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Owner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Active Partners</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Earnings</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12"><span className="sr-only">View</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((n) => (
                  <TableRow key={n.id} className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors" onClick={() => setSelected(n)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-soft">
                          <Network className="h-4 w-4 text-cv-ink" />
                        </div>
                        <span className="font-bold text-cv-ink text-sm">{n.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-cv-body">{n.ownerName}</TableCell>
                    <TableCell><StatusBadge status={networkStatusBadge(n.status)} /></TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{n.activePartnerCount}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{n.conversions}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(n.revenue)}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-good">{fmtMoney(n.networkEarnings)}</TableCell>
                    <TableCell className="text-right"><ChevronRight className="h-4 w-4 text-cv-muted ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Network detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl rounded-2xl border-cv-line">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <Network className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-cv-ink">{selected?.name}</DialogTitle>
                <DialogDescription className="text-cv-muted">
                  Owner: {selected?.ownerName} · Created {selected && fmtDate(selected.createdDate)}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selected && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-cv-soft rounded-lg p-0.5 h-auto w-full">
                <TabsTrigger value="overview" className="rounded-md flex-1 text-xs font-bold">Overview</TabsTrigger>
                <TabsTrigger value="partners" className="rounded-md flex-1 text-xs font-bold">Partners</TabsTrigger>
                <TabsTrigger value="activity" className="rounded-md flex-1 text-xs font-bold">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MiniStat label="Partners" value={selected.activePartnerCount} />
                  <MiniStat label="Conversions" value={selected.conversions} />
                  <MiniStat label="Revenue" value={fmtMoney(selected.revenue)} />
                  <MiniStat label="Earnings" value={fmtMoney(selected.networkEarnings)} highlight />
                </div>
                <div className="mt-4 space-y-2">
                  <DetailRow label="Network Status" value={selected.status} />
                  <DetailRow label="Total Partners" value={`${selected.partnerCount}`} />
                  <DetailRow label="Active Partners" value={`${selected.activePartnerCount}`} />
                  <DetailRow label="Conversion Rate" value={`${((selected.conversions / selected.revenue) * 100).toFixed(1)}%`} />
                  <DetailRow label="Avg Revenue / Partner" value={fmtMoney(Math.round(selected.revenue / selected.partnerCount))} />
                  <DetailRow label="Created" value={fmtDate(selected.createdDate)} />
                </div>
              </TabsContent>

              <TabsContent value="partners" className="mt-4 max-h-[50vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cv-line bg-cv-soft/50">
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conv.</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.partners.map((p) => (
                      <TableRow key={p.id} className="border-cv-line">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar name={p.name} color={p.avatarColor} size={28} />
                            <span className="text-sm font-bold text-cv-ink">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell><StatusBadge status={partnerStatusBadge(p.status)} /></TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-cv-ink">{p.storefrontName}</span>
                            <span className="text-[10px] text-cv-muted">{p.storefrontStatus}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-good">{fmtMoney(p.networkEarnings)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="activity" className="mt-4 max-h-[50vh] overflow-y-auto space-y-2">
                {selected.activity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-xl border border-cv-line p-3">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', activityIconColor[a.type])}>
                      <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-cv-ink">{a.description}</p>
                      <p className="text-xs text-cv-muted mt-0.5">{a.partnerName} · {fmtDate(a.date)}</p>
                    </div>
                    {a.amount && (
                      <span className="text-sm font-bold text-cv-ink shrink-0">{fmtMoney(a.amount)}</span>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-cv-soft p-3 text-center">
      <p className="text-xs font-bold uppercase text-cv-muted">{label}</p>
      <p className={cn('text-lg font-bold mt-0.5', highlight ? 'text-cv-good' : 'text-cv-ink')}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-cv-line last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">{label}</span>
      <span className="text-sm font-bold text-cv-ink text-right">{value}</span>
    </div>
  );
}
