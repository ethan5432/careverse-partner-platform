'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Lock,
  Store,
  Bell,
  Wallet,
  Check,
  Palette,
  Globe,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import {
  mockPartnerProfile,
  mockStorefrontSettings,
  mockNotificationSettings,
  mockPayoutSetup,
} from '@/data/mock';
import type {
  PayoutSetupMethod,
  PayoutSetupStatus,
  MockPayoutSetup,
  MockNotificationSettings,
} from '@/data/mock/types';
import { useMockAuth } from '@/hooks/useMockAuth';
import { SupportLink } from '@/components/shared/SupportLink';
import { cn } from '@/lib/utils';
import {
  loadWhiteLabelConfig,
  saveWhiteLabelConfig,
  loadWhiteLabelAdminConfig,
  isWhiteLabelEligible,
  WL_FONT_OPTIONS,
  type WhiteLabelConfig,
} from '@/lib/white-label-persistence';

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
}

function Field({ id, label, value, onChange, readOnly, type = 'text', placeholder }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-cv-muted">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
        className={cn('cv-input', readOnly && 'bg-cv-soft text-cv-muted cursor-not-allowed')}
      />
    </div>
  );
}

function FormActions({ saved }: { saved: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Button
        type="submit"
        className="rounded-full bg-cv-ink text-white font-bold hover:opacity-90"
      >
        Save changes
      </Button>
      {saved && (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cv-good">
          <Check className="h-3.5 w-3.5" />
          Saved
        </span>
      )}
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="cv-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft">
            <Icon className="h-5 w-5 text-cv-ink" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-cv-ink">{title}</CardTitle>
            <p className="text-xs text-cv-muted mt-0.5">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// Map payout status to the StatusBadge variants supported by the shared badge.
const payoutStatusToBadge: Record<PayoutSetupStatus, 'connected' | 'none' | 'processing'> = {
  connected: 'connected',
  none: 'none',
  processing: 'processing',
};

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-cv-muted">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded-lg border border-cv-line cursor-pointer shrink-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="cv-input font-mono text-xs"
          placeholder="#18191D"
        />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateOnboarding, onboarding } = useMockAuth();

  // Profile
  const [profile, setProfile] = useState(mockPartnerProfile);
  const [profileSaved, setProfileSaved] = useState(false);

  // Account (password)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  // Storefront
  const [storefront, setStorefront] = useState(mockStorefrontSettings);
  const [storefrontSaved, setStorefrontSaved] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<MockNotificationSettings>(mockNotificationSettings);
  const [notifSaved, setNotifSaved] = useState(false);

  // Payout
  const [payout, setPayout] = useState<MockPayoutSetup>(mockPayoutSetup);
  const [payoutSaved, setPayoutSaved] = useState(false);

  // White label
  const [wlConfig, setWlConfig] = useState<WhiteLabelConfig | null>(null);
  const [wlSaved, setWlSaved] = useState(false);
  const [wlEligible, setWlEligible] = useState(false);
  const [wlDomainInput, setWlDomainInput] = useState('');

  React.useEffect(() => {
    if (user?.partnerType === 'BUSINESS' && user.id) {
      const admin = loadWhiteLabelAdminConfig();
      setWlEligible(isWhiteLabelEligible(user.partnerType, admin));
      const cfg = loadWhiteLabelConfig(user.id);
      setWlConfig(cfg);
      setWlDomainInput(cfg.customDomain || '');
    }
  }, [user]);

  const flash = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    flash(setProfileSaved);
    if (!onboarding.profileComplete) updateOnboarding({ profileComplete: true });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (passwords.next.length > 0 && passwords.next.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwError('New password and confirmation do not match.');
      return;
    }
    setPasswords({ current: '', next: '', confirm: '' });
    flash(setPwSaved);
  };

  const handleSaveStorefront = (e: React.FormEvent) => {
    e.preventDefault();
    flash(setStorefrontSaved);
  };

  const handleSaveNotifications = () => {
    flash(setNotifSaved);
  };

  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    flash(setPayoutSaved);
    if (!onboarding.payoutsSetup) updateOnboarding({ payoutsSetup: true });
  };

  const handleSaveWhiteLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlConfig) return;
    const domainChanged = wlDomainInput !== wlConfig.customDomain;
    const updated = {
      ...wlConfig,
      customDomain: wlDomainInput,
      domainStatus: domainChanged
        ? wlDomainInput ? ('PENDING' as const) : ('NONE' as const)
        : wlConfig.domainStatus,
    };
    setWlConfig(updated);
    saveWhiteLabelConfig(updated);
    flash(setWlSaved);
  };

  const notificationItems: { key: keyof MockNotificationSettings; label: string; description: string }[] = [
    { key: 'commissionApproved', label: 'Commission approved', description: 'When a conversion commission is approved.' },
    { key: 'payoutSent', label: 'Payout sent', description: 'When a payout is transferred to your account.' },
    { key: 'newConversion', label: 'New conversion', description: 'When a new conversion is tracked on your storefront.' },
    { key: 'partnerNewsletter', label: 'Partner newsletter', description: 'Monthly tips, product news, and partner highlights.' },
    { key: 'productUpdates', label: 'Product updates', description: 'When Careverse launches new features or plans.' },
    { key: 'accountAlerts', label: 'Account alerts', description: 'Security and account status notifications.' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="Manage your profile, account, storefront, notifications, and payouts."
      />

      <Tabs defaultValue="profile">
        <TabsList className="bg-cv-soft h-auto p-1 rounded-xl flex flex-wrap">
          <TabsTrigger
            value="profile"
            className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="storefront"
            className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted"
          >
            Storefront
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="payout"
            className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted"
          >
            Payout Setup
          </TabsTrigger>
          {wlEligible && (
            <TabsTrigger
              value="whitelabel"
              className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted"
            >
              White Label
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6">
          <form onSubmit={handleSaveProfile}>
            <SectionCard
              icon={User}
              title="Profile"
              description="Your personal identity as a partner. This is separate from your storefront name — changing your name here will not change your store name."
            >
              <div className="flex items-center gap-4">
                <Avatar
                  name={profile.name}
                  color={user?.partnerType === 'BUSINESS' ? '#18191D' : '#0B9B6B'}
                  size={56}
                />
                <div>
                  <p className="text-sm font-bold text-cv-ink">{profile.name}</p>
                  <p className="text-xs text-cv-muted">{user?.partnerType}</p>
                </div>
              </div>

              <Field
                id="profile-name"
                label="Name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Field
                id="profile-email"
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <div className="space-y-1.5">
                <Label htmlFor="profile-bio" className="text-xs font-bold uppercase tracking-wider text-cv-muted">
                  Bio
                </Label>
                <textarea
                  id="profile-bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="cv-input w-full resize-none py-3 px-4"
                  placeholder="Tell customers and Careverse about yourself."
                />
              </div>

              <FormActions saved={profileSaved} />
            </SectionCard>
          </form>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="mt-6">
          <form onSubmit={handleSavePassword}>
            <SectionCard
              icon={Lock}
              title="Account"
              description="Change the password you use to sign in to your partner account."
            >
              <Field
                id="pw-current"
                label="Current password"
                type="password"
                value={passwords.current}
                placeholder="Enter your current password"
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
              <Field
                id="pw-new"
                label="New password"
                type="password"
                value={passwords.next}
                placeholder="At least 8 characters"
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              />
              <Field
                id="pw-confirm"
                label="Confirm new password"
                type="password"
                value={passwords.confirm}
                placeholder="Re-enter your new password"
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />

              {pwError && <p className="text-xs font-bold text-cv-red">{pwError}</p>}

              <FormActions saved={pwSaved} />
            </SectionCard>
          </form>
        </TabsContent>

        {/* Storefront */}
        <TabsContent value="storefront" className="mt-6">
          <form onSubmit={handleSaveStorefront}>
            <SectionCard
              icon={Store}
              title="Storefront"
              description="Your public store name that customers see. This is separate from your personal profile name."
            >
              <Field
                id="storefront-name"
                label="Storefront name"
                value={storefront.name}
                onChange={(e) => setStorefront({ ...storefront, name: e.target.value })}
              />
              <Field id="storefront-url" label="Storefront URL" value={storefront.url} readOnly />
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</Label>
                <div className="flex items-center gap-2">
                  <StatusBadge status={storefront.status === 'LIVE' ? 'live' : 'draft'} />
                  <span className="text-xs text-cv-muted">
                    {storefront.status === 'LIVE'
                      ? 'Your storefront is live and accepting conversions.'
                      : 'Your storefront is not yet published.'}
                  </span>
                </div>
              </div>

              <FormActions saved={storefrontSaved} />
            </SectionCard>
          </form>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <SectionCard
            icon={Bell}
            title="Notifications"
            description="Choose which email notifications you receive from Careverse."
          >
            <ul className="space-y-1">
              {notificationItems.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3 border-b border-cv-line last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-cv-ink">{item.label}</p>
                    <p className="text-xs text-cv-muted mt-0.5">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                    }
                    aria-label={item.label}
                  />
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                onClick={handleSaveNotifications}
                className="rounded-full bg-cv-ink text-white font-bold hover:opacity-90"
              >
                Save changes
              </Button>
              {notifSaved && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cv-good">
                  <Check className="h-3.5 w-3.5" />
                  Saved
                </span>
              )}
            </div>
          </SectionCard>
        </TabsContent>

        {/* Payout Setup */}
        <TabsContent value="payout" className="mt-6">
          <form onSubmit={handleSavePayout}>
            <SectionCard
              icon={Wallet}
              title="Payout Setup"
              description="Choose how you receive your commission payouts."
            >
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Payout method</Label>
                <Select
                  value={payout.method}
                  onValueChange={(value: PayoutSetupMethod) => setPayout({ ...payout, method: value })}
                >
                  <SelectTrigger className="cv-input h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="PAYPAL">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-cv-line bg-cv-soft/60 px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Status</span>
                <StatusBadge status={payoutStatusToBadge[payout.status]} />
              </div>

              {payout.method === 'BANK_TRANSFER' ? (
                <>
                  <Field
                    id="payout-bank-name"
                    label="Bank name"
                    value={payout.bankName ?? ''}
                    onChange={(e) => setPayout({ ...payout, bankName: e.target.value })}
                    placeholder="First National Bank"
                  />
                  <Field
                    id="payout-account-name"
                    label="Name on account"
                    value={payout.accountLast4 ?? ''}
                    onChange={(e) => setPayout({ ...payout, accountLast4: e.target.value })}
                    placeholder="Name on the account"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id="payout-account-last4"
                      label="Account (last 4)"
                      value={payout.accountLast4 ?? ''}
                      onChange={(e) => setPayout({ ...payout, accountLast4: e.target.value })}
                      placeholder="4821"
                    />
                    <Field
                      id="payout-routing-number"
                      label="Routing number"
                      value={payout.routingNumber ?? ''}
                      onChange={(e) => setPayout({ ...payout, routingNumber: e.target.value })}
                      placeholder="021000021"
                    />
                  </div>
                </>
              ) : (
                <Field
                  id="payout-paypal-email"
                  label="PayPal email"
                  type="email"
                  value={payout.paypalEmail ?? ''}
                  onChange={(e) => setPayout({ ...payout, paypalEmail: e.target.value })}
                  placeholder="you@example.com"
                />
              )}

              <FormActions saved={payoutSaved} />
            </SectionCard>
          </form>
        </TabsContent>

        {/* White Label */}
        {wlEligible && wlConfig && (
          <TabsContent value="whitelabel" className="mt-6 space-y-6">
            <form onSubmit={handleSaveWhiteLabel} className="space-y-6">
              {/* Branding */}
              <SectionCard
                icon={Palette}
                title="Platform Branding"
                description="Customize how the partner platform looks for your team. These settings apply across the partner dashboard, login screens, and communications."
              >
                <Field
                  id="wl-platform-name"
                  label="Platform Name"
                  value={wlConfig.platformName}
                  onChange={(e) => setWlConfig({ ...wlConfig, platformName: e.target.value })}
                  placeholder="Your branded platform name"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Logo URL</Label>
                    <Input
                      value={wlConfig.logoUrl}
                      onChange={(e) => setWlConfig({ ...wlConfig, logoUrl: e.target.value })}
                      className="cv-input"
                      placeholder="https://yourbrand.com/logo.png"
                    />
                    <p className="text-[10px] text-cv-muted">Recommended: 200x40px, PNG or SVG with transparent background.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Favicon URL</Label>
                    <Input
                      value={wlConfig.faviconUrl}
                      onChange={(e) => setWlConfig({ ...wlConfig, faviconUrl: e.target.value })}
                      className="cv-input"
                      placeholder="https://yourbrand.com/favicon.ico"
                    />
                    <p className="text-[10px] text-cv-muted">Recommended: 32x32px ICO or PNG.</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <ColorField id="wl-primary" label="Primary Color" value={wlConfig.primaryColor} onChange={(v) => setWlConfig({ ...wlConfig, primaryColor: v })} />
                  <ColorField id="wl-secondary" label="Secondary Color" value={wlConfig.secondaryColor} onChange={(v) => setWlConfig({ ...wlConfig, secondaryColor: v })} />
                  <ColorField id="wl-accent" label="Accent Color" value={wlConfig.accentColor} onChange={(v) => setWlConfig({ ...wlConfig, accentColor: v })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Heading Font</Label>
                    <Select value={wlConfig.headingFont} onValueChange={(v) => setWlConfig({ ...wlConfig, headingFont: v })}>
                      <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {WL_FONT_OPTIONS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Body Font</Label>
                    <Select value={wlConfig.bodyFont} onValueChange={(v) => setWlConfig({ ...wlConfig, bodyFont: v })}>
                      <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {WL_FONT_OPTIONS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <FormActions saved={wlSaved} />
              </SectionCard>

              {/* Custom Domain */}
              <SectionCard
                icon={Globe}
                title="Custom Domain"
                description="Serve your white-labeled partner platform on your own domain. Your domain must be approved by Careverse admin."
              >
                <Field
                  id="wl-domain"
                  label="Custom Domain"
                  value={wlDomainInput}
                  onChange={(e) => setWlDomainInput(e.target.value)}
                  placeholder="partners.yourbrand.com"
                />
                <div className="flex items-center gap-2 rounded-xl border border-cv-line bg-cv-soft/60 px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cv-muted">Domain Status</span>
                  <StatusBadge
                    status={
                      wlConfig.domainStatus === 'CONNECTED' ? 'connected' :
                      wlConfig.domainStatus === 'PENDING' ? 'processing' : 'none'
                    }
                  />
                </div>
                <p className="text-[10px] text-cv-muted">
                  Your domain must be verified and approved by Careverse before it goes live. DNS configuration instructions will be provided after submission.
                </p>
              </SectionCard>

              {/* Login / Auth Screens */}
              <SectionCard
                icon={Lock}
                title="Login & Authentication Screens"
                description="Customize the login experience your team sees when signing in to the partner platform."
              >
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Login Logo URL</Label>
                  <Input
                    value={wlConfig.loginLogoUrl}
                    onChange={(e) => setWlConfig({ ...wlConfig, loginLogoUrl: e.target.value })}
                    className="cv-input"
                    placeholder="https://yourbrand.com/login-logo.png"
                  />
                  <p className="text-[10px] text-cv-muted">If empty, your main logo will be used on the login screen.</p>
                </div>
                <Field
                  id="wl-login-headline"
                  label="Login Headline"
                  value={wlConfig.loginHeadline}
                  onChange={(e) => setWlConfig({ ...wlConfig, loginHeadline: e.target.value })}
                  placeholder="Welcome back"
                />
                <Field
                  id="wl-login-subtext"
                  label="Login Subtext"
                  value={wlConfig.loginSubtext}
                  onChange={(e) => setWlConfig({ ...wlConfig, loginSubtext: e.target.value })}
                  placeholder="Sign in to your partner dashboard"
                />
                <ColorField id="wl-login-bg" label="Login Background Color" value={wlConfig.loginBackgroundColor} onChange={(v) => setWlConfig({ ...wlConfig, loginBackgroundColor: v })} />
              </SectionCard>

              {/* Email Branding */}
              <SectionCard
                icon={Mail}
                title="Email & Communications Branding"
                description="Customize how partner-facing emails and communications appear to your team."
              >
                <Field
                  id="wl-email-from"
                  label="Email From Name"
                  value={wlConfig.emailFromName}
                  onChange={(e) => setWlConfig({ ...wlConfig, emailFromName: e.target.value })}
                  placeholder="Your Brand Team"
                />
                <ColorField id="wl-email-header" label="Email Header Color" value={wlConfig.emailHeaderColor} onChange={(v) => setWlConfig({ ...wlConfig, emailHeaderColor: v })} />
                <div className="flex items-center justify-between gap-4 py-2 border-b border-cv-line">
                  <div>
                    <p className="text-sm font-bold text-cv-ink">Show logo in email header</p>
                    <p className="text-xs text-cv-muted mt-0.5">Display your logo at the top of partner notification emails.</p>
                  </div>
                  <Switch
                    checked={wlConfig.emailShowLogo}
                    onCheckedChange={(v) => setWlConfig({ ...wlConfig, emailShowLogo: v })}
                  />
                </div>
                <Field
                  id="wl-comm-sender"
                  label="Communication Sender Name"
                  value={wlConfig.communicationSenderName}
                  onChange={(e) => setWlConfig({ ...wlConfig, communicationSenderName: e.target.value })}
                  placeholder="Your Brand Team"
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-cv-muted">Communication Footer Text (optional)</Label>
                  <textarea
                    value={wlConfig.communicationFooterText}
                    onChange={(e) => setWlConfig({ ...wlConfig, communicationFooterText: e.target.value })}
                    rows={3}
                    className="cv-input w-full resize-none py-3 px-4"
                    placeholder="Your custom footer message for partner communications."
                  />
                </div>
              </SectionCard>

              {/* Required Disclosures - read only */}
              <Card className="cv-card border-amber-200 bg-amber-50/40">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                      <Lock className="h-4 w-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cv-ink">Required Careverse Disclosures</p>
                      <p className="text-xs text-cv-muted mt-1 leading-relaxed">
                        The following items are required by Careverse and cannot be removed or modified:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2 text-xs text-cv-body">
                          <Check className="h-3.5 w-3.5 text-cv-good" />
                          Careverse product and benefit information
                        </li>
                        <li className="flex items-center gap-2 text-xs text-cv-body">
                          <Check className="h-3.5 w-3.5 text-cv-good" />
                          Legal disclosures and cancellation policies
                        </li>
                        <li className="flex items-center gap-2 text-xs text-cv-body">
                          <Check className="h-3.5 w-3.5 text-cv-good" />
                          &quot;This is not insurance&quot; disclaimers
                        </li>
                        <li className="flex items-center gap-2 text-xs text-cv-body">
                          <Check className="h-3.5 w-3.5 text-cv-good" />
                          Powered by Careverse attribution (where required by your plan)
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
        )}
      </Tabs>

      <SupportLink variant="card" context="Questions about your account, settings, or payouts? Message us anytime." />
    </div>
  );
}
