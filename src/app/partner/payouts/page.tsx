'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Wallet, Clock, CircleCheck as CheckCircle2, Banknote, CreditCard, Building2, Plus, Search, Eye } from 'lucide-react';
import { SupportLink } from '@/components/shared/SupportLink';
import { mockPayouts, mockCommissions, getPartnerIdByEmail } from '@/data/mock';
import type { PayoutStatus, MockPayout } from '@/data/mock/types';
import { cn } from '@/lib/utils';
import { useMockAuth, useEffectivePartner } from '@/hooks/useMockAuth';

type FilterTab = 'ALL' | PayoutStatus;

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
  const router = useRouter();
  const { user } = useMockAuth();
  const partner = useEffectivePartner();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MockPayout | null>(null);

  const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const partnerId = partner ? getPartnerIdByEmail(partner.email) : null;
  const partnerPayouts = useMemo(() => mockPayouts.filter((p) => p.partnerId === partnerId), [partnerId]);
  const partnerCommissions = useMemo(() => mockCommissions.filter((c) => c.partnerId === partnerId), [partnerId]);

  const stats = useMemo(() => {
    const available = partnerCommissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commission, 0);
    const pending = partnerCommissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commission, 0);
    const paid = partnerPayouts.filter(p => p.status === 'PAID').reduce((s, p) => s + p.amount, 0);
    return { available, pending, paid };
  }, [partnerCommissions, partnerPayouts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partnerPayouts.filter((p) => {
      const matchesStatus = activeTab === 'ALL' || p.status === activeTab;
      const matchesQuery = !q || p.reference.toLowerCase().includes(q) || METHOD_META[p.method]?.label.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [partnerPayouts, activeTab, query]);

  const counts = useMemo(() => {
    const base: Record<FilterTab, number> = { ALL: partnerPayouts.length, PENDING: 0, PROCESSING: 0, PAID: 0, FAILED: 0 };
    partnerPayouts.forEach((p) => { base[p.status as FilterTab] += 1; });
    return base;
  }, [partnerPayouts]);

  const statusToBadge = (status: PayoutStatus) =>
    status.toLowerCase() as 'pending' | 'processing' | 'paid' | 'failed';

  const payoutConfigured = true;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Payouts" title="Your payouts" description="Track payouts to your bank or PayPal, and manage your payout method." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Available Balance" value={fmtMoney(stats.available)} icon={Wallet} description="Ready for payout" />
        <StatCard label="Pending" value={fmtMoney(stats.pending)} icon={Clock} description="Awaiting approval" />
        <StatCard label="Total Paid" value={fmtMoney(stats.paid)} icon={CheckCircle2} description="All-time paid out" />
      </div>

      {/* Payout setup status */}
      <Card className="cv-card">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft shrink-0">
                {payoutConfigured ? <Building2 className="h-5 w-5 text-cv-ink" /> : <Wallet className="h-5 w-5 text-cv-muted" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-bold text-cv-ink">{payoutConfigured ? 'Payout method configured' : 'No payout method configured'}</p>
                  <StatusBadge status={payoutConfigured ? 'connected' : 'none'} />
                </div>
                <p className="text-sm text-cv-muted mt-1">
                  {payoutConfigured ? 'Bank Transfer · Account ending in 8842 · Payouts sent on the 1st of each month.' : 'Add a payout method so your available balance can be sent to you.'}
                </p>
              </div>
            </div>
            <Button variant="outline" className="rounded-full border-cv-line font-bold shrink-0" onClick={() => router.push('/partner/settings')}>
              {payoutConfigured ? 'Manage method' : (<><Plus className="h-4 w-4 mr-1.5" />Add payout method</>)}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex bg-cv-soft rounded-lg p-0.5 w-fit overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn('px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap', activeTab === tab.key ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink')}>
              {tab.label}<span className="ml-1.5 text-[10px] text-cv-muted">{counts[tab.key]}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reference or method..." className="cv-input w-full pl-9 h-9 text-sm" />
        </div>
      </div>

      <Card className="cv-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState icon={Wallet} title="No payouts yet" description={partnerPayouts.length === 0 ? "Payouts are sent on the 1st of each month once your available balance reaches the minimum threshold. Set up your payout method in Settings to get started." : "Try changing the filter or search above."} action={partnerPayouts.length === 0 ? <Button variant="outline" className="rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-sm" onClick={() => router.push('/partner/settings')}>Set up payouts</Button> : undefined} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Method</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Reference</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12"><span className="sr-only">View</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const meta = METHOD_META[p.method] ?? { label: p.method, icon: Banknote };
                  return (
                    <TableRow key={p.id} className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors" onClick={() => setSelected(p)}>
                      <TableCell className="text-sm text-cv-body">{fmtDate(p.date)}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney2(p.amount)}</TableCell>
                      <TableCell><span className="inline-flex items-center gap-2 text-sm text-cv-body"><meta.icon className="h-4 w-4 text-cv-muted" />{meta.label}</span></TableCell>
                      <TableCell><StatusBadge status={statusToBadge(p.status)} /></TableCell>
                      <TableCell className="text-xs font-bold text-cv-ink tabular-nums">{p.reference}</TableCell>
                      <TableCell className="text-right"><Eye className="h-4 w-4 text-cv-muted" /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SupportLink variant="card" context="Questions about your payout method, schedule, or balance? Reach out and we'll help." />

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Payout detail</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{selected ? selected.reference : ''}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 pt-1">
              <DetailRow label="Amount" value={fmtMoney2(selected.amount)} mono />
              <DetailRow label="Method" value={selected.method} />
              <DetailRow label="Date" value={fmtDate(selected.date)} />
              <DetailRow label="Reference" value={selected.reference} mono />
              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={statusToBadge(selected.status)} />
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
