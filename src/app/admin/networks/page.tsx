'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Network, Users, DollarSign, TrendingUp, ChevronRight, Layers } from 'lucide-react';
import { mockNetworks } from '@/data/mock';
import type { MockNetwork, MockNetworkPartner } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const partnerTypeBadge: Record<MockNetworkPartner['type'], 'active' | 'pending' | 'suspended'> = {
  CREATOR: 'active',
  BUSINESS: 'pending',
  NETWORK: 'suspended',
};

export default function AdminNetworksPage() {
  const [selected, setSelected] = useState<MockNetwork | null>(null);

  const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const totalNetworks = mockNetworks.length;
  const totalPartners = mockNetworks.reduce((s, n) => s + n.partnerCount, 0);
  const totalRevenue = mockNetworks.reduce((s, n) => s + n.revenue, 0);
  const totalEarnings = mockNetworks.reduce((s, n) => s + n.networkEarnings, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Networks"
        title="Partner Networks"
        description="Multi-partner networks managed on the Careverse platform, with aggregate revenue and sub-partner rosters."
        actions={<Button className="cv-btn-primary cv-btn-sm rounded-full"><Network className="h-4 w-4" /> New Network</Button>}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Networks" value={totalNetworks} icon={Network} description="Active groups" />
        <StatCard label="Total Partners" value={totalPartners} icon={Users} trend="+4" trendUp description="Across networks" />
        <StatCard label="Total Revenue" value={fmtMoney(totalRevenue)} icon={DollarSign} trend="+18%" trendUp description="All time" />
        <StatCard label="Network Earnings" value={fmtMoney(totalEarnings)} icon={TrendingUp} trend="+15%" trendUp description="Network share" />
      </div>

      {/* Networks Table */}
      <Card className="cv-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-cv-ink">All Networks</CardTitle>
          <p className="text-xs text-cv-muted mt-0.5">Click a network to view its sub-partners</p>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-cv-line">
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Network Name</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Partners</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Network Earnings</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockNetworks.map((n) => (
                <TableRow
                  key={n.id}
                  className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors"
                  onClick={() => setSelected(n)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-soft">
                        <Network className="h-4 w-4 text-cv-ink" />
                      </div>
                      <span className="font-bold text-cv-ink text-sm">{n.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-cv-body">{n.partnerCount}</TableCell>
                  <TableCell className="text-right text-sm text-cv-body">{n.conversions}</TableCell>
                  <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(n.revenue)}</TableCell>
                  <TableCell className="text-right text-sm font-bold text-cv-good">{fmtMoney(n.networkEarnings)}</TableCell>
                  <TableCell className="text-right">
                    <ChevronRight className="h-4 w-4 text-cv-muted ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Partner Detail Dialog */}
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
                  {selected?.partnerCount} partners · {selected && fmtMoney(selected.revenue)} revenue
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-cv-soft p-3 text-center">
                  <p className="text-xs font-bold uppercase text-cv-muted">Partners</p>
                  <p className="text-lg font-bold text-cv-ink mt-0.5">{selected.partnerCount}</p>
                </div>
                <div className="rounded-xl bg-cv-soft p-3 text-center">
                  <p className="text-xs font-bold uppercase text-cv-muted">Revenue</p>
                  <p className="text-lg font-bold text-cv-ink mt-0.5">{fmtMoney(selected.revenue)}</p>
                </div>
                <div className="rounded-xl bg-cv-soft p-3 text-center">
                  <p className="text-xs font-bold uppercase text-cv-muted">Earnings</p>
                  <p className="text-lg font-bold text-cv-good mt-0.5">{fmtMoney(selected.networkEarnings)}</p>
                </div>
              </div>

              {/* Partner list */}
              <div className="rounded-2xl border border-cv-line overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cv-line bg-cv-soft/50">
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conv.</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.partners.map((p) => (
                      <TableRow key={p.id} className="border-cv-line">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar name={p.name} color="#18191D" size={28} />
                            <span className="text-sm font-bold text-cv-ink">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={partnerTypeBadge[p.type]} label={p.type.charAt(0) + p.type.slice(1).toLowerCase()} />
                        </TableCell>
                        <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                        <TableCell className="text-xs text-cv-muted">{fmtDate(p.joinedDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
