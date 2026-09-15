'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ArrowLeftRight, Search, Eye } from 'lucide-react';
import { mockConversions } from '@/data/mock';
import type { MockConversion, ConversionStatus } from '@/data/mock/types';
import { cn } from '@/lib/utils';

type FilterTab = 'ALL' | 'PENDING' | 'APPROVED' | 'PAID' | 'REVERSED';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PAID', label: 'Paid' },
  { key: 'REVERSED', label: 'Reversed' },
];

export default function PartnerConversionsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MockConversion | null>(null);

  const fmtMoney = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const partnerConversions = useMemo(
    () => mockConversions.filter((c) => c.partnerId === 'p-1'),
    [],
  );

  const filtered = useMemo(() => {
    return partnerConversions.filter((c) => {
      const matchesStatus = activeTab === 'ALL' || c.status === activeTab;
      const matchesQuery =
        !query ||
        c.plan.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.storefrontName.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [partnerConversions, activeTab, query]);

  const counts = useMemo(() => {
    const base: Record<FilterTab, number> = {
      ALL: partnerConversions.length,
      PENDING: 0,
      APPROVED: 0,
      PAID: 0,
      REVERSED: 0,
    };
    partnerConversions.forEach((c) => {
      base[c.status as FilterTab] += 1;
    });
    return base;
  }, [partnerConversions]);

  const statusToBadge = (status: ConversionStatus) =>
    status.toLowerCase() as 'pending' | 'approved' | 'paid' | 'reversed';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Conversions"
        title="Your conversions"
        description="Track every sale attributed to your storefront, coupon codes, and referral links."
      />

      {/* Filter tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex bg-cv-soft rounded-lg p-0.5 w-fit overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-white text-cv-ink shadow-sm'
                  : 'text-cv-muted hover:text-cv-ink',
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] text-cv-muted">
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plan, ID, or storefront..."
            className="cv-input w-full pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Conversions table */}
      <Card className="cv-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title="No conversions found"
              description="Try changing the filter or search. Conversions will appear here once customers purchase through your storefront."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">
                    Sale Amount
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">
                    Commission
                  </TableHead>
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
                    className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors"
                    onClick={() => setSelected(c)}
                  >
                    <TableCell className="font-bold text-cv-ink text-sm">{c.plan}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">
                      {fmtMoney(c.saleAmount)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">
                      {fmtMoney(c.commission)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={statusToBadge(c.status)} />
                    </TableCell>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Conversion details</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">
              {selected ? `Conversion ${selected.id}` : ''}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-3 pt-1">
              <DetailRow label="Plan" value={selected.plan} />
              <DetailRow
                label="Sale Amount"
                value={fmtMoney(selected.saleAmount)}
                mono
              />
              <DetailRow label="Partner / Storefront" value={selected.storefrontName} />
              <DetailRow label="Attribution Source" value={selected.attributionSource} />
              <DetailRow
                label="Commission"
                value={fmtMoney(selected.commission)}
                mono
              />
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">
                  Status
                </span>
                <StatusBadge status={statusToBadge(selected.status)} />
              </div>
              <DetailRow label="Date" value={fmtDate(selected.date)} />
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
