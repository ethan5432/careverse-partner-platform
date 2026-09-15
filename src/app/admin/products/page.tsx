'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Check, Star, Plus, Pencil } from 'lucide-react';
import { mockProducts } from '@/data/mock';
import { cn } from '@/lib/utils';

export default function AdminProductsPage() {
  const fmtPrice = (n: number) => `$${n}`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Products"
        title="Membership Catalog"
        description="The centralized Careverse membership plans available to every partner storefront."
        actions={<Button className="cv-btn-primary cv-btn-sm rounded-full"><Plus className="h-4 w-4" /> Add Product</Button>}
      />

      {/* Summary bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cv-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
              <Package className="h-5 w-5 text-cv-ink" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Total Products</p>
              <p className="text-2xl font-bold text-cv-ink">{mockProducts.length}</p>
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
              <p className="text-2xl font-bold text-cv-ink">{mockProducts.filter(p => p.availability === 'AVAILABLE').length}</p>
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
              <p className="text-2xl font-bold text-cv-ink">{mockProducts.find(p => p.popular)?.name ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockProducts.map((p) => (
          <Card key={p.id} className={cn('cv-card relative flex flex-col overflow-hidden', p.popular && 'ring-2 ring-cv-red ring-offset-2 ring-offset-cv-cream')}>
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
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-cv-ink">{fmtPrice(p.price)}</span>
                <span className="text-sm text-cv-muted">/mo</span>
              </div>

              {/* Description */}
              <p className="text-sm text-cv-body leading-relaxed">{p.description}</p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={p.status === 'ACTIVE' ? 'active' : 'draft'} />
                <StatusBadge status={p.availability === 'AVAILABLE' ? 'available' : 'none'} label={p.availability === 'AVAILABLE' ? 'Available' : 'Coming Soon'} />
              </div>

              {/* Features */}
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

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button className="cv-btn-primary cv-btn-sm rounded-full flex-1">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
