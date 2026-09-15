'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Clock, Loader as Loader2, Wallet } from 'lucide-react';
import { mockPayouts, mockPartners } from '@/data/mock';
import type { PayoutStatus } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type StatusFilter = 'ALL' | PayoutStatus;
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'PAID', label: 'Paid' },
  { value: 'FAILED', label: 'Failed' },
];

export default function AdminPayoutsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const partnerMap = useMemo(() => {
    const m = new Map<string, { avatarColor: string }>();
    mockPartners.forEach((p) => m.set(p.id, { avatarColor: p.avatarColor }));
    return m;
  }, []);

  const filtered = useMemo(() => {
    return mockPayouts.filter((p) => statusFilter === 'ALL' || p.status === statusFilter);
  }, [statusFilter]);

  const stats = useMemo(() => {
    const totalPaid = mockPayouts
      .filter((p) => p.status === 'PAID')
      .reduce((s, p) => s + p.amount, 0);
    const processing = mockPayouts
      .filter((p) => p.status === 'PROCESSING')
      .reduce((s, p) => s + p.amount, 0);
    const pending = mockPayouts
      .filter((p) => p.status === 'PENDING')
      .reduce((s, p) => s + p.amount, 0);
    return { totalPaid, processing, pending };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payouts"
        title="Partner Payouts"
        description="Track every payout to partners — paid, processing, pending, and failed."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Paid" value={fmtMoney(stats.totalPaid)} icon={DollarSign} description="Settled payouts" />
        <StatCard label="Processing" value={fmtMoney(stats.processing)} icon={Loader2} description="In transit" />
        <StatCard label="Pending" value={fmtMoney(stats.pending)} icon={Clock} description="Awaiting approval" />
      </div>

      {/* Filter tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
        <TabsList className="bg-cv-soft h-auto p-1 flex flex-wrap gap-1 w-fit">
          {statusFilters.map((f) => (
            <TabsTrigger key={f.value} value={f.value} className="text-xs">
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No payouts found"
              description="Try a different status filter."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Method</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const partner = partnerMap.get(p.partnerId);
                  return (
                    <TableRow key={p.id} className="border-cv-line hover:bg-cv-soft/60 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={p.partnerName} color={partner?.avatarColor} size={28} />
                          <span className="text-sm font-bold text-cv-ink">{p.partnerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.amount)}</TableCell>
                      <TableCell className="text-sm text-cv-body">{p.method}</TableCell>
                      <TableCell><StatusBadge status={p.status.toLowerCase() as any} /></TableCell>
                      <TableCell className="text-xs text-cv-muted">{fmtDate(p.date)}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-cv-soft px-2 py-0.5 rounded font-bold text-cv-body">{p.reference}</code>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
