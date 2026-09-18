'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Copy, Check, ExternalLink, Share2, Mail, MessageSquare, Download,
  QrCode, Loader as Loader2, Plus, Trash2, Link2, Megaphone, BarChart3,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  Campaign, loadCampaigns, createCampaign, deleteCampaign,
  buildStorefrontUrl, buildAffiliateUrl, buildCampaignUrl,
} from '@/lib/campaign-persistence';

interface ShareStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeUrl: string;
  storeName: string;
  isPublished: boolean;
}

function useQrCode(url: string | null) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    if (!url || typeof window === 'undefined') { setQrDataUrl(null); return; }
    setQrLoading(true);
    setQrDataUrl(null);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 300, 300);
        setQrDataUrl(canvas.toDataURL('image/png'));
      } else {
        setQrDataUrl(qrUrl);
      }
      setQrLoading(false);
    };
    img.onerror = () => {
      setQrDataUrl(qrUrl);
      setQrLoading(false);
    };
    img.src = qrUrl;
  }, [url]);

  return { qrDataUrl, qrLoading };
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button
      variant="outline"
      className={cn('rounded-full border-cv-line font-bold shrink-0', copied && 'border-cv-good text-cv-good')}
      onClick={handleCopy}
    >
      {copied ? <><Check className="h-3.5 w-3.5 mr-1" /> Copied</> : <><Copy className="h-3.5 w-3.5 mr-1" /> {label || 'Copy'}</>}
    </Button>
  );
}

function QrPreview({ url, size }: { url: string; size?: number }) {
  const { qrDataUrl, qrLoading } = useQrCode(url);
  const handleDownload = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrDataUrl]);

  const s = size || 96;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center rounded-xl border-2 border-cv-line bg-white shrink-0" style={{ width: s, height: s }}>
        {qrLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-cv-muted" />
        ) : qrDataUrl ? (
          <img src={qrDataUrl} alt="QR code" className="h-full w-full object-contain rounded-lg" />
        ) : (
          <QrCode className="h-6 w-6 text-cv-muted" />
        )}
      </div>
      <Button
        variant="outline"
        className="rounded-full border-cv-line font-bold text-xs"
        onClick={handleDownload}
        disabled={!qrDataUrl}
      >
        <Download className="h-3 w-3 mr-1" /> QR
      </Button>
    </div>
  );
}

function LinkRow({
  label, url, icon: Icon,
}: {
  label: string; url: string; icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase text-cv-muted tracking-wider flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <div className="flex items-center gap-2">
        <Input readOnly value={url} className="cv-input text-xs font-mono" onClick={(e) => e.currentTarget.select()} />
        <CopyButton text={url} />
        <Button variant="outline" className="rounded-full border-cv-line font-bold shrink-0 px-2.5" onClick={() => window.open(url, '_blank')} title="Open">
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function CampaignRow({
  campaign, storeUrl,
}: {
  campaign: Campaign; storeUrl: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const url = buildCampaignUrl(storeUrl, campaign);

  return (
    <div className="rounded-xl border border-cv-line overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-soft shrink-0">
          <Megaphone className="h-4 w-4 text-cv-ink" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-cv-ink truncate">{campaign.name}</p>
          <p className="text-[10px] text-cv-muted">Source: {campaign.source} · {campaign.clicks} clicks · {campaign.conversions} conversions</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-cv-muted hover:text-cv-ink p-1">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      {expanded && (
        <div className="border-t border-cv-line p-3 space-y-3 bg-cv-cream/30">
          <LinkRow label="Campaign link" url={url} icon={Link2} />
          <div className="flex items-center justify-between">
            <QrPreview url={url} size={80} />
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <p className="text-lg font-extrabold text-cv-ink">{campaign.clicks}</p>
                <p className="text-[10px] text-cv-muted">Clicks</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-extrabold text-cv-ink">{campaign.conversions}</p>
                <p className="text-[10px] text-cv-muted">Conversions</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => deleteCampaign(campaign.id)}
            className="text-[10px] font-bold text-cv-muted hover:text-cv-red transition-colors flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" /> Delete campaign
          </button>
        </div>
      )}
    </div>
  );
}

export function ShareStoreDialog({ open, onOpenChange, storeUrl, storeName, isPublished }: ShareStoreDialogProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSource, setNewSource] = useState('');
  const [copyText, setCopyText] = useState('');

  const fullStoreUrl = buildStorefrontUrl(storeUrl);
  const affiliateRef = 'aff-direct';
  const affiliateUrl = buildAffiliateUrl(storeUrl, affiliateRef);

  useEffect(() => {
    if (open) {
      setCampaigns(loadCampaigns());
      setCopyText(`Check out ${storeName} — quality care for your family. ${fullStoreUrl}`);
      setShowCreateForm(false);
      setNewName('');
      setNewSource('');
    }
  }, [open, storeName, fullStoreUrl]);

  const handleCreateCampaign = () => {
    if (!newName.trim()) return;
    const campaign = createCampaign(newName.trim(), newSource.trim().toLowerCase());
    setCampaigns(loadCampaigns());
    setNewName('');
    setNewSource('');
    setShowCreateForm(false);
  };

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title: storeName, text: copyText, url: fullStoreUrl }); } catch { /* cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(fullStoreUrl); } catch { /* ignore */ }
    }
  }, [storeName, copyText, fullStoreUrl]);

  const handleEmailShare = useCallback(() => {
    window.open(`mailto:?subject=${encodeURIComponent(`Check out ${storeName}`)}&body=${encodeURIComponent(copyText)}`, '_blank');
  }, [storeName, copyText]);

  const handleTextShare = useCallback(() => {
    window.open(`sms:?body=${encodeURIComponent(copyText)}`, '_blank');
  }, [copyText]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-cv-ink">
            <Share2 className="h-5 w-5" />
            Share your store
          </DialogTitle>
          <DialogDescription className="text-sm text-cv-muted">
            Share your storefront link, QR code, or create campaigns to track where your clicks come from.
          </DialogDescription>
        </DialogHeader>

        {!isPublished && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm font-bold text-amber-700">
              Your store is not published yet. Links will work, but visitors will see a coming soon page until you publish.
            </p>
          </div>
        )}

        {/* Storefront link */}
        <LinkRow label="Storefront link" url={fullStoreUrl} icon={ExternalLink} />

        {/* Affiliate link */}
        <LinkRow label="Affiliate link" url={affiliateUrl} icon={Link2} />

        {/* QR code for storefront */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-cv-muted tracking-wider flex items-center gap-1.5">
            <QrCode className="h-3 w-3" /> Storefront QR code
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-cv-line p-3">
            <QrPreview url={fullStoreUrl} size={100} />
            <p className="text-xs text-cv-muted flex-1">
              Scan or download this QR code for print materials, business cards, or flyers. It points directly to your storefront.
            </p>
          </div>
        </div>

        {/* Quick share actions */}
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-2.5" onClick={() => window.open(fullStoreUrl, '_blank')}>
            <ExternalLink className="h-4 w-4 text-cv-ink" />
            <span className="text-[10px] font-bold uppercase text-cv-muted">Open</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-2.5" onClick={handleNativeShare}>
            <Share2 className="h-4 w-4 text-cv-ink" />
            <span className="text-[10px] font-bold uppercase text-cv-muted">Share</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-2.5" onClick={handleEmailShare}>
            <Mail className="h-4 w-4 text-cv-ink" />
            <span className="text-[10px] font-bold uppercase text-cv-muted">Email</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-2.5" onClick={handleTextShare}>
            <MessageSquare className="h-4 w-4 text-cv-ink" />
            <span className="text-[10px] font-bold uppercase text-cv-muted">Text</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-cv-line pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-cv-ink flex items-center gap-1.5">
                <Megaphone className="h-4 w-4" /> Campaigns
              </p>
              <p className="text-xs text-cv-muted">Create trackable links for different sources. All send customers to the same storefront.</p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold text-xs shrink-0"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> New
            </Button>
          </div>

          {/* Create campaign form */}
          {showCreateForm && (
            <div className="rounded-xl border border-cv-line p-3 space-y-3 bg-cv-cream/30">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-cv-ink">Campaign name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="cv-input text-sm"
                  placeholder="e.g. October Instagram Promo"
                  maxLength={50}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-cv-ink">Source</Label>
                <Input
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="cv-input text-sm"
                  placeholder="e.g. instagram, email, youtube"
                  maxLength={30}
                />
                <p className="text-[10px] text-cv-muted">Where you plan to share this link. Helps you track which sources perform best.</p>
              </div>
              <div className="flex gap-2">
                <Button className="cv-btn-primary rounded-full text-xs" onClick={handleCreateCampaign} disabled={!newName.trim()}>
                  <Check className="h-3.5 w-3.5 mr-1" /> Create campaign
                </Button>
                <Button variant="outline" className="rounded-full border-cv-line font-bold text-xs" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Campaign list */}
          {campaigns.length === 0 && !showCreateForm && (
            <div className="rounded-xl border border-dashed border-cv-line p-6 text-center">
              <BarChart3 className="h-8 w-8 text-cv-muted mx-auto mb-2" />
              <p className="text-sm font-bold text-cv-ink mb-1">No campaigns yet</p>
              <p className="text-xs text-cv-muted">Create your first campaign to get a trackable link and QR code for a specific source.</p>
            </div>
          )}

          <div className="space-y-2">
            {campaigns.map((c) => (
              <CampaignRow key={c.id} campaign={c} storeUrl={storeUrl} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
