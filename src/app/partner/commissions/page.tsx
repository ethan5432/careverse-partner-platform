'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Wallet, Clock, CircleCheck as CheckCircle2, Percent, Search, Eye, Share2 } from 'lucide-react';
import { SupportLink } from '@/components/shared/SupportLink';
import { mockCommissions } from '@/data/mock';
import type { CommissionStatus, MockCommission } from '@/data/mock/types';
import { cn } from '@/lib/utils';

type FilterTab = 'ALL' | CommissionStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PAID', label: 'Paid' },
  { key: 'REVERSED', label: 'Reversed' },
];

export default function PartnerCommissionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MockCommission | null>(null);

  const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const partnerCommissions = useMemo(
    () => mockCommissions.filter((c) => c.partnerId === 'p-1'),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partnerCommissions.filter((c) => {
      const matchesStatus = activeTab === 'ALL' || c.status === activeTab;
      const matchesQuery = !q || c.plan.toLowerCase().includes(q) || c.conversionId.toLowerCase().includes(q) || c.customerName.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [partnerCommissions, activeTab, query]);

  const counts = useMemo(() => {
    const base: Record<FilterTab, number> = { ALL: partnerCommissions.length, PENDING: 0, APPROVED: 0, PAID: 0, REVERSED: 0 };
    partnerCommissions.forEach((c) => { base[c.status as FilterTab] += 1; });
    return base;
  }, [partnerCommissions]);

  const stats = useMemo(() => {
    const available = partnerCommissions.filter(c => c.status === 'APPROVED').reduce((s, c) => s + c.commission, 0);
    const pending = partnerCommissions.filter(c => c.status === 'PENDING').reduce((s, c) => s + c.commission, 0);
    const paid = partnerCommissions.filter(c => c.status === 'PAID').reduce((s, c) => s + c.commission, 0);
    return { available, pending, paid };
  }, [partnerCommissions]);

  const statusToBadge = (status: CommissionStatus) =>
    status.toLowerCase() as 'pending' | 'approved' | 'paid' | 'reversed';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Commissions" title="Your commissions" description="A detailed breakdown of every commission earned from your conversions." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Available" value={fmtMoney(stats.available)} icon={Wallet} description="Ready for payout" />
        <StatCard label="Pending" value={fmtMoney(stats.pending)} icon={Clock} description="Awaiting approval" />
        <StatCard label="Paid" value={fmtMoney(stats.paid)} icon={CheckCircle2} description="Total paid out" />
      </div>

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
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search plan, conversion, customer..." className="cv-input w-full pl-9 h-9 text-sm" />
        </div>
      </div>

      <Card className="cv-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState icon={Percent} title="No commissions yet" description={partnerCommissions.length === 0 ? "Commissions are earned when customers purchase through your storefront. Each approved conversion generates a commission entry here with your earnings breakdown." : "Try changing the filter or search above."} action={partnerCommissions.length === 0 ? <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={() => router.push('/partner')}><Share2 className="h-4 w-4" /> Share your store</Button> : undefined} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Conversion</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Package</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Purchase Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12"><span className="sr-only">View</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors" onClick={() => setSelected(c)}>
                    <TableCell className="text-xs font-bold text-cv-body tabular-nums">{c.conversionId}</TableCell>
                    <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney2(c.saleAmount)}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney2(c.commission)}</TableCell>
                    <TableCell><StatusBadge status={statusToBadge(c.status)} /></TableCell>
                    <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                    <TableCell className="text-right"><Eye className="h-4 w-4 text-cv-muted" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SupportLink variant="card" context="Questions about your commission rates, calculations, or payout schedule? We're here to help." />

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Commission details</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{selected ? `Commission ${selected.id}` : ''}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
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
                <DetailRow label="Storefront" value={selected.storefrontName} />
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
