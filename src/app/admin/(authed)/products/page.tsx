'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, Check, Star, Pencil, Save, Plus, Trash2 } from 'lucide-react';
import { mockProducts } from '@/data/mock';
import type { MockProduct } from '@/data/mock/types';
import { cn } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<MockProduct[]>(mockProducts);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedId) || null;

  const fmtPrice = (n: number) => `$${n}`;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditMode(false); }, 2000);
  };

  const updateField = <K extends keyof MockProduct>(key: K, value: MockProduct[K]) => {
    if (!selectedProduct) return;
    setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? { ...p, [key]: value } : p)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Products"
        title="Membership Catalog"
        description="The centralized Careverse membership plans available to every partner storefront."
        actions={<Button className="cv-btn-primary cv-btn-sm rounded-full"><Plus className="h-4 w-4" /> New Product</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cv-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
              <Package className="h-5 w-5 text-cv-ink" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Total Products</p>
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <Card
            key={p.id}
            className={cn('cv-card relative flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-shadow', p.popular && 'ring-2 ring-cv-red ring-offset-2 ring-offset-cv-cream')}
            onClick={() => { setSelectedId(p.id); setEditMode(false); }}
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

      {/* Product detail/edit dialog */}
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
                    <DialogTitle className="text-lg font-bold text-cv-ink">
                      {editMode ? 'Edit Product' : selectedProduct.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-cv-muted">
                      {editMode ? 'Modify product details and save changes' : `${selectedProduct.billingType.charAt(0) + selectedProduct.billingType.slice(1).toLowerCase()} billing · ${selectedProduct.partnerAvailability === 'ALL' ? 'All partner types' : selectedProduct.partnerAvailability + ' partners only'}`}
                    </DialogDescription>
                  </div>
                  {selectedProduct.popular && !editMode && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-cv-red px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      <Star className="h-3 w-3" /> Popular
                    </span>
                  )}
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="bg-cv-soft rounded-lg p-0.5 h-auto w-full">
                  <TabsTrigger value="details" className="rounded-md flex-1 text-xs font-bold">Details</TabsTrigger>
                  <TabsTrigger value="benefits" className="rounded-md flex-1 text-xs font-bold">Benefits</TabsTrigger>
                  <TabsTrigger value="availability" className="rounded-md flex-1 text-xs font-bold">Availability</TabsTrigger>
                </TabsList>

                {/* Details tab */}
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">Product Name</Label>
                    {editMode ? (
                      <Input value={selectedProduct.name} onChange={(e) => updateField('name', e.target.value)} className="cv-input" />
                    ) : (
                      <p className="text-sm text-cv-body">{selectedProduct.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">Description</Label>
                    {editMode ? (
                      <Textarea value={selectedProduct.description} onChange={(e) => updateField('description', e.target.value)} className="cv-input min-h-[80px] rounded-2xl" />
                    ) : (
                      <p className="text-sm text-cv-body leading-relaxed">{selectedProduct.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label className="text-sm font-bold text-cv-ink">Price ($/mo)</Label>
                      {editMode ? (
                        <div className="relative">
                          <Input type="number" value={selectedProduct.price} onChange={(e) => updateField('price', Number(e.target.value))} className="cv-input pr-8" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-cv-muted">$</span>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-cv-ink">{fmtPrice(selectedProduct.price)}<span className="text-sm text-cv-muted">/mo</span></p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm font-bold text-cv-ink">Billing Type</Label>
                      {editMode ? (
                        <Select value={selectedProduct.billingType} onValueChange={(v) => updateField('billingType', v as MockProduct['billingType'])}>
                          <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="MONTHLY">Monthly</SelectItem><SelectItem value="ANNUAL">Annual</SelectItem></SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm text-cv-body">{selectedProduct.billingType.charAt(0) + selectedProduct.billingType.slice(1).toLowerCase()}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Benefits tab */}
                <TabsContent value="benefits" className="mt-4 space-y-3">
                  {selectedProduct.benefits.map((b, i) => (
                    <div key={i} className="rounded-xl border border-cv-line p-4 space-y-2">
                      {editMode ? (
                        <>
                          <div className="flex items-center justify-between">
                            <Input value={b.title} onChange={(e) => {
                              const benefits = [...selectedProduct.benefits];
                              benefits[i] = { ...b, title: e.target.value };
                              updateField('benefits', benefits);
                            }} className="cv-input font-bold text-sm" placeholder="Benefit title" />
                            <button onClick={() => updateField('benefits', selectedProduct.benefits.filter((_, idx) => idx !== i))} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors ml-2">
                              <Trash2 className="h-3.5 w-3.5 text-cv-red" />
                            </button>
                          </div>
                          <Textarea value={b.description} onChange={(e) => {
                            const benefits = [...selectedProduct.benefits];
                            benefits[i] = { ...b, description: e.target.value };
                            updateField('benefits', benefits);
                          }} className="cv-input text-xs min-h-[60px]" placeholder="Benefit description" />
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-cv-ink">{b.title}</p>
                          <p className="text-xs text-cv-body leading-relaxed">{b.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                  {editMode && (
                    <Button variant="outline" className="w-full rounded-full border-cv-line text-cv-ink hover:bg-cv-soft" onClick={() => updateField('benefits', [...selectedProduct.benefits, { title: '', description: '' }])}>
                      <Plus className="h-4 w-4" /> Add Benefit
                    </Button>
                  )}
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

                {/* Availability tab */}
                <TabsContent value="availability" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label className="text-sm font-bold text-cv-ink">Status</Label>
                      {editMode ? (
                        <Select value={selectedProduct.status} onValueChange={(v) => updateField('status', v as MockProduct['status'])}>
                          <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="DRAFT">Draft</SelectItem></SelectContent>
                        </Select>
                      ) : <StatusBadge status={selectedProduct.status === 'ACTIVE' ? 'active' : 'draft'} />}
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm font-bold text-cv-ink">Availability</Label>
                      {editMode ? (
                        <Select value={selectedProduct.availability} onValueChange={(v) => updateField('availability', v as MockProduct['availability'])}>
                          <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="AVAILABLE">Available</SelectItem><SelectItem value="COMING_SOON">Coming Soon</SelectItem></SelectContent>
                        </Select>
                      ) : <StatusBadge status={selectedProduct.availability === 'AVAILABLE' ? 'available' : 'none'} label={selectedProduct.availability === 'AVAILABLE' ? 'Available' : 'Coming Soon'} />}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">Partner Availability</Label>
                    {editMode ? (
                      <Select value={selectedProduct.partnerAvailability} onValueChange={(v) => updateField('partnerAvailability', v as MockProduct['partnerAvailability'])}>
                        <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Partner Types</SelectItem>
                          <SelectItem value="CREATOR">Creators Only</SelectItem>
                          <SelectItem value="BUSINESS">Business / Agency Only</SelectItem>
                          <SelectItem value="NETWORK">Network Partners Only</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-cv-body">{selectedProduct.partnerAvailability === 'ALL' ? 'All partner types' : selectedProduct.partnerAvailability + ' partners only'}</p>
                    )}
                  </div>
                  {editMode && (
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-cv-line">
                      <div>
                        <p className="text-sm font-bold text-cv-ink">Mark as Popular</p>
                        <p className="text-xs text-cv-muted mt-0.5">Highlight this product as the most popular plan</p>
                      </div>
                      <Switch checked={!!selectedProduct.popular} onCheckedChange={(v) => updateField('popular', v || undefined)} />
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-2">
                {editMode ? (
                  <>
                    <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button onClick={handleSave} className={cn('cv-btn-sm rounded-full flex-1', saved ? 'bg-cv-good text-white' : 'cv-btn-primary')}>
                      {saved ? <><Check className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save Changes</>}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft" onClick={() => setSelectedId(null)}>Close</Button>
                    <Button onClick={() => setEditMode(true)} className="cv-btn-primary cv-btn-sm rounded-full flex-1">
                      <Pencil className="h-3.5 w-3.5" /> Edit Product
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
