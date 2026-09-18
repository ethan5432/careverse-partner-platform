'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Image as ImageIcon, Video as VideoIcon, FileText, Link as LinkIcon,
  Megaphone, Download, ExternalLink, Copy, Trash2, Plus, QrCode,
  MousePointerClick, Target, File as FileIcon, Layers,
  AlertCircle, type LucideIcon,
} from 'lucide-react';
import type { MockResource } from '@/data/mock/types';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import {
  loadResourceCatalog, getAssetObjectURL, downloadAssetFile,
  getAssetKind, canPreviewInBrowser, formatFileSize, isResourceAvailable,
} from '@/lib/resource-persistence';
import {
  loadCampaigns, saveCampaigns, deleteCampaign, buildCampaignUrl, type Campaign,
} from '@/lib/campaign-persistence';
import {
  loadStorefrontConfig, getStorefrontSummaries, type StorefrontSummary,
} from '@/lib/store-persistence';

type MarketingTab = 'images' | 'videos' | 'copy' | 'links' | 'campaigns';

const tabConfig: { value: MarketingTab; label: string; icon: LucideIcon }[] = [
  { value: 'images', label: 'Images', icon: ImageIcon },
  { value: 'videos', label: 'Videos', icon: VideoIcon },
  { value: 'copy', label: 'Copy', icon: FileText },
  { value: 'links', label: 'Links', icon: LinkIcon },
  { value: 'campaigns', label: 'Campaigns', icon: Megaphone },
];

function categorizeResource(r: MockResource): MarketingTab | null {
  if (r.type === 'VIDEO') return 'videos';
  if (r.type === 'COPY' || r.type === 'GUIDE') return 'copy';
  if (r.type === 'LINK') return 'links';
  if (r.type === 'BRAND_ASSET' || r.type === 'DOWNLOAD') {
    if (r.fileExt && ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(r.fileExt)) return 'images';
    if (r.fileExt && ['mp4', 'mov', 'webm'].includes(r.fileExt)) return 'videos';
    return 'images';
  }
  if (r.type === 'PRODUCT_INFO') return 'links';
  return null;
}

function ResourceCard({ resource, onView }: { resource: MockResource; onView: (r: MockResource) => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const available = isResourceAvailable(resource);
  const isDownload = resource.type === 'DOWNLOAD' || resource.assetSource === 'UPLOAD';
  const ActionIcon = isDownload ? Download : ExternalLink;
  const kind = resource.fileExt ? getAssetKind(resource.fileExt) : 'other';
  const canPreview = resource.fileExt ? canPreviewInBrowser(resource.fileExt) : false;

  useEffect(() => {
    let revoked = false;
    if (resource.assetSource === 'UPLOAD' && resource.assetId && canPreview) {
      getAssetObjectURL(resource.assetId).then((url) => {
        if (!revoked) setPreviewUrl(url);
      });
    }
    return () => {
      revoked = true;
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [resource.assetId, resource.assetSource, canPreview]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (resource.url) {
      navigator.clipboard.writeText(resource.url);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <Card className="cv-card flex flex-col overflow-hidden">
      <div className="h-32 bg-cv-soft flex items-center justify-center overflow-hidden">
        {previewUrl && kind === 'image' ? (
          <img src={previewUrl} alt={resource.title} className="w-full h-full object-cover" />
        ) : previewUrl && kind === 'video' ? (
          <video src={previewUrl} className="w-full h-full object-cover" muted />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <FileIcon className="h-8 w-8 text-cv-muted" />
            <span className="text-[10px] font-bold text-cv-muted uppercase">{resource.fileExt || resource.type}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-cv-ink leading-tight truncate">{resource.title}</h3>
          <p className="text-xs text-cv-muted mt-1 leading-relaxed line-clamp-2">{resource.description}</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-cv-muted">
          <span className="px-2 py-0.5 rounded-full bg-cv-soft">{resource.type.replace('_', ' ')}</span>
          {resource.fileSize && <span>{formatFileSize(resource.fileSize)}</span>}
        </div>
        <div className="mt-auto flex gap-2">
          {available ? (
            <>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs"
                onClick={() => onView(resource)}
              >
                <ActionIcon className="h-3.5 w-3.5" />
                {isDownload ? 'Download' : 'View'}
              </Button>
              {resource.url && !isDownload && (
                <Button
                  variant="outline"
                  className="rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-xs px-3"
                  onClick={handleCopyLink}
                  title="Copy link"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              )}
            </>
          ) : (
            <div className="w-full rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-center">
              <p className="text-xs font-bold text-amber-600">Not available yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceViewerDialog({
  resource, open, onOpenChange,
}: {
  resource: MockResource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !resource) { setUrl(null); return; }
    let revoked = false;
    setLoading(true);
    (async () => {
      if (resource.assetSource === 'UPLOAD' && resource.assetId) {
        const objUrl = await getAssetObjectURL(resource.assetId);
        if (!revoked) { setUrl(objUrl); setLoading(false); }
      } else if (resource.url) {
        if (!revoked) { setUrl(null); setLoading(false); }
        window.open(resource.url, '_blank', 'noopener,noreferrer');
        onOpenChange(false);
      } else {
        if (!revoked) { setUrl(null); setLoading(false); }
      }
    })();
    return () => { revoked = true; };
  }, [open, resource, onOpenChange]);

  useEffect(() => {
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [url]);

  if (!resource) return null;

  const kind = resource.fileExt ? getAssetKind(resource.fileExt) : 'other';
  const canPreview = resource.fileExt ? canPreviewInBrowser(resource.fileExt) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-cv-ink">{resource.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-cv-muted">Loading...</p>
            </div>
          ) : url && canPreview ? (
            <>
              {kind === 'image' && <img src={url} alt={resource.title} className="w-full rounded-xl" />}
              {kind === 'video' && <video src={url} controls autoPlay className="w-full rounded-xl" />}
              {kind === 'pdf' && <iframe src={url} className="w-full h-[60vh] rounded-xl border border-cv-line" title={resource.title} />}
            </>
          ) : (
            <div className="rounded-xl bg-cv-soft p-6 text-center">
              <FileIcon className="h-8 w-8 text-cv-muted mx-auto mb-2" />
              <p className="text-sm font-bold text-cv-ink">{resource.fileName || resource.title}</p>
              <p className="text-xs text-cv-muted mt-1">
                {resource.fileExt ? `${resource.fileExt.toUpperCase()} file` : ''} {resource.fileSize ? `· ${formatFileSize(resource.fileSize)}` : ''}
              </p>
              <p className="text-xs text-cv-muted mt-2">This file type cannot be previewed in the browser. Download it to view.</p>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => onOpenChange(false)}>Close</Button>
            {resource.assetSource === 'UPLOAD' && resource.assetId && (
              <Button className="cv-btn-primary rounded-full" onClick={() => resource.assetId && downloadAssetFile(resource.assetId, resource.fileName)}>
                <Download className="h-4 w-4" /> Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CampaignCreatorDialog({
  open, onOpenChange, storefronts, onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storefronts: StorefrontSummary[];
  onCreated: (campaign: Campaign) => void;
}) {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [source, setSource] = useState('');
  const [creating, setCreating] = useState(false);

  const reset = () => {
    setName('');
    setDestination('');
    setSource('');
  };

  const canCreate = name.trim().length > 0 && destination.length > 0;

  const handleCreate = async () => {
    if (!canCreate) return;
    setCreating(true);
    const sf = storefronts.find((s) => s.id === destination);
    const baseUrl = sf?.url || '/storefront';
    const ref = `camp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const campaignUrl = buildCampaignUrl(baseUrl, { id: '', name: '', source: '', ref, createdAt: '', clicks: 0, conversions: 0 });
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: name.trim(),
      source: source.trim() || 'direct',
      ref,
      destination: sf?.url || baseUrl,
      storefrontId: sf?.id,
      storefrontName: sf?.name,
      campaignUrl,
      createdAt: new Date().toISOString(),
      clicks: 0,
      conversions: 0,
    };
    const all = loadCampaigns();
    all.push(newCampaign);
    saveCampaigns(all);
    setCreating(false);
    reset();
    onCreated(newCampaign);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-cv-ink">Create a campaign</DialogTitle>
          <DialogDescription className="text-sm text-cv-muted">
            Generate a trackable link and QR code for your selected storefront.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label className="text-sm font-bold text-cv-ink">Campaign name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cv-input"
              placeholder="e.g. Fall Instagram Promotion"
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-bold text-cv-ink">Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="cv-input">
                <SelectValue placeholder="Select a storefront" />
              </SelectTrigger>
              <SelectContent>
                {storefronts.length === 0 ? (
                  <SelectItem value="_none" disabled>No storefronts available</SelectItem>
                ) : (
                  storefronts.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {storefronts.length === 0 && (
              <p className="text-xs text-amber-600 font-bold flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Create a storefront first to associate campaigns with it.
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label className="text-sm font-bold text-cv-ink">Source</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="cv-input"
              placeholder="e.g. instagram, email, tiktok"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="cv-btn-primary rounded-full"
              disabled={!canCreate || creating}
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4" />
              {creating ? 'Creating...' : 'Create campaign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CampaignRow({ campaign, onDelete }: { campaign: Campaign; onDelete: (id: string) => void }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const link = campaign.campaignUrl || buildCampaignUrl(campaign.destination || '/storefront', campaign);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(link, { width: 120, margin: 1 })
      .then((url) => { if (!cancelled) setQrUrl(url); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [link]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success('Campaign link copied');
  };

  const handleDownloadQr = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `${campaign.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="cv-card">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* QR code */}
          <div className="shrink-0 flex items-start gap-3">
            {qrUrl ? (
              <img src={qrUrl} alt="QR code" className="w-24 h-24 rounded-lg border border-cv-line" />
            ) : (
              <div className="w-24 h-24 rounded-lg border border-cv-line bg-cv-soft flex items-center justify-center">
                <QrCode className="h-8 w-8 text-cv-muted" />
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-cv-line text-xs font-bold self-start"
              onClick={handleDownloadQr}
              disabled={!qrUrl}
            >
              <Download className="h-3 w-3" />
              QR
            </Button>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-cv-ink truncate">{campaign.name}</h3>
                <p className="text-xs text-cv-muted mt-0.5">
                  {campaign.storefrontName || 'No storefront'} · {campaign.source}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-cv-line text-xs font-bold text-cv-red hover:bg-red-50 px-2"
                onClick={() => onDelete(campaign.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Link */}
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 rounded-lg bg-cv-soft px-3 py-2">
                <p className="text-xs text-cv-body font-mono truncate">{link}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-cv-line text-xs font-bold shrink-0"
                onClick={handleCopyLink}
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <MousePointerClick className="h-3.5 w-3.5 text-cv-muted" />
                <span className="text-xs font-bold text-cv-ink tabular-nums">{campaign.clicks}</span>
                <span className="text-xs text-cv-muted">clicks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-cv-muted" />
                <span className="text-xs font-bold text-cv-ink tabular-nums">{campaign.conversions}</span>
                <span className="text-xs text-cv-muted">conversions</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResourcesPage() {
  const { user } = useMockAuth();
  const [resources, setResources] = useState<MockResource[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [storefronts, setStorefronts] = useState<StorefrontSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [viewerResource, setViewerResource] = useState<MockResource | null>(null);
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);

  useEffect(() => {
    setResources(loadResourceCatalog());
    setCampaigns(loadCampaigns());
    const isBusiness = user?.partnerType === 'BUSINESS';
    if (isBusiness) {
      setStorefronts(getStorefrontSummaries());
    } else {
      const config = loadStorefrontConfig();
      setStorefronts([{
        id: config.id,
        name: config.name,
        status: config.status,
        customDomain: config.customDomain,
        domainStatus: config.domainStatus,
        url: config.url,
        selectedPackages: config.selectedPackages,
        createdAt: config.savedAt,
        savedAt: config.savedAt,
      }]);
    }
    setLoaded(true);
  }, [user?.partnerType]);

  const refreshCampaigns = useCallback(() => {
    setCampaigns(loadCampaigns());
  }, []);

  const handleView = (r: MockResource) => {
    if (r.assetSource === 'EXTERNAL' && r.url) {
      window.open(r.url, '_blank', 'noopener,noreferrer');
    } else {
      setViewerResource(r);
    }
  };

  const handleDeleteCampaign = (id: string) => {
    deleteCampaign(id);
    refreshCampaigns();
    toast.success('Campaign deleted');
  };

  const handleCampaignCreated = () => {
    refreshCampaigns();
    setCreateCampaignOpen(false);
    toast.success('Campaign created');
  };

  const resourcesByTab = useMemo(() => {
    const map: Record<MarketingTab, MockResource[]> = {
      images: [], videos: [], copy: [], links: [], campaigns: [],
    };
    for (const r of resources) {
      if (!r.published) continue;
      const tab = categorizeResource(r);
      if (tab) map[tab].push(r);
    }
    for (const key of Object.keys(map) as MarketingTab[]) {
      map[key].sort((a, b) => a.order - b.order);
    }
    return map;
  }, [resources]);

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Careverse Marketing"
        title="Careverse Marketing"
        description="Find approved promotional materials and create trackable campaign links with QR codes."
      />

      <Tabs defaultValue="images">
        <TabsList className="bg-cv-soft h-auto p-1 rounded-xl flex flex-wrap">
          {tabConfig.map((t) => (
            <TabsTrigger key={t.value} value={t.value}
              className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted">
              <t.icon className="h-4 w-4 mr-1.5" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabConfig.filter((t) => t.value !== 'campaigns').map((t) => {
          const items = resourcesByTab[t.value];
          return (
            <TabsContent key={t.value} value={t.value} className="mt-6">
              {items.length === 0 ? (
                <Card className="cv-card">
                  <CardContent>
                    <EmptyState
                      icon={t.icon}
                      title={`No ${t.label.toLowerCase()} available`}
                      description="New promotional materials are on the way. Check back soon."
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((r) => (
                    <ResourceCard key={r.id} resource={r} onView={handleView} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}

        {/* Campaigns tab */}
        <TabsContent value="campaigns" className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-cv-muted">
              Create trackable links and QR codes for your storefronts.
            </p>
            <Button
              className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold"
              onClick={() => setCreateCampaignOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create campaign
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <Card className="cv-card">
              <CardContent>
                <EmptyState
                  icon={Megaphone}
                  title="No campaigns yet"
                  description="Create your first campaign to generate a trackable link and QR code for your storefront."
                  action={
                    <Button
                      className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold"
                      onClick={() => setCreateCampaignOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Create campaign
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {campaigns.map((c) => (
                <CampaignRow key={c.id} campaign={c} onDelete={handleDeleteCampaign} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ResourceViewerDialog
        resource={viewerResource}
        open={!!viewerResource}
        onOpenChange={(o) => !o && setViewerResource(null)}
      />

      <CampaignCreatorDialog
        open={createCampaignOpen}
        onOpenChange={setCreateCampaignOpen}
        storefronts={storefronts}
        onCreated={handleCampaignCreated}
      />
    </div>
  );
}
