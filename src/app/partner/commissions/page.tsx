'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, Clock, CircleCheck as CheckCircle2, Percent, Search } from 'lucide-react';
import { mockCommissions } from '@/data/mock';
import type { ConversionStatus } from '@/data/mock/types';
import { cn } from '@/lib/utils';

type FilterTab = 'ALL' | 'PENDING' | 'APPROVED' | 'PAID' | 'REVERSED';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PAID', label: 'Paid' },
  { key: 'REVERSED', label: 'Reversed' },
];

const RULE_LABELS: Record<string, string> = {
  FIXED: 'Fixed',
  PERCENTAGE: 'Percentage',
  TIERED: 'Tiered',
};

export default function PartnerCommissionsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [query, setQuery] = useState('');

  const fmtMoney = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtMoney2 = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const partnerCommissions = useMemo(
    () => mockCommissions.filter((c) => c.partnerId === 'p-1'),
    [],
  );

  const filtered = useMemo(() => {
    return partnerCommissions.filter((c) => {
      const matchesStatus = activeTab === 'ALL' || c.status === activeTab;
      const matchesQuery =
        !query ||
        c.plan.toLowerCase().includes(query.toLowerCase()) ||
        c.commissionRule.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [partnerCommissions, activeTab, query]);

  const counts = useMemo(() => {
    const base: Record<FilterTab, number> = {
      ALL: partnerCommissions.length,
      PENDING: 0,
      APPROVED: 0,
      PAID: 0,
      REVERSED: 0,
    };
    partnerCommissions.forEach((c) => {
      base[c.status as FilterTab] += 1;
    });
    return base;
  }, [partnerCommissions]);

  const statusToBadge = (status: ConversionStatus) =>
    status.toLowerCase() as 'pending' | 'approved' | 'paid' | 'reversed';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Commissions"
        title="Your commissions"
        description="A detailed breakdown of every commission earned across your plans and rules."
      />

      {/* Summary stat cards */}
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
          label="Paid"
          value={fmtMoney(4456)}
          icon={CheckCircle2}
          description="Total paid out"
        />
      </div>

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
            placeholder="Search plan or rule..."
            className="cv-input w-full pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Commissions table */}
      <Card className="cv-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Percent}
              title="No commissions found"
              description="Try changing the filter or search. Commissions appear here once conversions are attributed to you."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">
                    Sale Amount
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">
                    Commission Rule
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Rate</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">
                    Commission
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="border-cv-line">
                    <TableCell className="font-bold text-cv-ink text-sm">{c.plan}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">
                      {fmtMoney2(c.saleAmount)}
                    </TableCell>
                    <TableCell className="text-sm text-cv-body">
                      {c.commissionRule}
                    </TableCell>
                    <TableCell className="text-sm text-cv-body">{(c.rate * 100).toFixed(0)}%</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">
                      {fmtMoney2(c.commission)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={statusToBadge(c.status)} />
                    </TableCell>
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
