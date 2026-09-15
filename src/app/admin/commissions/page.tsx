'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, Wallet, Search } from 'lucide-react';
import { mockCommissions, mockPartners } from '@/data/mock';
import type { CommissionStatus } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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

  const partnerMap = useMemo(() => {
    const m = new Map<string, string>();
    mockPartners.forEach((p) => m.set(p.id, p.name));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockCommissions.filter((c) => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const partnerName = partnerMap.get(c.partnerId) || '';
      const matchesSearch =
        !q ||
        c.plan.toLowerCase().includes(q) ||
        partnerName.toLowerCase().includes(q) ||
        c.commissionRule.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, partnerMap]);

  const stats = useMemo(() => {
    const available = mockCommissions
      .filter((c) => c.status === 'PAID')
      .reduce((s, c) => s + c.commission, 0);
    const pending = mockCommissions
      .filter((c) => c.status === 'PENDING' || c.status === 'APPROVED')
      .reduce((s, c) => s + c.commission, 0);
    const paid = mockCommissions
      .filter((c) => c.status === 'PAID')
      .reduce((s, c) => s + c.commission, 0);
    return { available, pending, paid };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commissions"
        title="Commission Ledger"
        description="Track commission accrual, rules, and payout status across partners."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Available" value={fmtMoney(stats.available)} icon={Wallet} description="Ready for payout" />
        <StatCard label="Pending" value={fmtMoney(stats.pending)} icon={TrendingUp} description="Awaiting approval" />
        <StatCard label="Paid" value={fmtMoney(stats.paid)} icon={DollarSign} description="Settled to partners" />
      </div>

      {/* Filters */}
      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <TabsList className="bg-cv-soft h-auto p-1 flex flex-wrap gap-1">
                {statusFilters.map((f) => (
                  <TabsTrigger key={f.value} value={f.value} className="text-xs">
                    {f.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input
                placeholder="Search commissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cv-input pl-9 h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No commissions found"
              description="Try a different search or status filter."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Rule</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Rate</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="border-cv-line hover:bg-cv-soft/60 transition-colors">
                    <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                    <TableCell className="text-xs text-cv-muted">{c.commissionRule}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{(c.rate * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.commission)}</TableCell>
                    <TableCell className="text-sm text-cv-body">{partnerMap.get(c.partnerId) || '—'}</TableCell>
                    <TableCell><StatusBadge status={c.status.toLowerCase() as any} /></TableCell>
                    <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
