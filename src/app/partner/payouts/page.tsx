'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, Clock, CircleCheck as CheckCircle2, Banknote, CreditCard, Building2, Plus, Search } from 'lucide-react';
import { mockPayouts } from '@/data/mock';
import type { PayoutStatus } from '@/data/mock/types';
import { cn } from '@/lib/utils';

type FilterTab = 'ALL' | 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'PAID', label: 'Paid' },
  { key: 'FAILED', label: 'Failed' },
];

const METHOD_META: Record<string, { label: string; icon: React.ElementType }> = {
  'Bank Transfer': { label: 'Bank Transfer', icon: Building2 },
  PAYPAL: { label: 'PayPal', icon: CreditCard },
  STRIPE: { label: 'Stripe', icon: Banknote },
  BANK: { label: 'Bank Transfer', icon: Building2 },
};

export default function PartnerPayoutsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [query, setQuery] = useState('');

  const fmtMoney = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtMoney2 = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const partnerPayouts = useMemo(
    () => mockPayouts.filter((p) => p.partnerId === 'p-1'),
    [],
  );

  const filtered = useMemo(() => {
    return partnerPayouts.filter((p) => {
      const matchesStatus = activeTab === 'ALL' || p.status === activeTab;
      const matchesQuery =
        !query ||
        p.reference.toLowerCase().includes(query.toLowerCase()) ||
        METHOD_META[p.method]?.label.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [partnerPayouts, activeTab, query]);

  const counts = useMemo(() => {
    const base: Record<FilterTab, number> = {
      ALL: partnerPayouts.length,
      PENDING: 0,
      PROCESSING: 0,
      PAID: 0,
      FAILED: 0,
    };
    partnerPayouts.forEach((p) => {
      base[p.status as FilterTab] += 1;
    });
    return base;
  }, [partnerPayouts]);

  const statusToBadge = (status: PayoutStatus) =>
    status.toLowerCase() as 'pending' | 'processing' | 'paid' | 'failed';

  // Mock payout setup status — "configured" with a bank transfer method
  const payoutConfigured = true;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payouts"
        title="Your payouts"
        description="Track payouts to your bank or PayPal, and manage your payout method."
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Available"
          value={fmtMoney(5696)}
          icon={Wallet}
          description="Ready for payout"
        />
        <StatCard
          label="Pending"
          value={fmtMoney(1240)}
          icon={Clock}
          description="Awaiting approval"
        />
        <StatCard
          label="Total Paid"
          value={fmtMoney(4456)}
          icon={CheckCircle2}
          description="All-time paid out"
        />
      </div>

      {/* Payout setup status card */}
      <Card className="cv-card">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft shrink-0">
                {payoutConfigured ? (
                  <Building2 className="h-5 w-5 text-cv-ink" />
                ) : (
                  <Wallet className="h-5 w-5 text-cv-muted" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-cv-ink">
                    {payoutConfigured ? 'Payout method configured' : 'No payout method configured'}
                  </p>
                  <StatusBadge status={payoutConfigured ? 'connected' : 'none'} />
                </div>
                <p className="text-sm text-cv-muted mt-1">
                  {payoutConfigured
                    ? 'Bank Transfer · Account ending in 8842 · Payouts sent on the 1st of each month.'
                    : 'Add a payout method so your available balance can be sent to you.'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold shrink-0"
            >
              {payoutConfigured ? (
                'Manage method'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add payout method
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

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
              <span className="ml-1.5 text-[10px] text-cv-muted">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference or method..."
            className="cv-input w-full pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Payouts table */}
      <Card className="cv-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No payouts found"
              description="Try changing the filter or search. Payouts appear here once your available balance is sent."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Method</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const meta = METHOD_META[p.method] ?? { label: p.method, icon: Banknote };
                  return (
                    <TableRow key={p.id} className="border-cv-line">
                      <TableCell className="text-sm text-cv-body">{fmtDate(p.date)}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">
                        {fmtMoney2(p.amount)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-2 text-sm text-cv-body">
                          <meta.icon className="h-4 w-4 text-cv-muted" />
                          {meta.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={statusToBadge(p.status)} />
                      </TableCell>
                      <TableCell className="text-xs font-bold text-cv-ink tabular-nums">
                        {p.reference}
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
