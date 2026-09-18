'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Avatar } from '@/components/shared/StatusBadge';
import {
  LayoutDashboard,
  Store,
  ArrowLeftRight,
  Percent,
  Wallet,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  ChevronsUpDown,
  Lock,
  Users,
  Plug,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PartnerNotifications } from '@/components/shared/PartnerNotifications';
import { cn } from '@/lib/utils';
import { loadWhiteLabelConfig, isWhiteLabelEligible, type WhiteLabelConfig } from '@/lib/white-label-persistence';

const baseNavItems = [
  { title: 'Overview', url: '/partner', icon: LayoutDashboard },
  { title: 'Store', url: '/partner/store', icon: Store },
  { title: 'Storefronts', url: '/partner/storefronts', icon: Store },
  { title: 'Team', url: '/partner/team', icon: Users },
  { title: 'Conversions', url: '/partner/conversions', icon: ArrowLeftRight },
  { title: 'Commissions', url: '/partner/commissions', icon: Percent },
  { title: 'Payouts', url: '/partner/payouts', icon: Wallet },
  { title: 'Integrations', url: '/partner/integrations', icon: Plug },
];

const bottomNavItems = [
  { title: 'Marketing', url: '/partner/resources', icon: BookOpen },
  { title: 'Messages', url: '/partner/messages', icon: MessageSquare },
  { title: 'Settings', url: '/partner/settings', icon: Settings },
];

function useWhiteLabel() {
  const { user } = useMockAuth();
  const [wlConfig, setWlConfig] = React.useState<WhiteLabelConfig | null>(null);

  React.useEffect(() => {
    if (user?.id && user.partnerType === 'BUSINESS') {
      const cfg = loadWhiteLabelConfig(user.id);
      if (isWhiteLabelEligible(user.partnerType) && cfg.status !== 'DISABLED') {
        setWlConfig(cfg);
      } else {
        setWlConfig(null);
      }
    } else {
      setWlConfig(null);
    }
  }, [user]);

  return wlConfig;
}

function PartnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, hasStorefrontAccess } = useMockAuth();
  const wlConfig = useWhiteLabel();

  const isActive = (url: string) => {
    if (url === '/partner') return pathname === '/partner';
    // Exact match for /partner/store to avoid matching /partner/storefronts or /partner/storefront-application
    if (url === '/partner/store') return pathname === '/partner/store';
    return pathname.startsWith(url);
  };

  const storeLocked = user?.partnerType === 'CREATOR' && !hasStorefrontAccess();
  const isBusiness = user?.partnerType === 'BUSINESS';

  const navItems = baseNavItems
    .filter((item) => {
      // Business/Agency partners use the multi-storefront workspace instead of the single store builder
      if (isBusiness && item.title === 'Store') return false;
      if (!isBusiness && item.title === 'Storefronts') return false;
      if (!isBusiness && item.title === 'Team') return false;
      return true;
    })
    .map((item) => {
      if (item.title === 'Store' && storeLocked) {
        return { ...item, locked: true as const };
      }
      return item;
    });

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-cv-line h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[72px] border-b border-cv-line">
        {wlConfig?.logoUrl ? (
          <img src={wlConfig.logoUrl} alt={wlConfig.platformName} className="h-7 w-auto max-w-[140px] object-contain" />
        ) : (
          <CareverseMark size={28} />
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-cv-ink" style={wlConfig ? { fontFamily: wlConfig.headingFont } : undefined}>
            {wlConfig?.platformName || 'Careverse'}
          </span>
          <span className="text-[10px] font-bold text-cv-muted uppercase tracking-wider">
            {wlConfig ? 'Partner Platform' : 'Partners'}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const locked = 'locked' in item && item.locked;
          return (
            <button
              key={item.title}
              onClick={() => {
                if (locked) {
                  router.push('/partner/storefront-application');
                  return;
                }
                router.push(item.url);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                isActive(item.url)
                  ? 'bg-cv-ink text-white'
                  : 'text-cv-body hover:bg-cv-soft hover:text-cv-ink',
                locked && 'opacity-50 text-cv-muted hover:opacity-70'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
              {locked && <Lock className="h-3 w-3 ml-auto text-cv-muted" />}
            </button>
          );
        })}

        <div className="pt-3 mt-3 border-t border-cv-line space-y-1">
          {bottomNavItems.map((item) => (
            <button
              key={item.title}
              onClick={() => router.push(item.url)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all',
                isActive(item.url)
                  ? 'bg-cv-ink text-white'
                  : 'text-cv-body hover:bg-cv-soft hover:text-cv-ink'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
            </button>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-cv-line p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-cv-soft transition-colors">
              <Avatar name={user?.name || 'User'} color={user?.partnerType === 'BUSINESS' ? '#18191D' : '#0B9B6B'} size={32} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-cv-ink truncate">{user?.name}</p>
                <p className="text-xs text-cv-muted truncate">{user?.partnerType}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-cv-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end" sideOffset={8}>
            <DropdownMenuItem onClick={() => router.push('/partner/settings')} className="font-bold">
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); router.push('/login'); }} className="text-cv-red">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hasStorefrontAccess } = useMockAuth();
  const storeLocked = user?.partnerType === 'CREATOR' && !hasStorefrontAccess();
  const isBusiness = user?.partnerType === 'BUSINESS';
  const wlConfig = useWhiteLabel();
  const navItems = [...baseNavItems, ...bottomNavItems]
    .filter((item) => {
      if (isBusiness && item.title === 'Store') return false;
      if (!isBusiness && item.title === 'Storefronts') return false;
      if (!isBusiness && item.title === 'Team') return false;
      return true;
    })
    .map((item) => {
      if (item.title === 'Store' && storeLocked) {
        return { ...item, locked: true as const };
      }
      return item;
    });

  const isActive = (url: string) => {
    if (url === '/partner') return pathname === '/partner';
    if (url === '/partner/store') return pathname === '/partner/store';
    return pathname.startsWith(url);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cv-line z-50">
      <div className="flex overflow-x-auto px-2 py-2 gap-1 no-scrollbar">
        {navItems.map((item) => {
          const locked = 'locked' in item && item.locked;
          return (
            <button
              key={item.title}
              onClick={() => {
                if (locked) {
                  router.push('/partner/storefront-application');
                  return;
                }
                router.push(item.url);
              }}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-colors relative',
                isActive(item.url) ? 'text-cv-ink' : 'text-cv-muted',
                locked && 'opacity-40'
              )}
            >
              <item.icon className="h-4 w-4" />
              {locked && <Lock className="h-2 w-2 absolute top-0 right-1 text-cv-muted" />}
              {item.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useMockAuth();
  const router = useRouter();
  const wlConfig = useWhiteLabel();

  const shouldRedirect = !loading && (!user || user.role !== 'PARTNER');

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/login');
    }
  }, [shouldRedirect, router]);

  if (loading || shouldRedirect) {
    return (
      <div className="cv-page flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto h-10 w-10">
            <div className="absolute inset-0 rounded-full border-4 border-cv-line" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cv-ink" />
          </div>
          <p className="mt-4 text-sm text-cv-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Show status-based notices
  const showPendingNotice = user.status === 'PENDING_ACTIVATION';
  const showSuspendedNotice = user.status === 'SUSPENDED';

  return (
    <div className="flex cv-page">
      <PartnerSidebar />
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between px-5 lg:px-8 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
          <div className="lg:hidden flex items-center gap-2">
            {wlConfig?.logoUrl ? (
              <img src={wlConfig.logoUrl} alt={wlConfig.platformName} className="h-6 w-auto max-w-[120px] object-contain" />
            ) : (
              <CareverseMark size={24} />
            )}
            <span className="text-sm font-extrabold text-cv-ink" style={wlConfig ? { fontFamily: wlConfig.headingFont } : undefined}>
              {wlConfig?.platformName || 'Careverse'}
            </span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm text-cv-muted">
              {user.status === 'ACTIVE' ? 'Welcome back' : `Account ${user.status.toLowerCase()}:`}{' '}
              <span className="font-bold text-cv-ink">{user.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PartnerNotifications />
          </div>
        </header>

        {/* Status notices */}
        {showPendingNotice && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 lg:px-8 py-3">
            <p className="text-sm font-bold text-amber-700">
              Your application has been accepted. Please activate your account to access all features.
            </p>
          </div>
        )}
        {showSuspendedNotice && (
          <div className="bg-red-50 border-b border-red-200 px-5 lg:px-8 py-3">
            <p className="text-sm font-bold text-red-700">
              Your account has been suspended. Please contact info@careverse.ai for assistance.
            </p>
          </div>
        )}

        {/* Main content */}
        <main className="p-5 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
