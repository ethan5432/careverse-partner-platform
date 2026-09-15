'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Send, Zap, MousePointerClick, Megaphone, Plus, Pencil, Play, Pause, Eye } from 'lucide-react';
import { mockEmailCampaigns, mockEmailAutomations } from '@/data/mock';
import type { MockEmailCampaign, MockEmailAutomation } from '@/data/mock/types';
import { cn } from '@/lib/utils';

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

export default function AdminEmailsPage() {
  const totalSent = mockEmailCampaigns.reduce((s, c) => s + c.sentCount, 0);
  const avgOpenRate = mockEmailCampaigns.filter((c) => c.openRate > 0).reduce((s, c) => s + c.openRate, 0) / (mockEmailCampaigns.filter((c) => c.openRate > 0).length || 1);
  const activeAutomations = mockEmailAutomations.filter((a) => a.status === 'ACTIVE').length;

  const pct = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Emails"
        title="Email Center"
        description="Broadcast campaigns and lifecycle automations that reach your partners."
        actions={<Button className="cv-btn-primary cv-btn-sm rounded-full"><Plus className="h-4 w-4" /> New Campaign</Button>}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campaigns" value={mockEmailCampaigns.length} icon={Megaphone} description="All time" />
        <StatCard label="Emails Sent" value={totalSent.toLocaleString()} icon={Send} trend="+8%" trendUp description="Across campaigns" />
        <StatCard label="Avg Open Rate" value={pct(avgOpenRate)} icon={MousePointerClick} trend="+3%" trendUp description="Sent campaigns" />
        <StatCard label="Active Automations" value={activeAutomations} icon={Zap} description={`${mockEmailAutomations.length} total`} />
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-cv-soft rounded-full p-1 h-auto">
          <TabsTrigger value="campaigns" className="rounded-full px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm">
            <Megaphone className="h-4 w-4 mr-1.5" /> Campaigns
          </TabsTrigger>
          <TabsTrigger value="automations" className="rounded-full px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm">
            <Zap className="h-4 w-4 mr-1.5" /> Automations
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
              {mockEmailCampaigns.length === 0 ? (
                <EmptyState icon={Mail} title="No campaigns yet" description="Create your first email campaign to reach partners." action={<Button className="cv-btn-primary cv-btn-sm rounded-full">New Campaign</Button>} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-cv-line">
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Name</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Audience</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Template</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Subject</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Schedule</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sent</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Open Rate</TableHead>
                      <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-20" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmailCampaigns.map((c) => (
                      <TableRow key={c.id} className="border-cv-line">
                        <TableCell className="font-bold text-cv-ink text-sm">{c.name}</TableCell>
                        <TableCell className="text-sm text-cv-body">{c.audience}</TableCell>
                        <TableCell className="text-sm text-cv-muted">{c.template}</TableCell>
                        <TableCell className="text-sm text-cv-body max-w-[220px] truncate">{c.subject}</TableCell>
                        <TableCell className="text-sm text-cv-muted">{c.schedule}</TableCell>
                        <TableCell><StatusBadge status={campaignStatusVariant[c.status]} label={campaignStatusLabel[c.status]} /></TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-ink">{c.sentCount.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-good">{c.openRate > 0 ? pct(c.openRate) : '—'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors"><Eye className="h-3.5 w-3.5 text-cv-muted" /></button>
                            <button className="rounded-lg p-1.5 hover:bg-cv-soft transition-colors"><Pencil className="h-3.5 w-3.5 text-cv-muted" /></button>
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

        {/* Automations */}
        <TabsContent value="automations" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-cv-ink">Automations</CardTitle>
                  <p className="text-xs text-cv-muted mt-0.5">Triggered emails sent automatically based on partner events</p>
                </div>
                <Button variant="outline" className="rounded-full border-cv-line text-cv-ink hover:bg-cv-soft">
                  <Plus className="h-3.5 w-3.5" /> New Automation
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {mockEmailAutomations.length === 0 ? (
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
                    {mockEmailAutomations.map((a) => (
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
      </Tabs>
    </div>
  );
}
