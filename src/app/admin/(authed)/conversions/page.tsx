'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, DollarSign, TrendingUp, Search, Calendar, Store, User, Package, ChevronDown, Eye } from 'lucide-react';
import { mockConversions, mockPartners, mockStorefronts, mockProducts } from '@/data/mock';
import type { ConversionStatus, AttributionState, MockConversion } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type StatusFilter = 'ALL' | ConversionStatus;
type DateFilter = 'ALL' | '7D' | '30D' | '90D';

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REVERSED', label: 'Reversed' },
];

const dateFilters: { value: DateFilter; label: string }[] = [
  { value: 'ALL', label: 'All time' },
  { value: '7D', label: '7 days' },
  { value: '30D', label: '30 days' },
  { value: '90D', label: '90 days' },
];

const ATTRIBUTION_LABELS: Record<AttributionState, string> = {
  ATTRIBUTED: 'Attributed',
  PENDING: 'Pending',
  UNATTRIBUTED: 'Unattributed',
  REVERSED: 'Reversed',
};

const ATTRIBUTION_COLORS: Record<AttributionState, string> = {
  ATTRIBUTED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  UNATTRIBUTED: 'bg-gray-100 text-gray-600 border-gray-200',
  REVERSED: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminConversionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [storefrontFilter, setStorefrontFilter] = useState('ALL');
  const [packageFilter, setPackageFilter] = useState('ALL');
  const [selected, setSelected] = useState<MockConversion | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date('2026-09-16');
    return mockConversions.filter((c) => {
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      const matchesPartner = partnerFilter === 'ALL' || c.partnerId === partnerFilter;
      const matchesStorefront = storefrontFilter === 'ALL' || c.storefrontId === storefrontFilter;
      const matchesPackage = packageFilter === 'ALL' || c.plan === packageFilter;
      const matchesSearch =
        !q ||
        c.plan.toLowerCase().includes(q) ||
        c.partnerName.toLowerCase().includes(q) ||
        c.storefrontName.toLowerCase().includes(q) ||
        c.customerEmail.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.attributionSource.toLowerCase().includes(q) ||
        c.clickId.toLowerCase().includes(q);

      let matchesDate = true;
      if (dateFilter !== 'ALL') {
        const convDate = new Date(c.date);
        const daysDiff = Math.floor((now.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dateFilter === '7D') matchesDate = daysDiff <= 7;
        else if (dateFilter === '30D') matchesDate = daysDiff <= 30;
        else if (dateFilter === '90D') matchesDate = daysDiff <= 90;
      }

      return matchesStatus && matchesPartner && matchesStorefront && matchesPackage && matchesSearch && matchesDate;
    });
  }, [search, statusFilter, dateFilter, partnerFilter, storefrontFilter, packageFilter]);

  const stats = useMemo(() => {
    const total = mockConversions.length;
    const revenue = mockConversions.reduce((s, c) => s + c.saleAmount, 0);
    const commission = mockConversions.reduce((s, c) => s + c.commission, 0);
    return { total, revenue, commission };
  }, []);

  const statusToBadge = (status: ConversionStatus) =>
    status.toLowerCase() as 'pending' | 'approved' | 'paid' | 'reversed';

  const hasActiveFilters = statusFilter !== 'ALL' || dateFilter !== 'ALL' || partnerFilter !== 'ALL' || storefrontFilter !== 'ALL' || packageFilter !== 'ALL' || search;

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

      {/* Status tabs + search */}
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

      {/* Additional filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          icon={Calendar}
          label="Date"
          value={dateFilters.find((d) => d.value === dateFilter)?.label || 'All time'}
          options={dateFilters.map((d) => ({ value: d.value, label: d.label }))}
          onSelect={(v) => setDateFilter(v as DateFilter)}
        />
        <FilterDropdown
          icon={User}
          label="Partner"
          value={partnerFilter === 'ALL' ? 'All partners' : mockPartners.find((p) => p.id === partnerFilter)?.name || 'All partners'}
          options={[
            { value: 'ALL', label: 'All partners' },
            ...mockPartners.map((p) => ({ value: p.id, label: p.name })),
          ]}
          onSelect={(v) => setPartnerFilter(v)}
        />
        <FilterDropdown
          icon={Store}
          label="Storefront"
          value={storefrontFilter === 'ALL' ? 'All storefronts' : mockStorefronts.find((s) => s.id === storefrontFilter)?.name || 'All storefronts'}
          options={[
            { value: 'ALL', label: 'All storefronts' },
            ...mockStorefronts.map((s) => ({ value: s.id, label: s.name })),
          ]}
          onSelect={(v) => setStorefrontFilter(v)}
        />
        <FilterDropdown
          icon={Package}
          label="Package"
          value={packageFilter === 'ALL' ? 'All packages' : packageFilter}
          options={[
            { value: 'ALL', label: 'All packages' },
            ...mockProducts.map((p) => ({ value: p.name, label: p.name })),
          ]}
          onSelect={(v) => setPackageFilter(v)}
        />
        {hasActiveFilters && (
          <button
            onClick={() => { setStatusFilter('ALL'); setDateFilter('ALL'); setPartnerFilter('ALL'); setStorefrontFilter('ALL'); setPackageFilter('ALL'); setSearch(''); }}
            className="text-xs font-bold text-cv-muted hover:text-cv-ink transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title="No conversions found"
              description="Try a different search or filter combination."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Customer</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Package</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Attribution</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12">
                    <span className="sr-only">View</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-cv-line hover:bg-cv-soft/60 transition-colors cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <TableCell className="text-sm">
                      <p className="font-bold text-cv-ink">{c.customerName}</p>
                      <p className="text-xs text-cv-muted">{c.customerEmail}</p>
                    </TableCell>
                    <TableCell className="text-sm text-cv-body">{c.partnerName}</TableCell>
                    <TableCell className="text-sm text-cv-body">{c.storefrontName}</TableCell>
                    <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney(c.saleAmount)}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.commission)}</TableCell>
                    <TableCell>
                      <span className={cn(
                        'text-xs font-extrabold px-2.5 py-1 rounded-full border inline-block',
                        ATTRIBUTION_COLORS[c.attributionState]
                      )}>
                        {ATTRIBUTION_LABELS[c.attributionState]}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={statusToBadge(c.status)} /></TableCell>
                    <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                    <TableCell className="text-right">
                      <Eye className="h-4 w-4 text-cv-muted" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Conversion detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Conversion details</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">
              {selected ? `Conversion ${selected.id}` : ''}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="rounded-xl bg-cv-soft p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Customer</p>
                <p className="text-sm font-bold text-cv-ink">{selected.customerName}</p>
                <p className="text-xs text-cv-muted">{selected.customerEmail}</p>
              </div>

              <DetailRow label="Partner" value={selected.partnerName} />
              <DetailRow label="Storefront" value={selected.storefrontName} />
              <DetailRow label="Package" value={selected.plan} />
              <DetailRow label="Purchase Amount" value={fmtMoney2(selected.saleAmount)} mono />
              <DetailRow label="Conversion Date" value={fmtDate(selected.date)} />
              <DetailRow label="Commission" value={fmtMoney2(selected.commission)} mono />

              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={statusToBadge(selected.status)} />
              </div>

              {/* Attribution section */}
              <div className="rounded-xl border border-cv-line p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Attribution / Tracking</p>
                <DetailRow label="Tracking Source" value={selected.attributionSource} />
                <DetailRow label="Click / Attribution ID" value={selected.clickId} mono />
                <DetailRow label="Partner" value={selected.partnerName} />
                <DetailRow label="Storefront" value={selected.storefrontName} />
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Attribution State</span>
                  <span className={cn(
                    'text-xs font-extrabold px-2.5 py-1 rounded-full border',
                    ATTRIBUTION_COLORS[selected.attributionState]
                  )}>
                    {ATTRIBUTION_LABELS[selected.attributionState]}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-cv-line last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">{label}</span>
      <span
        className={cn(
          'text-sm font-bold text-cv-ink text-right',
          mono && 'tabular-nums',
        )}
      >
        {value}
      </span>
    </div>
  );
}

function FilterDropdown({
  icon: Icon,
  label,
  value,
  options,
  onSelect,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-cv-line bg-white text-sm font-bold text-cv-ink hover:bg-cv-soft transition-colors"
      >
        <Icon className="h-3.5 w-3.5 text-cv-muted" />
        <span className="text-xs text-cv-muted uppercase tracking-wider">{label}:</span>
        <span className="truncate max-w-[120px]">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 text-cv-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl border border-cv-line shadow-lg py-1 min-w-[180px] max-h-[240px] overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onSelect(opt.value); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm font-bold text-cv-body hover:bg-cv-soft hover:text-cv-ink transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
