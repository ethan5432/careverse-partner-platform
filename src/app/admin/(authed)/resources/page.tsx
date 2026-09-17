'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
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
  ArrowUp, ArrowDown, Search, type LucideIcon,
} from 'lucide-react';
import { mockResources } from '@/data/mock';
import type { MockResource, ResourcePackage, ResourceType, ResourceIconKey } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const iconMap: Record<ResourceIconKey, LucideIcon> = {
  palette: Palette,
  'file-text': FileText,
  info: Info,
  'book-open': BookOpen,
  video: Video,
  image: Layers,
  file: FileText,
  layers: Layers,
  megaphone: Megaphone,
  gift: Gift,
  presentation: Presentation,
  users: Users,
  link: ExternalLink,
  download: Download,
};

const typeIconKey: Record<ResourceType, ResourceIconKey> = {
  GUIDE: 'book-open',
  BRAND_ASSET: 'palette',
  COPY: 'file-text',
  PRODUCT_INFO: 'info',
  VIDEO: 'video',
  DOWNLOAD: 'download',
  LINK: 'link',
};

const typeLabel: Record<ResourceType, string> = {
  GUIDE: 'Guide',
  BRAND_ASSET: 'Brand Asset',
  COPY: 'Copy / Template',
  PRODUCT_INFO: 'Product Info',
  VIDEO: 'Video',
  DOWNLOAD: 'Download',
  LINK: 'External Link',
};

const audienceLabel: Record<ResourcePackage, string> = {
  CREATOR: 'Creator',
  BUSINESS: 'Business / Agency',
  ALL: 'All Partners',
};

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

type AudienceFilter = 'ALL' | ResourcePackage;
const audienceFilters: { value: AudienceFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'CREATOR', label: 'Creator' },
  { value: 'BUSINESS', label: 'Business' },
];

type StatusFilter = 'ALL' | 'PUBLISHED' | 'UNPUBLISHED';
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
];

const emptyResource: Omit<MockResource, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  type: 'GUIDE',
  category: 'ALL',
  description: '',
  url: '',
  icon: 'book-open',
  published: false,
  order: 0,
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<MockResource[]>(mockResources);
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [editing, setEditing] = useState<MockResource | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<typeof emptyResource>(emptyResource);
  const [deleteTarget, setDeleteTarget] = useState<MockResource | null>(null);

  const filtered = useMemo(() => {
    return resources
      .filter((r) => {
        const matchesAudience = audienceFilter === 'ALL' || r.category === audienceFilter || r.category === 'ALL';
        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'PUBLISHED' && r.published) ||
          (statusFilter === 'UNPUBLISHED' && !r.published);
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
    setDraft({ ...emptyResource, order: resources.length });
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (r: MockResource) => {
    setEditing(r);
    setDraft({
      title: r.title, type: r.type, category: r.category, description: r.description,
      url: r.url, icon: r.icon, published: r.published, order: r.order,
    });
    setIsCreating(false);
  };

  const closeDialog = () => {
    setEditing(null);
    setIsCreating(false);
  };

  const saveResource = () => {
    const now = new Date().toISOString().slice(0, 10);
    const icon = typeIconKey[draft.type] || 'book-open';
    if (isCreating) {
      const newResource: MockResource = {
        ...draft,
        id: `r-${Date.now()}`,
        icon,
        createdAt: now,
        updatedAt: now,
      };
      setResources((prev) => [...prev, newResource]);
    } else if (editing) {
      setResources((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...draft, icon, updatedAt: now } : r)),
      );
    }
    closeDialog();
  };

  const togglePublish = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, published: !r.published, updatedAt: new Date().toISOString().slice(0, 10) } : r)),
    );
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    setDeleteTarget(null);
  };

  const moveResource = (id: string, dir: 'up' | 'down') => {
    setResources((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((r) => r.id === id);
      if (idx < 0) return prev;
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const a = sorted[idx];
      const b = sorted[swapIdx];
      return prev.map((r) => {
        if (r.id === a.id) return { ...r, order: b.order };
        if (r.id === b.id) return { ...r, order: a.order };
        return r;
      });
    });
  };

  const dialogOpen = isCreating || !!editing;

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
              <Input
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cv-input pl-9 h-11"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
                {audienceFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setAudienceFilter(f.value)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                      audienceFilter === f.value ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink',
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
                {statusFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                      statusFilter === f.value ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink',
                    )}
                  >
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
            <EmptyState
              icon={Layers}
              title="No resources found"
              description="Create a new resource or adjust your filters."
              action={
                <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={openCreate}>
                  <Plus className="h-4 w-4" /> Add Resource
                </Button>
              }
            />
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
                    return (
                      <TableRow key={r.id} className="border-cv-line">
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => moveResource(r.id, 'up')}
                              disabled={idx === 0}
                              className="rounded p-0.5 hover:bg-cv-soft disabled:opacity-30 transition-colors"
                            >
                              <ArrowUp className="h-3.5 w-3.5 text-cv-muted" />
                            </button>
                            <button
                              onClick={() => moveResource(r.id, 'down')}
                              disabled={idx === filtered.length - 1}
                              className="rounded p-0.5 hover:bg-cv-soft disabled:opacity-30 transition-colors"
                            >
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
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-bold text-cv-body">{typeLabel[r.type]}</span>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-bold',
                            r.category === 'ALL' ? 'bg-blue-50 text-blue-600' : 'bg-cv-soft text-cv-body',
                          )}>
                            {audienceLabel[r.category]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={r.published ? 'active' : 'draft'} label={r.published ? 'Published' : 'Unpublished'} />
                        </TableCell>
                        <TableCell className="text-xs text-cv-muted">{fmtDate(r.updatedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => togglePublish(r.id)}
                              className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors"
                              title={r.published ? 'Unpublish' : 'Publish'}
                            >
                              {r.published
                                ? <EyeOff className="h-3.5 w-3.5 text-cv-muted" />
                                : <Eye className="h-3.5 w-3.5 text-cv-good" />}
                            </button>
                            <button
                              onClick={() => openEdit(r)}
                              className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5 text-cv-muted" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(r)}
                              className="rounded-lg p-1.5 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
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
            <DialogTitle className="text-lg font-bold text-cv-ink">
              {isCreating ? 'New Resource' : 'Edit Resource'}
            </DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">
              {isCreating ? 'Create a new resource for partners.' : 'Update this resource.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-1 max-h-[60vh] overflow-y-auto">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Title</Label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="cv-input"
                placeholder="e.g. Careverse Brand Guidelines"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Resource Type</Label>
                <Select
                  value={draft.type}
                  onValueChange={(v) => setDraft({ ...draft, type: v as ResourceType })}
                >
                  <SelectTrigger className="cv-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(typeLabel) as ResourceType[]).map((t) => (
                      <SelectItem key={t} value={t}>{typeLabel[t]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Partner Audience</Label>
                <Select
                  value={draft.category}
                  onValueChange={(v) => setDraft({ ...draft, category: v as ResourcePackage })}
                >
                  <SelectTrigger className="cv-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(audienceLabel) as ResourcePackage[]).map((a) => (
                      <SelectItem key={a} value={a}>{audienceLabel[a]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Description</Label>
              <Textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3}
                className="cv-input text-sm"
                placeholder="Brief description shown to partners"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">URL or File Link</Label>
              <Input
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                className="cv-input"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Thumbnail URL (optional)</Label>
              <Input
                value={draft.thumbnail || ''}
                onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value })}
                className="cv-input"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Sort Order</Label>
                <Input
                  type="number"
                  value={draft.order}
                  onChange={(e) => setDraft({ ...draft, order: parseInt(e.target.value) || 0 })}
                  className="cv-input"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, published: !draft.published })}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
                      draft.published ? 'bg-cv-good' : 'bg-cv-line',
                    )}
                  >
                    <span className={cn('inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform', draft.published ? 'translate-x-5' : 'translate-x-1')} />
                  </button>
                  <span className="text-sm font-bold text-cv-ink">Published</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={closeDialog}>Cancel</Button>
            <Button
              className="cv-btn-primary rounded-full"
              onClick={saveResource}
              disabled={!draft.title.trim()}
            >
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
            <AlertDialogAction
              className="rounded-full bg-cv-red text-white font-bold hover:bg-cv-red/90"
              onClick={() => deleteTarget && deleteResource(deleteTarget.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
