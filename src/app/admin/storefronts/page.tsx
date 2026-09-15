'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Store, Search, Globe, Eye, ArrowLeftRight, DollarSign, ExternalLink } from 'lucide-react';
import { mockStorefronts, mockPartners } from '@/data/mock';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function AdminStorefrontsPage() {
  const [search, setSearch] = useState('');

  const partnerMap = useMemo(() => {
    const m = new Map<string, { name: string; avatarColor: string }>();
    mockPartners.forEach((p) => m.set(p.id, { name: p.name, avatarColor: p.avatarColor }));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockStorefronts.filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        (s.customDomain || '').toLowerCase().includes(q)
      );
    });
  }, [search]);

  const stats = useMemo(() => {
    const total = mockStorefronts.length;
    const live = mockStorefronts.filter((s) => s.status === 'LIVE').length;
    const draft = mockStorefronts.filter((s) => s.status === 'DRAFT').length;
    return { total, live, draft };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Storefronts"
        title="Storefront Management"
        description="All partner storefronts across the platform, live and in draft."
        actions={
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90" size="sm">
            <Store className="h-4 w-4" />
            New Storefront
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Storefronts" value={stats.total} icon={Store} description="Across all partners" />
        <StatCard label="Live" value={stats.live} icon={Globe} description="Published & active" />
        <StatCard label="Draft" value={stats.draft} icon={Eye} description="Not yet published" />
      </div>

      {/* Search */}
      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
            <Input
              placeholder="Search storefronts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="cv-input pl-9 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No storefronts found"
              description="Try a different search to see storefronts."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line hover:bg-transparent">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Visitors</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const partner = partnerMap.get(s.partnerId);
                  return (
                    <TableRow key={s.id} className="border-cv-line hover:bg-cv-soft/60 transition-colors">
                      <TableCell>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-cv-ink truncate">{s.name}</p>
                          <div className="flex items-center gap-1 text-xs text-cv-muted">
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate">{s.url}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={partner?.name || '?'} color={partner?.avatarColor} size={26} />
                          <span className="text-sm text-cv-body">{partner?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={s.status.toLowerCase() as any} /></TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{s.visitors.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{s.conversions}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(s.revenue)}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{fmtMoney(s.commission)}</TableCell>
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
