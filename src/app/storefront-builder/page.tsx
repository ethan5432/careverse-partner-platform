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
import { Check, Monitor, Smartphone, Eye, Save, Globe, Upload, Package, ArrowLeftRight, DollarSign, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { mockProducts, currentPartnerStorefront, partnerDashboardStats } from '@/data/mock';
import { cn } from '@/lib/utils';

type BuilderTab = 'overview' | 'packages' | 'branding' | 'domain' | 'preview' | 'publish';

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

  const togglePackage = (pkg: string) => {
    setSelectedPackages(prev =>
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: { key: BuilderTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'packages', label: 'Packages' },
    { key: 'branding', label: 'Branding' },
    { key: 'domain', label: 'Domain' },
    { key: 'preview', label: 'Preview' },
    { key: 'publish', label: 'Publish' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Storefront Builder"
        title="Customize your storefront"
        description="Choose packages, update branding, connect a domain, and publish your storefront."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold"
              onClick={handleSave}
            >
              {saved ? <Check className="h-4 w-4 text-cv-good mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              {saved ? 'Saved!' : 'Save'}
            </Button>
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white rounded-xl border border-cv-line p-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap',
              activeTab === tab.key ? 'bg-cv-ink text-white' : 'text-cv-muted hover:text-cv-ink hover:bg-cv-soft'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <Globe className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Storefront Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
                </div>
              </div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <ExternalLink className="h-5 w-5 text-cv-ink" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Storefront URL</p>
                <p className="text-sm font-bold text-cv-ink truncate mt-1">{currentPartnerStorefront.url}</p>
              </div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <Users className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Visitors</p>
                <p className="text-sm font-bold text-cv-ink mt-1">{currentPartnerStorefront.visitors.toLocaleString()}</p>
              </div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <ArrowLeftRight className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Conversions</p>
                <p className="text-sm font-bold text-cv-ink mt-1">{currentPartnerStorefront.conversions}</p>
              </div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <DollarSign className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Revenue</p>
                <p className="text-sm font-bold text-cv-ink mt-1">${currentPartnerStorefront.revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="cv-card p-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                <TrendingUp className="h-5 w-5 text-cv-ink" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Commission</p>
                <p className="text-sm font-bold text-cv-ink mt-1">${currentPartnerStorefront.commission.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="cv-card">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft mb-4">
                  <Package className="h-5 w-5 text-cv-ink" />
                </div>
                <h3 className="text-lg font-bold text-cv-ink mb-1">Packages</h3>
                <p className="text-sm text-cv-muted mb-3">{selectedPackages.length} packages selected</p>
                <Button variant="outline" className="rounded-full text-xs font-bold border-cv-line" onClick={() => setActiveTab('packages')}>
                  Manage packages
                </Button>
              </CardContent>
            </Card>
            <Card className="cv-card">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft mb-4">
                  <Globe className="h-5 w-5 text-cv-ink" />
                </div>
                <h3 className="text-lg font-bold text-cv-ink mb-1">Domain</h3>
                <p className="text-sm text-cv-muted mb-3">
                  {currentPartnerStorefront.domainStatus === 'CONNECTED' ? 'Custom domain connected' : currentPartnerStorefront.domainStatus === 'PENDING' ? 'Domain pending' : 'Using Careverse URL'}
                </p>
                <Button variant="outline" className="rounded-full text-xs font-bold border-cv-line" onClick={() => setActiveTab('domain')}>
                  Configure domain
                </Button>
              </CardContent>
            </Card>
            <Card className="cv-card">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft mb-4">
                  <Eye className="h-5 w-5 text-cv-ink" />
                </div>
                <h3 className="text-lg font-bold text-cv-ink mb-1">Preview</h3>
                <p className="text-sm text-cv-muted mb-3">See your storefront as customers see it</p>
                <Button variant="outline" className="rounded-full text-xs font-bold border-cv-line" onClick={() => setActiveTab('preview')}>
                  Open preview
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* View Storefront button */}
          <div className="flex justify-center">
            <Button
              className="cv-btn-primary rounded-full"
              onClick={() => router.push('/storefront')}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              View Storefront
            </Button>
          </div>
        </div>
      )}

      {/* Packages */}
      {activeTab === 'packages' && (
        <Card className="cv-card">
          <CardHeader>
            <CardTitle className="text-base font-bold text-cv-ink">Choose packages</CardTitle>
            <p className="text-sm text-cv-muted">Select which Careverse plans appear on your storefront</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockProducts.map((product) => {
              const isSelected = selectedPackages.includes(product.name);
              return (
                <div
                  key={product.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer',
                    isSelected ? 'border-cv-ink bg-cv-soft' : 'border-cv-line bg-white hover:border-cv-muted'
                  )}
                  onClick={() => togglePackage(product.name)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all',
                      isSelected ? 'bg-cv-ink border-cv-ink' : 'border-cv-line'
                    )}>
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-bold text-cv-ink">{product.name} <span className="text-cv-muted font-normal">— ${product.price}/mo</span></p>
                      <p className="text-xs text-cv-muted">{product.features.length} benefits included</p>
                    </div>
                  </div>
                  {product.popular && (
                    <span className="text-xs font-extrabold text-cv-ink bg-cv-soft px-2 py-0.5 rounded-full">POPULAR</span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Branding */}
      {activeTab === 'branding' && (
        <Card className="cv-card">
          <CardHeader>
            <CardTitle className="text-base font-bold text-cv-ink">Branding</CardTitle>
            <p className="text-sm text-cv-muted">Customize how your storefront appears to customers</p>
          </CardHeader>
          <CardContent className="space-y-5 max-w-lg">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Storefront name</Label>
              <Input
                value={storefrontName}
                onChange={(e) => setStorefrontName(e.target.value)}
                className="cv-input"
                placeholder="Your storefront name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Logo</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cv-soft border border-cv-line">
                  <span className="text-2xl font-extrabold text-cv-ink">{storefrontName.charAt(0)}</span>
                </div>
                <Button variant="outline" className="rounded-full border-cv-line font-bold text-sm">
                  <Upload className="h-4 w-4 mr-1.5" />
                  Upload logo
                </Button>
              </div>
              <p className="text-xs text-cv-muted">Recommended: 256x256px, PNG or SVG</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Partner photo (optional)</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cv-soft border border-cv-line">
                  <Upload className="h-5 w-5 text-cv-muted" />
                </div>
                <Button variant="outline" className="rounded-full border-cv-line font-bold text-sm">
                  <Upload className="h-4 w-4 mr-1.5" />
                  Upload photo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Short intro copy</Label>
              <Textarea
                value={introCopy}
                onChange={(e) => setIntroCopy(e.target.value)}
                className="cv-input min-h-[100px] resize-none"
                placeholder="A brief introduction that appears in your storefront hero section..."
                maxLength={200}
              />
              <p className="text-xs text-cv-muted">{introCopy.length}/200 characters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domain */}
      {activeTab === 'domain' && (
        <Card className="cv-card">
          <CardHeader>
            <CardTitle className="text-base font-bold text-cv-ink">Domain</CardTitle>
            <p className="text-sm text-cv-muted">Configure your storefront URL</p>
          </CardHeader>
          <CardContent className="space-y-5 max-w-lg">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Careverse-hosted URL</Label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-cv-soft border border-cv-line">
                <Globe className="h-4 w-4 text-cv-muted" />
                <span className="text-sm font-bold text-cv-ink">{currentPartnerStorefront.url}</span>
                <StatusBadge status="connected" label="Active" className="ml-auto" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Custom domain (optional)</Label>
              <Input
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="cv-input"
                placeholder="yourdomain.com"
              />
              <p className="text-xs text-cv-muted">
                {currentPartnerStorefront.domainStatus === 'CONNECTED'
                  ? 'Your custom domain is connected and active.'
                  : currentPartnerStorefront.domainStatus === 'PENDING'
                  ? 'DNS configuration in progress. This may take 24-48 hours.'
                  : 'Connect a custom domain for your storefront. We\'ll guide you through the DNS setup.'}
              </p>
              {currentPartnerStorefront.domainStatus !== 'CONNECTED' && customDomain && (
                <Button variant="outline" className="rounded-full border-cv-line font-bold text-sm mt-2">
                  Configure DNS
                </Button>
              )}
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
              <button
                onClick={() => setPreviewMode('desktop')}
                className={cn('px-3 py-1.5 rounded-md transition-all', previewMode === 'desktop' ? 'bg-white shadow-sm' : '')}
              >
                <Monitor className={cn('h-4 w-4', previewMode === 'desktop' ? 'text-cv-ink' : 'text-cv-muted')} />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={cn('px-3 py-1.5 rounded-md transition-all', previewMode === 'mobile' ? 'bg-white shadow-sm' : '')}
              >
                <Smartphone className={cn('h-4 w-4', previewMode === 'mobile' ? 'text-cv-ink' : 'text-cv-muted')} />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              'mx-auto bg-cv-cream rounded-2xl border border-cv-line overflow-hidden transition-all',
              previewMode === 'desktop' ? 'w-full' : 'w-[375px]'
            )}>
              {/* Mini storefront preview */}
              <div className="bg-cv-cream/88 backdrop-blur-md border-b border-cv-line px-4 py-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cv-ink">
                  <span className="text-xs font-extrabold text-white">C</span>
                </div>
                <span className="text-sm font-bold text-cv-ink">{storefrontName}</span>
                <span className="ml-auto text-xs text-cv-muted">Preview</span>
              </div>
              <div className="p-6">
                <div className="cv-red-rule mb-3" />
                <p className="cv-eyebrow uppercase mb-3">Care Benefits</p>
                <h2 className="text-2xl font-bold text-cv-ink tracking-tight mb-3">
                  Quality <span className="cv-red">care</span> for your family
                </h2>
                <p className="text-sm text-cv-body mb-4">{introCopy || 'Your intro copy will appear here.'}</p>
                <div className="grid gap-3 sm:grid-cols-3 mt-4">
                  {selectedPackages.map((pkg) => {
                    const product = mockProducts.find(p => p.name === pkg);
                    return product ? (
                      <div key={pkg} className="bg-white rounded-xl border border-cv-line p-3">
                        <p className="text-sm font-bold text-cv-ink">{product.name}</p>
                        <p className="text-xs text-cv-muted mt-0.5">${product.price}/mo</p>
                        <div className="mt-2 bg-cv-ink text-white text-xs font-bold text-center py-1.5 rounded-full">Request Care</div>
                      </div>
                    ) : null;
                  })}
                </div>
                {selectedPackages.length === 0 && (
                  <p className="text-sm text-cv-muted italic">No packages selected. Go to Packages tab to add some.</p>
                )}
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => router.push('/storefront')}>
                <Eye className="h-4 w-4 mr-1.5" />
                Open full storefront
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish */}
      {activeTab === 'publish' && (
        <Card className="cv-card max-w-lg">
          <CardHeader>
            <CardTitle className="text-base font-bold text-cv-ink">Publish</CardTitle>
            <p className="text-sm text-cv-muted">Control whether your storefront is visible to customers</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl border border-cv-line">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  publishStatus === 'LIVE' ? 'bg-emerald-50' : 'bg-cv-soft'
                )}>
                  <Globe className={cn('h-5 w-5', publishStatus === 'LIVE' ? 'text-cv-good' : 'text-cv-muted')} />
                </div>
                <div>
                  <p className="font-bold text-cv-ink">{publishStatus === 'LIVE' ? 'Storefront is Live' : 'Storefront is Draft'}</p>
                  <p className="text-xs text-cv-muted">{publishStatus === 'LIVE' ? 'Customers can visit and purchase' : 'Only you can see it'}</p>
                </div>
              </div>
              <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
            </div>

            <div className="flex gap-3">
              {publishStatus === 'DRAFT' ? (
                <button
                  className="cv-btn-primary flex-1"
                  onClick={() => setPublishStatus('LIVE')}
                >
                  Publish storefront
                </button>
              ) : (
                <button
                  className="cv-btn-secondary flex-1"
                  onClick={() => setPublishStatus('DRAFT')}
                >
                  Unpublish
                </button>
              )}
            </div>

            <div className="rounded-xl bg-cv-soft p-4">
              <p className="text-xs font-bold text-cv-ink uppercase tracking-wider mb-2">Storefront checklist</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm text-cv-body">
                  <Check className={cn('h-4 w-4', selectedPackages.length > 0 ? 'text-cv-good' : 'text-cv-muted')} />
                  {selectedPackages.length > 0 ? `${selectedPackages.length} packages selected` : 'Select at least one package'}
                </li>
                <li className="flex items-center gap-2 text-sm text-cv-body">
                  <Check className={cn('h-4 w-4', storefrontName ? 'text-cv-good' : 'text-cv-muted')} />
                  {storefrontName ? 'Storefront name set' : 'Set a storefront name'}
                </li>
                <li className="flex items-center gap-2 text-sm text-cv-body">
                  <Check className={cn('h-4 w-4', introCopy ? 'text-cv-good' : 'text-cv-muted')} />
                  {introCopy ? 'Intro copy written' : 'Write intro copy'}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
