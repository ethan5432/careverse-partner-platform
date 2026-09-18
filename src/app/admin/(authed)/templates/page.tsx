'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  LayoutTemplate, Plus, Pencil, Trash2, Copy, Eye, EyeOff,
  Archive, RotateCcw, CheckCircle2, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface StorefrontTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  status: TemplateStatus;
  sectionTypes: string[];
  defaultBranding: { primaryColor: string; backgroundColor: string };
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

const STORAGE_KEY = 'careverse_templates';

function seedTemplates(): StorefrontTemplate[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'tpl-1',
      name: 'Classic Care',
      description: 'A clean, professional layout with hero, packages, benefits, and FAQ.',
      category: 'Health',
      status: 'PUBLISHED',
      sectionTypes: ['hero', 'packages', 'benefits', 'faq', 'footer'],
      defaultBranding: { primaryColor: '#18191D', backgroundColor: '#F6F3EE' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tpl-2',
      name: 'Family First',
      description: 'Warm, family-oriented layout with partner story and testimonials.',
      category: 'Family',
      status: 'PUBLISHED',
      sectionTypes: ['hero', 'partnerStory', 'packages', 'benefits', 'testimonials', 'faq', 'footer'],
      defaultBranding: { primaryColor: '#0B9B6B', backgroundColor: '#F0F9F4' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tpl-3',
      name: 'Minimal',
      description: 'A streamlined layout focused on packages and contact.',
      category: 'Minimal',
      status: 'DRAFT',
      sectionTypes: ['hero', 'packages', 'contact', 'footer'],
      defaultBranding: { primaryColor: '#2563EB', backgroundColor: '#F8FAFC' },
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function loadTemplates(): StorefrontTemplate[] {
  if (typeof window === 'undefined') return seedTemplates();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedTemplates();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return seedTemplates();
  }
}

function saveTemplates(templates: StorefrontTemplate[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

function statusBadge(status: TemplateStatus) {
  const config = {
    PUBLISHED: { icon: CheckCircle2, label: 'Published', cls: 'bg-emerald-50 text-cv-good' },
    DRAFT: { icon: Clock, label: 'Draft', cls: 'bg-amber-50 text-amber-600' },
    ARCHIVED: { icon: Archive, label: 'Archived', cls: 'bg-cv-soft text-cv-muted' },
  };
  const { icon: Icon, label, cls } = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold', cls)}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const emptyDraft: Partial<StorefrontTemplate> = {
  name: '', description: '', category: 'General',
  sectionTypes: ['hero', 'packages', 'benefits', 'footer'],
  defaultBranding: { primaryColor: '#18191D', backgroundColor: '#F6F3EE' },
};

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<StorefrontTemplate[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState<StorefrontTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<Partial<StorefrontTemplate>>(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<StorefrontTemplate | null>(null);

  useEffect(() => {
    setTemplates(loadTemplates());
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: StorefrontTemplate[]) => {
    setTemplates(updated);
    saveTemplates(updated);
  }, []);

  const openCreate = () => {
    setDraft({ ...emptyDraft });
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (t: StorefrontTemplate) => {
    setDraft({ ...t });
    setEditing(t);
    setIsCreating(false);
  };

  const closeDialog = () => {
    setEditing(null);
    setIsCreating(false);
  };

  const saveTemplate = () => {
    const ts = new Date().toISOString();
    if (editing) {
      persist(templates.map(t => t.id === editing.id ? { ...t, ...draft, updatedAt: ts } : t));
    } else {
      const newTemplate: StorefrontTemplate = {
        id: `tpl-${Date.now()}`,
        name: draft.name || 'Untitled Template',
        description: draft.description || '',
        category: draft.category || 'General',
        status: 'DRAFT',
        sectionTypes: draft.sectionTypes || ['hero', 'packages', 'footer'],
        defaultBranding: draft.defaultBranding || { primaryColor: '#18191D', backgroundColor: '#F6F3EE' },
        createdAt: ts,
        updatedAt: ts,
      };
      persist([...templates, newTemplate]);
    }
    closeDialog();
  };

  const duplicateTemplate = (t: StorefrontTemplate) => {
    const ts = new Date().toISOString();
    const copy: StorefrontTemplate = {
      ...t,
      id: `tpl-${Date.now()}`,
      name: `${t.name} (Copy)`,
      status: 'DRAFT',
      createdAt: ts,
      updatedAt: ts,
      archivedAt: undefined,
    };
    persist([...templates, copy]);
  };

  const updateStatus = (id: string, status: TemplateStatus) => {
    const ts = new Date().toISOString();
    persist(templates.map(t => t.id === id ? { ...t, status, updatedAt: ts, archivedAt: status === 'ARCHIVED' ? ts : t.archivedAt } : t));
  };

  const deleteTemplate = (id: string) => {
    persist(templates.filter(t => t.id !== id));
    setDeleteTarget(null);
  };

  const dialogOpen = isCreating || !!editing;
  if (!loaded) return null;

  const published = templates.filter(t => t.status === 'PUBLISHED').length;
  const drafts = templates.filter(t => t.status === 'DRAFT').length;
  const archived = templates.filter(t => t.status === 'ARCHIVED').length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Templates"
        title="Storefront Templates"
        description="Create and manage templates that define storefront structure and presentation. Templates contain layout — not product data."
        actions={
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Template
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Templates" value={templates.length} />
        <StatCard label="Published" value={published} />
        <StatCard label="Drafts" value={drafts} />
        <StatCard label="Archived" value={archived} />
      </div>

      <Card className="cv-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Template</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Category</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Sections</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Updated</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id} className={cn(t.status === 'ARCHIVED' && 'opacity-50')}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft shrink-0">
                        <LayoutTemplate className="h-4 w-4 text-cv-ink" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-cv-ink">{t.name}</p>
                        <p className="text-xs text-cv-muted line-clamp-1">{t.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-xs text-cv-body">{t.category}</span></TableCell>
                  <TableCell><span className="text-xs text-cv-muted">{t.sectionTypes.length} sections</span></TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell className="text-xs text-cv-muted">{fmtDate(t.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {t.status !== 'ARCHIVED' && (
                        <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Edit">
                          <Pencil className="h-3.5 w-3.5 text-cv-body" />
                        </button>
                      )}
                      <button onClick={() => duplicateTemplate(t)} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Duplicate">
                        <Copy className="h-3.5 w-3.5 text-cv-body" />
                      </button>
                      {t.status === 'DRAFT' && (
                        <button onClick={() => updateStatus(t.id, 'PUBLISHED')} className="rounded-lg p-1.5 hover:bg-emerald-50 transition-colors" title="Publish">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cv-good" />
                        </button>
                      )}
                      {t.status === 'PUBLISHED' && (
                        <button onClick={() => updateStatus(t.id, 'DRAFT')} className="rounded-lg p-1.5 hover:bg-amber-50 transition-colors" title="Unpublish">
                          <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                        </button>
                      )}
                      {t.status !== 'ARCHIVED' && (
                        <button onClick={() => updateStatus(t.id, 'ARCHIVED')} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Archive">
                          <Archive className="h-3.5 w-3.5 text-cv-muted" />
                        </button>
                      )}
                      {t.status === 'ARCHIVED' && (
                        <button onClick={() => updateStatus(t.id, 'DRAFT')} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Restore">
                          <RotateCcw className="h-3.5 w-3.5 text-cv-body" />
                        </button>
                      )}
                      {(t.status === 'DRAFT' || t.status === 'ARCHIVED') && (
                        <button onClick={() => setDeleteTarget(t)} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="h-3.5 w-3.5 text-cv-red" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-sm text-cv-muted py-8">No templates yet. Click &ldquo;Add Template&rdquo; to create one.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isCreating ? 'New Template' : 'Edit Template'}</DialogTitle>
            <DialogDescription>Templates define storefront structure and default presentation. They do not contain product data.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-sm font-bold">Name</Label><Input value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="cv-input" /></div>
            <div><Label className="text-sm font-bold">Description</Label><Textarea value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="cv-input min-h-[60px]" /></div>
            <div><Label className="text-sm font-bold">Category</Label><Input value={draft.category || ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="cv-input" /></div>
            <div>
              <Label className="text-sm font-bold">Default Sections</Label>
              <p className="text-xs text-cv-muted mb-2">Comma-separated list of section types (e.g. hero, packages, benefits, faq, footer)</p>
              <Input value={(draft.sectionTypes || []).join(', ')} onChange={(e) => setDraft({ ...draft, sectionTypes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="cv-input" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button className="bg-cv-ink text-white hover:bg-cv-ink/90" onClick={saveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this template?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the template. Storefronts using this template will not be affected — they keep their current configuration.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-cv-red text-white hover:bg-cv-red/90" onClick={() => deleteTarget && deleteTemplate(deleteTarget.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
