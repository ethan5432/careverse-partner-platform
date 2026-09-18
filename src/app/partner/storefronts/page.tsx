'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Store, Plus, Eye, Pencil, Copy, Search, ExternalLink, Trash2, Globe, Package, FilePlus, LayoutTemplate, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import { mockStorefronts } from '@/data/mock';
import {
  getStorefrontSummaries,
  createStorefront,
  createStorefrontFromTemplate,
  duplicateStorefront,
  deleteStorefront,
  saveStorefrontConfigById,
  STOREFRONT_TEMPLATES,
  type StorefrontSummary,
  type StorefrontTemplate,
} from '@/lib/store-persistence';
import { cn } from '@/lib/utils';

type CreateMode = 'choose' | 'blank' | 'template' | 'duplicate';

export default function PartnerStorefrontsPage() {
  const router = useRouter();
  const { user } = useMockAuth();
  const [summaries, setSummaries] = useState<StorefrontSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>('choose');
  const [newName, setNewName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<StorefrontTemplate | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<StorefrontSummary | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setSummaries(getStorefrontSummaries());
    setLoaded(true);
  }, []);

  const fmtMoney = (n: number) =>
    `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const filtered = useMemo(() => {
    if (!query) return summaries;
    return summaries.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.url.toLowerCase().includes(query.toLowerCase()) ||
      (s.customDomain || '').toLowerCase().includes(query.toLowerCase()),
    );
  }, [summaries, query]);

  const getSalesSummary = (storefrontName: string) => {
    const sf = mockStorefronts.find((s) => s.name === storefrontName);
    if (sf) {
      return { conversions: sf.conversions, revenue: sf.revenue, commission: sf.commission };
    }
    return { conversions: 0, revenue: 0, commission: 0 };
  };

  const resetCreate = () => {
    setCreateOpen(false);
    setCreateMode('choose');
    setNewName('');
    setSelectedTemplate(null);
    setDuplicateTarget(null);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    let config = null;
    if (createMode === 'template' && selectedTemplate) {
      config = createStorefrontFromTemplate(newName.trim(), selectedTemplate.id);
    } else if (createMode === 'duplicate' && duplicateTarget) {
      config = duplicateStorefront(duplicateTarget.id);
      // Rename to user's chosen name
      if (config) {
        config.name = newName.trim();
        saveStorefrontConfigById(config);
      }
    } else {
      config = createStorefront(newName.trim());
    }
    resetCreate();
    if (config) {
      router.push(`/partner/store?store=${config.id}`);
    }
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateStorefront(id);
    if (copy) {
      setSummaries(getStorefrontSummaries());
    }
  };

  const handleDelete = (id: string) => {
    deleteStorefront(id);
    setDeleteId(null);
    setSummaries(getStorefrontSummaries());
  };

  const handleEdit = (id: string) => {
    router.push(`/partner/store?store=${id}`);
  };

  const handleView = (url: string) => {
    router.push(`/storefront`);
  };

  const canCreate = newName.trim().length > 0 && (
    createMode === 'blank' ||
    (createMode === 'template' && selectedTemplate) ||
    (createMode === 'duplicate' && duplicateTarget)
  );

  const createDialogTitle = createMode === 'choose'
    ? 'Create a new storefront'
    : createMode === 'blank'
      ? 'Start from blank'
      : createMode === 'template'
        ? 'Choose a template'
        : 'Duplicate a storefront';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Storefronts"
        title="Your storefronts"
        description="Manage multiple storefronts from one workspace. Each storefront has its own branding, packages, content, domain, and sharing links."
        actions={
          <Button
            className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold"
            onClick={() => { setCreateMode('choose'); setCreateOpen(true); }}
          >
            <Plus className="h-4 w-4" />
            Create storefront
          </Button>
        }
      />

      {loaded && filtered.length === 0 && !query && (
        <EmptyState
          icon={Store}
          title="No storefronts yet"
          description="Create your first storefront to start offering Careverse memberships to your clients. Start from blank, use a template, or duplicate an existing one."
          action={
            <Button
              className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold"
              onClick={() => { setCreateMode('choose'); setCreateOpen(true); }}
            >
              <Plus className="h-4 w-4" />
              Create your first storefront
            </Button>
          }
        />
      )}

      {filtered.length > 0 && (
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search storefronts..."
            className="cv-input w-full pl-9 h-9 text-sm"
          />
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => {
            const sales = getSalesSummary(s.name);
            return (
              <Card key={s.id} className="cv-card flex flex-col">
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft shrink-0">
                        <Store className="h-5 w-5 text-cv-ink" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-cv-ink truncate">{s.name}</p>
                        <p className="text-xs text-cv-muted truncate">{s.url}</p>
                      </div>
                    </div>
                    <StatusBadge status={s.status.toLowerCase() as 'live' | 'draft'} />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-cv-muted mb-4">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    {s.customDomain ? (
                      <span className="font-bold text-cv-body">{s.customDomain}</span>
                    ) : s.domainStatus === 'PENDING' ? (
                      <span>Custom domain pending</span>
                    ) : (
                      <span>No custom domain</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-cv-muted mb-4">
                    <Package className="h-3.5 w-3.5 shrink-0" />
                    <span>{s.selectedPackages.length} package{s.selectedPackages.length !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-cv-line">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-cv-muted">Conversions</p>
                      <p className="text-sm font-extrabold text-cv-ink tabular-nums">{sales.conversions}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-cv-muted">Revenue</p>
                      <p className="text-sm font-extrabold text-cv-ink tabular-nums">{fmtMoney(sales.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-cv-muted">Commission</p>
                      <p className="text-sm font-extrabold text-cv-ink tabular-nums">{fmtMoney(sales.commission)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Button
                      variant="outline"
                      className="rounded-full border-cv-line text-xs font-bold flex-1"
                      onClick={() => handleView(s.url)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-cv-line text-xs font-bold flex-1"
                      onClick={() => handleEdit(s.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-cv-line text-xs font-bold px-2.5"
                      onClick={() => { setDuplicateTarget(s); setCreateMode('duplicate'); setNewName(`${s.name} (Copy)`); setCreateOpen(true); }}
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-cv-line text-xs font-bold px-2.5 text-cv-red hover:bg-red-50"
                      onClick={() => setDeleteId(s.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create storefront dialog — multi-step */}
      <Dialog open={createOpen} onOpenChange={(open) => !open && resetCreate()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">{createDialogTitle}</DialogTitle>
            {createMode === 'choose' && (
              <DialogDescription className="text-sm text-cv-muted">
                Start from scratch, use a pre-designed template, or duplicate an existing storefront.
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Step 1: Choose mode */}
          {createMode === 'choose' && (
            <div className="space-y-3 py-2">
              <CreateOptionCard
                icon={FilePlus}
                title="Start from blank"
                description="Create an empty storefront and customize everything yourself."
                onClick={() => { setCreateMode('blank'); setNewName(''); }}
              />
              <CreateOptionCard
                icon={LayoutTemplate}
                title="Use a template"
                description="Choose from pre-designed storefronts with branding, sections, and content structure already set up."
                onClick={() => { setCreateMode('template'); setSelectedTemplate(null); }}
              />
              {summaries.length > 0 && (
                <CreateOptionCard
                  icon={Copy}
                  title="Duplicate an existing storefront"
                  description="Copy the presentation and content from one of your current storefronts."
                  onClick={() => { setCreateMode('duplicate'); setDuplicateTarget(null); }}
                />
              )}
            </div>
          )}

          {/* Step 2a: Blank — just need a name */}
          {createMode === 'blank' && (
            <div className="space-y-3 py-2">
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Storefront name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="cv-input"
                  placeholder="e.g. Johnson Family Care"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && canCreate && handleCreate()}
                />
              </div>
            </div>
          )}

          {/* Step 2b: Template — pick template then name */}
          {createMode === 'template' && (
            <div className="space-y-3 py-2 max-h-[400px] overflow-y-auto">
              {!selectedTemplate && (
                <>
                  {STOREFRONT_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => { setSelectedTemplate(tpl); setNewName(tpl.name); }}
                      className="w-full text-left rounded-xl border border-cv-line p-4 hover:bg-cv-soft/50 hover:border-cv-ink/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: tpl.branding.backgroundColor, border: `1px solid ${tpl.branding.borderColor}` }}>
                          <div className="h-4 w-4 rounded" style={{ backgroundColor: tpl.branding.primaryColor }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-cv-ink">{tpl.name}</p>
                          <p className="text-xs text-cv-muted mt-0.5">{tpl.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-bold text-cv-muted uppercase">{tpl.selectedPackages.length} packages</span>
                            <span className="text-[10px] font-bold text-cv-muted uppercase">{tpl.sections.length} sections</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
              {selectedTemplate && (
                <>
                  <div className="rounded-xl border border-cv-ink/30 bg-cv-soft/50 p-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: selectedTemplate.branding.backgroundColor, border: `1px solid ${selectedTemplate.branding.borderColor}` }}>
                      <div className="h-3.5 w-3.5 rounded" style={{ backgroundColor: selectedTemplate.branding.primaryColor }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-cv-ink">{selectedTemplate.name}</p>
                      <p className="text-xs text-cv-muted truncate">{selectedTemplate.description}</p>
                    </div>
                    <button
                      className="ml-auto text-xs font-bold text-cv-muted hover:text-cv-ink shrink-0"
                      onClick={() => setSelectedTemplate(null)}
                    >
                      Change
                    </button>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">Storefront name</Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="cv-input"
                      placeholder="e.g. Johnson Family Care"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && canCreate && handleCreate()}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2c: Duplicate — pick source then name */}
          {createMode === 'duplicate' && (
            <div className="space-y-3 py-2 max-h-[400px] overflow-y-auto">
              {!duplicateTarget && (
                <>
                  {summaries.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setDuplicateTarget(s); setNewName(`${s.name} (Copy)`); }}
                      className="w-full text-left rounded-xl border border-cv-line p-3 hover:bg-cv-soft/50 hover:border-cv-ink/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-soft shrink-0">
                          <Store className="h-4 w-4 text-cv-ink" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-cv-ink truncate">{s.name}</p>
                          <p className="text-xs text-cv-muted truncate">{s.url}</p>
                        </div>
                        <StatusBadge status={s.status.toLowerCase() as 'live' | 'draft'} />
                      </div>
                    </button>
                  ))}
                </>
              )}
              {duplicateTarget && (
                <>
                  <div className="rounded-xl border border-cv-ink/30 bg-cv-soft/50 p-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-soft shrink-0">
                      <Store className="h-4 w-4 text-cv-ink" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-cv-ink truncate">{duplicateTarget.name}</p>
                      <p className="text-xs text-cv-muted truncate">{duplicateTarget.url}</p>
                    </div>
                    <button
                      className="ml-auto text-xs font-bold text-cv-muted hover:text-cv-ink shrink-0"
                      onClick={() => setDuplicateTarget(null)}
                    >
                      Change
                    </button>
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5">
                    <p className="text-xs text-amber-800">
                      The new storefront will copy branding, sections, and content from the original. It will get its own name, domain, sharing links, and start as a draft. No conversion or commission data will be copied.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">New storefront name</Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="cv-input"
                      placeholder="e.g. Johnson Family Care"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && canCreate && handleCreate()}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            {createMode !== 'choose' && (
              <Button
                variant="outline"
                className="rounded-full border-cv-line font-bold"
                onClick={() => { setCreateMode('choose'); setSelectedTemplate(null); setDuplicateTarget(null); }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={resetCreate}>
              Cancel
            </Button>
            {createMode !== 'choose' && (
              <Button
                className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full font-bold"
                onClick={handleCreate}
                disabled={!canCreate}
              >
                <Plus className="h-4 w-4" />
                {createMode === 'template' ? 'Create from template' : createMode === 'duplicate' ? 'Duplicate & customize' : 'Create & customize'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Delete storefront?</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">
              This will remove the storefront and all its configuration. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              className="rounded-full font-bold bg-cv-red text-white hover:bg-cv-red/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateOptionCard({ icon: Icon, title, description, onClick }: { icon: typeof Store; title: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-cv-line p-4 hover:bg-cv-soft/50 hover:border-cv-ink/30 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft shrink-0 group-hover:bg-cv-ink/10 transition-colors">
          <Icon className="h-5 w-5 text-cv-ink" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-cv-ink">{title}</p>
          <p className="text-xs text-cv-muted mt-0.5">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-cv-muted shrink-0 mt-1 group-hover:text-cv-ink transition-colors" />
      </div>
    </button>
  );
}
