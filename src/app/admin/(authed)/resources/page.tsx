'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  BookOpen, Palette, FileText, Info, Video, Download, ExternalLink, Layers,
  Megaphone, Gift, Presentation, Users, Plus, Pencil, Trash2, Eye, EyeOff,
  ArrowUp, ArrowDown, Search, Upload, File as FileIcon, X, AlertCircle,
  CheckCircle2, type LucideIcon,
} from 'lucide-react';
import type { MockResource, ResourcePackage, ResourceType, ResourceIconKey } from '@/data/mock/types';
import { cn } from '@/lib/utils';
import {
  loadResourceCatalog, saveResourceCatalog, createResource,
  storeAssetFile, deleteAssetFile, downloadAssetFile, getAssetObjectURL,
  isSupportedFile, getMaxFileSize, getSupportedExtensions, getFileExtension,
  getAssetKind, canPreviewInBrowser, formatFileSize, isResourceAvailable,
} from '@/lib/resource-persistence';

const iconMap: Record<ResourceIconKey, LucideIcon> = {
  palette: Palette, 'file-text': FileText, info: Info, 'book-open': BookOpen,
  video: Video, image: Layers, file: FileIcon, layers: Layers, megaphone: Megaphone,
  gift: Gift, presentation: Presentation, users: Users, link: ExternalLink, download: Download,
};

const typeIconKey: Record<ResourceType, ResourceIconKey> = {
  GUIDE: 'book-open', BRAND_ASSET: 'palette', COPY: 'file-text', PRODUCT_INFO: 'info',
  VIDEO: 'video', DOWNLOAD: 'download', LINK: 'link',
};

const typeLabel: Record<ResourceType, string> = {
  GUIDE: 'Guide', BRAND_ASSET: 'Brand Asset', COPY: 'Copy / Template',
  PRODUCT_INFO: 'Product Info', VIDEO: 'Video', DOWNLOAD: 'Download', LINK: 'External Link',
};

const audienceLabel: Record<ResourcePackage, string> = {
  CREATOR: 'Creator', BUSINESS: 'Business / Agency', ALL: 'All Partners',
};

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type AudienceFilter = 'ALL' | ResourcePackage;
const audienceFilters: { value: AudienceFilter; label: string }[] = [
  { value: 'ALL', label: 'All' }, { value: 'CREATOR', label: 'Creator' }, { value: 'BUSINESS', label: 'Business' },
];

type StatusFilter = 'ALL' | 'PUBLISHED' | 'UNPUBLISHED';
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'UNPUBLISHED', label: 'Unpublished' },
];

interface DraftResource {
  title: string;
  type: ResourceType;
  category: ResourcePackage;
  description: string;
  url: string;
  icon: ResourceIconKey;
  published: boolean;
  order: number;
  thumbnail?: string;
  assetSource?: 'UPLOAD' | 'EXTERNAL';
  assetId?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileExt?: string;
}

const emptyDraft: DraftResource = {
  title: '', type: 'GUIDE', category: 'ALL', description: '', url: '',
  icon: 'book-open', published: false, order: 0,
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<MockResource[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [editing, setEditing] = useState<MockResource | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<DraftResource>(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<MockResource | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<MockResource | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResources(loadResourceCatalog());
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: MockResource[]) => {
    setResources(updated);
    saveResourceCatalog(updated);
  }, []);

  const filtered = useMemo(() => {
    return resources
      .filter((r) => {
        const matchesAudience = audienceFilter === 'ALL' || r.category === audienceFilter || r.category === 'ALL';
        const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'PUBLISHED' && r.published) || (statusFilter === 'UNPUBLISHED' && !r.published);
        const q = search.trim().toLowerCase();
        const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
        return matchesAudience && matchesStatus && matchesSearch;
      })
      .sort((a, b) => a.order - b.order);
  }, [resources, search, audienceFilter, statusFilter]);

  const publishedCount = resources.filter((r) => r.published).length;
  const creatorCount = resources.filter((r) => r.category === 'CREATOR' || r.category === 'ALL').length;
  const businessCount = resources.filter((r) => r.category === 'BUSINESS' || r.category === 'ALL').length;

  const openCreate = () => {
    setDraft({ ...emptyDraft, order: resources.length });
    setIsCreating(true);
    setEditing(null);
    setUploadError('');
  };

  const openEdit = (r: MockResource) => {
    setEditing(r);
    setDraft({
      title: r.title, type: r.type, category: r.category, description: r.description,
      url: r.url, icon: r.icon, published: r.published, order: r.order,
      thumbnail: r.thumbnail, assetSource: r.assetSource, assetId: r.assetId,
      fileName: r.fileName, fileSize: r.fileSize, fileType: r.fileType, fileExt: r.fileExt,
    });
    setIsCreating(false);
    setUploadError('');
  };

  const closeDialog = () => {
    setEditing(null);
    setIsCreating(false);
    setUploadError('');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    if (!isSupportedFile(file)) {
      setUploadError(`Unsupported file type. Supported: ${getSupportedExtensions().join(', ')}`);
      e.target.value = '';
      return;
    }
    if (file.size > getMaxFileSize()) {
      setUploadError(`File too large. Maximum: ${formatFileSize(getMaxFileSize())}`);
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const assetId = `asset-${Date.now()}`;
      await storeAssetFile(assetId, file);
      const ext = getFileExtension(file.name);
      setDraft((prev) => ({
        ...prev,
        assetSource: 'UPLOAD',
        assetId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileExt: ext,
        url: '',
      }));
    } catch {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeUploadedFile = async () => {
    if (draft.assetId) {
      try { await deleteAssetFile(draft.assetId); } catch { /* ignore */ }
    }
    setDraft((prev) => ({ ...prev, assetSource: 'EXTERNAL', assetId: undefined, fileName: undefined, fileSize: undefined, fileType: undefined, fileExt: undefined, url: '' }));
  };

  const saveResource = async () => {
    const now = new Date().toISOString().slice(0, 10);
    const icon = typeIconKey[draft.type] || 'book-open';

    if (editing) {
      if (editing.assetId && editing.assetId !== draft.assetId) {
        try { await deleteAssetFile(editing.assetId); } catch { /* ignore */ }
      }
      const updated = resources.map((r) =>
        r.id === editing.id ? { ...r, ...draft, icon, updatedAt: now } : r,
      );
      persist(updated);
    } else {
      const newResource = createResource({ ...draft, icon });
      persist([...resources, newResource]);
    }
    closeDialog();
  };

  const togglePublish = (id: string) => {
    persist(resources.map((r) => (r.id === id ? { ...r, published: !r.published, updatedAt: new Date().toISOString().slice(0, 10) } : r)));
  };

  const deleteResource = async (id: string) => {
    const resource = resources.find((r) => r.id === id);
    if (resource?.assetId) {
      try { await deleteAssetFile(resource.assetId); } catch { /* ignore */ }
    }
    persist(resources.filter((r) => r.id !== id));
    setDeleteTarget(null);
  };

  const moveResource = (id: string, dir: 'up' | 'down') => {
    const sorted = [...resources].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((r) => r.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    persist(resources.map((r) => {
      if (r.id === a.id) return { ...r, order: b.order };
      if (r.id === b.id) return { ...r, order: a.order };
      return r;
    }));
  };

  const handlePreview = async (r: MockResource) => {
    if (r.assetSource === 'UPLOAD' && r.assetId) {
      const url = await getAssetObjectURL(r.assetId);
      if (url) {
        setPreviewUrl(url);
        setPreviewResource(r);
        return;
      }
    }
    if (r.assetSource === 'EXTERNAL' && r.url) {
      window.open(r.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = async (r: MockResource) => {
    if (r.assetSource === 'UPLOAD' && r.assetId) {
      await downloadAssetFile(r.assetId, r.fileName);
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewResource(null);
  };

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const dialogOpen = isCreating || !!editing;
  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resources"
        title="Partner Resources"
        description="Create and manage guides, brand assets, templates, and marketing materials for your partners."
        actions={
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Resource
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Resources" value={resources.length} icon={Layers} description={`${publishedCount} published`} />
        <StatCard label="Published" value={publishedCount} icon={Eye} description="Visible to partners" />
        <StatCard label="For Creators" value={creatorCount} icon={Users} description="Including shared" />
        <StatCard label="For Business" value={businessCount} icon={Users} description="Including shared" />
      </div>

      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="cv-input pl-9 h-11" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
                {audienceFilters.map((f) => (
                  <button key={f.value} onClick={() => setAudienceFilter(f.value)}
                    className={cn('rounded-lg px-3 py-1.5 text-xs font-bold transition-colors', audienceFilter === f.value ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink')}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
                {statusFilters.map((f) => (
                  <button key={f.value} onClick={() => setStatusFilter(f.value)}
                    className={cn('rounded-lg px-3 py-1.5 text-xs font-bold transition-colors', statusFilter === f.value ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink')}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState icon={Layers} title="No resources found" description="Create a new resource or adjust your filters."
              action={<Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={openCreate}><Plus className="h-4 w-4" /> Add Resource</Button>} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted w-16">Order</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Resource</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Audience</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Updated</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, idx) => {
                    const Icon = iconMap[r.icon] ?? Layers;
                    const available = isResourceAvailable(r);
                    return (
                      <TableRow key={r.id} className="border-cv-line">
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveResource(r.id, 'up')} disabled={idx === 0} className="rounded p-0.5 hover:bg-cv-soft disabled:opacity-30 transition-colors">
                              <ArrowUp className="h-3.5 w-3.5 text-cv-muted" />
                            </button>
                            <button onClick={() => moveResource(r.id, 'down')} disabled={idx === filtered.length - 1} className="rounded p-0.5 hover:bg-cv-soft disabled:opacity-30 transition-colors">
                              <ArrowDown className="h-3.5 w-3.5 text-cv-muted" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cv-soft">
                              <Icon className="h-4 w-4 text-cv-ink" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-cv-ink truncate">{r.title}</p>
                              <p className="text-xs text-cv-muted truncate max-w-[240px]">{r.description}</p>
                              {!available && (
                                <p className="text-[10px] font-bold text-amber-600 mt-0.5">Asset not available yet</p>
                              )}
                              {r.assetSource === 'UPLOAD' && r.fileName && (
                                <p className="text-[10px] text-cv-muted mt-0.5 truncate max-w-[200px]">
                                  {r.fileName} {r.fileSize ? `(${formatFileSize(r.fileSize)})` : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><span className="text-xs font-bold text-cv-body">{typeLabel[r.type]}</span></TableCell>
                        <TableCell>
                          <span className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold', r.category === 'ALL' ? 'bg-blue-50 text-blue-600' : 'bg-cv-soft text-cv-body')}>
                            {audienceLabel[r.category]}
                          </span>
                        </TableCell>
                        <TableCell><StatusBadge status={r.published ? 'active' : 'draft'} label={r.published ? 'Published' : 'Unpublished'} /></TableCell>
                        <TableCell className="text-xs text-cv-muted">{fmtDate(r.updatedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handlePreview(r)} disabled={!available}
                              className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors disabled:opacity-30" title={available ? 'Preview' : 'Asset not available'}>
                              <Eye className="h-3.5 w-3.5 text-cv-muted" />
                            </button>
                            <button onClick={() => togglePublish(r.id)} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title={r.published ? 'Unpublish' : 'Publish'}>
                              {r.published ? <EyeOff className="h-3.5 w-3.5 text-cv-muted" /> : <Eye className="h-3.5 w-3.5 text-cv-good" />}
                            </button>
                            <button onClick={() => openEdit(r)} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Edit">
                              <Pencil className="h-3.5 w-3.5 text-cv-muted" />
                            </button>
                            <button onClick={() => setDeleteTarget(r)} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 className="h-3.5 w-3.5 text-cv-red" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">{isCreating ? 'New Resource' : 'Edit Resource'}</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{isCreating ? 'Create a new resource for partners.' : 'Update this resource.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-1 max-h-[60vh] overflow-y-auto">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Title</Label>
              <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="cv-input" placeholder="e.g. Careverse Brand Guidelines" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Resource Type</Label>
                <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as ResourceType })}>
                  <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(typeLabel) as ResourceType[]).map((t) => (<SelectItem key={t} value={t}>{typeLabel[t]}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Partner Audience</Label>
                <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as ResourcePackage })}>
                  <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(audienceLabel) as ResourcePackage[]).map((a) => (<SelectItem key={a} value={a}>{audienceLabel[a]}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Description</Label>
              <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} rows={3} className="cv-input text-sm" placeholder="Brief description shown to partners" />
            </div>

            {/* Asset section: Upload or External URL */}
            <div className="rounded-xl border border-cv-line p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex bg-cv-soft rounded-lg p-0.5 w-full">
                  <button type="button" onClick={() => { setDraft({ ...draft, assetSource: 'UPLOAD', url: '' }); setUploadError(''); }}
                    className={cn('flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all', draft.assetSource === 'UPLOAD' ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink')}>
                    Upload File
                  </button>
                  <button type="button" onClick={() => { setDraft({ ...draft, assetSource: 'EXTERNAL' }); setUploadError(''); }}
                    className={cn('flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all', draft.assetSource !== 'UPLOAD' ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink')}>
                    External URL
                  </button>
                </div>
              </div>

              {draft.assetSource === 'UPLOAD' ? (
                <div className="space-y-2">
                  {draft.fileName ? (
                    <div className="rounded-lg bg-cv-soft p-3 flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-cv-ink shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-cv-ink truncate">{draft.fileName}</p>
                        <p className="text-xs text-cv-muted">
                          {draft.fileSize ? formatFileSize(draft.fileSize) : ''} {draft.fileExt ? `· ${draft.fileExt.toUpperCase()}` : ''}
                        </p>
                      </div>
                      <button type="button" onClick={removeUploadedFile} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors" title="Remove file">
                        <X className="h-4 w-4 text-cv-red" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-cv-line rounded-xl p-6 text-center cursor-pointer hover:border-cv-ink transition-colors"
                    >
                      <Upload className="h-6 w-6 text-cv-muted mx-auto mb-2" />
                      <p className="text-sm font-bold text-cv-ink">{uploading ? 'Uploading...' : 'Click to upload a file'}</p>
                      <p className="text-xs text-cv-muted mt-1">
                        Supported: {getSupportedExtensions().join(', ')}
                      </p>
                      <p className="text-xs text-cv-muted mt-0.5">Max: {formatFileSize(getMaxFileSize())}</p>
                    </div>
                  )}
                  {draft.fileName && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-cv-ink hover:text-cv-good transition-colors">
                      Replace file
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
                </div>
              ) : (
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">External URL</Label>
                  <Input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value, assetSource: 'EXTERNAL' })} className="cv-input" placeholder="https://..." />
                  <p className="text-xs text-cv-muted mt-1">Link to an external resource (Google Drive, YouTube, etc.)</p>
                </div>
              )}

              {uploadError && (
                <div className="rounded-lg bg-red-50 p-2.5 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-cv-red shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-cv-red">{uploadError}</p>
                </div>
              )}
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Thumbnail URL (optional)</Label>
              <Input value={draft.thumbnail || ''} onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value })} className="cv-input" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Sort Order</Label>
                <Input type="number" value={draft.order} onChange={(e) => setDraft({ ...draft, order: parseInt(e.target.value) || 0 })} className="cv-input" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <button type="button" onClick={() => setDraft({ ...draft, published: !draft.published })}
                    className={cn('relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors', draft.published ? 'bg-cv-good' : 'bg-cv-line')}>
                    <span className={cn('inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform', draft.published ? 'translate-x-5' : 'translate-x-1')} />
                  </button>
                  <span className="text-sm font-bold text-cv-ink">Published</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={closeDialog}>Cancel</Button>
            <Button className="cv-btn-primary rounded-full" onClick={saveResource} disabled={!draft.title.trim()}>
              {isCreating ? 'Create resource' : 'Save changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-cv-ink">Delete resource?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-cv-muted">
              Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-cv-line font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction className="rounded-full bg-cv-red text-white font-bold hover:bg-cv-red/90" onClick={() => deleteTarget && deleteResource(deleteTarget.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview dialog */}
      <Dialog open={!!previewUrl} onOpenChange={(o) => !o && closePreview()}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-cv-ink">{previewResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {previewResource && previewUrl && previewResource.fileExt && canPreviewInBrowser(previewResource.fileExt) && (
              <>
                {getAssetKind(previewResource.fileExt) === 'image' && (
                  <img src={previewUrl} alt={previewResource.title} className="w-full rounded-xl" />
                )}
                {getAssetKind(previewResource.fileExt) === 'video' && (
                  <video src={previewUrl} controls className="w-full rounded-xl" />
                )}
                {getAssetKind(previewResource.fileExt) === 'pdf' && (
                  <iframe src={previewUrl} className="w-full h-[60vh] rounded-xl border border-cv-line" title={previewResource.title} />
                )}
              </>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={closePreview}>Close</Button>
              {previewResource?.assetSource === 'UPLOAD' && (
                <Button className="cv-btn-primary rounded-full" onClick={() => previewResource && handleDownload(previewResource)}>
                  <Download className="h-4 w-4" /> Download
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
