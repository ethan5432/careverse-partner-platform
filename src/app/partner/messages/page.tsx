'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Avatar } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Search, Plus, ArrowLeft } from 'lucide-react';
import { mockConversations } from '@/data/mock';
import type { MockConversation, MockMessage } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const fmtDate = (d: string) => {
  const date = new Date(d);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function MessagesPage() {
  const conversations: MockConversation[] = mockConversations;
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  // Local copy so replies are reflected in the UI.
  const [localConvs, setLocalConvs] = useState<MockConversation[]>(conversations);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = localConvs.find((c) => c.id === activeId) ?? null;

  const filtered = localConvs.filter(
    (c) =>
      c.partnerName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const unreadTotal = localConvs.filter((c) => c.unread).length;

  // Scroll the chat to the bottom whenever the active conversation changes.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, active?.messages.length]);

  const openConversation = (id: string) => {
    setActiveId(id);
    setShowListOnMobile(false);
    // Mark as read.
    setLocalConvs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !active) return;

    const now = new Date();
    const time = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const newMessage: MockMessage = {
      id: `m-${Date.now()}`,
      conversationId: active.id,
      sender: 'PARTNER',
      senderName: 'You',
      text: draft.trim(),
      date: now.toISOString().slice(0, 10),
    };

    setLocalConvs((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: newMessage.text,
              lastMessageDate: now.toISOString().slice(0, 10),
            }
          : c
      )
    );
    setDraft('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Messages"
        title="Messages"
        description="Chat with the Careverse team about payouts, onboarding, and partnerships."
        actions={
          <Button
            className="rounded-full bg-cv-ink text-white font-bold hover:opacity-90"
            onClick={() => {
              // Start a fresh conversation with the support team.
              const support = localConvs.find((c) => c.id === 'conv-1');
              if (support) openConversation(support.id);
              setDraft('');
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New message to Careverse
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 lg:gap-6 h-[calc(100vh-260px)] min-h-[520px]">
        {/* Conversation list */}
        <Card className={cn('cv-card flex flex-col overflow-hidden', !showListOnMobile && 'hidden lg:flex')}>
          <div className="p-3 border-b border-cv-line">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
              <Input
                placeholder="Search messages"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="cv-input pl-9 h-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No conversations"
                description="Messages from the Careverse team will appear here."
                className="py-12"
              />
            ) : (
              <ul className="divide-y divide-cv-line">
                {filtered.map((c) => {
                  const isActive = c.id === activeId;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => openConversation(c.id)}
                        className={cn(
                          'w-full flex items-start gap-3 px-3 py-3 text-left transition-colors',
                          isActive ? 'bg-cv-soft' : 'hover:bg-cv-soft/60'
                        )}
                      >
                        <Avatar name={c.partnerName} color={c.partnerAvatarColor} size={40} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-bold text-cv-ink truncate">{c.partnerName}</p>
                            <span className="text-[10px] text-cv-muted shrink-0">{fmtDate(c.lastMessageDate)}</span>
                          </div>
                          <p className="text-xs text-cv-muted truncate mt-0.5">{c.lastMessage}</p>
                        </div>
                        {c.unread && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cv-red text-[10px] font-bold text-white shrink-0">
                            •
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {unreadTotal > 0 && (
            <div className="border-t border-cv-line px-3 py-2">
              <p className="text-[11px] font-bold text-cv-muted">
                {unreadTotal} unread {unreadTotal === 1 ? 'message' : 'messages'}
              </p>
            </div>
          )}
        </Card>

        {/* Conversation detail */}
        <Card className={cn('cv-card flex flex-col overflow-hidden', showListOnMobile && 'hidden lg:flex')}>
          {active ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-cv-line">
                <button
                  className="lg:hidden text-cv-muted hover:text-cv-ink"
                  onClick={() => setShowListOnMobile(true)}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar name={active.partnerName} color={active.partnerAvatarColor} size={40} />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-cv-ink truncate">{active.partnerName}</p>
                  <p className="text-xs text-cv-muted">Careverse Team</p>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-cv-cream/40">
                {active.messages.map((m) => {
                  const isPartner = m.sender === 'PARTNER';
                  return (
                    <div
                      key={m.id}
                      className={cn('flex', isPartner ? 'justify-end' : 'justify-start')}
                    >
                      <div className={cn('max-w-[78%] flex flex-col', isPartner ? 'items-end' : 'items-start')}>
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                            isPartner
                              ? 'bg-cv-ink text-white rounded-br-md'
                              : 'bg-white border border-cv-line text-cv-ink rounded-bl-md'
                          )}
                        >
                          {m.text}
                        </div>
                        <span className="text-[10px] text-cv-muted mt-1 px-1">{fmtDate(m.date)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply input */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-4 py-3 border-t border-cv-line bg-white"
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Write a reply..."
                  className="cv-input flex-1 h-11"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!draft.trim()}
                  className="h-11 w-11 shrink-0 rounded-full bg-cv-ink text-white hover:opacity-90 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a conversation from the list to view messages."
              />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
