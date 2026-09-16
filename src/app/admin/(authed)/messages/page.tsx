'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Avatar, StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send, Search, MessageCircle } from 'lucide-react';
import { mockConversations, mockPartners, mockStorefronts } from '@/data/mock';
import type { MockConversation, MockMessage } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmtDateLong = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function AdminMessagesPage() {
  const [activeId, setActiveId] = useState<string>(mockConversations[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState<MockConversation[]>(mockConversations);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId) ?? null;
  const activePartner = active ? mockPartners.find((p) => p.id === active.partnerId) : null;
  const activeStorefront = activePartner ? mockStorefronts.find((s) => s.id === activePartner.storefrontId) : null;

  const filtered = threads.filter((t) =>
    t.partnerName.toLowerCase().includes(query.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  const unreadCount = threads.filter((t) => t.unread).length;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, active?.messages.length]);

  const handleSend = () => {
    if (!draft.trim() || !active) return;
    const newMsg: MockMessage = {
      id: `m-${Date.now()}`,
      conversationId: active.id,
      sender: 'ADMIN',
      senderName: 'Careverse Team',
      text: draft.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, messages: [...t.messages, newMsg], lastMessage: newMsg.text, lastMessageDate: newMsg.date, unread: false }
          : t
      )
    );
    setDraft('');
  };

  const openConversation = (id: string) => {
    setActiveId(id);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: false } : t)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Messages"
        title="Partner Messages"
        description="Direct conversations between the Careverse team and your partners."
        actions={
          <>
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cv-red/10 px-3 py-1 text-xs font-bold text-cv-red">
                <span className="h-1.5 w-1.5 rounded-full bg-cv-red" />
                {unreadCount} unread
              </span>
            )}
          </>
        }
      />

      {/* Three-column layout: conversations | chat | partner details */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_280px] gap-4 h-[calc(100vh-280px)] min-h-[520px]">
        {/* Conversation list */}
        <Card className="cv-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-cv-line">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations..."
                className="cv-input pl-9 h-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState icon={MessageCircle} title="No conversations" description="Try a different search." />
            ) : (
              filtered.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openConversation(t.id)}
                  className={cn(
                    'w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-cv-line transition-colors',
                    t.id === activeId ? 'bg-cv-soft' : 'hover:bg-cv-soft/50'
                  )}
                >
                  <Avatar name={t.partnerName} color={t.partnerAvatarColor} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-cv-ink truncate">{t.partnerName}</p>
                      <span className="text-[10px] text-cv-muted shrink-0">{fmtDate(t.lastMessageDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className={cn('text-xs truncate flex-1', t.unread ? 'font-bold text-cv-ink' : 'text-cv-muted')}>{t.lastMessage}</p>
                      {t.unread && <span className="h-2 w-2 rounded-full bg-cv-red shrink-0" />}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Conversation detail */}
        <Card className="cv-card flex flex-col overflow-hidden">
          {active ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-cv-line">
                <Avatar name={active.partnerName} color={active.partnerAvatarColor} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-cv-ink">{active.partnerName}</p>
                  <p className="text-xs text-cv-muted">{active.messages.length} messages · Last {fmtDateLong(active.lastMessageDate)}</p>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-cv-cream/40">
                {active.messages.map((m) => {
                  const isPartner = m.sender === 'PARTNER';
                  return (
                    <div key={m.id} className={cn('flex gap-2.5', isPartner ? 'justify-end' : 'justify-start')}>
                      {!isPartner && <Avatar name="CV" color="#18191D" size={28} />}
                      <div className={cn('max-w-[75%]', isPartner && 'flex flex-col items-end')}>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-sm',
                            isPartner
                              ? 'bg-cv-ink text-white rounded-tr-sm'
                              : 'bg-white border border-cv-line text-cv-body rounded-tl-sm'
                          )}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-cv-muted mt-1 px-1">{m.senderName} · {fmtDate(m.date)}</span>
                      </div>
                      {isPartner && <Avatar name={active.partnerName} color={active.partnerAvatarColor} size={28} />}
                    </div>
                  );
                })}
              </div>

              {/* Reply input */}
              <div className="p-4 border-t border-cv-line">
                <div className="flex items-center gap-2">
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    placeholder="Type your reply..."
                    className="cv-input h-11"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="cv-btn-primary cv-btn-sm rounded-full h-11 w-11 p-0 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Select a conversation"
              description="Choose a conversation from the list to view messages."
            />
          )}
        </Card>

        {/* Partner details panel */}
        <Card className="cv-card flex flex-col overflow-hidden hidden lg:flex">
          {activePartner ? (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="p-5 border-b border-cv-line">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={activePartner.name} color={activePartner.avatarColor} size={48} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-cv-ink">{activePartner.name}</p>
                    <p className="text-xs text-cv-muted">{activePartner.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={activePartner.status.toLowerCase() as 'active' | 'pending' | 'suspended'} label={activePartner.status.charAt(0) + activePartner.status.slice(1).toLowerCase()} />
                  <span className="text-xs font-bold text-cv-muted">{activePartner.type}</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <DetailRow label="Partner Type" value={activePartner.type} />
                <DetailRow label="Joined" value={fmtDateLong(activePartner.joinedDate)} />
                <DetailRow label="Last Active" value={fmtDateLong(activePartner.lastActive)} />
                <DetailRow label="Storefront" value={activePartner.storefrontName} />
                {activeStorefront && (
                  <DetailRow label="Storefront Status" value={activeStorefront.status} />
                )}
              </div>

              <div className="p-5 border-t border-cv-line">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-3">Performance</p>
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="Conversions" value={activePartner.conversions} />
                  <MiniStat label="Revenue" value={fmtMoney(activePartner.revenue)} />
                  <MiniStat label="Commission" value={fmtMoney(activePartner.commission)} />
                  <MiniStat label="Visitors" value={activeStorefront?.visitors ?? 0} />
                </div>
              </div>
            </div>
          ) : (
            <EmptyState icon={MessageCircle} title="No partner selected" description="Select a conversation to see partner details." />
          )}
        </Card>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1 border-b border-cv-line last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-cv-muted shrink-0">{label}</span>
      <span className="text-sm font-bold text-cv-ink text-right truncate">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-cv-soft p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-cv-muted">{label}</p>
      <p className="text-base font-bold text-cv-ink mt-0.5">{value}</p>
    </div>
  );
}
