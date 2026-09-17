'use client';

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Users, Search, UserPlus, ArrowLeftRight, DollarSign,
  Store, MessageSquare, StickyNote, Settings as SettingsIcon, Activity as ActivityIcon,
  Send, ExternalLink, Pencil, Check, Mail, Clock, AlertCircle, CheckCircle2, XCircle,
} from 'lucide-react';
import {
  mockPartners, mockConversions, mockCommissions, mockStorefronts,
  mockConversations, mockPartnerNotes, getPartnerActivity, adminDashboardStats,
  mockEmailTemplates, mockEmailAutomations,
} from '@/data/mock';
import type { MockPartner, PartnerType, PartnerStatus, MockPartnerNote, MockMessage, ApprovalEmailStatus } from '@/data/mock/types';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const partnerStatusMap: Record<PartnerStatus, 'active' | 'pending' | 'incomplete' | 'suspended'> = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INCOMPLETE: 'incomplete',
  SUSPENDED: 'suspended',
};

const partnerStatusLabel: Record<PartnerStatus, string> = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
  INCOMPLETE: 'Incomplete',
  SUSPENDED: 'Suspended',
};

type TypeFilter = 'ALL' | PartnerType;
const typeFilters: { value: TypeFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'CREATOR', label: 'Creator' },
  { value: 'BUSINESS', label: 'Business' },
];

type StatusFilter = 'ALL' | PartnerStatus;
const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'INCOMPLETE', label: 'Incomplete' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

const activityDotColor: Record<string, string> = {
  APPLICATION: 'bg-cv-muted',
  APPROVAL: 'bg-cv-good',
  ACTIVATED: 'bg-cv-good',
  STOREFRONT_CREATED: 'bg-blue-500',
  STOREFRONT_PUBLISHED: 'bg-cv-good',
  CONVERSION: 'bg-cv-ink',
  COMMISSION: 'bg-cv-good',
  MESSAGE: 'bg-cv-muted',
};

export default function AdminPartnersPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [approvalEmailStatuses, setApprovalEmailStatuses] = useState<Record<string, ApprovalEmailStatus>>({});
  const [approvalActivity, setApprovalActivity] = useState<Record<string, { description: string; date: string }[]>>({});

  const handleApprove = (partner: MockPartner) => {
    const approvalTemplate = mockEmailTemplates.find((t) => t.trigger.toLowerCase().includes('approved'));
    const approvalAutomation = mockEmailAutomations.find((a) => a.trigger.toLowerCase().includes('approved'));
    const isConfigured = approvalTemplate?.enabled && approvalAutomation?.status === 'ACTIVE';

    const emailStatus: ApprovalEmailStatus = isConfigured ? 'QUEUED' : 'NOT_CONFIGURED';
    setApprovalEmailStatuses((prev) => ({ ...prev, [partner.id]: emailStatus }));

    const now = new Date().toISOString().slice(0, 10);
    const activities = [
      { description: `Partner application approved by admin`, date: now },
      ...(isConfigured
        ? [{ description: `Approval email queued — subject: &ldquo;${approvalTemplate?.subject}&rdquo;`, date: now }]
        : [{ description: `Approval email NOT sent — automation not configured`, date: now }]),
    ];
    setApprovalActivity((prev) => ({ ...prev, [partner.id]: [...(prev[partner.id] || []), ...activities] }));
  };

  const filtered = useMemo(() => {
    return mockPartners.filter((p) => {
      const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.storefrontName.toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [search, typeFilter, statusFilter]);

  const selectedPartner = mockPartners.find((p) => p.id === selectedId) || null;

  const stats = useMemo(() => {
    const active = mockPartners.filter((p) => p.status === 'ACTIVE').length;
    const pending = mockPartners.filter((p) => p.status === 'PENDING').length;
    const revenue = mockPartners.reduce((s, p) => s + p.revenue, 0);
    return { total: mockPartners.length, active, pending, revenue };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Partners"
        title="Partners"
        description="Manage creators and businesses across the platform."
        actions={
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90" size="sm">
            <UserPlus className="h-4 w-4" />
            Add Partner
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Partners" value={stats.total} icon={Users} description={`${stats.active} active`} />
        <StatCard label="Active" value={stats.active} icon={ArrowLeftRight} description="In good standing" />
        <StatCard label="Pending" value={stats.pending} icon={DollarSign} description="Awaiting review" />
        <StatCard label="Partner Revenue" value={fmtMoney(stats.revenue)} icon={DollarSign} description="All time" />
      </div>

      {/* Filters */}
      <Card className="cv-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input
                placeholder="Search partners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cv-input pl-9 h-11"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
                {typeFilters.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTypeFilter(t.value)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                      typeFilter === t.value ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-xl bg-cv-soft p-1">
                {statusFilters.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatusFilter(s.value)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                      statusFilter === s.value ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="cv-card overflow-hidden">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No partners found"
              description="Try a different search or filter to see partners."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line hover:bg-transparent">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conv.</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow
                      key={p.id}
                      className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors"
                      onClick={() => setSelectedId(p.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={p.name} color={p.avatarColor} size={32} />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-cv-ink truncate">{p.name}</p>
                            <p className="text-xs text-cv-muted truncate">{p.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-cv-body">{p.type}</span>
                      </TableCell>
                      <TableCell><StatusBadge status={partnerStatusMap[p.status]} /></TableCell>
                      <TableCell className="text-sm text-cv-body">{p.storefrontName}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{fmtMoney(p.commission)}</TableCell>
                      <TableCell className="text-xs text-cv-muted">{fmtDate(p.joinedDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partner detail dialog */}
      <PartnerDialog
        partner={selectedPartner}
        onClose={() => setSelectedId(null)}
        approvalEmailStatus={selectedPartner ? approvalEmailStatuses[selectedPartner.id] : undefined}
        onApprove={handleApprove}
        extraActivity={selectedPartner ? approvalActivity[selectedPartner.id] || [] : []}
      />
    </div>
  );
}

function PartnerDialog({
  partner, onClose, approvalEmailStatus, onApprove, extraActivity,
}: {
  partner: MockPartner | null;
  onClose: () => void;
  approvalEmailStatus?: ApprovalEmailStatus;
  onApprove: (partner: MockPartner) => void;
  extraActivity: { description: string; date: string }[];
}) {
  const open = !!partner;

  const partnerConversions = useMemo(
    () => (partner ? mockConversions.filter((c) => c.partnerId === partner.id) : []),
    [partner]
  );
  const partnerCommissions = useMemo(
    () => (partner ? mockCommissions.filter((c) => c.partnerId === partner.id) : []),
    [partner]
  );
  const partnerStorefront = useMemo(
    () => (partner ? mockStorefronts.find((s) => s.partnerId === partner.id) || null : null),
    [partner]
  );
  const partnerConversation = useMemo(
    () => (partner ? mockConversations.find((c) => c.partnerId === partner.id) || null : null),
    [partner]
  );
  const partnerActivity = useMemo(
    () => (partner ? getPartnerActivity(partner.id) : []),
    [partner]
  );

  const [notes, setNotes] = useState<MockPartnerNote[]>([]);
  const [noteDraft, setNoteDraft] = useState('');
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [msgDraft, setMsgDraft] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>('ACTIVE');

  React.useEffect(() => {
    if (partner) {
      setNotes(mockPartnerNotes.filter((n) => n.partnerId === partner.id));
      setMessages(partnerConversation?.messages || []);
      setSelectedConvId(partnerConversation?.id || null);
      setPartnerStatus(partner.status);
      setNoteDraft('');
      setMsgDraft('');
    }
  }, [partner, partnerConversation]);

  const handleAddNote = () => {
    if (!noteDraft.trim() || !partner) return;
    const newNote: MockPartnerNote = {
      id: `pn-${Date.now()}`,
      partnerId: partner.id,
      text: noteDraft.trim(),
      author: 'Sarah Chen',
      date: new Date().toISOString().slice(0, 10),
    };
    setNotes((prev) => [newNote, ...prev]);
    setNoteDraft('');
  };

  const handleSendMessage = () => {
    if (!msgDraft.trim() || !selectedConvId) return;
    const newMsg: MockMessage = {
      id: `m-${Date.now()}`,
      conversationId: selectedConvId,
      sender: 'ADMIN',
      senderName: 'Careverse Team',
      text: msgDraft.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setMessages((prev) => [...prev, newMsg]);
    setMsgDraft('');
  };

  const statusOptions: { value: PartnerStatus; label: string; badge: 'active' | 'pending' | 'incomplete' | 'suspended' | 'paused' }[] = [
    { value: 'ACTIVE', label: 'Active', badge: 'active' },
    { value: 'PENDING', label: 'Pending', badge: 'pending' },
    { value: 'INCOMPLETE', label: 'Incomplete', badge: 'incomplete' },
    { value: 'SUSPENDED', label: 'Suspended', badge: 'suspended' },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto cv-card border-cv-line rounded-2xl bg-white p-0">
        {partner && (
          <>
            <DialogHeader className="p-6 pb-4 border-b border-cv-line">
              <div className="flex items-center gap-3">
                <Avatar name={partner.name} color={partner.avatarColor} size={44} />
                <div>
                  <DialogTitle className="text-lg font-bold text-cv-ink">{partner.name}</DialogTitle>
                  <DialogDescription className="text-sm text-cv-muted">{partner.email}</DialogDescription>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={partnerStatusMap[partnerStatus]} />
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 pb-6">
              <Tabs defaultValue="overview">
                <TabsList className="bg-cv-soft h-auto p-1 flex flex-wrap gap-1">
                  <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
                  <TabsTrigger value="conversions" className="text-xs">Conversions</TabsTrigger>
                  <TabsTrigger value="commissions" className="text-xs">Commissions</TabsTrigger>
                  <TabsTrigger value="storefront" className="text-xs">Storefront</TabsTrigger>
                  <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField label="Name" value={partner.name} />
                    <DetailField label="Email" value={partner.email} />
                    <DetailField label="Type" value={partner.type} />
                    <DetailField label="Status" value={<StatusBadge status={partnerStatusMap[partner.status]} />} />
                    <DetailField label="Joined" value={fmtDate(partner.joinedDate)} />
                    <DetailField label="Last Active" value={fmtDate(partner.lastActive)} />
                    <DetailField label="Conversions" value={String(partner.conversions)} />
                    <DetailField label="Revenue" value={fmtMoney(partner.revenue)} />
                    <DetailField label="Commission" value={fmtMoney(partner.commission)} />
                    <DetailField label="Storefront" value={partner.storefrontName} />
                  </div>

                  {/* Approval action */}
                  <div className="mt-4 rounded-xl border border-cv-line p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Application</p>
                        <p className="text-sm font-bold text-cv-ink mt-0.5">
                          {partner.status === 'PENDING' || partner.status === 'INCOMPLETE'
                            ? 'Awaiting approval'
                            : partner.status === 'ACTIVE'
                              ? 'Approved'
                              : partner.status === 'SUSPENDED'
                                ? 'Suspended'
                                : 'Unknown'}
                        </p>
                      </div>
                      {(partner.status === 'PENDING' || partner.status === 'INCOMPLETE') && !approvalEmailStatus && (
                        <Button
                          className="bg-cv-good text-white hover:bg-cv-good/90 rounded-full text-sm font-bold"
                          onClick={() => onApprove(partner)}
                        >
                          <Check className="h-4 w-4" /> Approve
                        </Button>
                      )}
                    </div>

                    {approvalEmailStatus && (
                      <ApprovalEmailBanner status={approvalEmailStatus} />
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-cv-soft p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Commercial Summary</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-cv-muted">Commission Rate</p>
                        <p className="text-sm font-bold text-cv-ink">20%</p>
                      </div>
                      <div>
                        <p className="text-xs text-cv-muted">Avg. Sale</p>
                        <p className="text-sm font-bold text-cv-ink">{partner.conversions > 0 ? fmtMoney(partner.revenue / partner.conversions) : '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cv-muted">Conversion Rate</p>
                        <p className="text-sm font-bold text-cv-ink">{partnerStorefront ? `${(partnerStorefront.conversions / Math.max(partnerStorefront.visitors, 1) * 100).toFixed(1)}%` : '—'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Activity */}
                <TabsContent value="activity" className="mt-4">
                  {(partnerActivity.length === 0 && extraActivity.length === 0) ? (
                    <EmptyState icon={ActivityIcon} title="No activity" description="Activity will appear here as the partner takes actions." />
                  ) : (
                    <div className="relative pl-6">
                      <div className="absolute left-2 top-1 bottom-1 w-px bg-cv-line" />
                      <div className="space-y-4">
                        {extraActivity.map((item, i) => (
                          <div key={`extra-${i}`} className="relative">
                            <div className="absolute -left-[18px] top-1 h-3 w-3 rounded-full border-2 border-white bg-cv-good" />
                            <p className="text-sm font-bold text-cv-ink" dangerouslySetInnerHTML={{ __html: item.description }} />
                            <p className="text-xs text-cv-muted mt-0.5">{fmtDate(item.date)}</p>
                          </div>
                        ))}
                        {partnerActivity.map((item) => (
                          <div key={item.id} className="relative">
                            <div className={cn('absolute -left-[18px] top-1 h-3 w-3 rounded-full border-2 border-white', activityDotColor[item.type] || 'bg-cv-muted')} />
                            <p className="text-sm font-bold text-cv-ink">{item.description}</p>
                            <p className="text-xs text-cv-muted mt-0.5">{fmtDate(item.date)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Conversions */}
                <TabsContent value="conversions" className="mt-4">
                  {partnerConversions.length === 0 ? (
                    <EmptyState icon={ArrowLeftRight} title="No conversions" description="This partner has no conversions yet." />
                  ) : (
                    <ConversionTable conversions={partnerConversions} />
                  )}
                </TabsContent>

                {/* Commissions */}
                <TabsContent value="commissions" className="mt-4">
                  {partnerCommissions.length === 0 ? (
                    <EmptyState icon={DollarSign} title="No commissions" description="This partner has no commissions yet." />
                  ) : (
                    <CommissionTable commissions={partnerCommissions} />
                  )}
                </TabsContent>

                {/* Storefront */}
                <TabsContent value="storefront" className="mt-4">
                  {partnerStorefront ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Name" value={partnerStorefront.name} />
                        <DetailField label="URL" value={partnerStorefront.url} />
                        <DetailField label="Status" value={<StatusBadge status={partnerStorefront.status.toLowerCase() as any} />} />
                        <DetailField label="Domain" value={
                          partnerStorefront.customDomain
                            ? <span className="flex items-center gap-2"><span>{partnerStorefront.customDomain}</span><StatusBadge status={partnerStorefront.domainStatus.toLowerCase() as any} /></span>
                            : <StatusBadge status="none" />
                        } />
                        <DetailField label="Visitors" value={String(partnerStorefront.visitors)} />
                        <DetailField label="Conversions" value={String(partnerStorefront.conversions)} />
                        <DetailField label="Revenue" value={fmtMoney(partnerStorefront.revenue)} />
                        <DetailField label="Commission" value={fmtMoney(partnerStorefront.commission)} />
                      </div>
                      {partnerStorefront.introCopy && (
                        <div className="rounded-xl bg-cv-soft p-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Intro Copy</p>
                          <p className="text-sm text-cv-body">{partnerStorefront.introCopy}</p>
                        </div>
                      )}
                      <div className="rounded-xl bg-cv-soft p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Packages</p>
                        <div className="flex flex-wrap gap-2">
                          {partnerStorefront.packages.length === 0 ? (
                            <span className="text-sm text-cv-muted">No packages</span>
                          ) : (
                            partnerStorefront.packages.map((pkg) => (
                              <span key={pkg} className="rounded-lg border border-cv-line bg-white px-2.5 py-1 text-xs font-bold text-cv-ink">{pkg}</span>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft text-xs">
                          <ExternalLink className="h-3.5 w-3.5" /> View storefront
                        </Button>
                        <Button variant="outline" className="flex-1 rounded-full border-cv-line text-cv-ink hover:bg-cv-soft text-xs">
                          <Pencil className="h-3.5 w-3.5" /> Edit storefront
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <EmptyState icon={Store} title="No storefront" description="This partner has not set up a storefront." />
                  )}
                </TabsContent>

                {/* Messages */}
                <TabsContent value="messages" className="mt-4">
                  {messages.length === 0 ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No messages"
                      description="Start a conversation with this partner."
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="max-h-64 overflow-y-auto space-y-3 rounded-xl bg-cv-soft/40 p-4">
                        {messages.map((m) => {
                          const isPartner = m.sender === 'PARTNER';
                          return (
                            <div key={m.id} className={cn('flex gap-2.5', isPartner ? 'justify-end' : 'justify-start')}>
                              <div className={cn('max-w-[80%]', isPartner && 'flex flex-col items-end')}>
                                <div
                                  className={cn(
                                    'rounded-2xl px-3.5 py-2 text-sm',
                                    isPartner
                                      ? 'bg-cv-ink text-white rounded-tr-sm'
                                      : 'bg-white border border-cv-line text-cv-body rounded-tl-sm'
                                  )}
                                >
                                  {m.text}
                                </div>
                                <span className="text-[10px] text-cv-muted mt-1 px-1">{m.senderName} · {fmtDate(m.date)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={msgDraft}
                          onChange={(e) => setMsgDraft(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                          placeholder="Reply to partner..."
                          className="cv-input h-10"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!msgDraft.trim()}
                          className="cv-btn-primary cv-btn-sm rounded-full h-10 w-10 p-0 shrink-0"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Notes */}
                <TabsContent value="notes" className="mt-4">
                  <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/60 p-2.5">
                    <p className="text-xs font-bold text-amber-700">Internal notes — not visible to the partner.</p>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add an internal note..."
                      className="cv-input min-h-[60px] text-sm"
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={!noteDraft.trim()}
                      className="cv-btn-primary cv-btn-sm rounded-full shrink-0 self-end h-10"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  {notes.length === 0 ? (
                    <EmptyState icon={StickyNote} title="No notes yet" description="Internal notes about this partner will appear here." />
                  ) : (
                    <div className="space-y-2.5">
                      {notes.map((n) => (
                        <div key={n.id} className="rounded-xl bg-cv-soft p-3">
                          <p className="text-sm text-cv-body">{n.text}</p>
                          <p className="text-xs text-cv-muted mt-2">{n.author} · {fmtDate(n.date)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings" className="mt-4">
                  <div className="space-y-4">
                    <DetailField label="Name" value={partner.name} />
                    <DetailField label="Email" value={partner.email} />
                    <DetailField label="Type" value={partner.type} />
                    <DetailField label="Joined" value={fmtDate(partner.joinedDate)} />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Account Status</p>
                      <div className="flex flex-wrap gap-2">
                        {statusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setPartnerStatus(opt.value)}
                            className={cn(
                              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                              partnerStatus === opt.value
                                ? 'border-cv-ink bg-cv-ink text-white'
                                : 'border-cv-line bg-white text-cv-body hover:bg-cv-soft'
                            )}
                          >
                            {partnerStatus === opt.value && <Check className="h-3 w-3" />}
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-cv-muted mt-2">Changes are mock only — no backend enforcement in this prototype.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-cv-soft p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">{label}</p>
      <div className="text-sm font-bold text-cv-ink">{value}</div>
    </div>
  );
}

function ApprovalEmailBanner({ status }: { status: ApprovalEmailStatus }) {
  const config = {
    NOT_CONFIGURED: {
      icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50',
      label: 'Approval email not configured',
      desc: 'No approval email automation is enabled. Go to Emails > Automations to configure it.',
    },
    QUEUED: {
      icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50',
      label: 'Approval email queued',
      desc: 'The approval email has been queued and will be sent to the partner automatically.',
    },
    SENT: {
      icon: CheckCircle2, color: 'text-cv-good', bg: 'bg-emerald-50',
      label: 'Approval email sent',
      desc: 'The approval email was successfully sent to the partner.',
    },
    FAILED: {
      icon: XCircle, color: 'text-cv-red', bg: 'bg-red-50',
      label: 'Approval email failed',
      desc: 'The approval email could not be sent. Check the email configuration and try again.',
    },
  }[status];

  const Icon = config.icon;
  return (
    <div className={cn('rounded-lg p-3 flex items-start gap-2', config.bg)}>
      <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', config.color)} />
      <div>
        <p className={cn('text-xs font-bold', config.color)}>{config.label}</p>
        <p className="text-xs text-cv-body mt-0.5">{config.desc}</p>
      </div>
    </div>
  );
}

function ConversionTable({ conversions }: { conversions: typeof mockConversions }) {
  const [selected, setSelected] = useState<typeof mockConversions[0] | null>(null);
  return (
    <>
      <div className="rounded-xl border border-cv-line overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-cv-line hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conversions.map((c) => (
              <TableRow
                key={c.id}
                className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors"
                onClick={() => setSelected(c)}
              >
                <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                <TableCell className="text-right text-sm text-cv-body">{fmtMoney(c.commission)}</TableCell>
                <TableCell><StatusBadge status={c.status.toLowerCase() as any} /></TableCell>
                <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md cv-card border-cv-line rounded-2xl bg-white p-0">
          {selected && (
            <div className="p-6 space-y-3">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-cv-ink">Conversion Detail</DialogTitle>
              </DialogHeader>
              <DetailField label="Plan" value={selected.plan} />
              <DetailField label="Sale Amount" value={`$${selected.saleAmount}`} />
              <DetailField label="Commission" value={fmtMoney(selected.commission)} />
              <DetailField label="Status" value={<StatusBadge status={selected.status.toLowerCase() as any} />} />
              <DetailField label="Date" value={fmtDate(selected.date)} />
              <DetailField label="Customer" value={selected.customerEmail} />
              <DetailField label="Attribution" value={selected.attributionSource} />
              <DetailField label="Storefront" value={selected.storefrontName} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function CommissionTable({ commissions }: { commissions: typeof mockCommissions }) {
  const [selected, setSelected] = useState<typeof mockCommissions[0] | null>(null);
  return (
    <>
      <div className="rounded-xl border border-cv-line overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-cv-line hover:bg-transparent">
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Rate</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
              <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.map((c) => (
              <TableRow
                key={c.id}
                className="border-cv-line cursor-pointer hover:bg-cv-soft/60 transition-colors"
                onClick={() => setSelected(c)}
              >
                <TableCell className="text-sm font-bold text-cv-ink">{c.plan}</TableCell>
                <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                <TableCell className="text-xs text-cv-muted">{c.commissionRule}</TableCell>
                <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.commission)}</TableCell>
                <TableCell><StatusBadge status={c.status.toLowerCase() as any} /></TableCell>
                <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md cv-card border-cv-line rounded-2xl bg-white p-0">
          {selected && (
            <div className="p-6 space-y-3">
              <DialogHeader>
                <DialogTitle className="text-base font-bold text-cv-ink">Commission Calculation</DialogTitle>
              </DialogHeader>
              <DetailField label="Plan" value={selected.plan} />
              <DetailField label="Sale Amount" value={`$${selected.saleAmount}`} />
              <DetailField label="Commission Rule" value={selected.commissionRule} />
              <DetailField label="Rate" value={`${(selected.rate * 100).toFixed(0)}%`} />
              <div className="rounded-xl bg-cv-soft p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Calculation</p>
                <p className="text-sm font-bold text-cv-ink">${selected.saleAmount} x {(selected.rate * 100).toFixed(0)}% = {fmtMoney(selected.commission)}</p>
              </div>
              <DetailField label="Status" value={<StatusBadge status={selected.status.toLowerCase() as any} />} />
              <DetailField label="Date" value={fmtDate(selected.date)} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
