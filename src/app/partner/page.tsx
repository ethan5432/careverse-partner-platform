'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { GetStartedChecklist } from '@/components/shared/GetStartedChecklist';
import { StoreHealth } from '@/components/shared/StoreHealth';
import { ShareStoreDialog } from '@/components/shared/ShareStoreDialog';
import { TestStoreDialog } from '@/components/shared/TestStoreDialog';
import { SupportLink } from '@/components/shared/SupportLink';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Wallet, TrendingUp, Users, MousePointerClick, ExternalLink, Pencil, Store,
  Rocket, Sparkles, Share2, FlaskConical, ArrowRight, Clock,
  Link as LinkIcon, Copy, Check, Lock, ArrowUpRight, FileText, Heart,
} from 'lucide-react';
import {
  partnerDashboardStats, partnerPerformanceData,
  mockConversions, mockCommissions, currentPartnerStorefront,
} from '@/data/mock';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';
import {
  loadPendingStorefrontApplication, loadStorefrontApplicationsByPartner,
} from '@/lib/creator-persistence';
import type { StorefrontApplication } from '@/data/mock/types';

type TimeRange = '7D' | '30D' | '90D' | 'ALL';
type Metric = 'revenue' | 'conversions' | 'commission';

export default function PartnerDashboardPage() {
  const router = useRouter();
  const { user, onboarding, isOnboardingComplete, hasStorefrontAccess, affiliateLink, creatorProfiles } = useMockAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [metric, setMetric] = useState<Metric>('revenue');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [storefrontApps, setStorefrontApps] = useState<StorefrontApplication[]>([]);

  const isCreator = user?.partnerType === 'CREATOR';
  const storeUnlocked = isCreator ? hasStorefrontAccess() : true;
  const isAffiliateOnly = isCreator && !storeUnlocked;

  useEffect(() => {
    if (user) {
      const apps = loadStorefrontApplicationsByPartner(user.id);
      setStorefrontApps(apps);
    }
  }, [user]);

  const pendingApp = storefrontApps.find(a => a.status === 'SUBMITTED' || a.status === 'IN_REVIEW');
  const rejectedApp = storefrontApps.find(a => a.status === 'REJECTED');

  const handleCopyLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onboardingDone = isOnboardingComplete();
  const completedCount = Object.values(onboarding).filter(Boolean).length;

  const recentConversions = mockConversions.filter((c) => c.partnerId === 'p-1').slice(0, 5);
  const partnerCommissions = mockCommissions.filter((c) => c.partnerId === 'p-1');
  const pendingCommissions = partnerCommissions.filter((c) => c.status === 'PENDING');
  const performanceData = partnerPerformanceData[timeRange];
  const maxValue = Math.max(...performanceData.map((d) => d[metric]));

  const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const incompleteSteps = useMemo(() => {
    if (isAffiliateOnly) return [];
    const steps: { label: string; href: string }[] = [];
    if (!onboarding.profileComplete) steps.push({ label: 'Complete your profile', href: '/partner/settings' });
    if (!onboarding.storeCustomized) steps.push({ label: 'Customize your storefront', href: '/partner/store' });
    if (!onboarding.packagesChosen) steps.push({ label: 'Choose your packages', href: '/partner/store' });
    if (!onboarding.contentAdded) steps.push({ label: 'Add content to your store', href: '/partner/store' });
    if (!onboarding.payoutsSetup) steps.push({ label: 'Set up payouts', href: '/partner/settings' });
    if (!onboarding.storePublished) steps.push({ label: 'Publish your store', href: '/partner/store' });
    if (!onboarding.storeShared) steps.push({ label: 'Share your store', href: '/partner/store' });
    return steps;
  }, [onboarding, isAffiliateOnly]);

  const nextStep = incompleteSteps[0];

  // --- Affiliate-only creator dashboard ---
  if (isAffiliateOnly) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Creator Dashboard"
          title={`Welcome, ${user?.name?.split(' ')[0] || 'Partner'}!`}
          description="Share your affiliate link and earn commission on every Careverse membership."
        />

        {/* Affiliate Link Section */}
        <Card className="cv-card border-cv-ink/20">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-cv-ink" />
              <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider">Your Affiliate Link</h3>
            </div>
            <p className="text-sm text-cv-body">
              Share this link with your audience. Every Careverse membership purchased through this link earns you commission.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 rounded-xl border border-cv-line bg-cv-soft/30 px-4 py-3 text-sm font-bold text-cv-ink truncate">
                {affiliateLink?.url || 'https://careverse.ai/r/your-code'}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-sm shrink-0"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4 text-cv-good" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <a
                  href={affiliateLink?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-cv-ink text-white px-4 py-2 text-sm font-bold hover:bg-cv-ink/90 transition-colors shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="rounded-full bg-cv-ink text-white hover:bg-cv-ink/90 text-sm font-bold"
                onClick={() => router.push('/partner/storefront-application')}
              >
                <Store className="h-4 w-4 mr-1.5" />
                Apply for a storefront
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-sm"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                Share affiliate link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Link Clicks"
            value={affiliateLink?.clicks || 0}
            icon={MousePointerClick}
            description="All time"
          />
          <StatCard
            label="Conversions"
            value={affiliateLink?.conversions || 0}
            icon={Users}
            description="From your link"
          />
          <StatCard
            label="Available"
            value={fmtMoney(partnerDashboardStats.available)}
            icon={Wallet}
            description="Ready for payout"
          />
          <StatCard
            label="Pending"
            value={fmtMoney(partnerDashboardStats.pending)}
            icon={TrendingUp}
            description="Awaiting approval"
          />
        </div>

        {/* Storefront Application Status */}
        {pendingApp ? (
          <Card className="cv-card border-amber-200 bg-amber-50/50">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="text-sm font-bold text-amber-700">Storefront Application Under Review</p>
                  <p className="text-xs text-cv-muted">Submitted on {new Date(pendingApp.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-cv-body">
                Your application is being reviewed. You'll be notified when a decision is made.
              </p>
              <Button variant="outline" className="rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-sm" onClick={() => router.push('/partner/storefront-application')}>
                View application <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ) : rejectedApp ? (
          <Card className="cv-card border-red-200 bg-red-50/50">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-red-700" />
                <div>
                  <p className="text-sm font-bold text-red-700">Storefront Application Not Approved</p>
                  <p className="text-xs text-cv-muted">You can apply again with new content.</p>
                </div>
              </div>
              {rejectedApp.feedback && (
                <p className="text-sm text-cv-body">
                  <span className="font-bold">Feedback: </span>{rejectedApp.feedback}
                </p>
              )}
              <Button className="rounded-full bg-cv-ink text-white hover:bg-cv-ink/90 text-sm font-bold" onClick={() => router.push('/partner/storefront-application')}>
                Apply again <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="cv-card border-cv-line bg-cv-soft/30">
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-cv-ink" />
                <div>
                  <p className="text-sm font-bold text-cv-ink">Want your own storefront?</p>
                  <p className="text-xs text-cv-muted">Apply to get a full Careverse storefront with your branding.</p>
                </div>
              </div>
              <p className="text-sm text-cv-body">
                A storefront lets you customize your page, showcase your content, and sell Careverse memberships directly. Submit 5 pieces of content for review.
              </p>
              <Button className="rounded-full bg-cv-ink text-white hover:bg-cv-ink/90 text-sm font-bold" onClick={() => router.push('/partner/storefront-application')}>
                <FileText className="h-4 w-4 mr-1.5" />
                Apply for a storefront
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Creator Profiles */}
        {creatorProfiles.length > 0 && (
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-cv-ink uppercase tracking-wider">Your Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {creatorProfiles.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-cv-line px-3 py-2">
                  <div>
                    <p className="text-sm font-bold text-cv-ink">{p.platform}</p>
                    <p className="text-xs text-cv-muted">{p.handle}</p>
                  </div>
                  {p.profileUrl && (
                    <a href={p.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-cv-ink hover:text-cv-red flex items-center gap-1">
                      Visit <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Conversions (affiliate) */}
        <Card className="cv-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Recent Conversions</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-cv-muted" onClick={() => router.push('/partner/conversions')}>
              View all
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {recentConversions.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No conversions yet"
                description="When customers purchase Careverse memberships through your affiliate link, their conversions will appear here. Share your link to start earning."
                action={
                  <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={() => setShareDialogOpen(true)}>
                    <Share2 className="h-4 w-4" /> Share your link
                  </Button>
                }
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentConversions.map((c) => (
                    <TableRow key={c.id} className="border-cv-line">
                      <TableCell className="font-bold text-cv-ink text-sm">{c.plan}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">${c.commission.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge status={c.status.toLowerCase() as any} />
                      </TableCell>
                      <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <SupportLink variant="card" context="Questions about your affiliate link, earnings, or applying for a storefront? We're here to help." />

        <ShareStoreDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          storeUrl={affiliateLink?.url || currentPartnerStorefront.url}
          storeName="Your Affiliate Link"
          isPublished={true}
        />
      </div>
    );
  }

  // --- Incomplete / new partner onboarding view (business or unlocked creators) ---
  if (!onboardingDone) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Get Started"
          title={`Welcome, ${user?.name?.split(' ')[0] || 'Partner'}!`}
          description="Let's get your store set up and ready to launch."
        />

        {/* Welcome banner with next action highlight */}
        <div className="rounded-2xl bg-gradient-to-br from-cv-ink to-cv-night p-6 sm:p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">Welcome to Careverse Partners</h2>
              <p className="text-sm text-white/70 mt-1 max-w-lg">
                You're just a few steps away from launching your storefront and starting to earn commission. Follow the checklist below to get everything set up.
              </p>
              {nextStep && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/60">Next step</p>
                    <p className="text-sm font-bold">{nextStep.label}</p>
                  </div>
                  <button
                    onClick={() => router.push(nextStep.href)}
                    className="rounded-full bg-white text-cv-ink px-4 py-2 text-xs font-bold hover:bg-white/90 transition-colors"
                  >
                    Go
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GetStartedChecklist />
          </div>

          <div className="space-y-4">
            {/* Setup progress */}
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-cv-ink uppercase tracking-wider">Setup Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-3xl font-bold text-cv-ink">{completedCount}/7</p>
                  <p className="text-xs text-cv-muted">Setup steps completed</p>
                </div>
                <div className="h-2 rounded-full bg-cv-soft overflow-hidden">
                  <div
                    className="h-full bg-cv-good rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((completedCount / 7) * 100)}%` }}
                  />
                </div>
                {nextStep && (
                  <Button
                    className="w-full rounded-full bg-cv-ink text-white hover:bg-cv-ink/90 text-sm font-bold"
                    onClick={() => router.push(nextStep.href)}
                  >
                    {nextStep.label}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Store health */}
            <StoreHealth />

            {/* Your store card */}
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-cv-ink uppercase tracking-wider">Your Store</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                    <Store className="h-5 w-5 text-cv-ink" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-cv-ink">{currentPartnerStorefront.name}</p>
                    <StatusBadge status={currentPartnerStorefront.status === 'LIVE' ? 'live' : 'draft'} />
                  </div>
                </div>
                {currentPartnerStorefront.status !== 'LIVE' && (
                  <p className="text-xs text-cv-muted">Your store must be published before sharing.</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs"
                    onClick={() => setShareDialogOpen(true)}
                    disabled={currentPartnerStorefront.status !== 'LIVE'}
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs"
                    onClick={() => setTestDialogOpen(true)}
                  >
                    <FlaskConical className="h-3.5 w-3.5 mr-1" />
                    Test store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <ShareStoreDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          storeUrl={currentPartnerStorefront.url}
          storeName={currentPartnerStorefront.name}
          isPublished={currentPartnerStorefront.status === 'LIVE'}
        />
        <TestStoreDialog open={testDialogOpen} onOpenChange={setTestDialogOpen} />
      </div>
    );
  }

  // --- Active seller dashboard ---
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Partner'}`}
        description="Your earnings, storefront performance, and recent conversions at a glance."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft"
              onClick={() => setTestDialogOpen(true)}
            >
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Test store</span>
            </Button>
            <Button
              className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full font-bold"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share your store</span>
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Available"
          value={fmtMoney(partnerDashboardStats.available)}
          icon={Wallet}
          description="Ready for payout"
        />
        <StatCard
          label="Pending"
          value={fmtMoney(partnerDashboardStats.pending)}
          icon={TrendingUp}
          description="Awaiting approval"
        />
        <StatCard
          label="Conversions"
          value={partnerDashboardStats.conversions}
          icon={Users}
          trend="+12%"
          trendUp
          description="All time"
        />
        <StatCard
          label="Storefront Visitors"
          value={partnerDashboardStats.visitors.toLocaleString()}
          icon={MousePointerClick}
          trend="+8%"
          trendUp
          description="Last 30 days"
        />
      </div>

      {/* Lidia engagement — future metrics placeholder */}
      <Card className="cv-card border-dashed border-cv-line bg-cv-soft/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-soft">
              <Heart className="h-4 w-4 text-cv-ink" />
            </div>
            <div>
              <p className="text-sm font-bold text-cv-ink">Lidia Engagement</p>
              <p className="text-xs text-cv-muted">Member activity through Lidia — coming soon</p>
            </div>
          </div>
          <p className="text-xs text-cv-muted leading-relaxed">
            After purchase, your customers manage their benefits through Lidia, Careverse's AI care assistant.
            Future reporting will show how your referred members engage with their benefits — without exposing any clinical or care details.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance chart - spans 2 cols */}
        <Card className="cv-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold text-cv-ink">Performance</CardTitle>
              <p className="text-xs text-cv-muted mt-0.5">Track your revenue, conversions, and commission over time</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-cv-soft rounded-lg p-0.5">
                {(['7D', '30D', '90D', 'ALL'] as TimeRange[]).map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setTimeRange(tr)}
                    className={cn(
                      'px-2 sm:px-3 py-1 text-xs font-bold rounded-md transition-all',
                      timeRange === tr ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                    )}
                  >
                    {tr}
                  </button>
                ))}
              </div>
              <div className="hidden sm:flex bg-cv-soft rounded-lg p-0.5">
                {([
                  { key: 'revenue' as Metric, label: 'Revenue' },
                  { key: 'conversions' as Metric, label: 'Conversions' },
                  { key: 'commission' as Metric, label: 'Commission' },
                ]).map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMetric(m.key)}
                    className={cn(
                      'px-3 py-1 text-xs font-bold rounded-md transition-all',
                      metric === m.key ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between gap-2 h-48 pt-4">
              {performanceData.map((d, i) => {
                const value = d[metric];
                const heightPct = (value / maxValue) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex-1 flex items-end justify-center relative">
                      <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-cv-ink whitespace-nowrap">
                        {metric === 'conversions' ? value : fmtMoney(value)}
                      </div>
                      <div
                        className="w-full max-w-[60px] rounded-t-lg bg-cv-ink hover:bg-cv-red transition-colors"
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-cv-muted whitespace-nowrap">{d.date}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Store status & health sidebar */}
        <div className="space-y-4">
          {/* Storefront status */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-cv-ink">Storefront Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
                  <Store className="h-5 w-5 text-cv-ink" />
                </div>
                <div>
                  <p className="text-sm font-bold text-cv-ink">{currentPartnerStorefront.name}</p>
                  <StatusBadge status={currentPartnerStorefront.status === 'LIVE' ? 'live' : 'draft'} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-cv-muted">Visitors</p>
                  <p className="text-sm font-bold text-cv-ink">{currentPartnerStorefront.visitors.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-cv-muted">Conv.</p>
                  <p className="text-sm font-bold text-cv-ink">{currentPartnerStorefront.conversions}</p>
                </div>
                <div>
                  <p className="text-xs text-cv-muted">Revenue</p>
                  <p className="text-sm font-bold text-cv-ink">{fmtMoney(currentPartnerStorefront.revenue)}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs" onClick={() => setShareDialogOpen(true)}>
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs" onClick={() => router.push('/storefront')}>
                  <ExternalLink className="h-3.5 w-3.5" /> View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs" onClick={() => router.push('/partner/store')}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payout status */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-cv-ink">Payout Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cv-muted">Available</span>
                <span className="text-sm font-bold text-cv-ink">{fmtMoney(partnerDashboardStats.available)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cv-muted">Pending commissions</span>
                <span className="text-sm font-bold text-cv-ink">{pendingCommissions.length}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-cv-soft px-3 py-2">
                <Clock className="h-3.5 w-3.5 text-cv-muted" />
                <span className="text-xs text-cv-body">Next payout: Oct 1</span>
              </div>
              <Button variant="outline" size="sm" className="w-full rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs" onClick={() => router.push('/partner/payouts')}>
                View payouts <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Store health */}
          <StoreHealth />
        </div>
      </div>

      {/* Recent Conversions */}
      <Card className="cv-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-bold text-cv-ink">Recent Conversions</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-cv-muted" onClick={() => router.push('/partner/conversions')}>
            View all
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          {recentConversions.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No conversions yet"
              description="When customers purchase Careverse plans through your storefront, their conversions will appear here. Share your store link to start earning."
              action={
                <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={() => setShareDialogOpen(true)}>
                  <Share2 className="h-4 w-4" /> Share your store
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentConversions.map((c) => (
                  <TableRow key={c.id} className="border-cv-line">
                    <TableCell className="font-bold text-cv-ink text-sm">{c.plan}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">${c.commission.toFixed(2)}</TableCell>
                    <TableCell>
                      <StatusBadge status={c.status.toLowerCase() as any} />
                    </TableCell>
                    <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SupportLink variant="card" context="Questions about your dashboard, earnings, or storefront? We're here to help." />

      <ShareStoreDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        storeUrl={currentPartnerStorefront.url}
        storeName={currentPartnerStorefront.name}
        isPublished={currentPartnerStorefront.status === 'LIVE'}
      />
      <TestStoreDialog open={testDialogOpen} onOpenChange={setTestDialogOpen} />
    </div>
  );
}
