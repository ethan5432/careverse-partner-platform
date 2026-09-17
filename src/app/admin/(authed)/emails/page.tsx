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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Mail, Send, Zap, MousePointerClick, Megaphone, Plus, Pencil, Play, Pause, Eye, Calendar, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockEmailCampaigns, mockEmailAutomations, mockEmailTemplates, mockScheduledEmails } from '@/data/mock';
import type { MockEmailCampaign, MockEmailAutomation, MockEmailTemplate, MockScheduledEmail } from '@/data/mock/types';

const campaignStatusVariant: Record<MockEmailCampaign['status'], 'draft' | 'pending' | 'active'> = {
  DRAFT: 'draft',
  SCHEDULED: 'pending',
  SENT: 'active',
};

const campaignStatusLabel: Record<MockEmailCampaign['status'], string> = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  SENT: 'Sent',
};

const automationStatusVariant: Record<MockEmailAutomation['status'], 'active' | 'suspended' | 'draft'> = {
  ACTIVE: 'active',
  PAUSED: 'suspended',
  DRAFT: 'draft',
};

const automationStatusLabel: Record<MockEmailAutomation['status'], string> = {
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  DRAFT: 'Draft',
};

const scheduledStatusVariant: Record<MockScheduledEmail['status'], 'draft' | 'pending' | 'active' | 'suspended'> = {
  SCHEDULED: 'pending',
  SENDING: 'active',
  SENT: 'active',
  CANCELLED: 'suspended',
};

const scheduledStatusLabel: Record<MockScheduledEmail['status'], string> = {
  SCHEDULED: 'Scheduled',
  SENDING: 'Sending',
  SENT: 'Sent',
  CANCELLED: 'Cancelled',
};

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function AdminEmailsPage() {
  const [campaigns, setCampaigns] = useState(mockEmailCampaigns);
  const [automations, setAutomations] = useState(mockEmailAutomations);
  const [templates, setTemplates] = useState(mockEmailTemplates);
  const [scheduledEmails, setScheduledEmails] = useState(mockScheduledEmails);
  const [editingTemplate, setEditingTemplate] = useState<MockEmailTemplate | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [viewingScheduled, setViewingScheduled] = useState<MockScheduledEmail | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<MockEmailTemplate | null>(null);
  const [viewingCampaign, setViewingCampaign] = useState<MockEmailCampaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<MockEmailCampaign | null>(null);
  const [campaignDraft, setCampaignDraft] = useState({ name: '', audience: 'All Partners', subject: '', schedule: 'Send immediately' });
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [automationDraft, setAutomationDraft] = useState({ name: '', trigger: 'Partner application approved', audience: 'All Partners', template: 'Welcome Email', delay: 'Immediately' });
  const [isCreatingAutomation, setIsCreatingAutomation] = useState(false);

  const totalSent = campaigns.reduce((s, c) => s + c.sentCount, 0);
  const avgOpenRate = campaigns.filter((c) => c.openRate > 0).reduce((s, c) => s + c.openRate, 0) / (campaigns.filter((c) => c.openRate > 0).length || 1);
  const activeAutomations = automations.filter((a) => a.status === 'ACTIVE').length;
  const enabledTemplates = templates.filter((t) => t.enabled).length;

  const pct = (n: number) => `${Math.round(n * 100)}%`;

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : a)),
    );
  };

  const toggleTemplate = (id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  const openTemplateEditor = (t: MockEmailTemplate) => {
    setEditingTemplate(t);
    setEditSubject(t.subject);
    setEditBody(t.body);
  };

  const saveTemplate = () => {
    if (!editingTemplate) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, subject: editSubject, body: editBody, lastEdited: new Date().toISOString().slice(0, 10) }
          : t,
      ),
    );
    setEditingTemplate(null);
  };

  const cancelScheduledSend = (id: string) => {
    setScheduledEmails((prev) => prev.map((s) => s.id === id ? { ...s, status: 'CANCELLED' as const } : s));
    setViewingScheduled(null);
  };

  const openCreateCampaign = () => {
    setCampaignDraft({ name: '', audience: 'All Partners', subject: '', schedule: 'Send immediately' });
    setIsCreatingCampaign(true);
    setEditingCampaign(null);
  };

  const openEditCampaign = (c: MockEmailCampaign) => {
    setEditingCampaign(c);
    setCampaignDraft({ name: c.name, audience: c.audience, subject: c.subject, schedule: c.schedule });
    setIsCreatingCampaign(false);
  };

  const saveCampaign = () => {
    if (!campaignDraft.name.trim()) return;
    if (isCreatingCampaign) {
      const newCampaign: MockEmailCampaign = {
        id: `camp-${Date.now()}`, name: campaignDraft.name, audience: campaignDraft.audience,
        template: 'Custom', subject: campaignDraft.subject, schedule: campaignDraft.schedule,
        status: 'DRAFT', sentCount: 0, openRate: 0,
      };
      setCampaigns((prev) => [...prev, newCampaign]);
    } else if (editingCampaign) {
      setCampaigns((prev) => prev.map((c) => c.id === editingCampaign.id ? { ...c, ...campaignDraft } : c));
    }
    setIsCreatingCampaign(false);
    setEditingCampaign(null);
  };

  const closeCampaignDialog = () => {
    setIsCreatingCampaign(false);
    setEditingCampaign(null);
  };

  const openCreateAutomation = () => {
    setAutomationDraft({ name: '', trigger: 'Partner application approved', audience: 'All Partners', template: 'Welcome Email', delay: 'Immediately' });
    setIsCreatingAutomation(true);
  };

  const saveAutomation = () => {
    if (!automationDraft.name.trim()) return;
    const newAutomation: MockEmailAutomation = {
      id: `auto-${Date.now()}`, name: automationDraft.name, trigger: automationDraft.trigger,
      audience: automationDraft.audience, template: automationDraft.template, delay: automationDraft.delay,
      status: 'ACTIVE',
    };
    setAutomations((prev) => [...prev, newAutomation]);
    setIsCreatingAutomation(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Emails"
        title="Email Center"
        description="Broadcast campaigns, scheduled sends, lifecycle automations, and editable email templates."
        actions={<Button className="cv-btn-primary cv-btn-sm rounded-full" onClick={openCreateCampaign}><Plus className="h-4 w-4" /> New Campaign</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campaigns" value={campaigns.length} icon={Megaphone} description="All time" />
        <StatCard label="Emails Sent" value={totalSent.toLocaleString()} icon={Send} trend="+8%" trendUp description="Across campaigns" />
        <StatCard label="Avg Open Rate" value={pct(avgOpenRate)} icon={MousePointerClick} trend="+3%" trendUp description="Sent campaigns" />
        <StatCard label="Active Automations" value={activeAutomations} icon={Zap} description={`${automations.length} total`} />
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-cv-soft rounded-full p-1 h-auto flex flex-wrap">
          <TabsTrigger value="campaigns" className="rounded-full px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm">
            <Megaphone className="h-4 w-4 mr-1.5" /> Campaigns
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-full px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm">
            <Calendar className="h-4 w-4 mr-1.5" /> Scheduled
          </TabsTrigger>
          <TabsTrigger value="automations" className="rounded-full px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm">
            <Zap className="h-4 w-4 mr-1.5" /> Automations
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-full px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm">
            <FileText className="h-4 w-4 mr-1.5" /> Templates
          </TabsTrigger>
        </TabsList>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Campaigns</CardTitle>
              <p className="text-xs text-cv-muted mt-0.5">One-time broadcasts sent to partner audiences</p>
            </CardHeader>
            <CardContent className="pt-0">
              {campaigns.length === 0 ? (
                <EmptyState icon={Mail} title="No campaigns yet" description="Create your first email campaign to reach partners." action={<Button className="cv-btn-primary cv-btn-sm rounded-full" onClick={openCreateCampaign}>New Campaign</Button>} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-cv-line">
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Name</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Audience</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Subject</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Schedule</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sent</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Open Rate</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {campaigns.map((c) => (
                      <TableRow key={c.id} className="border-cv-line">
                        <TableCell className="font-bold text-cv-ink text-sm">{c.name}</TableCell>
                        <TableCell className="text-sm text-cv-body">{c.audience}</TableCell>
                        <TableCell className="text-sm text-cv-body max-w-[220px] truncate">{c.subject}</TableCell>
                        <TableCell className="text-sm text-cv-muted">{c.schedule}</TableCell>
                        <TableCell><StatusBadge status={campaignStatusVariant[c.status]} label={campaignStatusLabel[c.status]} /></TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-ink">{c.sentCount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-good">{c.openRate > 0 ? pct(c.openRate) : '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewingCampaign(c)} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="View"><Eye className="h-3.5 w-3.5 text-cv-muted" /></button>
                            <button onClick={() => openEditCampaign(c)} className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors" title="Edit"><Pencil className="h-3.5 w-3.5 text-cv-muted" /></button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled */}
        <TabsContent value="scheduled" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Scheduled Emails</CardTitle>
              <p className="text-xs text-cv-muted mt-0.5">Campaigns queued for future delivery</p>
            </CardHeader>
            <CardContent className="pt-0">
              {scheduledEmails.length === 0 ? (
                <EmptyState icon={Calendar} title="No scheduled emails" description="Scheduled campaign sends will appear here." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-cv-line">
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Campaign</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Audience</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Subject</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Scheduled Date</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Recipients</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledEmails.map((s) => (
                      <TableRow key={s.id} className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors" onClick={() => setViewingScheduled(s)}>
                        <TableCell className="font-bold text-cv-ink text-sm">{s.campaignName}</TableCell>
                        <TableCell className="text-sm text-cv-body">{s.audience}</TableCell>
                        <TableCell className="text-sm text-cv-body max-w-[220px] truncate">{s.subject}</TableCell>
                        <TableCell className="text-sm text-cv-muted">{fmtDate(s.scheduledDate)}</TableCell>
                        <TableCell><StatusBadge status={scheduledStatusVariant[s.status]} label={scheduledStatusLabel[s.status]} /></TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-ink">{s.recipientCount}</TableCell>
                        <TableCell className="text-right"><Eye className="h-3.5 w-3.5 text-cv-muted" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automations */}
        <TabsContent value="automations" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-cv-ink">Automations</CardTitle>
                  <p className="text-xs text-cv-muted mt-0.5">Triggered emails sent automatically based on partner events</p>
                </div>
                <Button variant="outline" className="rounded-full border-cv-line text-cv-ink hover:bg-cv-soft" onClick={openCreateAutomation}>
                  <Plus className="h-3.5 w-3.5" /> New Automation
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {automations.length === 0 ? (
                <EmptyState icon={Zap} title="No automations" description="Set up automated emails triggered by partner events." />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-cv-line">
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Name</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Trigger</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Audience</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Template</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Delay</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {automations.map((a) => (
                      <TableRow key={a.id} className="border-cv-line">
                        <TableCell className="font-bold text-cv-ink text-sm">{a.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-cv-soft px-2 py-0.5 text-xs font-bold text-cv-body">
                            <Zap className="h-3 w-3 text-cv-red" /> {a.trigger}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-cv-body">{a.audience}</TableCell>
                        <TableCell className="text-sm text-cv-muted">{a.template}</TableCell>
                        <TableCell className="text-sm text-cv-muted">{a.delay}</TableCell>
                        <TableCell><StatusBadge status={automationStatusVariant[a.status]} label={automationStatusLabel[a.status]} /></TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => toggleAutomation(a.id)}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-colors',
                              a.status === 'ACTIVE'
                                ? 'bg-cv-soft text-cv-body hover:bg-cv-line'
                                : 'bg-emerald-50 text-cv-good hover:bg-emerald-100'
                            )}
                          >
                            {a.status === 'ACTIVE' ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Resume</>}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-cv-ink">Email Templates</CardTitle>
                  <p className="text-xs text-cv-muted mt-0.5">{enabledTemplates} of {templates.length} templates enabled</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3 sm:grid-cols-2">
                {templates.map((t) => (
                  <div key={t.id} className="rounded-xl border border-cv-line p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-cv-ink">{t.name}</p>
                        <p className="text-xs text-cv-muted mt-0.5">{t.trigger}</p>
                      </div>
                      <button
                        onClick={() => toggleTemplate(t.id)}
                        className={cn(
                          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
                          t.enabled ? 'bg-cv-good' : 'bg-cv-line'
                        )}
                      >
                        <span className={cn('inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform', t.enabled ? 'translate-x-5' : 'translate-x-1')} />
                      </button>
                    </div>
                    <p className="text-xs text-cv-body truncate mb-2">{t.subject}</p>
                    <p className="text-[10px] text-cv-muted">Last edited {fmtDate(t.lastEdited)}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="rounded-full border-cv-line text-xs h-7" onClick={() => openTemplateEditor(t)}>
                        <Pencil className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full border-cv-line text-xs h-7" onClick={() => setPreviewTemplate(t)}>
                        <Eye className="h-3 w-3 mr-1" /> Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Template editor dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={(open) => !open && setEditingTemplate(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Edit template</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{editingTemplate?.name}</DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="rounded-lg bg-cv-soft px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Trigger</p>
                <p className="text-sm text-cv-body mt-0.5">{editingTemplate.trigger}</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Subject Line</label>
                <Input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} className="cv-input" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Email Body</label>
                <Textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={12} className="cv-input font-mono text-xs" />
                <p className="text-[10px] text-cv-muted mt-1">
                  Variables: <code className="bg-cv-soft px-1 rounded">{'{{partner_name}}'}</code>, <code className="bg-cv-soft px-1 rounded">{'{{activation_link}}'}</code>, <code className="bg-cv-soft px-1 rounded">{'{{partner_portal_link}}'}</code>, <code className="bg-cv-soft px-1 rounded">{'{{storefront_link}}'}</code>, <code className="bg-cv-soft px-1 rounded">{'{{commission_amount}}'}</code>, <code className="bg-cv-soft px-1 rounded">{'{{package_name}}'}</code>
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => { if (editingTemplate) setPreviewTemplate(editingTemplate); }}>Preview</Button>
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setEditingTemplate(null)}>Cancel</Button>
            <Button className="cv-btn-primary rounded-full" onClick={saveTemplate}>Save template</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template preview dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Email Preview</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{previewTemplate?.name}</DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
              <div className="rounded-lg border border-cv-line">
                <div className="border-b border-cv-line bg-cv-soft px-4 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Subject</p>
                  <p className="text-sm font-bold text-cv-ink mt-0.5">
                    {renderEmailPreview(previewTemplate.subject, previewTemplate.trigger)}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Body</p>
                  <div className="rounded-lg bg-white border border-cv-line p-4">
                    <pre className="whitespace-pre-wrap text-sm text-cv-body font-sans leading-relaxed">
{renderEmailPreview(previewTemplate.body, previewTemplate.trigger)}
                    </pre>
                  </div>
                </div>
                <div className="border-t border-cv-line bg-cv-soft px-4 py-2.5">
                  <p className="text-[10px] text-cv-muted">Preview uses sample data. Actual variables will be replaced with real partner data when sent.</p>
                </div>
              </div>
              {previewTemplate.trigger.includes('approved') && (
                <div className={cn('rounded-lg p-3 flex items-start gap-2', previewTemplate.enabled ? 'bg-emerald-50' : 'bg-amber-50')}>
                  {previewTemplate.enabled
                    ? <CheckCircle2 className="h-4 w-4 text-cv-good shrink-0 mt-0.5" />
                    : <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />}
                  <p className="text-xs text-cv-body">
                    {previewTemplate.enabled
                      ? 'This automation is enabled. Approval emails will be sent automatically when a partner application is approved.'
                      : 'This automation is disabled. Approval emails will NOT be sent when a partner application is approved. Enable it in the Automations tab.'}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setPreviewTemplate(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Scheduled email detail dialog */}
      <Dialog open={!!viewingScheduled} onOpenChange={(open) => !open && setViewingScheduled(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Scheduled email</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{viewingScheduled?.campaignName}</DialogDescription>
          </DialogHeader>
          {viewingScheduled && (
            <div className="space-y-3 pt-1">
              <DetailRow label="Campaign" value={viewingScheduled.campaignName} />
              <DetailRow label="Audience" value={viewingScheduled.audience} />
              <DetailRow label="Subject" value={viewingScheduled.subject} />
              <DetailRow label="Scheduled Date" value={fmtDate(viewingScheduled.scheduledDate)} />
              <DetailRow label="Recipients" value={`${viewingScheduled.recipientCount} partners`} />
              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={scheduledStatusVariant[viewingScheduled.status]} label={scheduledStatusLabel[viewingScheduled.status]} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            {viewingScheduled?.status === 'SCHEDULED' && (
              <Button variant="outline" className="rounded-full border-cv-red text-cv-red font-bold hover:bg-cv-red/5" onClick={() => cancelScheduledSend(viewingScheduled.id)}>Cancel send</Button>
            )}
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setViewingScheduled(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign view dialog */}
      <Dialog open={!!viewingCampaign} onOpenChange={(open) => !open && setViewingCampaign(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">Campaign details</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{viewingCampaign?.name}</DialogDescription>
          </DialogHeader>
          {viewingCampaign && (
            <div className="space-y-3 pt-1">
              <DetailRow label="Name" value={viewingCampaign.name} />
              <DetailRow label="Audience" value={viewingCampaign.audience} />
              <DetailRow label="Subject" value={viewingCampaign.subject} />
              <DetailRow label="Template" value={viewingCampaign.template} />
              <DetailRow label="Schedule" value={viewingCampaign.schedule} />
              <DetailRow label="Sent" value={viewingCampaign.sentCount.toLocaleString()} />
              <DetailRow label="Open Rate" value={viewingCampaign.openRate > 0 ? pct(viewingCampaign.openRate) : '—'} />
              <div className="flex items-center justify-between py-1 border-b border-cv-line">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={campaignStatusVariant[viewingCampaign.status]} label={campaignStatusLabel[viewingCampaign.status]} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            {viewingCampaign && viewingCampaign.status === 'DRAFT' && (
              <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => { const c = viewingCampaign; setViewingCampaign(null); openEditCampaign(c); }}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setViewingCampaign(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Campaign create/edit dialog */}
      <Dialog open={isCreatingCampaign || !!editingCampaign} onOpenChange={(open) => !open && closeCampaignDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">{isCreatingCampaign ? 'New Campaign' : 'Edit Campaign'}</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">{isCreatingCampaign ? 'Create a new email campaign for partners.' : 'Update this campaign.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Campaign Name</label>
              <Input value={campaignDraft.name} onChange={(e) => setCampaignDraft({ ...campaignDraft, name: e.target.value })} className="cv-input" placeholder="e.g. September Partner Newsletter" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Audience</label>
              <Input value={campaignDraft.audience} onChange={(e) => setCampaignDraft({ ...campaignDraft, audience: e.target.value })} className="cv-input" placeholder="e.g. All Partners" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Subject Line</label>
              <Input value={campaignDraft.subject} onChange={(e) => setCampaignDraft({ ...campaignDraft, subject: e.target.value })} className="cv-input" placeholder="Email subject" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Schedule</label>
              <Input value={campaignDraft.schedule} onChange={(e) => setCampaignDraft({ ...campaignDraft, schedule: e.target.value })} className="cv-input" placeholder="e.g. Send immediately or Sep 25, 2026" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={closeCampaignDialog}>Cancel</Button>
            <Button className="cv-btn-primary rounded-full" onClick={saveCampaign} disabled={!campaignDraft.name.trim()}>
              {isCreatingCampaign ? 'Create campaign' : 'Save changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Automation create dialog */}
      <Dialog open={isCreatingAutomation} onOpenChange={(open) => !open && setIsCreatingAutomation(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-cv-ink">New Automation</DialogTitle>
            <DialogDescription className="text-sm text-cv-muted">Create an automated email triggered by partner events.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-1">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Automation Name</label>
              <Input value={automationDraft.name} onChange={(e) => setAutomationDraft({ ...automationDraft, name: e.target.value })} className="cv-input" placeholder="e.g. Welcome Email" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Trigger</label>
              <Input value={automationDraft.trigger} onChange={(e) => setAutomationDraft({ ...automationDraft, trigger: e.target.value })} className="cv-input" placeholder="e.g. Partner application approved" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Audience</label>
              <Input value={automationDraft.audience} onChange={(e) => setAutomationDraft({ ...automationDraft, audience: e.target.value })} className="cv-input" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Template</label>
              <Input value={automationDraft.template} onChange={(e) => setAutomationDraft({ ...automationDraft, template: e.target.value })} className="cv-input" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-cv-muted block mb-1.5">Delay</label>
              <Input value={automationDraft.delay} onChange={(e) => setAutomationDraft({ ...automationDraft, delay: e.target.value })} className="cv-input" placeholder="e.g. Immediately or 2 hours" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => setIsCreatingAutomation(false)}>Cancel</Button>
            <Button className="cv-btn-primary rounded-full" onClick={saveAutomation} disabled={!automationDraft.name.trim()}>Create automation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-cv-line last:border-0 gap-3">
      <span className="text-xs font-bold uppercase tracking-wider text-cv-muted shrink-0">{label}</span>
      <span className="text-sm font-bold text-cv-ink text-right">{value}</span>
    </div>
  );
}

function renderEmailPreview(text: string, trigger: string): string {
  const isApproval = trigger.toLowerCase().includes('approved');
  const sampleVars: Record<string, string> = {
    partner_name: 'Marcus Johnson',
    activation_link: 'https://careverse.ai/activate?token=abc123',
    partner_portal_link: 'https://careverse.ai/partner',
    storefront_link: 'https://careverse.ai/s/marcus',
    commission_amount: '$17.80',
    package_name: 'Family Plus',
    customer_name: 'Jennifer Smith',
    storefront_name: 'Marcus Care Partners',
    storefront_url: 'https://careverse.ai/s/marcus',
    payout_amount: '$1,240',
    payout_method: 'Bank Transfer',
    payout_reference: 'PAY-2026-0901',
  };
  let result = text.replace(/\{\{(\w+)\}\}/g, (_, key) => sampleVars[key] || `{{${key}}}`);
  if (isApproval) {
    result = result.replace(/\{\{#if\s+\w+\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, content) => content.trim());
  } else {
    result = result.replace(/\{\{#if\s+\w+\}\}([\s\S]*?)\{\{\/if\}\}/g, '');
  }
  return result;
}
