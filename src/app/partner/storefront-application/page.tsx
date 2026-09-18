'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth, useEffectivePartner } from '@/hooks/useMockAuth';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, CheckCircle2, Clock, XCircle, ExternalLink, Send, AlertCircle, Lock, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadPendingStorefrontApplication,
  loadStorefrontApplicationsByPartner,
  submitStorefrontApplication,
} from '@/lib/creator-persistence';
import type { StorefrontApplication, StorefrontApplicationContent, StorefrontApplicationStatus } from '@/data/mock/types';

const socialPlatforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter/X', 'Facebook', 'LinkedIn', 'Blog/Website', 'Other'];

const statusConfig: Record<StorefrontApplicationStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  SUBMITTED: { label: 'Submitted', icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  IN_REVIEW: { label: 'In Review', icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  REJECTED: { label: 'Not Approved', icon: XCircle, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

export default function StorefrontApplicationPage() {
  const router = useRouter();
  const { user, creatorProfiles } = useMockAuth();
  const partner = useEffectivePartner();

  const [contentFields, setContentFields] = useState<StorefrontApplicationContent[]>(
    Array.from({ length: 5 }, (_, i) => ({ id: `content-${i}`, platform: 'Instagram', contentUrl: '' }))
  );
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [existingApps, setExistingApps] = useState<StorefrontApplication[]>([]);
  const [currentApp, setCurrentApp] = useState<StorefrontApplication | null>(null);

  useEffect(() => {
    if (!partner) return;
    const apps = loadStorefrontApplicationsByPartner(partner.id);
    setExistingApps(apps);
    const pending = loadPendingStorefrontApplication(partner.id);
    if (pending) {
      setCurrentApp(pending);
    } else if (apps.length > 0 && apps[apps.length - 1].status === 'REJECTED') {
      setCurrentApp(apps[apps.length - 1]);
    }
  }, [partner, submitted]);

  if (!partner) return null;

  const isCreator = partner.partnerType === 'CREATOR';
  if (!isCreator) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-sm text-cv-muted">Storefront applications are only available for creator partners.</p>
        <Button className="cv-btn-primary rounded-full mt-4" onClick={() => router.push('/partner')}>Back to dashboard</Button>
      </div>
    );
  }

  const pendingApp = existingApps.find(a => a.status === 'SUBMITTED' || a.status === 'IN_REVIEW');
  if (pendingApp) {
    const cfg = statusConfig[pendingApp.status];
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" className="rounded-full text-cv-muted hover:text-cv-ink" onClick={() => router.push('/partner')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
        </Button>
        <PageHeader
          eyebrow="Storefront Application"
          title="Application Status"
          description="Your storefront application is being reviewed."
        />
        <Card className={cn('border', cfg.bg)}>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <cfg.icon className={cn('h-6 w-6', cfg.color)} />
              <div>
                <p className={cn('text-lg font-bold', cfg.color)}>{cfg.label}</p>
                <p className="text-xs text-cv-muted">Submitted on {new Date(pendingApp.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-sm text-cv-body">
              Your application is being reviewed by the Careverse team. You will be notified when a decision is made.
              This typically takes 3-5 business days.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Submitted Content</p>
              {pendingApp.contentSubmissions.map((c, i) => (
                <div key={c.id} className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-cv-ink">{i + 1}.</span>
                  <span className="text-cv-muted">{c.platform}</span>
                  <a href={c.contentUrl} target="_blank" rel="noopener noreferrer" className="text-cv-ink underline hover:text-cv-red flex items-center gap-1">
                    View content <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const lastApp = existingApps[existingApps.length - 1];
  if (lastApp && lastApp.status === 'REJECTED' && !submitted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" className="rounded-full text-cv-muted hover:text-cv-ink" onClick={() => router.push('/partner')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
        </Button>
        <PageHeader
          eyebrow="Storefront Application"
          title="Apply Again"
          description="Your previous application was not approved. You can submit a new application below."
        />
        {lastApp.feedback && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <span className="font-bold">Feedback from the review team: </span>{lastApp.feedback}
            </AlertDescription>
          </Alert>
        )}
        <ApplicationForm
          creatorProfiles={creatorProfiles}
          contentFields={contentFields}
          setContentFields={setContentFields}
          error={error}
          setError={setError}
          onSubmit={() => {
            const valid = contentFields.every(c => c.contentUrl.trim());
            if (!valid) {
              setError(`All ${contentFields.length} content links are required.`);
              return;
            }
            const validUrls = contentFields.every(c => {
              try { new URL(c.contentUrl); return true; } catch { return false; }
            });
            if (!validUrls) {
              setError('All content links must be valid URLs.');
              return;
            }
            submitStorefrontApplication(partner.id, partner.name, partner.email, creatorProfiles, contentFields);
            setSubmitted(true);
            setError('');
            setContentFields(Array.from({ length: 5 }, (_, i) => ({ id: `content-${i}`, platform: 'Instagram', contentUrl: '' })));
            router.push('/partner/storefront-application');
          }}
        />
      </div>
    );
  }

  if (lastApp && lastApp.status === 'APPROVED') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" className="rounded-full text-cv-muted hover:text-cv-ink" onClick={() => router.push('/partner')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
        </Button>
        <PageHeader
          eyebrow="Storefront Application"
          title="Application Approved"
          description="Your storefront access has been granted."
        />
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-700" />
              <p className="text-lg font-bold text-emerald-700">Approved</p>
            </div>
            <p className="text-sm text-cv-body">
              Your storefront access has been unlocked. You can now customize your store and start selling.
            </p>
            <Button className="cv-btn-primary rounded-full" onClick={() => router.push('/partner/store')}>
              Go to Store Editor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" className="rounded-full text-cv-muted hover:text-cv-ink" onClick={() => router.push('/partner')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to dashboard
      </Button>
      <PageHeader
        eyebrow="Storefront Application"
        title="Apply for a Storefront"
        description="Submit your best content for review. Approved creators get a full storefront on Careverse."
      />
      <ApplicationForm
        creatorProfiles={creatorProfiles}
        contentFields={contentFields}
        setContentFields={setContentFields}
        error={error}
        setError={setError}
        onSubmit={() => {
          const valid = contentFields.every(c => c.contentUrl.trim());
          if (!valid) {
            setError('All 5 content links are required.');
            return;
          }
          const validUrls = contentFields.every(c => {
            try { new URL(c.contentUrl); return true; } catch { return false; }
          });
          if (!validUrls) {
            setError('All content links must be valid URLs.');
            return;
          }
          submitStorefrontApplication(partner.id, partner.name, partner.email, creatorProfiles, contentFields);
          setSubmitted(true);
          setError('');
          setContentFields(Array.from({ length: 5 }, (_, i) => ({ id: `content-${i}`, platform: 'Instagram', contentUrl: '' })));
          router.push('/partner/storefront-application');
        }}
      />
    </div>
  );
}

function ApplicationForm({
  creatorProfiles,
  contentFields,
  setContentFields,
  error,
  setError,
  onSubmit,
}: {
  creatorProfiles: { id: string; platform: string; handle: string; profileUrl: string; followerCount?: number }[];
  contentFields: StorefrontApplicationContent[];
  setContentFields: React.Dispatch<React.SetStateAction<StorefrontApplicationContent[]>>;
  error: string;
  setError: (e: string) => void;
  onSubmit: () => void;
}) {
  const allFilled = contentFields.every(c => c.contentUrl.trim());

  return (
    <div className="space-y-6">
      {/* Requirements */}
      <Card className="border-cv-line bg-cv-soft/50">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-cv-ink" />
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider">Storefront Requirements</h3>
          </div>
          <div className="space-y-2 text-sm text-cv-body leading-relaxed">
            <p>
              To be considered for a Careverse storefront, submit at least 5 of your best pieces of content about Careverse.
            </p>
            <p>
              These should be content you have already created and published on one or more platforms. We'll review your submissions for quality, accuracy, and fit with the Careverse brand.
            </p>
            <p>
              If we believe your content meets the standard, we'll approve your storefront access.
            </p>
            <p>
              Submit 5 or more public links to your best Careverse content.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Existing profiles */}
      {creatorProfiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cv-muted">Your Profiles (for reference)</h3>
          <div className="flex flex-wrap gap-2">
            {creatorProfiles.map(p => (
              <a
                key={p.id}
                href={p.profileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-cv-line px-3 py-1.5 text-xs font-bold text-cv-ink hover:bg-cv-soft transition-colors"
              >
                {p.platform} {p.handle && <span className="text-cv-muted">{p.handle}</span>}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Content submission fields */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Content Submissions</h3>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {contentFields.map((field, idx) => (
          <div key={field.id} className="rounded-xl border border-cv-line p-4 space-y-3 bg-white">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cv-ink text-white text-xs font-bold">{idx + 1}</span>
              <span className="text-sm font-bold text-cv-ink">Content Piece {idx + 1}</span>
              {contentFields.length > 5 && (
                <button
                  type="button"
                  onClick={() => setContentFields(prev => prev.filter(c => c.id !== field.id))}
                  className="ml-auto text-cv-muted hover:text-cv-red transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" /> Remove
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-cv-muted">Platform</Label>
                <select
                  value={field.platform}
                  onChange={(e) => setContentFields(prev => prev.map(c => c.id === field.id ? { ...c, platform: e.target.value } : c))}
                  className="cv-input h-11 w-full rounded-xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                >
                  {socialPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-[10px] font-bold uppercase text-cv-muted">Public Content URL</Label>
                <Input
                  type="url"
                  value={field.contentUrl}
                  onChange={(e) => { setContentFields(prev => prev.map(c => c.id === field.id ? { ...c, contentUrl: e.target.value } : c)); setError(''); }}
                  className="cv-input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setContentFields(prev => [...prev, { id: `content-${Date.now()}`, platform: 'Instagram', contentUrl: '' }])}
          className="flex items-center gap-2 text-sm font-bold text-cv-ink hover:text-cv-red transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add another piece
        </button>
      </div>

      <button
        onClick={onSubmit}
        disabled={!allFilled}
        className="cv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
        Submit Application
      </button>
      {!allFilled && (
        <p className="text-center text-xs text-cv-muted">All {contentFields.length} content links are required to submit.</p>
      )}
    </div>
  );
}
