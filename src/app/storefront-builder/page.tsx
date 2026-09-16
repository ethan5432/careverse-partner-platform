'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Check, Monitor, Smartphone, Eye, Save, Globe, Upload, Package, ArrowLeftRight, DollarSign, Users, TrendingUp, ExternalLink, ChevronUp, ChevronDown, Info, Lock, Video, Plus, Trash2, Play, Type, Palette, Layout, AlignLeft } from 'lucide-react';
import { mockProducts, currentPartnerStorefront, partnerDashboardStats } from '@/data/mock';
import type { MockCreatorContent, ContentSource, ContentPlacement, ContentLayout } from '@/data/mock/types';
import { cn } from '@/lib/utils';

type BuilderTab = 'overview' | 'packages' | 'branding' | 'positioning' | 'content' | 'domain' | 'preview' | 'publish';

const placementLabels: Record<ContentPlacement, string> = { TOP: 'Top', MIDDLE: 'Middle', BOTTOM: 'Bottom' };
const layoutLabels: Record<ContentLayout, string> = { ONE_COLUMN: '1 Column', TWO_COLUMN: '2 Columns', THREE_COLUMN: '3 Columns' };
const layoutCols: Record<ContentLayout, string> = { ONE_COLUMN: 'grid-cols-1', TWO_COLUMN: 'grid-cols-2', THREE_COLUMN: 'grid-cols-3' };

export default function StorefrontBuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BuilderTab>('overview');
  const [storefrontName, setStorefrontName] = useState(currentPartnerStorefront.name);
  const [introCopy, setIntroCopy] = useState(currentPartnerStorefront.introCopy || '');
  const [selectedPackages, setSelectedPackages] = useState<string[]>(currentPartnerStorefront.packages);
  const [customDomain, setCustomDomain] = useState(currentPartnerStorefront.customDomain || '');
  const [publishStatus, setPublishStatus] = useState<'DRAFT' | 'LIVE'>(currentPartnerStorefront.status);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saved, setSaved] = useState(false);

  // Branding
  const [brandPresentation, setBrandPresentation] = useState(currentPartnerStorefront.brandPresentation || '');

  // Positioning
  const [heroHeadline, setHeroHeadline] = useState(currentPartnerStorefront.heroHeadline || 'Quality care for your family');
  const [heroSupportingCopy, setHeroSupportingCopy] = useState(currentPartnerStorefront.heroSupportingCopy || '');
  const [ctaText, setCtaText] = useState(currentPartnerStorefront.ctaText || 'Request Care');
  const [aboutContent, setAboutContent] = useState(currentPartnerStorefront.aboutContent || '');

  // Creator content
  const [contentBlocks, setContentBlocks] = useState<MockCreatorContent[]>(currentPartnerStorefront.creatorContent || []);

  const togglePackage = (pkg: string) => {
    setSelectedPackages(prev => prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]);
  };
  const movePackageUp = (pkg: string) => {
    setSelectedPackages(prev => { const i = prev.indexOf(pkg); if (i <= 0) return prev; const n = [...prev]; [n[i-1], n[i]] = [n[i], n[i-1]]; return n; });
  };
  const movePackageDown = (pkg: string) => {
    setSelectedPackages(prev => { const i = prev.indexOf(pkg); if (i < 0 || i >= prev.length - 1) return prev; const n = [...prev]; [n[i], n[i+1]] = [n[i+1], n[i]]; return n; });
  };
  const availableProducts = mockProducts.filter((p) => p.availability === 'AVAILABLE');

  // Content block helpers
  const addContentBlock = () => {
    setContentBlocks(prev => [...prev, { id: `cc-${Date.now()}`, source: 'EMBED', url: '', title: '', caption: '', placement: 'MIDDLE', layout: 'ONE_COLUMN', order: prev.length }]);
  };
  const updateContentBlock = (id: string, updates: Partial<MockCreatorContent>) => {
    setContentBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };
  const removeContentBlock = (id: string) => {
    setContentBlocks(prev => prev.filter(b => b.id !== id));
  };
  const moveContentUp = (idx: number) => {
    setContentBlocks(prev => { if (idx <= 0) return prev; const n = [...prev]; [n[idx-1], n[idx]] = [n[idx], n[idx-1]]; return n.map((b, i) => ({ ...b, order: i })); });
  };
  const moveContentDown = (idx: number) => {
    setContentBlocks(prev => { if (idx >= prev.length - 1) return prev; const n = [...prev]; [n[idx], n[idx+1]] = [n[idx+1], n[idx]]; return n.map((b, i) => ({ ...b, order: i })); });
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const tabs: { key: BuilderTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'packages', label: 'Packages' },
    { key: 'branding', label: 'Branding' },
    { key: 'positioning', label: 'Positioning' },
    { key: 'content', label: 'Creator Content' },
    { key: 'domain', label: 'Domain' },
    { key: 'preview', label: 'Preview' },
    { key: 'publish', label: 'Publish' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Storefront Builder"
        title="Customize your storefront"
        description="Choose packages, update branding, add creator content, and publish your storefront."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={handleSave}>
              {saved ? <Check className="h-4 w-4 text-cv-good mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              {saved ? 'Saved!' : 'Save'}
            </Button>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white rounded-xl border border-cv-line p-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn('px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap', activeTab === tab.key ? 'bg-cv-ink text-white' : 'text-cv-muted hover:text-cv-ink hover:bg-cv-soft')}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft"><Globe className="h-5 w-5 text-cv-ink" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Storefront Status</p><div className="flex items-center gap-2 mt-1"><StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} /></div></div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft"><ExternalLink className="h-5 w-5 text-cv-ink" /></div>
              <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Storefront URL</p><p className="text-sm font-bold text-cv-ink truncate mt-1">{currentPartnerStorefront.url}</p></div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft"><Users className="h-5 w-5 text-cv-ink" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Visitors</p><p className="text-sm font-bold text-cv-ink mt-1">{currentPartnerStorefront.visitors.toLocaleString()}</p></div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft"><ArrowLeftRight className="h-5 w-5 text-cv-ink" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Conversions</p><p className="text-sm font-bold text-cv-ink mt-1">{currentPartnerStorefront.conversions}</p></div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft"><DollarSign className="h-5 w-5 text-cv-ink" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Revenue</p><p className="text-sm font-bold text-cv-ink mt-1">${currentPartnerStorefront.revenue.toLocaleString()}</p></div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft"><TrendingUp className="h-5 w-5 text-cv-ink" /></div>
              <div><p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Commission</p><p className="text-sm font-bold text-cv-ink mt-1">${currentPartnerStorefront.commission.toLocaleString()}</p></div>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="grid gap-6 lg:grid-cols-4">
            {[
              { icon: Package, title: 'Packages', desc: `${selectedPackages.length} packages selected`, tab: 'packages' as BuilderTab },
              { icon: Palette, title: 'Branding', desc: brandPresentation || 'Not set', tab: 'branding' as BuilderTab },
              { icon: Type, title: 'Positioning', desc: heroHeadline || 'Not set', tab: 'positioning' as BuilderTab },
              { icon: Video, title: 'Creator Content', desc: `${contentBlocks.length} content blocks`, tab: 'content' as BuilderTab },
            ].map((card) => (
              <Card key={card.tab} className="cv-card">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft mb-4"><card.icon className="h-5 w-5 text-cv-ink" /></div>
                  <h3 className="text-lg font-bold text-cv-ink mb-1">{card.title}</h3>
                  <p className="text-sm text-cv-muted mb-3 truncate">{card.desc}</p>
                  <Button variant="outline" className="rounded-full text-xs font-bold border-cv-line" onClick={() => setActiveTab(card.tab)}>Manage</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button className="cv-btn-primary rounded-full" onClick={() => router.push('/storefront')}>
              <ExternalLink className="h-4 w-4 mr-1.5" />View Storefront
            </Button>
          </div>
        </div>
      )}

      {/* Packages */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-xl bg-cv-soft border border-cv-line p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-ink shrink-0"><Info className="h-4 w-4 text-white" /></div>
            <div><p className="text-sm font-bold text-cv-ink">Careverse manages all package content</p><p className="text-xs text-cv-muted mt-0.5">You can select which packages to offer and reorder them. Package names, prices, and benefits are set by Careverse and cannot be edited.</p></div>
          </div>

          {selectedPackages.length > 0 && (
            <Card className="cv-card">
              <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Your storefront packages ({selectedPackages.length})</CardTitle><p className="text-sm text-cv-muted">Reorder how packages appear on your storefront</p></CardHeader>
              <CardContent className="space-y-2">
                {selectedPackages.map((pkgName, idx) => {
                  const product = mockProducts.find((p) => p.name === pkgName);
                  if (!product) return null;
                  return (
                    <div key={pkgName} className="flex items-center gap-3 p-3 rounded-xl border border-cv-ink bg-cv-soft">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => movePackageUp(pkgName)} disabled={idx === 0} className={cn('p-0.5 rounded transition-colors', idx === 0 ? 'text-cv-line cursor-not-allowed' : 'text-cv-ink hover:text-cv-red')}><ChevronUp className="h-4 w-4" /></button>
                        <button onClick={() => movePackageDown(pkgName)} disabled={idx === selectedPackages.length - 1} className={cn('p-0.5 rounded transition-colors', idx === selectedPackages.length - 1 ? 'text-cv-line cursor-not-allowed' : 'text-cv-ink hover:text-cv-red')}><ChevronDown className="h-4 w-4" /></button>
                      </div>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cv-ink text-white text-xs font-bold shrink-0">{idx + 1}</span>
                      <div className="flex-1"><p className="font-bold text-cv-ink">{product.name} <span className="text-cv-muted font-normal">— ${product.price}/mo</span></p><p className="text-xs text-cv-muted">{product.features.length} benefits</p></div>
                      {product.popular && <span className="text-xs font-extrabold text-cv-ink bg-white px-2 py-0.5 rounded-full border border-cv-line">POPULAR</span>}
                      <button onClick={() => togglePackage(pkgName)} className="text-xs font-bold text-cv-red hover:text-cv-ink transition-colors px-2">Remove</button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Available Careverse packages</CardTitle><p className="text-sm text-cv-muted">Select which packages to offer on your storefront</p></CardHeader>
            <CardContent className="space-y-3">
              {availableProducts.map((product) => {
                const isSelected = selectedPackages.includes(product.name);
                return (
                  <div key={product.id} className="space-y-0">
                    <div className={cn('flex items-center justify-between p-4 rounded-xl border-2 transition-all', isSelected ? 'border-cv-ink bg-cv-soft' : 'border-cv-line bg-white hover:border-cv-muted cursor-pointer')} onClick={() => !isSelected && togglePackage(product.name)}>
                      <div className="flex items-center gap-4">
                        <div className={cn('flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all', isSelected ? 'bg-cv-ink border-cv-ink' : 'border-cv-line')}>{isSelected && <Check className="h-4 w-4 text-white" />}</div>
                        <div><p className="font-bold text-cv-ink">{product.name} <span className="text-cv-muted font-normal">— ${product.price}/mo</span></p><p className="text-xs text-cv-muted">{product.features.length} benefits included</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.popular && <span className="text-xs font-extrabold text-cv-ink bg-cv-soft px-2 py-0.5 rounded-full">POPULAR</span>}
                        {isSelected ? <span className="text-xs font-bold text-cv-good">Added</span> : <span className="text-xs font-bold text-cv-ink">Click to add</span>}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="rounded-xl border border-cv-line border-t-0 bg-cv-soft/30 p-4 space-y-3">
                        <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-cv-muted" /><p className="text-[10px] font-bold uppercase tracking-wider text-cv-muted">Package content — managed by Careverse</p></div>
                        <p className="text-xs text-cv-body leading-relaxed">{product.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.features.map((f, i) => <span key={i} className="inline-flex items-center gap-1 rounded-full bg-white border border-cv-line px-2 py-0.5 text-[10px] font-bold text-cv-body"><Check className="h-2.5 w-2.5 text-cv-good" />{f}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Branding */}
      {activeTab === 'branding' && (
        <Card className="cv-card">
          <CardHeader><CardTitle className="text-base font-bold text-cv-ink">Branding</CardTitle><p className="text-sm text-cv-muted">Customize how your storefront appears to customers</p></CardHeader>
          <CardContent className="space-y-5 max-w-lg">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Storefront name</Label>
              <Input value={storefrontName} onChange={(e) => setStorefrontName(e.target.value)} className="cv-input" placeholder="Your storefront name" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cv-soft border border-cv-line"><span className="text-2xl font-extrabold text-cv-ink">{storefrontName.charAt(0)}</span></div>
                <Button variant="outline" className="rounded-full border-cv-line font-bold text-sm"><Upload className="h-4 w-4 mr-1.5" />Upload logo</Button>
              </div>
              <p className="text-xs text-cv-muted">Recommended: 256x256px, PNG or SVG</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Partner photo (optional)</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cv-soft border border-cv-line"><Upload className="h-5 w-5 text-cv-muted" /></div>
                <Button variant="outline" className="rounded-full border-cv-line font-bold text-sm"><Upload className="h-4 w-4 mr-1.5" />Upload photo</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Brand presentation</Label>
              <Input value={brandPresentation} onChange={(e) => setBrandPresentation(e.target.value)} className="cv-input" placeholder="e.g. Trusted, family-focused care guidance" maxLength={80} />
              <p className="text-xs text-cv-muted">A short tagline that appears under your storefront name</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Short intro copy</Label>
              <Textarea value={introCopy} onChange={(e) => setIntroCopy(e.target.value)} className="cv-input min-h-[100px] resize-none" placeholder="A brief introduction that appears in your storefront hero section..." maxLength={200} />
              <p className="text-xs text-cv-muted">{introCopy.length}/200 characters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Positioning */}
      {activeTab === 'positioning' && (
        <Card className="cv-card">
          <CardHeader><CardTitle className="text-base font-bold text-cv-ink">Storefront Positioning</CardTitle><p className="text-sm text-cv-muted">Customize your hero section and about content</p></CardHeader>
          <CardContent className="space-y-5 max-w-lg">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Hero headline</Label>
              <Input value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} className="cv-input" placeholder="Quality care for your family" maxLength={60} />
              <p className="text-xs text-cv-muted">The main headline visitors see first</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Hero supporting copy</Label>
              <Textarea value={heroSupportingCopy} onChange={(e) => setHeroSupportingCopy(e.target.value)} className="cv-input min-h-[80px] resize-none" placeholder="Supporting text below your headline..." maxLength={160} />
              <p className="text-xs text-cv-muted">{heroSupportingCopy.length}/160 characters</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">CTA button text</Label>
              <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="cv-input" placeholder="Request Care" maxLength={20} />
              <p className="text-xs text-cv-muted">The text on your call-to-action buttons</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">About / positioning content</Label>
              <Textarea value={aboutContent} onChange={(e) => setAboutContent(e.target.value)} className="cv-input min-h-[120px] resize-none" placeholder="Tell visitors about yourself and why you recommend Careverse..." maxLength={500} />
              <p className="text-xs text-cv-muted">{aboutContent.length}/500 characters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Creator Content */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-xl bg-cv-soft border border-cv-line p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-ink shrink-0"><Video className="h-4 w-4 text-white" /></div>
            <div>
              <p className="text-sm font-bold text-cv-ink">Add video content to your storefront</p>
              <p className="text-xs text-cv-muted mt-0.5">Embed videos from YouTube, Vimeo, or upload your own. Choose where they appear and how they are laid out.</p>
            </div>
          </div>

          {contentBlocks.length > 0 && (
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-cv-ink">Content blocks ({contentBlocks.length})</CardTitle>
                <p className="text-sm text-cv-muted">Reorder, edit, or remove content blocks</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {contentBlocks.map((block, idx) => (
                  <div key={block.id} className="rounded-xl border border-cv-line bg-white p-4 space-y-4">
                    {/* Header row */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveContentUp(idx)} disabled={idx === 0} className={cn('p-0.5 rounded transition-colors', idx === 0 ? 'text-cv-line cursor-not-allowed' : 'text-cv-ink hover:text-cv-red')}><ChevronUp className="h-4 w-4" /></button>
                        <button onClick={() => moveContentDown(idx)} disabled={idx === contentBlocks.length - 1} className={cn('p-0.5 rounded transition-colors', idx === contentBlocks.length - 1 ? 'text-cv-line cursor-not-allowed' : 'text-cv-ink hover:text-cv-red')}><ChevronDown className="h-4 w-4" /></button>
                      </div>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cv-ink text-white text-xs font-bold shrink-0">{idx + 1}</span>
                      <span className="text-sm font-bold text-cv-ink flex-1">{block.title || `Content block ${idx + 1}`}</span>
                      <button onClick={() => removeContentBlock(block.id)} className="text-cv-red hover:text-cv-ink transition-colors p-1"><Trash2 className="h-4 w-4" /></button>
                    </div>

                    {/* Source toggle */}
                    <div className="grid grid-cols-2 gap-2">
                      {(['EMBED', 'UPLOAD'] as ContentSource[]).map((src) => (
                        <button key={src} onClick={() => updateContentBlock(block.id, { source: src })}
                          className={cn('flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-bold transition-all',
                            block.source === src ? 'border-cv-ink bg-cv-soft text-cv-ink' : 'border-cv-line text-cv-muted hover:bg-cv-soft/50')}>
                          {src === 'EMBED' ? <Play className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
                          {src === 'EMBED' ? 'Video Embed URL' : 'Direct Upload'}
                        </button>
                      ))}
                    </div>

                    {/* URL or upload */}
                    {block.source === 'EMBED' ? (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-cv-ink">Embed URL</Label>
                        <Input value={block.url} onChange={(e) => updateContentBlock(block.id, { url: e.target.value })} className="cv-input" placeholder="https://www.youtube.com/embed/..." />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-cv-ink">Upload video</Label>
                        <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-cv-line p-4">
                          <Upload className="h-6 w-6 text-cv-muted" />
                          <div><p className="text-sm font-bold text-cv-ink">Click to upload</p><p className="text-xs text-cv-muted">MP4, MOV up to 500MB</p></div>
                        </div>
                      </div>
                    )}

                    {/* Title and caption */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-cv-ink">Title (optional)</Label>
                        <Input value={block.title || ''} onChange={(e) => updateContentBlock(block.id, { title: e.target.value })} className="cv-input" placeholder="Video title" maxLength={60} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-cv-ink">Caption (optional)</Label>
                        <Input value={block.caption || ''} onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })} className="cv-input" placeholder="Short caption" maxLength={120} />
                      </div>
                    </div>

                    {/* Placement and layout */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-cv-ink flex items-center gap-1.5"><AlignLeft className="h-3.5 w-3.5" />Placement</Label>
                        <div className="flex gap-1.5">
                          {(['TOP', 'MIDDLE', 'BOTTOM'] as ContentPlacement[]).map((pl) => (
                            <button key={pl} onClick={() => updateContentBlock(block.id, { placement: pl })}
                              className={cn('flex-1 rounded-lg border py-1.5 text-[10px] font-bold transition-all',
                                block.placement === pl ? 'border-cv-ink bg-cv-soft text-cv-ink' : 'border-cv-line text-cv-muted hover:bg-cv-soft/50')}>
                              {placementLabels[pl]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-cv-ink flex items-center gap-1.5"><Layout className="h-3.5 w-3.5" />Layout</Label>
                        <div className="flex gap-1.5">
                          {(['ONE_COLUMN', 'TWO_COLUMN', 'THREE_COLUMN'] as ContentLayout[]).map((ly) => (
                            <button key={ly} onClick={() => updateContentBlock(block.id, { layout: ly })}
                              className={cn('flex-1 rounded-lg border py-1.5 text-[10px] font-bold transition-all',
                                block.layout === ly ? 'border-cv-ink bg-cv-soft text-cv-ink' : 'border-cv-line text-cv-muted hover:bg-cv-soft/50')}>
                              {layoutLabels[ly]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Button className="cv-btn-primary rounded-full" onClick={addContentBlock}>
            <Plus className="h-4 w-4 mr-1.5" />Add content block
          </Button>

          {contentBlocks.length === 0 && (
            <Card className="cv-card">
              <CardContent className="p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft mx-auto mb-3"><Video className="h-6 w-6 text-cv-muted" /></div>
                <p className="text-sm font-bold text-cv-ink">No content blocks yet</p>
                <p className="text-xs text-cv-muted mt-1 mb-4">Add video content to engage visitors and showcase your Careverse experience.</p>
                <Button className="cv-btn-primary rounded-full" onClick={addContentBlock}><Plus className="h-4 w-4 mr-1.5" />Add your first content block</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Domain */}
      {activeTab === 'domain' && (
        <Card className="cv-card">
          <CardHeader><CardTitle className="text-base font-bold text-cv-ink">Domain</CardTitle><p className="text-sm text-cv-muted">Configure your storefront URL</p></CardHeader>
          <CardContent className="space-y-5 max-w-lg">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Careverse-hosted URL</Label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cv-soft border border-cv-line">
                <Globe className="h-4 w-4 text-cv-muted" /><span className="text-sm font-bold text-cv-ink">{currentPartnerStorefront.url}</span><StatusBadge status="connected" label="Active" className="ml-auto" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Custom domain (optional)</Label>
              <Input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} className="cv-input" placeholder="yourdomain.com" />
              <p className="text-xs text-cv-muted">{currentPartnerStorefront.domainStatus === 'CONNECTED' ? 'Your custom domain is connected and active.' : currentPartnerStorefront.domainStatus === 'PENDING' ? 'DNS configuration in progress.' : 'Connect a custom domain for your storefront.'}</p>
              {currentPartnerStorefront.domainStatus !== 'CONNECTED' && customDomain && <Button variant="outline" className="rounded-full border-cv-line font-bold text-sm mt-2">Configure DNS</Button>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {activeTab === 'preview' && (
        <Card className="cv-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-cv-ink">Preview</CardTitle>
            <div className="flex bg-cv-soft rounded-lg p-0.5">
              <button onClick={() => setPreviewMode('desktop')} className={cn('px-3 py-1.5 rounded-md transition-all', previewMode === 'desktop' ? 'bg-white shadow-sm' : '')}><Monitor className={cn('h-4 w-4', previewMode === 'desktop' ? 'text-cv-ink' : 'text-cv-muted')} /></button>
              <button onClick={() => setPreviewMode('mobile')} className={cn('px-3 py-1.5 rounded-md transition-all', previewMode === 'mobile' ? 'bg-white shadow-sm' : '')}><Smartphone className={cn('h-4 w-4', previewMode === 'mobile' ? 'text-cv-ink' : 'text-cv-muted')} /></button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn('mx-auto bg-cv-cream rounded-2xl border border-cv-line overflow-hidden transition-all', previewMode === 'desktop' ? 'w-full' : 'w-[375px]')}>
              {/* Header */}
              <div className="bg-cv-cream/88 backdrop-blur-md border-b border-cv-line px-4 py-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cv-ink"><span className="text-xs font-extrabold text-white">{storefrontName.charAt(0)}</span></div>
                <div><span className="text-sm font-bold text-cv-ink">{storefrontName}</span>{brandPresentation && <p className="text-[10px] text-cv-muted">{brandPresentation}</p>}</div>
                <span className="ml-auto text-xs text-cv-muted">Preview</span>
              </div>

              {/* TOP content */}
              {contentBlocks.filter(b => b.placement === 'TOP' && b.url).length > 0 && (
                <div className="p-4 space-y-3">
                  {contentBlocks.filter(b => b.placement === 'TOP').map((block) => (
                    <div key={block.id} className="space-y-1.5">
                      {block.title && <p className="text-sm font-bold text-cv-ink">{block.title}</p>}
                      <div className={cn('grid gap-2', layoutCols[block.layout])}>
                        <div className="aspect-video rounded-lg bg-cv-soft border border-cv-line flex items-center justify-center"><Play className="h-6 w-6 text-cv-muted" /></div>
                      </div>
                      {block.caption && <p className="text-xs text-cv-muted">{block.caption}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Hero */}
              <div className="p-6">
                <div className="cv-red-rule mb-3" />
                <p className="cv-eyebrow uppercase mb-3">Care Benefits</p>
                <h2 className="text-2xl font-bold text-cv-ink tracking-tight mb-3">{heroHeadline}</h2>
                <p className="text-sm text-cv-body mb-4">{heroSupportingCopy || introCopy || 'Your intro copy will appear here.'}</p>
                <div className="inline-flex bg-cv-ink text-white text-xs font-bold px-5 py-2.5 rounded-full">{ctaText}</div>
              </div>

              {/* MIDDLE content */}
              {contentBlocks.filter(b => b.placement === 'MIDDLE' && b.url).length > 0 && (
                <div className="px-6 pb-4 space-y-3">
                  {contentBlocks.filter(b => b.placement === 'MIDDLE').map((block) => (
                    <div key={block.id} className="space-y-1.5">
                      {block.title && <p className="text-sm font-bold text-cv-ink">{block.title}</p>}
                      <div className={cn('grid gap-2', layoutCols[block.layout])}>
                        {Array.from({ length: block.layout === 'ONE_COLUMN' ? 1 : block.layout === 'TWO_COLUMN' ? 2 : 3 }).map((_, i) => (
                          <div key={i} className="aspect-video rounded-lg bg-cv-soft border border-cv-line flex items-center justify-center"><Play className="h-5 w-5 text-cv-muted" /></div>
                        ))}
                      </div>
                      {block.caption && <p className="text-xs text-cv-muted">{block.caption}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Packages */}
              <div className="p-6 border-t border-cv-line">
                <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider mb-3">Choose your plan</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {selectedPackages.map((pkg) => {
                    const product = mockProducts.find(p => p.name === pkg);
                    return product ? (
                      <div key={pkg} className="bg-white rounded-xl border border-cv-line p-3">
                        <p className="text-sm font-bold text-cv-ink">{product.name}</p>
                        <p className="text-xs text-cv-muted mt-0.5">${product.price}/mo</p>
                        <div className="mt-2 bg-cv-ink text-white text-xs font-bold text-center py-1.5 rounded-full">{ctaText}</div>
                      </div>
                    ) : null;
                  })}
                </div>
                {selectedPackages.length === 0 && <p className="text-sm text-cv-muted italic">No packages selected.</p>}
              </div>

              {/* About */}
              {aboutContent && (
                <div className="p-6 border-t border-cv-line">
                  <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider mb-2">About</h3>
                  <p className="text-sm text-cv-body leading-relaxed">{aboutContent}</p>
                </div>
              )}

              {/* BOTTOM content */}
              {contentBlocks.filter(b => b.placement === 'BOTTOM' && b.url).length > 0 && (
                <div className="p-6 border-t border-cv-line space-y-3">
                  {contentBlocks.filter(b => b.placement === 'BOTTOM').map((block) => (
                    <div key={block.id} className="space-y-1.5">
                      {block.title && <p className="text-sm font-bold text-cv-ink">{block.title}</p>}
                      <div className={cn('grid gap-2', layoutCols[block.layout])}>
                        <div className="aspect-video rounded-lg bg-cv-soft border border-cv-line flex items-center justify-center"><Play className="h-6 w-6 text-cv-muted" /></div>
                      </div>
                      {block.caption && <p className="text-xs text-cv-muted">{block.caption}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => router.push('/storefront')}><Eye className="h-4 w-4 mr-1.5" />Open full storefront</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish */}
      {activeTab === 'publish' && (
        <Card className="cv-card max-w-lg">
          <CardHeader><CardTitle className="text-base font-bold text-cv-ink">Publish</CardTitle><p className="text-sm text-cv-muted">Control whether your storefront is visible to customers</p></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl border border-cv-line">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', publishStatus === 'LIVE' ? 'bg-emerald-50' : 'bg-cv-soft')}><Globe className={cn('h-5 w-5', publishStatus === 'LIVE' ? 'text-cv-good' : 'text-cv-muted')} /></div>
                <div><p className="font-bold text-cv-ink">{publishStatus === 'LIVE' ? 'Storefront is Live' : 'Storefront is Draft'}</p><p className="text-xs text-cv-muted">{publishStatus === 'LIVE' ? 'Customers can visit and purchase' : 'Only you can see it'}</p></div>
              </div>
              <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
            </div>
            <div className="flex gap-3">
              {publishStatus === 'DRAFT' ? <button className="cv-btn-primary flex-1" onClick={() => setPublishStatus('LIVE')}>Publish storefront</button> : <button className="cv-btn-secondary flex-1" onClick={() => setPublishStatus('DRAFT')}>Unpublish</button>}
            </div>
            <div className="rounded-xl bg-cv-soft p-4">
              <p className="text-xs font-bold text-cv-ink uppercase tracking-wider mb-2">Storefront checklist</p>
              <ul className="space-y-1.5">
                {[
                  { done: selectedPackages.length > 0, label: selectedPackages.length > 0 ? `${selectedPackages.length} packages selected` : 'Select at least one package' },
                  { done: !!storefrontName, label: storefrontName ? 'Storefront name set' : 'Set a storefront name' },
                  { done: !!introCopy, label: introCopy ? 'Intro copy written' : 'Write intro copy' },
                  { done: !!heroHeadline, label: heroHeadline ? 'Hero headline set' : 'Set a hero headline' },
                  { done: contentBlocks.length > 0, label: contentBlocks.length > 0 ? `${contentBlocks.length} content blocks added` : 'Add creator content (optional)' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-cv-body"><Check className={cn('h-4 w-4', item.done ? 'text-cv-good' : 'text-cv-muted')} />{item.label}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
