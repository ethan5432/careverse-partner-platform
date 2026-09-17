'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMockAuth } from '@/hooks/useMockAuth';

export type PartnerNotificationType =
  | 'application_approved'
  | 'account_activated'
  | 'storefront_published'
  | 'new_conversion'
  | 'commission_approved'
  | 'payout_sent'
  | 'payout_failed'
  | 'domain_connected'
  | 'upload_failed';

interface PartnerNotification {
  id: string;
  type: PartnerNotificationType;
  title: string;
  description: string;
  date: string;
  read: boolean;
  link: string;
}

const defaultNotifications: PartnerNotification[] = [
  { id: 'pn-1', type: 'application_approved', title: 'Application approved', description: 'Your Careverse partner application has been approved. Welcome aboard!', date: '2026-09-14', read: false, link: '/partner' },
  { id: 'pn-2', type: 'account_activated', title: 'Account activated', description: 'Your account is now active. Start setting up your storefront.', date: '2026-09-14', read: false, link: '/partner' },
  { id: 'pn-3', type: 'new_conversion', title: 'New conversion', description: 'You earned a commission from a Family Plus sale.', date: '2026-09-16', read: false, link: '/partner/conversions' },
  { id: 'pn-4', type: 'commission_approved', title: 'Commission approved', description: 'Your $17.80 commission for Family Plus has been approved.', date: '2026-09-15', read: true, link: '/partner/commissions' },
];

const dotColor: Record<PartnerNotificationType, string> = {
  application_approved: 'bg-emerald-500',
  account_activated: 'bg-emerald-500',
  storefront_published: 'bg-blue-500',
  new_conversion: 'bg-cv-ink',
  commission_approved: 'bg-emerald-500',
  payout_sent: 'bg-emerald-500',
  payout_failed: 'bg-cv-red',
  domain_connected: 'bg-blue-500',
  upload_failed: 'bg-cv-red',
};

const formatDate = (d: string) => {
  const date = new Date(d);
  const now = new Date('2026-09-17');
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function PartnerNotifications() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<PartnerNotification[]>(defaultNotifications);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = (n: PartnerNotification) => {
    markRead(n.id);
    setOpen(false);
    router.push(n.link);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-cv-soft transition-colors"
      >
        <Bell className="h-4 w-4 text-cv-body" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cv-red text-[10px] text-white font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-cv-line shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-cv-line">
              <p className="text-sm font-bold text-cv-ink">Notifications</p>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-bold text-cv-muted hover:text-cv-ink transition-colors flex items-center gap-1">
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-cv-muted hover:text-cv-ink transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="h-6 w-6 text-cv-muted mx-auto mb-2" />
                  <p className="text-sm text-cv-muted">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={cn(
                      'w-full flex gap-3 px-4 py-3 text-left border-b border-cv-line last:border-0 transition-colors hover:bg-cv-soft/50',
                      !n.read && 'bg-blue-50/40'
                    )}
                  >
                    <div className={cn('h-2 w-2 rounded-full mt-1.5 shrink-0', dotColor[n.type])} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-cv-ink truncate">{n.title}</p>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-cv-muted mt-0.5 line-clamp-2">{n.description}</p>
                      <p className="text-[10px] text-cv-muted mt-1">{formatDate(n.date)}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
