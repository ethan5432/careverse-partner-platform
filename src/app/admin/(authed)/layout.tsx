'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMockAuth } from '@/hooks/useMockAuth';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Avatar } from '@/components/shared/StatusBadge';
import { LayoutDashboard, Users, Store, ArrowLeftRight, Percent, Wallet, Package, MessageSquare, Mail, ChartBar as BarChart3, Settings, LogOut, ChevronsUpDown, Bell, Layers } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Partners', url: '/admin/partners', icon: Users },
  { title: 'Storefronts', url: '/admin/storefronts', icon: Store },
  { title: 'Conversions', url: '/admin/conversions', icon: ArrowLeftRight },
  { title: 'Commissions', url: '/admin/commissions', icon: Percent },
  { title: 'Payouts', url: '/admin/payouts', icon: Wallet },
  { title: 'Products', url: '/admin/products', icon: Package },
  { title: 'Resources', url: '/admin/resources', icon: Layers },
  { title: 'Messages', url: '/admin/messages', icon: MessageSquare },
  { title: 'Emails', url: '/admin/emails', icon: Mail },
  { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useMockAuth();

  const isActive = (url: string) => {
    if (url === '/admin') return pathname === '/admin' || pathname === '/admin/';
    return pathname.startsWith(url);
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-cv-line h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-[72px] border-b border-cv-line">
        <CareverseMark size={28} />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-cv-ink">Careverse</span>
          <span className="text-[10px] font-bold text-cv-muted uppercase tracking-wider">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {adminNavItems.map((item) => (
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
      </nav>

      {/* User */}
      <div className="border-t border-cv-line p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-cv-soft transition-colors">
              <Avatar name={user?.name || 'Admin'} color="#18191D" size={32} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-cv-ink truncate">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-cv-muted truncate">Administrator</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-cv-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end" sideOffset={8}>
            <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); router.push('/admin/login'); }} className="text-cv-red">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

function MobileAdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (url: string) => {
    if (url === '/admin') return pathname === '/admin' || pathname === '/admin/';
    return pathname.startsWith(url);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cv-line z-50">
      <div className="flex overflow-x-auto px-2 py-2 gap-1 no-scrollbar">
        {adminNavItems.map((item) => (
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

export default function AuthedAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useMockAuth();
  const router = useRouter();

  const shouldRedirect = !loading && (!user || user.role !== 'ADMIN');

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/admin/login');
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
          <p className="mt-4 text-sm text-cv-muted">Loading admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex cv-page">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between px-5 lg:px-8 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
          <div className="lg:hidden flex items-center gap-2">
            <CareverseMark size={24} />
            <span className="text-sm font-extrabold text-cv-ink">Admin</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm text-cv-muted">
              Careverse Admin Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin/messages" className="relative rounded-full p-2 hover:bg-cv-soft transition-colors" title="Notifications">
              <Bell className="h-4 w-4 text-cv-body" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cv-red text-[10px] text-white font-bold">
                3
              </span>
            </a>
          </div>
        </header>

        <main className="p-5 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileAdminNav />
    </div>
  );
}
