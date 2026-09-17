'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Image as ImageIcon, FileText, Video, Layers, Megaphone, Gift,
  Presentation, Users, Download, ExternalLink, BookOpen, Palette, Info,
  File as FileIcon, AlertCircle, X, type LucideIcon,
} from 'lucide-react';
import type { MockResource, ResourcePackage } from '@/data/mock/types';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';
import {
  loadResourceCatalog, getAssetObjectURL, downloadAssetFile,
  getAssetKind, canPreviewInBrowser, formatFileSize, isResourceAvailable,
  getSupportedExtensions,
} from '@/lib/resource-persistence';

const iconMap: Record<string, LucideIcon> = {
  palette: Palette, 'file-text': FileText, info: Info, 'book-open': BookOpen,
  video: Video, image: ImageIcon, file: FileIcon, layers: Layers,
  megaphone: Megaphone, gift: Gift, presentation: Presentation, users: Users,
  link: ExternalLink, download: Download,
};

const tabs: { value: ResourcePackage; label: string; description: string }[] = [
  { value: 'CREATOR', label: 'Creator', description: 'Brand kits, templates, and onboarding for creators.' },
  { value: 'BUSINESS', label: 'Business / Agency', description: 'Playbooks, email packs, and decks for business teams.' },
  { value: 'ALL', label: 'All Partners', description: 'Shared resources available to every partner.' },
];

function ResourceCard({ resource, onView }: { resource: MockResource; onView: (r: MockResource) => void }) {
  const Icon = iconMap[resource.icon] ?? Layers;
  const available = isResourceAvailable(resource);
  const isDownload = resource.type === 'DOWNLOAD' || resource.assetSource === 'UPLOAD';
  const ActionIcon = isDownload ? Download : ExternalLink;

  return (
    <Card className="cv-card flex flex-col">
      <CardContent className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cv-soft">
            <Icon className="h-5 w-5 text-cv-ink" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-cv-ink leading-tight">{resource.title}</h3>
            <p className="text-xs text-cv-muted mt-1 leading-relaxed">{resource.description}</p>
            {resource.fileName && (
              <p className="text-[10px] text-cv-muted mt-1">
                {resource.fileName} {resource.fileSize ? `· ${formatFileSize(resource.fileSize)}` : ''}
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-1">
          {available ? (
            <Button
              variant="outline"
              className="w-full rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft"
              onClick={() => onView(resource)}
            >
              <ActionIcon className="h-4 w-4 mr-1.5" />
              {isDownload ? 'Download' : 'View'}
            </Button>
          ) : (
            <div className="w-full rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-center">
              <p className="text-xs font-bold text-amber-600">Asset not available yet</p>
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

export default function ResourcesPage() {
  const { user } = useMockAuth();
  const [resources, setResources] = useState<MockResource[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [viewerResource, setViewerResource] = useState<MockResource | null>(null);

  useEffect(() => {
    setResources(loadResourceCatalog());
    setLoaded(true);
  }, []);

  const defaultTab: ResourcePackage = user?.partnerType === 'BUSINESS' ? 'BUSINESS' : 'CREATOR';

  const handleView = (r: MockResource) => {
    if (r.assetSource === 'EXTERNAL' && r.url) {
      window.open(r.url, '_blank', 'noopener,noreferrer');
    } else {
      setViewerResource(r);
    }
  };

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resources"
        title="Resources"
        description="Download marketing assets, templates, and guides tailored to your partner type."
      />

      <Tabs defaultValue={defaultTab}>
        <TabsList className="bg-cv-soft h-auto p-1 rounded-xl flex flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}
              className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => {
          const items = resources
            .filter((r) => r.published)
            .filter((r) => t.value === 'ALL' ? r.category === 'ALL' : r.category === t.value || r.category === 'ALL')
            .sort((a, b) => a.order - b.order);
          return (
            <TabsContent key={t.value} value={t.value} className="mt-6">
              <p className="text-sm text-cv-muted mb-4">{t.description}</p>
              {items.length === 0 ? (
                <Card className="cv-card">
                  <CardContent>
                    <EmptyState
                      icon={Layers}
                      title="No resources available"
                      description="New resources for this audience are on the way. Check back soon, or message Careverse if you need something specific."
                      action={
                        <Button variant="outline" className="rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft text-sm"
                          onClick={() => window.location.href = '/partner/messages'}>
                          Message Careverse
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => (
                    <ResourceCard key={r.id} resource={r} onView={handleView} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <ResourceViewerDialog
        resource={viewerResource}
        open={!!viewerResource}
        onOpenChange={(o) => !o && setViewerResource(null)}
      />
    </div>
  );
}
