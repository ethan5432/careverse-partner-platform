'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Package, Check, Star, RefreshCw, Cloud, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { mockProducts } from '@/data/mock';
import type { MockProduct } from '@/data/mock/types';
import { cn } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<MockProduct[]>(mockProducts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncedAt, setSyncedAt] = useState<string>('2026-09-15T10:00:00Z');

  const selectedProduct = products.find((p) => p.id === selectedId) || null;
  const fmtPrice = (n: number) => `$${n}`;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      setSyncedAt(now);
      setProducts((prev) => prev.map((p) => ({ ...p, syncStatus: 'SYNCED' as const, lastSyncedAt: now })));
      setSyncing(false);
    }, 2000);
  };

  const toggleAvailability = (id: string) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, availability: p.availability === 'AVAILABLE' ? 'COMING_SOON' : 'AVAILABLE' } : p));
  };

  const syncedDate = new Date(syncedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Products"
        title="Membership Catalog"
        description="The centralized Careverse membership plans available to every partner storefront."
        actions={
          <Button
            className="cv-btn-primary cv-btn-sm rounded-full"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {syncing ? 'Syncing...' : 'Sync from Careverse'}
          </Button>
        }
      />

      {/* Sync status banner */}
      <Card className="cv-card">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <Cloud className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <p className="text-sm font-bold text-cv-ink">Careverse Benefits Package Source</p>
                <p className="text-xs text-cv-muted mt-0.5">
                  Last synced: {syncedDate} · {products.filter((p) => p.syncStatus === 'SYNCED').length}/{products.length} packages synced
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="connected" label="Connected" />
              <a href="https://careverse.ai" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cv-ink flex items-center gap-1 hover:text-cv-red transition-colors">
                View source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cv-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
              <Package className="h-5 w-5 text-cv-ink" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Total Packages</p>
              <p className="text-2xl font-bold text-cv-ink">{products.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cv-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Check className="h-5 w-5 text-cv-good" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Available</p>
              <p className="text-2xl font-bold text-cv-ink">{products.filter((p) => p.availability === 'AVAILABLE').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cv-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
              <Star className="h-5 w-5 text-cv-ink" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Most Popular</p>
              <p className="text-2xl font-bold text-cv-ink">{products.find((p) => p.popular)?.name ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <Card
            key={p.id}
            className={cn(
              'cv-card relative flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-shadow',
              p.popular && 'ring-2 ring-cv-red ring-offset-2 ring-offset-cv-cream'
            )}
            onClick={() => setSelectedId(p.id)}
          >
            {p.popular && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-cv-red px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  <Star className="h-3 w-3" /> Popular
                </span>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cv-soft">
                  <Package className="h-5 w-5 text-cv-ink" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-cv-ink">{p.name}</CardTitle>
                  <p className="text-xs text-cv-muted mt-0.5">{p.billingType.charAt(0) + p.billingType.slice(1).toLowerCase()} billing</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-cv-ink">{fmtPrice(p.price)}</span>
                <span className="text-sm text-cv-muted">/mo</span>
              </div>
              <p className="text-sm text-cv-body leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={p.status === 'ACTIVE' ? 'active' : 'draft'} />
                <StatusBadge status={p.availability === 'AVAILABLE' ? 'available' : 'none'} label={p.availability === 'AVAILABLE' ? 'Available' : 'Coming Soon'} />
                {p.syncStatus === 'SYNCED' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-cv-good">
                    <Check className="h-2.5 w-2.5" /> Synced
                  </span>
                )}
              </div>
              <div className="rounded-2xl border border-cv-line bg-cv-soft/40 p-4 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-3">What's included</p>
                <ul className="space-y-2.5">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cv-good">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                      <span className="text-sm text-cv-body">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Package detail dialog — read-only with availability toggle */}
      <Dialog open={!!selectedProduct} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-2xl cv-card border-cv-line rounded-2xl bg-white p-0 max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <div className="p-6 space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cv-soft">
                    <Package className="h-6 w-6 text-cv-ink" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-lg font-bold text-cv-ink">{selectedProduct.name}</DialogTitle>
                    <DialogDescription className="text-sm text-cv-muted">
                      {selectedProduct.billingType.charAt(0) + selectedProduct.billingType.slice(1).toLowerCase()} billing · {selectedProduct.partnerAvailability === 'ALL' ? 'All partner types' : selectedProduct.partnerAvailability + ' partners only'}
                    </DialogDescription>
                  </div>
                  {selectedProduct.popular && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cv-red px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      <Star className="h-3 w-3" /> Popular
                    </span>
                  )}
                </div>
              </DialogHeader>

              {/* Source attribution */}
              <div className="flex items-center gap-2 text-xs text-cv-muted bg-cv-soft/50 rounded-lg p-3">
                <Cloud className="h-3.5 w-3.5" />
                <span>Source ID: <span className="font-bold text-cv-ink">{selectedProduct.sourceId}</span></span>
                <span className="mx-1">·</span>
                <Clock className="h-3.5 w-3.5" />
                <span>Synced: {selectedProduct.lastSyncedAt ? new Date(selectedProduct.lastSyncedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}</span>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="bg-cv-soft rounded-lg p-0.5 h-auto w-full">
                  <TabsTrigger value="details" className="rounded-md flex-1 text-xs font-bold">Details</TabsTrigger>
                  <TabsTrigger value="benefits" className="rounded-md flex-1 text-xs font-bold">Benefits</TabsTrigger>
                  <TabsTrigger value="availability" className="rounded-md flex-1 text-xs font-bold">Availability</TabsTrigger>
                </TabsList>

                {/* Details tab — read-only */}
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Package Name</p>
                    <p className="text-sm text-cv-ink font-bold">{selectedProduct.name}</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Description</p>
                    <p className="text-sm text-cv-body leading-relaxed">{selectedProduct.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Price</p>
                      <p className="text-2xl font-bold text-cv-ink">{fmtPrice(selectedProduct.price)}<span className="text-sm text-cv-muted">/mo</span></p>
                    </div>
                    <div className="grid gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Billing Type</p>
                      <p className="text-sm text-cv-body">{selectedProduct.billingType.charAt(0) + selectedProduct.billingType.slice(1).toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-cv-soft/40 border border-cv-line p-3 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-cv-muted shrink-0 mt-0.5" />
                    <p className="text-xs text-cv-muted">Package content is managed by the Careverse Benefits source. Use the Sync button to pull updates.</p>
                  </div>
                </TabsContent>

                {/* Benefits tab — read-only */}
                <TabsContent value="benefits" className="mt-4 space-y-3">
                  {selectedProduct.benefits.map((b, i) => (
                    <div key={i} className="rounded-xl border border-cv-line p-4 space-y-2">
                      <p className="text-sm font-bold text-cv-ink">{b.title}</p>
                      <p className="text-xs text-cv-body leading-relaxed">{b.description}</p>
                    </div>
                  ))}
                  <div className="rounded-2xl border border-cv-line bg-cv-soft/40 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-3">Package Features</p>
                    <ul className="space-y-2.5">
                      {selectedProduct.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cv-good">
                            <Check className="h-2.5 w-2.5 text-white" />
                          </span>
                          <span className="text-sm text-cv-body">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Availability tab — admin can toggle availability */}
                <TabsContent value="availability" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</p>
                      <StatusBadge status={selectedProduct.status === 'ACTIVE' ? 'active' : 'draft'} />
                    </div>
                    <div className="grid gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Partner Availability</p>
                      <p className="text-sm text-cv-body">{selectedProduct.partnerAvailability === 'ALL' ? 'All partner types' : selectedProduct.partnerAvailability + ' partners only'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-cv-line">
                    <div>
                      <p className="text-sm font-bold text-cv-ink">Available for partner storefronts</p>
                      <p className="text-xs text-cv-muted mt-0.5">When enabled, partners can select this package for their storefront</p>
                    </div>
                    <Switch
                      checked={selectedProduct.availability === 'AVAILABLE'}
                      onCheckedChange={() => toggleAvailability(selectedProduct.id)}
                    />
                  </div>
                  {selectedProduct.availability === 'COMING_SOON' && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">This package is currently hidden from partners. They won't see it in their storefront builder until you make it available.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft" onClick={() => setSelectedId(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
