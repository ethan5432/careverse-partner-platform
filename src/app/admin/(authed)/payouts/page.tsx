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
import { DollarSign, Clock, Loader as Loader2, Wallet, Search, Eye } from 'lucide-react';
import { mockPayouts, mockPartners, mockCommissions } from '@/data/mock';
import type { PayoutStatus, MockPayout, CommissionStatus } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type StatusFilter = 'ALL' | PayoutStatus;
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'PAID', label: 'Paid' },
  { value: 'FAILED', label: 'Failed' },
];

interface PartnerPayoutSummary {
  partnerId: string;
  partnerName: string;
  avatarColor: string;
  available: number;
  pending: number;
  paid: number;
  payoutStatus: PayoutStatus;
  lastPayoutDate: string | null;
  payouts: MockPayout[];
}

export default function AdminPayoutsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedPayout, setSelectedPayout] = useState<MockPayout | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<PartnerPayoutSummary | null>(null);

  const partnerMap = useMemo(() => {
    const m = new Map<string, { avatarColor: string }>();
    mockPartners.forEach((p) => m.set(p.id, { avatarColor: p.avatarColor }));
    return m;
  }, []);

  const partnerSummaries = useMemo<PartnerPayoutSummary[]>(() => {
    return mockPartners
      .filter(p => p.conversions > 0)
      .map(p => {
        const partnerCommissions = mockCommissions.filter(c => c.partnerId === p.id);
        const partnerPayouts = mockPayouts.filter(po => po.partnerId === p.id);
        const available = partnerCommissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commission, 0);
        const pending = partnerCommissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commission, 0);
        const paid = partnerPayouts.filter(po => po.status === 'PAID').reduce((s, po) => s + po.amount, 0);
        const lastPaid = partnerPayouts.filter(po => po.status === 'PAID').sort((a, b) => b.date.localeCompare(a.date))[0];
        const latestPayout = partnerPayouts.sort((a, b) => b.date.localeCompare(a.date))[0];
        const payoutStatus: PayoutStatus = latestPayout ? latestPayout.status : 'PENDING';
        return {
          partnerId: p.id, partnerName: p.name, avatarColor: p.avatarColor,
          available, pending, paid, payoutStatus,
          lastPayoutDate: lastPaid ? lastPaid.date : null,
          payouts: partnerPayouts,
        };
      });
  }, []);

  const filteredSummaries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partnerSummaries.filter((s) => {
      const matchesStatus = statusFilter === 'ALL' || s.payoutStatus === statusFilter;
      const matchesSearch = !q || s.partnerName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [partnerSummaries, search, statusFilter]);

  const stats = useMemo(() => {
    const totalAvailable = partnerSummaries.reduce((s, p) => s + p.available, 0);
    const totalPending = partnerSummaries.reduce((s, p) => s + p.pending, 0);
    const totalPaid = partnerSummaries.reduce((s, p) => s + p.paid, 0);
    return { totalAvailable, totalPending, totalPaid };
  }, [partnerSummaries]);

  const statusToBadge = (status: PayoutStatus) =>
    status.toLowerCase() as 'pending' | 'processing' | 'paid' | 'failed';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Payouts" title="Partner Payouts" description="Track every partner's available balance, pending commissions, and payout history." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Available" value={fmtMoney(stats.totalAvailable)} icon={Wallet} description="Ready for payout" />
        <StatCard label="Total Pending" value={fmtMoney(stats.totalPending)} icon={Clock} description="Awaiting approval" />
        <StatCard label="Total Paid" value={fmtMoney(stats.totalPaid)} icon={DollarSign} description="Settled to partners" />
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
              <Input placeholder="Search partner..." value={search} onChange={(e) => setSearch(e.target.value)} className="cv-input pl-9 h-11" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filteredSummaries.length === 0 ? (
            <EmptyState icon={Wallet} title="No payouts found" description="Try a different search or status filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Available</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Pending</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Paid</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Payout Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Payout Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12"><span className="sr-only">View</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummaries.map((s) => (
                  <TableRow key={s.partnerId} className="border-cv-line hover:bg-cv-soft/60 transition-colors cursor-pointer" onClick={() => setSelectedSummary(s)}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.partnerName} color={s.avatarColor} size={28} />
                        <span className="text-sm font-bold text-cv-ink">{s.partnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(s.available)}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney(s.pending)}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney(s.paid)}</TableCell>
                    <TableCell><StatusBadge status={statusToBadge(s.payoutStatus)} /></TableCell>
                    <TableCell className="text-xs text-cv-muted">{s.lastPayoutDate ? fmtDate(s.lastPayoutDate) : '—'}</TableCell>
                    <TableCell className="text-right"><Eye className="h-4 w-4 text-cv-muted" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Partner payout detail dialog */}
      <Dialog open={!!selectedSummary} onOpenChange={(open) => !open && setSelectedSummary(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Payout details</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{selectedSummary ? selectedSummary.partnerName : ''}</DialogDescription>
          </DialogHeader>
          {selectedSummary && (
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="rounded-xl bg-cv-soft p-3 flex items-center gap-3">
                <Avatar name={selectedSummary.partnerName} color={selectedSummary.avatarColor} size={40} />
                <div>
                  <p className="text-sm font-bold text-cv-ink">{selectedSummary.partnerName}</p>
                  <p className="text-xs text-cv-muted">{selectedSummary.payouts.length} payout{selectedSummary.payouts.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <DetailRow label="Available Balance" value={fmtMoney2(selectedSummary.available)} mono />
              <DetailRow label="Pending" value={fmtMoney2(selectedSummary.pending)} mono />
              <DetailRow label="Total Paid" value={fmtMoney2(selectedSummary.paid)} mono />

              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Payout Status</span>
                <StatusBadge status={statusToBadge(selectedSummary.payoutStatus)} />
              </div>

              {selectedSummary.lastPayoutDate && <DetailRow label="Last Payout Date" value={fmtDate(selectedSummary.lastPayoutDate)} />}

              {/* Payout history */}
              {selectedSummary.payouts.length > 0 && (
                <div className="rounded-xl border border-cv-line p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Payout History</p>
                  {selectedSummary.payouts.map(po => (
                    <div key={po.id} className="flex items-center justify-between py-2 border-b border-cv-line last:border-0 cursor-pointer hover:bg-cv-soft/40 rounded-lg px-2 -mx-2 transition-colors" onClick={() => setSelectedPayout(po)}>
                      <div>
                        <p className="text-sm font-bold text-cv-ink">{fmtMoney2(po.amount)}</p>
                        <p className="text-xs text-cv-muted">{fmtDate(po.date)} · {po.method}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={statusToBadge(po.status)} />
                        <Eye className="h-3.5 w-3.5 text-cv-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setSelectedSummary(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual payout detail dialog */}
      <Dialog open={!!selectedPayout} onOpenChange={(open) => !open && setSelectedPayout(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Payout detail</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{selectedPayout ? selectedPayout.reference : ''}</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-3 pt-1">
              <DetailRow label="Partner" value={selectedPayout.partnerName} />
              <DetailRow label="Amount" value={fmtMoney2(selectedPayout.amount)} mono />
              <DetailRow label="Method" value={selectedPayout.method} />
              <DetailRow label="Date" value={fmtDate(selectedPayout.date)} />
              <DetailRow label="Reference" value={selectedPayout.reference} mono />
              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={statusToBadge(selectedPayout.status)} />
              </div>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setSelectedPayout(null)}>Close</Button>
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
