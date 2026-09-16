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
  Network,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  ChevronsUpDown,
  Bell,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const baseNavItems = [
  { title: 'Overview', url: '/partner', icon: LayoutDashboard },
  { title: 'Storefront', url: '/storefront', icon: Store },
  { title: 'Conversions', url: '/partner/conversions', icon: ArrowLeftRight },
  { title: 'Commissions', url: '/partner/commissions', icon: Percent },
  { title: 'Payouts', url: '/partner/payouts', icon: Wallet },
];

const networkNavItems = [
  { title: 'Network', url: '/partner/network', icon: Network },
];

const bottomNavItems = [
  { title: 'Resources', url: '/partner/resources', icon: BookOpen },
  { title: 'Messages', url: '/partner/messages', icon: MessageSquare },
  { title: 'Settings', url: '/partner/settings', icon: Settings },
];

function PartnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchPartnerType, switchStatus } = useMockAuth();

  const isNetwork = user?.partnerType === 'NETWORK';

  const isActive = (url: string) => {
    if (url === '/partner') return pathname === '/partner';
    return pathname.startsWith(url);
  };

  const navItems = isNetwork ? [...baseNavItems, ...networkNavItems] : baseNavItems;

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-cv-line h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[72px] border-b border-cv-line">
        <CareverseMark size={28} />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-cv-ink">Careverse</span>
          <span className="text-[10px] font-bold text-cv-muted uppercase tracking-wider">Partners</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
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
              <Avatar name={user?.name || 'User'} color={user?.partnerType === 'NETWORK' ? '#E1062C' : '#0B9B6B'} size={32} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-cv-ink truncate">{user?.name}</p>
                <p className="text-xs text-cv-muted truncate">{user?.partnerType}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-cv-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end" sideOffset={8}>
            <div className="px-2 py-1.5">
              <p className="text-xs font-bold text-cv-muted uppercase tracking-wider">Switch role (mock)</p>
            </div>
            <DropdownMenuItem onClick={() => { switchPartnerType('CREATOR'); router.push('/partner'); }}>
              Creator
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { switchPartnerType('BUSINESS'); router.push('/partner'); }}>
              Business / Agency
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { switchPartnerType('NETWORK'); router.push('/partner'); }}>
              Network
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="text-xs font-bold text-cv-muted uppercase tracking-wider">Switch status (mock)</p>
            </div>
            <DropdownMenuItem onClick={() => switchStatus('ACTIVE')}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchStatus('PENDING')}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchStatus('INCOMPLETE')}>Incomplete</DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchStatus('SUSPENDED')}>Suspended</DropdownMenuItem>
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
  const { user } = useMockAuth();
  const isNetwork = user?.partnerType === 'NETWORK';
  const navItems = isNetwork ? [...baseNavItems, ...networkNavItems, ...bottomNavItems] : [...baseNavItems, ...bottomNavItems];

  const isActive = (url: string) => {
    if (url === '/partner') return pathname === '/partner';
    return pathname.startsWith(url);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cv-line z-50">
      <div className="flex overflow-x-auto px-2 py-2 gap-1 no-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.title}
            onClick={() => router.push(item.url)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-colors',
              isActive(item.url) ? 'text-cv-ink' : 'text-cv-muted'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useMockAuth();
  const router = useRouter();

  if (loading) {
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
  const showPendingNotice = user.status === 'PENDING';
  const showIncompleteNotice = user.status === 'INCOMPLETE';
  const showSuspendedNotice = user.status === 'SUSPENDED';

  return (
    <div className="flex cv-page">
      <PartnerSidebar />
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between px-5 lg:px-8 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
          <div className="lg:hidden flex items-center gap-2">
            <CareverseMark size={24} />
            <span className="text-sm font-extrabold text-cv-ink">Careverse</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm text-cv-muted">
              {user.status === 'ACTIVE' ? 'Welcome back' : 'Account status:'}{' '}
              <span className="font-bold text-cv-ink">{user.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-4 w-4 text-cv-body" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cv-red text-[10px] text-white font-bold">
                2
              </span>
            </Button>
          </div>
        </header>

        {/* Status notices */}
        {showPendingNotice && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 lg:px-8 py-3">
            <p className="text-sm font-bold text-amber-700">
              Your account is pending approval. Some features may be limited until your account is activated.
            </p>
          </div>
        )}
        {showIncompleteNotice && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 lg:px-8 py-3">
            <p className="text-sm font-bold text-amber-700">
              Your onboarding is incomplete. Please complete your profile and storefront setup to start earning.
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
