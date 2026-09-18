'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Store, Search, Globe, Eye, ExternalLink, Pencil, Palette, Package as PackageIcon, BarChart3, MousePointerClick, Ban, RotateCcw, Power, PowerOff } from 'lucide-react';
import { mockStorefronts, mockPartners, mockProducts } from '@/data/mock';
import type { MockStorefront } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

type StatusFilter = 'ALL' | 'LIVE' | 'DRAFT' | 'SUSPENDED';
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'LIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export default function AdminStorefrontsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const partnerMap = useMemo(() => {
    const m = new Map<string, { name: string; avatarColor: string }>();
    mockPartners.forEach((p) => m.set(p.id, { name: p.name, avatarColor: p.avatarColor }));
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockStorefronts.filter((s) => {
      const sStatus = getStorefrontStatus(s);
      const matchesStatus = statusFilter === 'ALL' || sStatus === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        (s.customDomain || '').toLowerCase().includes(q)
      );
    });
  }, [search, statusFilter]);

  const [governanceStatus, setGovernanceStatus] = useState<Record<string, 'LIVE' | 'DRAFT' | 'SUSPENDED'>>({});

  const selectedStorefront = mockStorefronts.find((s) => s.id === selectedId) || null;

  const getStorefrontStatus = (s: MockStorefront): 'LIVE' | 'DRAFT' | 'SUSPENDED' => {
    return governanceStatus[s.id] || s.status;
  };

  const suspendStorefront = (id: string) => {
    setGovernanceStatus(prev => ({ ...prev, [id]: 'SUSPENDED' }));
  };

  const restoreStorefront = (id: string) => {
    setGovernanceStatus(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const unpublishStorefront = (id: string) => {
    setGovernanceStatus(prev => ({ ...prev, [id]: 'DRAFT' }));
  };

  const publishStorefront = (id: string) => {
    setGovernanceStatus(prev => {
      const next = { ...prev };
      delete next[id];
      return { ...next, [id]: 'LIVE' };
    });
  };

  const stats = useMemo(() => {
    const total = mockStorefronts.length;
    const live = mockStorefronts.filter((s) => getStorefrontStatus(s) === 'LIVE').length;
    const draft = mockStorefronts.filter((s) => getStorefrontStatus(s) === 'DRAFT').length;
    const suspended = mockStorefronts.filter((s) => getStorefrontStatus(s) === 'SUSPENDED').length;
    return { total, live, draft, suspended };
  }, [governanceStatus]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Storefronts"
        title="Storefronts"
        description="All partner storefronts across the platform, live and in draft."
        actions={
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90" size="sm" onClick={() => router.push('/partner/store')}>
            <Store className="h-4 w-4" />
            New Storefront
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Storefronts" value={stats.total} icon={Store} description="Across all partners" />
        <StatCard label="Active" value={stats.live} icon={Globe} description="Published & live" />
        <StatCard label="Draft" value={stats.draft} icon={Eye} description="Not yet published" />
        {stats.suspended > 0 && <StatCard label="Suspended" value={stats.suspended} icon={Ban} description="Temporarily disabled" />}
      </div>

      {/* Filters */}
      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input
                placeholder="Search storefronts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cv-input pl-9 h-11"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                    statusFilter === f.value ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
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
              description="Try a different search or filter to see storefronts."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Domain</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Visitors</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conv.</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => {
                    const partner = partnerMap.get(s.partnerId);
                    return (
                      <TableRow
                        key={s.id}
                        className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors"
                        onClick={() => setSelectedId(s.id)}
                      >
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
                        <TableCell className="text-xs text-cv-body">
                          {s.customDomain ? (
                            <div className="flex items-center gap-1.5">
                              <span>{s.customDomain}</span>
                              <StatusBadge status={s.domainStatus.toLowerCase() as any} />
                            </div>
                          ) : (
                            <StatusBadge status="none" />
                          )}
                        </TableCell>
                        <TableCell><StatusBadge status={getStorefrontStatus(s).toLowerCase() as any} /></TableCell>
                        <TableCell className="text-right text-sm text-cv-body">{s.visitors.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm text-cv-body">{s.conversions}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(s.revenue)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storefront detail */}
      <StorefrontDialog
        storefront={selectedStorefront}
        onClose={() => setSelectedId(null)}
        getStorefrontStatus={getStorefrontStatus}
        onSuspend={suspendStorefront}
        onRestore={restoreStorefront}
        onPublish={publishStorefront}
        onUnpublish={unpublishStorefront}
      />
    </div>
  );
}

function StorefrontDialog({
  storefront,
  onClose,
  getStorefrontStatus,
  onSuspend,
  onRestore,
  onPublish,
  onUnpublish,
}: {
  storefront: MockStorefront | null;
  onClose: () => void;
  getStorefrontStatus: (s: MockStorefront) => 'LIVE' | 'DRAFT' | 'SUSPENDED';
  onSuspend: (id: string) => void;
  onRestore: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
}) {
  const router = useRouter();
  const open = !!storefront;

  const partner = useMemo(
    () => (storefront ? mockPartners.find((p) => p.id === storefront.partnerId) || null : null),
    [storefront]
  );

  const storefrontProducts = useMemo(
    () => (storefront ? mockProducts.filter((p) => storefront.packages.includes(p.name)) : []),
    [storefront]
  );

  const analyticsData = useMemo(() => {
    if (!storefront) return [];
    const baseVisitors = storefront.visitors;
    return [
      { date: 'Week 1', visitors: Math.round(baseVisitors * 0.22), conversions: Math.round(storefront.conversions * 0.22) },
      { date: 'Week 2', visitors: Math.round(baseVisitors * 0.28), conversions: Math.round(storefront.conversions * 0.28) },
      { date: 'Week 3', visitors: Math.round(baseVisitors * 0.20), conversions: Math.round(storefront.conversions * 0.20) },
      { date: 'Week 4', visitors: Math.round(baseVisitors * 0.30), conversions: Math.round(storefront.conversions * 0.30) },
    ];
  }, [storefront]);

  const maxVisitors = Math.max(...analyticsData.map(d => d.visitors), 1);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto cv-card border-cv-line rounded-2xl bg-white p-0">
        {storefront && (
          <>
            <DialogHeader className="p-6 pb-4 border-b border-cv-line">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cv-soft">
                  <Store className="h-5 w-5 text-cv-ink" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-cv-ink">{storefront.name}</DialogTitle>
                  <DialogDescription className="text-sm text-cv-muted">{storefront.url}</DialogDescription>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={getStorefrontStatus(storefront).toLowerCase() as any} />
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 pb-6">
              <Tabs defaultValue="overview">
                <TabsList className="bg-cv-soft h-auto p-1 flex flex-wrap gap-1">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
                  <TabsTrigger value="branding" className="text-xs">Branding</TabsTrigger>
                  <TabsTrigger value="domain" className="text-xs">Domain</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField label="Name" value={storefront.name} />
                    <DetailField label="URL" value={storefront.url} />
                    <DetailField label="Status" value={<StatusBadge status={getStorefrontStatus(storefront).toLowerCase() as any} />} />
                    <DetailField label="Partner" value={partner?.name || '—'} />
                    <DetailField label="Visitors" value={String(storefront.visitors)} />
                    <DetailField label="Conversions" value={String(storefront.conversions)} />
                    <DetailField label="Revenue" value={fmtMoney(storefront.revenue)} />
                    <DetailField label="Commission" value={fmtMoney(storefront.commission)} />
                  </div>
                  {storefront.introCopy && (
                    <div className="mt-3 rounded-xl bg-cv-soft p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Intro Copy</p>
                      <p className="text-sm text-cv-body">{storefront.introCopy}</p>
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft text-xs" onClick={() => router.push('/storefront')}>
                      <ExternalLink className="h-3.5 w-3.5" /> View storefront
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft text-xs" onClick={() => router.push('/partner/store')}>
                      <Pencil className="h-3.5 w-3.5" /> Open builder
                    </Button>
                  </div>
                  {/* Governance actions */}
                  <div className="mt-4 pt-4 border-t border-cv-line">
                    <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Storefront Governance</p>
                    <div className="flex flex-wrap gap-2">
                      {getStorefrontStatus(storefront) === 'LIVE' && (
                        <Button variant="outline" className="rounded-full border-cv-line text-xs text-amber-600 hover:bg-amber-50" onClick={() => onUnpublish(storefront.id)}>
                          <PowerOff className="h-3.5 w-3.5" /> Unpublish
                        </Button>
                      )}
                      {getStorefrontStatus(storefront) === 'DRAFT' && (
                        <Button variant="outline" className="rounded-full border-cv-line text-xs text-cv-good hover:bg-emerald-50" onClick={() => onPublish(storefront.id)}>
                          <Power className="h-3.5 w-3.5" /> Publish
                        </Button>
                      )}
                      {getStorefrontStatus(storefront) !== 'SUSPENDED' && (
                        <Button variant="outline" className="rounded-full border-cv-line text-xs text-cv-red hover:bg-red-50" onClick={() => onSuspend(storefront.id)}>
                          <Ban className="h-3.5 w-3.5" /> Suspend
                        </Button>
                      )}
                      {getStorefrontStatus(storefront) === 'SUSPENDED' && (
                        <Button variant="outline" className="rounded-full border-cv-line text-xs text-cv-good hover:bg-emerald-50" onClick={() => onRestore(storefront.id)}>
                          <RotateCcw className="h-3.5 w-3.5" /> Restore
                        </Button>
                      )}
                    </div>
                    {getStorefrontStatus(storefront) === 'SUSPENDED' && (
                      <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <p className="text-xs text-amber-800">This storefront is suspended. It shows a temporary unavailable message to visitors. Partner-owned content is preserved.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Products */}
                <TabsContent value="products" className="mt-4">
                  {storefrontProducts.length === 0 ? (
                    <EmptyState icon={PackageIcon} title="No products" description="This storefront has no packages assigned." />
                  ) : (
                    <div className="space-y-2">
                      {storefrontProducts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-xl bg-cv-soft p-3">
                          <div>
                            <p className="text-sm font-bold text-cv-ink">{p.name}</p>
                            <p className="text-xs text-cv-muted">${p.price}/mo · {p.billingType.toLowerCase()}</p>
                          </div>
                          <StatusBadge status={p.availability === 'AVAILABLE' ? 'available' : 'none'} />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Branding */}
                <TabsContent value="branding" className="mt-4">
                  <div className="space-y-3">
                    <DetailField label="Storefront Name" value={storefront.name} />
                    <DetailField label="Intro Copy" value={storefront.introCopy || '—'} />
                    <div className="rounded-xl bg-cv-soft p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className="h-4 w-4 text-cv-muted" />
                        <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Brand Colors</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-lg bg-cv-ink border border-cv-line" />
                        <div className="h-8 w-8 rounded-lg bg-cv-red border border-cv-line" />
                        <div className="h-8 w-8 rounded-lg bg-cv-cream border border-cv-line" />
                        <div className="h-8 w-8 rounded-lg bg-white border border-cv-line" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Domain */}
                <TabsContent value="domain" className="mt-4">
                  <div className="space-y-3">
                    <DetailField label="Default URL" value={storefront.url} />
                    <DetailField label="Custom Domain" value={storefront.customDomain || 'Not configured'} />
                    <DetailField label="Domain Status" value={
                      <StatusBadge status={storefront.domainStatus.toLowerCase() as any} />
                    } />
                  </div>
                </TabsContent>

                {/* Analytics */}
                <TabsContent value="analytics" className="mt-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-xl bg-cv-soft p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MousePointerClick className="h-3.5 w-3.5 text-cv-muted" />
                        <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Visitors</p>
                      </div>
                      <p className="text-lg font-bold text-cv-ink">{storefront.visitors.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-cv-soft p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <BarChart3 className="h-3.5 w-3.5 text-cv-muted" />
                        <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Conversions</p>
                      </div>
                      <p className="text-lg font-bold text-cv-ink">{storefront.conversions}</p>
                    </div>
                    <div className="rounded-xl bg-cv-soft p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Globe className="h-3.5 w-3.5 text-cv-muted" />
                        <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Conv. Rate</p>
                      </div>
                      <p className="text-lg font-bold text-cv-ink">{(storefront.conversions / Math.max(storefront.visitors, 1) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-2 h-40 pt-2">
                    {analyticsData.map((d, i) => {
                      const heightPct = (d.visitors / maxVisitors) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full flex-1 flex items-end justify-center relative">
                            <div className="absolute -top-5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-cv-ink whitespace-nowrap">
                              {d.visitors}
                            </div>
                            <div className="w-full max-w-[60px] rounded-t-lg bg-cv-ink hover:bg-cv-red transition-colors" style={{ height: `${Math.max(heightPct, 4)}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-cv-muted">{d.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-cv-soft p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">{label}</p>
      <div className="text-sm font-bold text-cv-ink">{value}</div>
    </div>
  );
}
