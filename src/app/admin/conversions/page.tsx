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
import { cn } from '@/lib/utils';
import { ArrowLeftRight, DollarSign, TrendingUp, Search } from 'lucide-react';
import { mockConversions } from '@/data/mock';
import type { ConversionStatus } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type StatusFilter = 'ALL' | ConversionStatus;
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REVERSED', label: 'Reversed' },
];

export default function AdminConversionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockConversions.filter((c) => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesSearch =
        !q ||
        c.plan.toLowerCase().includes(q) ||
        c.partnerName.toLowerCase().includes(q) ||
        c.storefrontName.toLowerCase().includes(q) ||
        c.customerEmail.toLowerCase().includes(q) ||
        c.attributionSource.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const total = mockConversions.length;
    const revenue = mockConversions.reduce((s, c) => s + c.saleAmount, 0);
    const commission = mockConversions.reduce((s, c) => s + c.commission, 0);
    return { total, revenue, commission };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Conversions"
        title="All Conversions"
        description="Every conversion across the platform, with attribution and status."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Conversions" value={stats.total} icon={ArrowLeftRight} description="All time" />
        <StatCard label="Total Revenue" value={fmtMoney(stats.revenue)} icon={DollarSign} description="Gross sales" />
        <StatCard label="Total Commission" value={fmtMoney(stats.commission)} icon={TrendingUp} description="Partner payouts" />
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
                placeholder="Search conversions..."
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
              icon={ArrowLeftRight}
              title="No conversions found"
              description="Try a different search or status filter."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Attribution</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="border-cv-line hover:bg-cv-soft/60 transition-colors">
                    <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.commission)}</TableCell>
                    <TableCell className="text-sm text-cv-body">{c.partnerName}</TableCell>
                    <TableCell className="text-sm text-cv-body">{c.storefrontName}</TableCell>
                    <TableCell className="text-xs text-cv-muted">{c.attributionSource}</TableCell>
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
