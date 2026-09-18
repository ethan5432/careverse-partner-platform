'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HelpCircle, Gift, Sparkles, FileText, Star, Megaphone,
  Plus, Pencil, Trash2, Eye, EyeOff, Archive, RotateCcw,
  ArrowUp, ArrowDown, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  loadContentCatalog, saveContentCatalog,
  type ContentCatalog, type ContentStatus, type ControlledContentType,
  type FAQItem, type BenefitExplanation, type CareverseExplanation,
  type RequiredDisclosure, type ApprovedTestimonial, type PromoCopy,
  createFAQ, createBenefitExplanation, createCareverseExplanation,
  createRequiredDisclosure, createTestimonial, createPromoCopy,
} from '@/lib/content-catalog';

type ContentTab = 'faq' | 'benefits' | 'careverse' | 'disclosures' | 'testimonials' | 'promo';

const tabConfig: { value: ContentTab; label: string; icon: typeof HelpCircle; type: ControlledContentType }[] = [
  { value: 'faq', label: 'FAQs', icon: HelpCircle, type: 'FAQ' },
  { value: 'benefits', label: 'Benefits', icon: Gift, type: 'BENEFIT_EXPLANATION' },
  { value: 'careverse', label: 'Careverse', icon: Sparkles, type: 'CAREVERSE_EXPLANATION' },
  { value: 'disclosures', label: 'Disclosures', icon: FileText, type: 'REQUIRED_DISCLOSURE' },
  { value: 'testimonials', label: 'Testimonials', icon: Star, type: 'TESTIMONIAL' },
  { value: 'promo', label: 'Promo Copy', icon: Megaphone, type: 'PROMO_COPY' },
];

function statusBadge(status: ContentStatus) {
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

export default function AdminContentPage() {
  const [catalog, setCatalog] = useState<ContentCatalog | null>(null);
  const [activeTab, setActiveTab] = useState<ContentTab>('faq');
  const [editingItem, setEditingItem] = useState<{ id: string; type: ControlledContentType } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: ControlledContentType } | null>(null);

  useEffect(() => {
    setCatalog(loadContentCatalog());
  }, []);

  const persist = useCallback((updated: ContentCatalog) => {
    setCatalog(updated);
    saveContentCatalog(updated);
  }, []);

  if (!catalog) return null;

  // ─── Generic lifecycle helpers ─────────────────────────────────────────────

  const updateItemStatus = (type: ControlledContentType, id: string, status: ContentStatus) => {
    const ts = new Date().toISOString();
    const updated = { ...catalog };
    if (type === 'FAQ') updated.faqs = updated.faqs.map(f => f.id === id ? { ...f, status, updatedAt: ts, archivedAt: status === 'ARCHIVED' ? ts : f.archivedAt } : f);
    if (type === 'BENEFIT_EXPLANATION') updated.benefitExplanations = updated.benefitExplanations.map(b => b.id === id ? { ...b, status, updatedAt: ts, archivedAt: status === 'ARCHIVED' ? ts : b.archivedAt } : b);
    if (type === 'CAREVERSE_EXPLANATION') updated.careverseExplanations = updated.careverseExplanations.map(c => c.id === id ? { ...c, status, updatedAt: ts, archivedAt: status === 'ARCHIVED' ? ts : c.archivedAt } : c);
    if (type === 'REQUIRED_DISCLOSURE') updated.requiredDisclosures = updated.requiredDisclosures.map(d => d.id === id ? { ...d, status, updatedAt: ts, archivedAt: status === 'ARCHIVED' ? ts : d.archivedAt } : d);
    if (type === 'TESTIMONIAL') updated.testimonials = updated.testimonials.map(t => t.id === id ? { ...t, status, updatedAt: ts, archivedAt: status === 'ARCHIVED' ? ts : t.archivedAt } : t);
    if (type === 'PROMO_COPY') updated.promoCopy = updated.promoCopy.map(p => p.id === id ? { ...p, status, updatedAt: ts, archivedAt: status === 'ARCHIVED' ? ts : p.archivedAt } : p);
    persist(updated);
  };

  const deleteItem = (type: ControlledContentType, id: string) => {
    const updated = { ...catalog };
    if (type === 'FAQ') updated.faqs = updated.faqs.filter(f => f.id !== id);
    if (type === 'BENEFIT_EXPLANATION') updated.benefitExplanations = updated.benefitExplanations.filter(b => b.id !== id);
    if (type === 'CAREVERSE_EXPLANATION') updated.careverseExplanations = updated.careverseExplanations.filter(c => c.id !== id);
    if (type === 'REQUIRED_DISCLOSURE') updated.requiredDisclosures = updated.requiredDisclosures.filter(d => d.id !== id);
    if (type === 'TESTIMONIAL') updated.testimonials = updated.testimonials.filter(t => t.id !== id);
    if (type === 'PROMO_COPY') updated.promoCopy = updated.promoCopy.filter(p => p.id !== id);
    persist(updated);
    setDeleteTarget(null);
  };

  const moveItem = (type: ControlledContentType, id: string, dir: 'up' | 'down') => {
    const updated = { ...catalog };
    const arr = type === 'FAQ' ? updated.faqs
      : type === 'BENEFIT_EXPLANATION' ? updated.benefitExplanations
      : type === 'CAREVERSE_EXPLANATION' ? updated.careverseExplanations
      : type === 'REQUIRED_DISCLOSURE' ? updated.requiredDisclosures
      : type === 'TESTIMONIAL' ? updated.testimonials
      : updated.promoCopy;
    const sorted = [...arr].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(item => item.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    const newOrders = arr.map(item => {
      if (item.id === a.id) return { ...item, order: b.order };
      if (item.id === b.id) return { ...item, order: a.order };
      return item;
    });
    if (type === 'FAQ') updated.faqs = newOrders as FAQItem[];
    if (type === 'BENEFIT_EXPLANATION') updated.benefitExplanations = newOrders as BenefitExplanation[];
    if (type === 'CAREVERSE_EXPLANATION') updated.careverseExplanations = newOrders as CareverseExplanation[];
    if (type === 'REQUIRED_DISCLOSURE') updated.requiredDisclosures = newOrders as RequiredDisclosure[];
    if (type === 'TESTIMONIAL') updated.testimonials = newOrders as ApprovedTestimonial[];
    if (type === 'PROMO_COPY') updated.promoCopy = newOrders as PromoCopy[];
    persist(updated);
  };

  // ─── FAQ CRUD ──────────────────────────────────────────────────────────────

  const faqs = catalog.faqs.sort((a, b) => a.order - b.order);
  const [faqDraft, setFaqDraft] = useState<Partial<FAQItem>>({});

  const openCreateFaq = () => {
    setFaqDraft({ question: '', answer: '', category: 'General', order: catalog.faqs.length });
    setIsCreating(true);
    setEditingItem(null);
  };

  const openEditFaq = (item: FAQItem) => {
    setFaqDraft({ ...item });
    setEditingItem({ id: item.id, type: 'FAQ' });
    setIsCreating(false);
  };

  const saveFaq = () => {
    if (editingItem) {
      persist({ ...catalog, faqs: catalog.faqs.map(f => f.id === editingItem.id ? { ...f, ...faqDraft, updatedAt: new Date().toISOString() } : f) });
    } else {
      persist({ ...catalog, faqs: [...catalog.faqs, createFAQ(faqDraft)] });
    }
    setEditingItem(null);
    setIsCreating(false);
    setFaqDraft({});
  };

  // ─── Benefit Explanation CRUD ──────────────────────────────────────────────

  const benefits = catalog.benefitExplanations.sort((a, b) => a.order - b.order);
  const [benefitDraft, setBenefitDraft] = useState<Partial<BenefitExplanation>>({});

  const openCreateBenefit = () => {
    setBenefitDraft({ title: '', description: '', icon: 'gift', order: catalog.benefitExplanations.length });
    setIsCreating(true);
    setEditingItem(null);
  };

  const openEditBenefit = (item: BenefitExplanation) => {
    setBenefitDraft({ ...item });
    setEditingItem({ id: item.id, type: 'BENEFIT_EXPLANATION' });
    setIsCreating(false);
  };

  const saveBenefit = () => {
    if (editingItem) {
      persist({ ...catalog, benefitExplanations: catalog.benefitExplanations.map(b => b.id === editingItem.id ? { ...b, ...benefitDraft, updatedAt: new Date().toISOString() } : b) });
    } else {
      persist({ ...catalog, benefitExplanations: [...catalog.benefitExplanations, createBenefitExplanation(benefitDraft)] });
    }
    setEditingItem(null);
    setIsCreating(false);
    setBenefitDraft({});
  };

  // ─── Careverse Explanation CRUD ─────────────────────────────────────────────

  const careverseExps = catalog.careverseExplanations.sort((a, b) => a.order - b.order);
  const [careverseDraft, setCareverseDraft] = useState<Partial<CareverseExplanation>>({});

  const openCreateCareverse = () => {
    setCareverseDraft({ title: '', body: '', order: catalog.careverseExplanations.length });
    setIsCreating(true);
    setEditingItem(null);
  };

  const openEditCareverse = (item: CareverseExplanation) => {
    setCareverseDraft({ ...item });
    setEditingItem({ id: item.id, type: 'CAREVERSE_EXPLANATION' });
    setIsCreating(false);
  };

  const saveCareverse = () => {
    if (editingItem) {
      persist({ ...catalog, careverseExplanations: catalog.careverseExplanations.map(c => c.id === editingItem.id ? { ...c, ...careverseDraft, updatedAt: new Date().toISOString() } : c) });
    } else {
      persist({ ...catalog, careverseExplanations: [...catalog.careverseExplanations, createCareverseExplanation(careverseDraft)] });
    }
    setEditingItem(null);
    setIsCreating(false);
    setCareverseDraft({});
  };

  // ─── Required Disclosure CRUD ───────────────────────────────────────────────

  const disclosures = catalog.requiredDisclosures.sort((a, b) => a.order - b.order);
  const [disclosureDraft, setDisclosureDraft] = useState<Partial<RequiredDisclosure>>({});

  const openCreateDisclosure = () => {
    setDisclosureDraft({ title: '', body: '', legalText: '', order: catalog.requiredDisclosures.length });
    setIsCreating(true);
    setEditingItem(null);
  };

  const openEditDisclosure = (item: RequiredDisclosure) => {
    setDisclosureDraft({ ...item });
    setEditingItem({ id: item.id, type: 'REQUIRED_DISCLOSURE' });
    setIsCreating(false);
  };

  const saveDisclosure = () => {
    if (editingItem) {
      persist({ ...catalog, requiredDisclosures: catalog.requiredDisclosures.map(d => d.id === editingItem.id ? { ...d, ...disclosureDraft, updatedAt: new Date().toISOString() } : d) });
    } else {
      persist({ ...catalog, requiredDisclosures: [...catalog.requiredDisclosures, createRequiredDisclosure(disclosureDraft)] });
    }
    setEditingItem(null);
    setIsCreating(false);
    setDisclosureDraft({});
  };

  // ─── Testimonial CRUD ───────────────────────────────────────────────────────

  const testimonials = catalog.testimonials.sort((a, b) => a.order - b.order);
  const [testimonialDraft, setTestimonialDraft] = useState<Partial<ApprovedTestimonial>>({});

  const openCreateTestimonial = () => {
    setTestimonialDraft({ authorName: '', authorRole: '', quote: '', rating: 5, avatarColor: '#E1062C', order: catalog.testimonials.length });
    setIsCreating(true);
    setEditingItem(null);
  };

  const openEditTestimonial = (item: ApprovedTestimonial) => {
    setTestimonialDraft({ ...item });
    setEditingItem({ id: item.id, type: 'TESTIMONIAL' });
    setIsCreating(false);
  };

  const saveTestimonial = () => {
    if (editingItem) {
      persist({ ...catalog, testimonials: catalog.testimonials.map(t => t.id === editingItem.id ? { ...t, ...testimonialDraft, updatedAt: new Date().toISOString() } : t) });
    } else {
      persist({ ...catalog, testimonials: [...catalog.testimonials, createTestimonial(testimonialDraft)] });
    }
    setEditingItem(null);
    setIsCreating(false);
    setTestimonialDraft({});
  };

  // ─── Promo Copy CRUD ────────────────────────────────────────────────────────

  const promoCopy = catalog.promoCopy.sort((a, b) => a.order - b.order);
  const [promoDraft, setPromoDraft] = useState<Partial<PromoCopy>>({});

  const openCreatePromo = () => {
    setPromoDraft({ title: '', body: '', placement: 'GENERAL', order: catalog.promoCopy.length });
    setIsCreating(true);
    setEditingItem(null);
  };

  const openEditPromo = (item: PromoCopy) => {
    setPromoDraft({ ...item });
    setEditingItem({ id: item.id, type: 'PROMO_COPY' });
    setIsCreating(false);
  };

  const savePromo = () => {
    if (editingItem) {
      persist({ ...catalog, promoCopy: catalog.promoCopy.map(p => p.id === editingItem.id ? { ...p, ...promoDraft, updatedAt: new Date().toISOString() } : p) });
    } else {
      persist({ ...catalog, promoCopy: [...catalog.promoCopy, createPromoCopy(promoDraft)] });
    }
    setEditingItem(null);
    setIsCreating(false);
    setPromoDraft({});
  };

  // ─── Stats ──────────────────────────────────────────────────────────────────

  const totalItems = catalog.faqs.length + catalog.benefitExplanations.length + catalog.careverseExplanations.length + catalog.requiredDisclosures.length + catalog.testimonials.length + catalog.promoCopy.length;
  const publishedItems = [catalog.faqs, catalog.benefitExplanations, catalog.careverseExplanations, catalog.requiredDisclosures, catalog.testimonials, catalog.promoCopy].flat().filter(i => i.status === 'PUBLISHED').length;
  const draftItems = [catalog.faqs, catalog.benefitExplanations, catalog.careverseExplanations, catalog.requiredDisclosures, catalog.testimonials, catalog.promoCopy].flat().filter(i => i.status === 'DRAFT').length;
  const archivedItems = [catalog.faqs, catalog.benefitExplanations, catalog.careverseExplanations, catalog.requiredDisclosures, catalog.testimonials, catalog.promoCopy].flat().filter(i => i.status === 'ARCHIVED').length;

  // ─── Render helpers ─────────────────────────────────────────────────────────

  const dialogOpen = isCreating || !!editingItem;
  const closeDialog = () => { setEditingItem(null); setIsCreating(false); };

  const renderItemRow = (item: { id: string; status: ContentStatus; order: number; updatedAt: string; archivedAt?: string }, type: ControlledContentType, cells: React.ReactNode[]) => {
    const isArchived = item.status === 'ARCHIVED';
    return (
      <TableRow key={item.id} className={cn(isArchived && 'opacity-50')}>
        <TableCell className="w-16">
          <div className="flex flex-col">
            <button onClick={() => moveItem(type, item.id, 'up')} className="text-cv-muted hover:text-cv-ink"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button onClick={() => moveItem(type, item.id, 'down')} className="text-cv-muted hover:text-cv-ink"><ArrowDown className="h-3.5 w-3.5" /></button>
          </div>
        </TableCell>
        {cells.map((cell, i) => <TableCell key={i}>{cell}</TableCell>)}
        <TableCell>{statusBadge(item.status)}</TableCell>
        <TableCell className="text-xs text-cv-muted">{fmtDate(item.updatedAt)}</TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            {!isArchived && (
              <button onClick={() => openEditForType(type, item.id)} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Edit">
                <Pencil className="h-3.5 w-3.5 text-cv-body" />
              </button>
            )}
            {item.status === 'DRAFT' && (
              <button onClick={() => updateItemStatus(type, item.id, 'PUBLISHED')} className="rounded-lg p-1.5 hover:bg-emerald-50 transition-colors" title="Publish">
                <CheckCircle2 className="h-3.5 w-3.5 text-cv-good" />
              </button>
            )}
            {item.status === 'PUBLISHED' && (
              <button onClick={() => updateItemStatus(type, item.id, 'DRAFT')} className="rounded-lg p-1.5 hover:bg-amber-50 transition-colors" title="Unpublish">
                <EyeOff className="h-3.5 w-3.5 text-amber-600" />
              </button>
            )}
            {item.status !== 'ARCHIVED' && (
              <button onClick={() => updateItemStatus(type, item.id, 'ARCHIVED')} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Archive">
                <Archive className="h-3.5 w-3.5 text-cv-muted" />
              </button>
            )}
            {item.status === 'ARCHIVED' && (
              <button onClick={() => updateItemStatus(type, item.id, 'DRAFT')} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Restore">
                <RotateCcw className="h-3.5 w-3.5 text-cv-body" />
              </button>
            )}
            {(item.status === 'DRAFT' || item.status === 'ARCHIVED') && (
              <button onClick={() => setDeleteTarget({ id: item.id, type })} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors" title="Delete">
                <Trash2 className="h-3.5 w-3.5 text-cv-red" />
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const openEditForType = (type: ControlledContentType, id: string) => {
    if (type === 'FAQ') { const item = catalog.faqs.find(f => f.id === id); if (item) openEditFaq(item); }
    if (type === 'BENEFIT_EXPLANATION') { const item = catalog.benefitExplanations.find(b => b.id === id); if (item) openEditBenefit(item); }
    if (type === 'CAREVERSE_EXPLANATION') { const item = catalog.careverseExplanations.find(c => c.id === id); if (item) openEditCareverse(item); }
    if (type === 'REQUIRED_DISCLOSURE') { const item = catalog.requiredDisclosures.find(d => d.id === id); if (item) openEditDisclosure(item); }
    if (type === 'TESTIMONIAL') { const item = catalog.testimonials.find(t => t.id === id); if (item) openEditTestimonial(item); }
    if (type === 'PROMO_COPY') { const item = catalog.promoCopy.find(p => p.id === id); if (item) openEditPromo(item); }
  };

  const openCreateForType = (type: ControlledContentType) => {
    if (type === 'FAQ') openCreateFaq();
    if (type === 'BENEFIT_EXPLANATION') openCreateBenefit();
    if (type === 'CAREVERSE_EXPLANATION') openCreateCareverse();
    if (type === 'REQUIRED_DISCLOSURE') openCreateDisclosure();
    if (type === 'TESTIMONIAL') openCreateTestimonial();
    if (type === 'PROMO_COPY') openCreatePromo();
  };

  const saveForType = () => {
    if (editingItem?.type === 'FAQ' || (!editingItem && activeTab === 'faq')) saveFaq();
    else if (editingItem?.type === 'BENEFIT_EXPLANATION' || (!editingItem && activeTab === 'benefits')) saveBenefit();
    else if (editingItem?.type === 'CAREVERSE_EXPLANATION' || (!editingItem && activeTab === 'careverse')) saveCareverse();
    else if (editingItem?.type === 'REQUIRED_DISCLOSURE' || (!editingItem && activeTab === 'disclosures')) saveDisclosure();
    else if (editingItem?.type === 'TESTIMONIAL' || (!editingItem && activeTab === 'testimonials')) saveTestimonial();
    else if (editingItem?.type === 'PROMO_COPY' || (!editingItem && activeTab === 'promo')) savePromo();
  };

  const activeType = tabConfig.find(t => t.value === activeTab)!.type;
  const currentDialogTitle = isCreating ? `New ${tabConfig.find(t => t.value === activeTab)?.label}` : editingItem ? `Edit ${tabConfig.find(t => t.value === activeTab)?.label}` : '';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Controlled Content"
        description="Manage FAQs, benefit explanations, disclosures, testimonials, and promo copy used across all storefronts."
        actions={
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full text-sm font-bold" onClick={() => openCreateForType(activeType)}>
            <Plus className="h-4 w-4" /> Add {tabConfig.find(t => t.value === activeTab)?.label}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Items" value={totalItems} />
        <StatCard label="Published" value={publishedItems} />
        <StatCard label="Drafts" value={draftItems} />
        <StatCard label="Archived" value={archivedItems} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentTab)}>
        <TabsList className="flex-wrap h-auto">
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <Card className="cv-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((item) => renderItemRow(item, 'FAQ', [
                    <div><p className="text-sm font-bold text-cv-ink line-clamp-1">{item.question}</p><p className="text-xs text-cv-muted line-clamp-1">{item.answer}</p></div>,
                    <span className="text-xs text-cv-muted">{item.category}</span>,
                  ]))}
                  {faqs.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-sm text-cv-muted py-8">No FAQs yet. Click &ldquo;Add FAQs&rdquo; to create one.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits">
          <Card className="cv-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {benefits.map((item) => renderItemRow(item, 'BENEFIT_EXPLANATION', [
                    <span className="text-sm font-bold text-cv-ink">{item.title}</span>,
                    <span className="text-xs text-cv-muted line-clamp-2">{item.description}</span>,
                  ]))}
                  {benefits.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-sm text-cv-muted py-8">No benefit explanations yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Careverse Explanation Tab */}
        <TabsContent value="careverse">
          <Card className="cv-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Body</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careverseExps.map((item) => renderItemRow(item, 'CAREVERSE_EXPLANATION', [
                    <span className="text-sm font-bold text-cv-ink">{item.title}</span>,
                    <span className="text-xs text-cv-muted line-clamp-2">{item.body}</span>,
                  ]))}
                  {careverseExps.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-sm text-cv-muted py-8">No explanations yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disclosures Tab */}
        <TabsContent value="disclosures">
          <Card className="cv-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Legal Text</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disclosures.map((item) => renderItemRow(item, 'REQUIRED_DISCLOSURE', [
                    <span className="text-sm font-bold text-cv-ink">{item.title}</span>,
                    <span className="text-xs text-cv-muted line-clamp-2">{item.legalText}</span>,
                  ]))}
                  {disclosures.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-sm text-cv-muted py-8">No disclosures yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials">
          <Card className="cv-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Quote</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((item) => renderItemRow(item, 'TESTIMONIAL', [
                    <div><p className="text-sm font-bold text-cv-ink">{item.authorName}</p><p className="text-xs text-cv-muted">{item.authorRole}</p></div>,
                    <span className="text-xs text-cv-muted line-clamp-2">{item.quote}</span>,
                    <span className="text-xs font-bold text-cv-ink">{item.rating}/5</span>,
                  ]))}
                  {testimonials.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-sm text-cv-muted py-8">No testimonials yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promo Copy Tab */}
        <TabsContent value="promo">
          <Card className="cv-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Body</TableHead>
                    <TableHead>Placement</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCopy.map((item) => renderItemRow(item, 'PROMO_COPY', [
                    <span className="text-sm font-bold text-cv-ink">{item.title}</span>,
                    <span className="text-xs text-cv-muted line-clamp-2">{item.body}</span>,
                    <span className="text-xs text-cv-muted">{item.placement}</span>,
                  ]))}
                  {promoCopy.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-sm text-cv-muted py-8">No promo copy yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentDialogTitle}</DialogTitle>
            <DialogDescription>Edit the content below. New items start as drafts.</DialogDescription>
          </DialogHeader>

          {/* FAQ form */}
          {activeType === 'FAQ' && (
            <div className="space-y-3">
              <div><Label className="text-sm font-bold">Question</Label><Input value={faqDraft.question || ''} onChange={(e) => setFaqDraft({ ...faqDraft, question: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Answer</Label><Textarea value={faqDraft.answer || ''} onChange={(e) => setFaqDraft({ ...faqDraft, answer: e.target.value })} className="cv-input min-h-[100px]" /></div>
              <div><Label className="text-sm font-bold">Category</Label><Input value={faqDraft.category || ''} onChange={(e) => setFaqDraft({ ...faqDraft, category: e.target.value })} className="cv-input" /></div>
            </div>
          )}

          {/* Benefit form */}
          {activeType === 'BENEFIT_EXPLANATION' && (
            <div className="space-y-3">
              <div><Label className="text-sm font-bold">Title</Label><Input value={benefitDraft.title || ''} onChange={(e) => setBenefitDraft({ ...benefitDraft, title: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Description</Label><Textarea value={benefitDraft.description || ''} onChange={(e) => setBenefitDraft({ ...benefitDraft, description: e.target.value })} className="cv-input min-h-[80px]" /></div>
              <div><Label className="text-sm font-bold">Icon</Label>
                <Select value={benefitDraft.icon || 'gift'} onValueChange={(v) => setBenefitDraft({ ...benefitDraft, icon: v })}>
                  <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gift">Gift</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                    <SelectItem value="heart">Heart</SelectItem>
                    <SelectItem value="stethoscope">Stethoscope</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Careverse Explanation form */}
          {activeType === 'CAREVERSE_EXPLANATION' && (
            <div className="space-y-3">
              <div><Label className="text-sm font-bold">Title</Label><Input value={careverseDraft.title || ''} onChange={(e) => setCareverseDraft({ ...careverseDraft, title: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Body</Label><Textarea value={careverseDraft.body || ''} onChange={(e) => setCareverseDraft({ ...careverseDraft, body: e.target.value })} className="cv-input min-h-[120px]" /></div>
            </div>
          )}

          {/* Disclosure form */}
          {activeType === 'REQUIRED_DISCLOSURE' && (
            <div className="space-y-3">
              <div><Label className="text-sm font-bold">Title</Label><Input value={disclosureDraft.title || ''} onChange={(e) => setDisclosureDraft({ ...disclosureDraft, title: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Summary</Label><Input value={disclosureDraft.body || ''} onChange={(e) => setDisclosureDraft({ ...disclosureDraft, body: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Legal Text</Label><Textarea value={disclosureDraft.legalText || ''} onChange={(e) => setDisclosureDraft({ ...disclosureDraft, legalText: e.target.value })} className="cv-input min-h-[100px]" /></div>
            </div>
          )}

          {/* Testimonial form */}
          {activeType === 'TESTIMONIAL' && (
            <div className="space-y-3">
              <div><Label className="text-sm font-bold">Author Name</Label><Input value={testimonialDraft.authorName || ''} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, authorName: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Author Role</Label><Input value={testimonialDraft.authorRole || ''} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, authorRole: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Quote</Label><Textarea value={testimonialDraft.quote || ''} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, quote: e.target.value })} className="cv-input min-h-[80px]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-sm font-bold">Rating (1-5)</Label><Input type="number" min={1} max={5} value={testimonialDraft.rating || 5} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, rating: parseInt(e.target.value) || 5 })} className="cv-input" /></div>
                <div><Label className="text-sm font-bold">Avatar Color</Label><Input value={testimonialDraft.avatarColor || '#E1062C'} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, avatarColor: e.target.value })} className="cv-input" /></div>
              </div>
            </div>
          )}

          {/* Promo Copy form */}
          {activeType === 'PROMO_COPY' && (
            <div className="space-y-3">
              <div><Label className="text-sm font-bold">Title</Label><Input value={promoDraft.title || ''} onChange={(e) => setPromoDraft({ ...promoDraft, title: e.target.value })} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Body</Label><Textarea value={promoDraft.body || ''} onChange={(e) => setPromoDraft({ ...promoDraft, body: e.target.value })} className="cv-input min-h-[80px]" /></div>
              <div><Label className="text-sm font-bold">Placement</Label>
                <Select value={promoDraft.placement || 'GENERAL'} onValueChange={(v) => setPromoDraft({ ...promoDraft, placement: v as PromoCopy['placement'] })}>
                  <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HERO">Hero</SelectItem>
                    <SelectItem value="BENEFITS">Benefits</SelectItem>
                    <SelectItem value="PACKAGES">Packages</SelectItem>
                    <SelectItem value="FOOTER">Footer</SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button className="bg-cv-ink text-white hover:bg-cv-ink/90" onClick={saveForType}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the item. If it is referenced by a storefront, consider archiving instead — archived items preserve existing storefront references.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-cv-red text-white hover:bg-cv-red/90" onClick={() => deleteTarget && deleteItem(deleteTarget.type, deleteTarget.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
