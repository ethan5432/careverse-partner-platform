'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp, Wallet, Search, Eye } from 'lucide-react';
import { mockCommissions, mockPartners } from '@/data/mock';
import type { CommissionStatus, MockCommission } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type StatusFilter = 'ALL' | CommissionStatus;
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REVERSED', label: 'Reversed' },
];

export default function AdminCommissionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selected, setSelected] = useState<MockCommission | null>(null);

  const partnerMap = useMemo(() => {
    const m = new Map<string, { name: string; avatarColor: string }>();
    mockPartners.forEach((p) => m.set(p.id, { name: p.name, avatarColor: p.avatarColor }));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockCommissions.filter((c) => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesSearch =
        !q ||
        c.plan.toLowerCase().includes(q) ||
        c.partnerName.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.clickId.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const pending = mockCommissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commission, 0);
    const approved = mockCommissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commission, 0);
    const paid = mockCommissions.filter(c => c.status === 'PAID').reduce((s, c) => s + c.commission, 0);
    return { pending, approved, paid };
  }, []);

  const statusToBadge = (status: CommissionStatus) =>
    status.toLowerCase() as 'pending' | 'approved' | 'paid' | 'reversed';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Commissions" title="Commission Ledger" description="Track commission accrual, rules, and payout status across all partners." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={fmtMoney(stats.pending)} icon={TrendingUp} description="Awaiting approval" />
        <StatCard label="Approved" value={fmtMoney(stats.approved)} icon={Wallet} description="Ready for payout" />
        <StatCard label="Paid" value={fmtMoney(stats.paid)} icon={DollarSign} description="Settled to partners" />
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
              <Input placeholder="Search partner, plan, customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="cv-input pl-9 h-11" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState icon={DollarSign} title="No commissions found" description="Try a different search or status filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Conversion</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Package</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12"><span className="sr-only">View</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const partner = partnerMap.get(c.partnerId);
                  return (
                    <TableRow key={c.id} className="border-cv-line hover:bg-cv-soft/60 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.partnerName} color={partner?.avatarColor} size={28} />
                          <span className="text-sm font-bold text-cv-ink">{c.partnerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-cv-body tabular-nums">{c.conversionId}</TableCell>
                      <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{fmtMoney2(c.saleAmount)}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney2(c.commission)}</TableCell>
                      <TableCell><StatusBadge status={statusToBadge(c.status)} /></TableCell>
                      <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                      <TableCell className="text-right"><Eye className="h-4 w-4 text-cv-muted" /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Commission details</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{selected ? `Commission ${selected.id}` : ''}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="rounded-xl bg-cv-soft p-3 flex items-center gap-3">
                <Avatar name={selected.partnerName} color={partnerMap.get(selected.partnerId)?.avatarColor} size={40} />
                <div>
                  <p className="text-sm font-bold text-cv-ink">{selected.partnerName}</p>
                  <p className="text-xs text-cv-muted">{selected.storefrontName}</p>
                </div>
              </div>

              <DetailRow label="Conversion" value={selected.conversionId} mono />
              <DetailRow label="Package" value={selected.plan} />
              <DetailRow label="Purchase Amount" value={fmtMoney2(selected.saleAmount)} mono />
              <DetailRow label="Commission Amount" value={fmtMoney2(selected.commission)} mono />
              <DetailRow label="Commission Rule" value={`${selected.commissionRule} (${(selected.rate * 100).toFixed(0)}%)`} />

              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={statusToBadge(selected.status)} />
              </div>

              <DetailRow label="Date" value={fmtDate(selected.date)} />
              {selected.approvedDate && <DetailRow label="Approved Date" value={fmtDate(selected.approvedDate)} />}
              {selected.paidDate && <DetailRow label="Paid Date" value={fmtDate(selected.paidDate)} />}
              {selected.reversedDate && <DetailRow label="Reversed Date" value={fmtDate(selected.reversedDate)} />}

              <div className="rounded-xl border border-cv-line p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Attribution Reference</p>
                <DetailRow label="Customer" value={selected.customerName} />
                <DetailRow label="Tracking Source" value={selected.attributionSource} />
                <DetailRow label="Click ID" value={selected.clickId} mono />
              </div>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setSelected(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-cv-line last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">{label}</span>
      <span className={cn('text-sm font-bold text-cv-ink text-right', mono && 'tabular-nums')}>{value}</span>
    </div>
  );
}
