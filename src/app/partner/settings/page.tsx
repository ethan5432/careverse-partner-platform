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
import { cn } from '@/lib/utils';

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

export default function SettingsPage() {
  const { user } = useMockAuth();

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

  const flash = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    flash(setProfileSaved);
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
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-6">
          <form onSubmit={handleSaveProfile}>
            <SectionCard
              icon={User}
              title="Profile"
              description="Update how your name and bio appear across Careverse."
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
              description="Manage your public storefront name, URL, and live status."
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
                    id="payout-account-last4"
                    label="Account (last 4)"
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
      </Tabs>
    </div>
  );
}
