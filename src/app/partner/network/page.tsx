'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Users, ArrowLeftRight, TrendingUp, Wallet, Network as NetworkIcon, Search, Eye, Activity } from 'lucide-react';
import { mockNetworks } from '@/data/mock';
import type { MockNetworkPartner, MockNetworkActivity } from '@/data/mock/types';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const partnerStatusBadge = (s: string) => s.toLowerCase() as 'active' | 'pending' | 'suspended';

const activityIconColor: Record<MockNetworkActivity['type'], string> = {
  PARTNER_JOINED: 'text-cv-good bg-emerald-50',
  CONVERSION: 'text-cv-ink bg-cv-soft',
  PAYOUT: 'text-cv-good bg-emerald-50',
  STOREFRONT_PUBLISHED: 'text-cv-ink bg-cv-soft',
  COMMISSION: 'text-cv-ink bg-cv-soft',
};

export default function PartnerNetworkPage() {
  const router = useRouter();
  const { user } = useMockAuth();
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<MockNetworkPartner | null>(null);

  if (user?.partnerType !== 'NETWORK') {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Network"
          title="Network"
          description="Manage your sub-partners and track network performance."
        />
        <Card className="cv-card">
          <CardContent>
            <EmptyState
              icon={NetworkIcon}
              title="Network access required"
              description="The Network dashboard is only available to partners enrolled in a network. Switch your role to Network from the account menu to view this page."
              action={
                <button
                  className="cv-btn-primary cv-btn-sm px-5"
                  onClick={() => router.push('/partner')}
                >
                  Back to overview
                </button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const network = mockNetworks[0];
  const partners: MockNetworkPartner[] = network?.partners ?? [];
  const activity: MockNetworkActivity[] = network?.activity ?? [];

  const filteredPartners = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners.filter((p) =>
      !q || p.name.toLowerCase().includes(q) || p.storefrontName.toLowerCase().includes(q),
    );
  }, [partners, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Network"
        title={network?.name ?? 'Network'}
        description="Your sub-partners, conversions, and network earnings at a glance."
      />

      {/* Network overview stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Partners" value={network?.activePartnerCount ?? 0} icon={Users} description="Active sub-partners" />
        <StatCard label="Conversions" value={network?.conversions ?? 0} icon={ArrowLeftRight} trend="+9%" trendUp description="All time" />
        <StatCard label="Revenue" value={fmtMoney(network?.revenue ?? 0)} icon={TrendingUp} trend="+14%" trendUp description="Network total" />
        <StatCard label="Network Earnings" value={fmtMoney(network?.networkEarnings ?? 0)} icon={Wallet} description="Your share" />
      </div>

      {/* Partner list with search */}
      <Card className="cv-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-bold text-cv-ink">Network Partners</CardTitle>
              <p className="text-xs text-cv-muted mt-0.5">{partners.length} sub-partners in your network</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search partner or storefront..." className="cv-input pl-9 h-9 text-sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredPartners.length === 0 ? (
            <EmptyState icon={Users} title="No sub-partners found" description="Try a different search." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Earnings</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12"><span className="sr-only">View</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((p) => (
                  <TableRow key={p.id} className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors" onClick={() => setSelectedPartner(p)}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.name} color={p.avatarColor} size={32} />
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
                    <TableCell className="text-right"><Eye className="h-4 w-4 text-cv-muted" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card className="cv-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-cv-ink">Recent Network Activity</CardTitle>
          <p className="text-xs text-cv-muted mt-0.5">Latest events across your network</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {activity.map((a) => (
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
          </div>
        </CardContent>
      </Card>

      {/* Partner detail dialog */}
      <Dialog open={!!selectedPartner} onOpenChange={(open) => !open && setSelectedPartner(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Avatar name={selectedPartner?.name || ''} color={selectedPartner?.avatarColor} size={40} />
              <div>
                <DialogTitle className="text-lg font-bold text-cv-ink">{selectedPartner?.name}</DialogTitle>
                <DialogDescription className="text-cv-muted">Partner performance details</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={partnerStatusBadge(selectedPartner.status)} />
              </div>
              <DetailRow label="Partner Type" value={selectedPartner.type.charAt(0) + selectedPartner.type.slice(1).toLowerCase()} />
              <DetailRow label="Storefront" value={selectedPartner.storefrontName} />
              <DetailRow label="Storefront Status" value={selectedPartner.storefrontStatus} />
              <DetailRow label="Joined" value={fmtDate(selectedPartner.joinedDate)} />
              <DetailRow label="Last Active" value={fmtDate(selectedPartner.lastActive)} />

              <div className="rounded-xl border border-cv-line p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-3">Performance</p>
                <DetailRow label="Conversions" value={`${selectedPartner.conversions}`} />
                <DetailRow label="Revenue" value={fmtMoney(selectedPartner.revenue)} />
                <DetailRow label="Commission" value={fmtMoney(selectedPartner.commission)} />
                <DetailRow label="Network Earnings" value={fmtMoney(selectedPartner.networkEarnings)} />
              </div>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <button className="cv-btn-outline rounded-full font-bold" onClick={() => setSelectedPartner(null)}>Close</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-cv-line last:border-0 gap-3">
      <span className="text-xs font-bold uppercase tracking-wider text-cv-muted shrink-0">{label}</span>
      <span className="text-sm font-bold text-cv-ink text-right">{value}</span>
    </div>
  );
}
