'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { ArrowLeftRight, Search, Eye, Calendar, Store, ChevronDown, Share2, Link as LinkIcon } from 'lucide-react';
import { mockConversions, mockStorefronts, getPartnerIdByEmail } from '@/data/mock';
import type { MockConversion, ConversionStatus, AttributionState } from '@/data/mock/types';
import { SupportLink } from '@/components/shared/SupportLink';
import { cn } from '@/lib/utils';
import { useMockAuth, useEffectivePartner } from '@/hooks/useMockAuth';

type FilterTab = 'ALL' | ConversionStatus;
type DateFilter = 'ALL' | '7D' | '30D' | '90D';
type StorefrontFilter = 'ALL' | string;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PAID', label: 'Paid' },
  { key: 'REVERSED', label: 'Reversed' },
];

const DATE_FILTERS: { key: DateFilter; label: string }[] = [
  { key: 'ALL', label: 'All time' },
  { key: '7D', label: '7 days' },
  { key: '30D', label: '30 days' },
  { key: '90D', label: '90 days' },
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

export default function PartnerConversionsPage() {
  const router = useRouter();
  const { user, hasStorefrontAccess } = useMockAuth();
  const partner = useEffectivePartner();
  const isAffiliateOnly = partner?.partnerType === 'CREATOR' && !hasStorefrontAccess();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilter>('ALL');
  const [storefrontFilter, setStorefrontFilter] = useState<StorefrontFilter>('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<MockConversion | null>(null);

  const fmtMoney = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const partnerId = partner ? getPartnerIdByEmail(partner.email) : null;

  const partnerConversions = useMemo(
    () => mockConversions.filter((c) => c.partnerId === partnerId),
    [partnerId],
  );

  const partnerStorefronts = useMemo(() => {
    const ids = new Set(partnerConversions.map((c) => c.storefrontId));
    return mockStorefronts.filter((s) => ids.has(s.id));
  }, [partnerConversions]);

  const filtered = useMemo(() => {
    const now = new Date();
    return partnerConversions.filter((c) => {
      const matchesStatus = activeTab === 'ALL' || c.status === activeTab;
      const matchesStorefront = storefrontFilter === 'ALL' || c.storefrontId === storefrontFilter;
      const matchesQuery =
        !query ||
        c.plan.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.storefrontName.toLowerCase().includes(query.toLowerCase()) ||
        c.customerName.toLowerCase().includes(query.toLowerCase()) ||
        c.customerEmail.toLowerCase().includes(query.toLowerCase());

      let matchesDate = true;
      if (dateFilter !== 'ALL') {
        const convDate = new Date(c.date);
        const daysDiff = Math.floor((now.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dateFilter === '7D') matchesDate = daysDiff <= 7;
        else if (dateFilter === '30D') matchesDate = daysDiff <= 30;
        else if (dateFilter === '90D') matchesDate = daysDiff <= 90;
      }

      return matchesStatus && matchesStorefront && matchesQuery && matchesDate;
    });
  }, [partnerConversions, activeTab, storefrontFilter, query, dateFilter]);

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
        description={isAffiliateOnly ? "Track every sale attributed to your affiliate link and referral clicks." : "Track every sale attributed to your storefront, coupon codes, and referral links."}
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
            placeholder="Search customer, plan, ID..."
            className="cv-input w-full pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Additional filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          icon={Calendar}
          label="Date"
          value={DATE_FILTERS.find((d) => d.key === dateFilter)?.label || 'All time'}
          options={DATE_FILTERS.map((d) => ({ value: d.key, label: d.label }))}
          onSelect={(v) => setDateFilter(v as DateFilter)}
        />
        <FilterDropdown
          icon={Store}
          label="Storefront"
          value={storefrontFilter === 'ALL' ? 'All storefronts' : partnerStorefronts.find((s) => s.id === storefrontFilter)?.name || 'All storefronts'}
          options={[
            { value: 'ALL', label: 'All storefronts' },
            ...partnerStorefronts.map((s) => ({ value: s.id, label: s.name })),
          ]}
          onSelect={(v) => setStorefrontFilter(v)}
        />
        {(dateFilter !== 'ALL' || storefrontFilter !== 'ALL' || activeTab !== 'ALL' || query) && (
          <button
            onClick={() => { setDateFilter('ALL'); setStorefrontFilter('ALL'); setActiveTab('ALL'); setQuery(''); }}
            className="text-xs font-bold text-cv-muted hover:text-cv-ink transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Conversions table */}
      <Card className="cv-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={ArrowLeftRight}
              title="No conversions yet"
              description={partnerConversions.length === 0 ? (isAffiliateOnly ? "When customers purchase Careverse memberships through your affiliate link, their conversions will appear here with full attribution details. Share your link to start earning." : "When customers purchase Careverse plans through your storefront, their conversions will appear here with full attribution details. Share your store link to start earning.") : "Try changing the filters or search above."}
              action={partnerConversions.length === 0 ? <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={() => router.push('/partner')}><Share2 className="h-4 w-4" /> {isAffiliateOnly ? 'Share your link' : 'Share your store'}</Button> : undefined}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Customer</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Package</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Amount</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
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
                    <TableCell className="text-sm">
                      <p className="font-bold text-cv-ink">{c.customerName}</p>
                      <p className="text-xs text-cv-muted">{c.customerEmail}</p>
                    </TableCell>
                    <TableCell className="text-sm text-cv-body">{c.storefrontName}</TableCell>
                    <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                    <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney(c.saleAmount)}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.commission)}</TableCell>
                    <TableCell>
                      <StatusBadge status={statusToBadge(c.status)} />
                    </TableCell>
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

      <SupportLink variant="card" context="Questions about a conversion, attribution, or payout? Reach out and we'll help sort it out." />

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
            <div className="space-y-3 pt-1">
              <div className="rounded-xl bg-cv-soft p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Customer</p>
                <p className="text-sm font-bold text-cv-ink">{selected.customerName}</p>
                <p className="text-xs text-cv-muted">{selected.customerEmail}</p>
              </div>

              <DetailRow label="Storefront" value={selected.storefrontName} />
              <DetailRow label="Package" value={selected.plan} />
              <DetailRow label="Conversion Date" value={fmtDate(selected.date)} />
              <DetailRow label="Purchase Amount" value={fmtMoney(selected.saleAmount)} mono />
              <DetailRow label="Commission" value={fmtMoney(selected.commission)} mono />

              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={statusToBadge(selected.status)} />
              </div>

              {/* Attribution section */}
              <div className="rounded-xl border border-cv-line p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Attribution / Tracking</p>
                <DetailRow label="Tracking Source" value={selected.attributionSource} />
                <DetailRow label="Click ID" value={selected.clickId} mono />
                {selected.attributedVia && (
                  <DetailRow label="Attributed Via" value={
                    selected.attributedVia === 'LIDIA' ? 'Lidia' :
                    selected.attributedVia === 'AFFILIATE_LINK' ? 'Affiliate Link' :
                    'Storefront'
                  } />
                )}
                {selected.campaignSource && (
                  <DetailRow label="Campaign Source" value={selected.campaignSource} />
                )}
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
        <span>{value}</span>
        <ChevronDown className="h-3.5 w-3.5 text-cv-muted" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl border border-cv-line shadow-lg py-1 min-w-[180px]">
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
