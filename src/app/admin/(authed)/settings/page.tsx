'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings as SettingsIcon, FileSliders as Sliders, Crosshair, Mail, Plug, Users, Shield, Save, Plus, Trash2, Check, Clock, Lock, Globe, Zap, Store, UserCheck, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Local mock data for settings ──────────────────────────────────
interface CommissionRule {
  id: string; name: string; rate: number; scope: string; status: 'ACTIVE' | 'PAUSED';
}
const initialRules: CommissionRule[] = [
  { id: 'r-1', name: 'Standard', rate: 20, scope: 'All products', status: 'ACTIVE' },
  { id: 'r-2', name: 'Network Bonus', rate: 25, scope: 'Network partners', status: 'ACTIVE' },
  { id: 'r-3', name: 'Creator Boost', rate: 22, scope: 'Creator partners', status: 'ACTIVE' },
  { id: 'r-4', name: 'Care Circle Premium', rate: 18, scope: 'Care Circle plan', status: 'PAUSED' },
];

interface Integration {
  id: string; name: string; description: string; category: string; connected: boolean;
}
const integrations: Integration[] = [
  { id: 'int-1', name: 'Stripe', description: 'Process partner payouts and track payment activity.', category: 'Payments', connected: true },
  { id: 'int-2', name: 'Mailgun', description: 'Transactional email delivery for automations.', category: 'Email', connected: true },
  { id: 'int-3', name: 'Slack', description: 'Get alerts for new partner signups and conversions.', category: 'Notifications', connected: false },
  { id: 'int-4', name: 'Zapier', description: 'Connect Careverse to 5,000+ apps and automate workflows.', category: 'Automation', connected: false },
  { id: 'int-5', name: 'Google Analytics', description: 'Track storefront traffic and conversion attribution.', category: 'Analytics', connected: true },
  { id: 'int-6', name: 'Twilio', description: 'SMS notifications for partners and verification.', category: 'Notifications', connected: false },
];

interface TeamMember {
  id: string; name: string; email: string; role: 'Owner' | 'Admin' | 'Editor' | 'Viewer'; lastActive: string;
}
const team: TeamMember[] = [
  { id: 'tm-1', name: 'Sarah Chen', email: 'admin@careverse.ai', role: 'Owner', lastActive: '2026-09-15' },
  { id: 'tm-2', name: 'Marcus Johnson', email: 'marcus@careverse.ai', role: 'Admin', lastActive: '2026-09-14' },
  { id: 'tm-3', name: 'Emily Rodriguez', email: 'emily@careverse.ai', role: 'Editor', lastActive: '2026-09-13' },
  { id: 'tm-4', name: 'David Kim', email: 'david@careverse.ai', role: 'Viewer', lastActive: '2026-09-12' },
];

const tabConfig = [
  { value: 'program', label: 'Program', icon: SettingsIcon },
  { value: 'commission', label: 'Commission', icon: Sliders },
  { value: 'partner', label: 'Partners', icon: UserCheck },
  { value: 'storefront', label: 'Storefronts', icon: Store },
  { value: 'tracking', label: 'Tracking', icon: Crosshair },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'integrations', label: 'Integrations', icon: Plug },
  { value: 'team', label: 'Team', icon: Users },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'general', label: 'General', icon: Building },
] as const;

export default function AdminSettingsPage() {
  const [program, setProgram] = useState({ name: 'Careverse Partner Program', description: 'The Careverse Partner Program helps creators, businesses, and networks earn commission by referring families to Careverse membership plans.', defaultRate: '20' });
  const [rules, setRules] = useState<CommissionRule[]>(initialRules);
  const [tracking, setTracking] = useState({ attributionWindow: '30', cookieDuration: '60', firstClick: true, crossDomain: false });
  const [emailCfg, setEmailCfg] = useState({ fromEmail: 'team@careverse.ai', replyTo: 'support@careverse.ai', testEmail: '' });
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: '60', ipAllowlist: '' });
  const [partnerSettings, setPartnerSettings] = useState({
    autoApprove: false, requireW9: true, minPayoutAmount: '50',
    allowCustomDomains: true, defaultStorefrontTheme: 'Careverse Default',
  });
  const [storefrontSettings, setStorefrontSettings] = useState({
    defaultIntroCopy: 'Helping families access better, more affordable care.',
    allowCustomDomains: true, maxPackages: '5', requireApproval: true,
  });
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'Careverse', supportEmail: 'support@careverse.ai',
    timezone: 'America/New_York', dateFormat: 'MM/DD/YYYY',
    currency: 'USD', maintenanceMode: false,
  });
  const [savedTab, setSavedTab] = useState<string | null>(null);

  const handleSave = (tab: string) => {
    setSavedTab(tab);
    setTimeout(() => setSavedTab(null), 2500);
  };

  const toggleRuleStatus = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : r)));
  };

  const deleteRule = (id: string) => setRules((prev) => prev.filter((r) => r.id !== id));

  const toggleIntegration = (id: string) => {
    // mock — no state mutation needed for demo, button shows feedback
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Program Settings"
        description="Configure your partner program, commissions, tracking, integrations, and security."
      />

      <Tabs defaultValue="program" className="space-y-6">
        {/* Tab list */}
        <TabsList className="bg-cv-soft rounded-2xl p-1.5 h-auto flex flex-wrap gap-1">
          {tabConfig.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-xl px-3.5 py-2 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm"
            >
              <t.icon className="h-4 w-4 mr-1.5" /> {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Program ── */}
        <TabsContent value="program" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Program Details</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">Core information about your partner program</p>
              </div>
              <SaveButton onClick={() => handleSave('program')} saved={savedTab === 'program'} />
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="grid gap-2">
                <Label htmlFor="prog-name" className="text-sm font-bold text-cv-ink">Program Name</Label>
                <Input id="prog-name" value={program.name} onChange={(e) => setProgram({ ...program, name: e.target.value })} className="cv-input" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prog-desc" className="text-sm font-bold text-cv-ink">Description</Label>
                <Textarea id="prog-desc" value={program.description} onChange={(e) => setProgram({ ...program, description: e.target.value })} className="cv-input min-h-[100px] rounded-2xl" />
              </div>
              <div className="grid gap-2 max-w-xs">
                <Label htmlFor="prog-rate" className="text-sm font-bold text-cv-ink">Default Commission Rate (%)</Label>
                <div className="relative">
                  <Input id="prog-rate" type="number" value={program.defaultRate} onChange={(e) => setProgram({ ...program, defaultRate: e.target.value })} className="cv-input pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-cv-muted">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Commission Rules ── */}
        <TabsContent value="commission" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Commission Rules</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">Rules that determine how partners earn commission</p>
              </div>
              <Button className="cv-btn-primary cv-btn-sm rounded-full"><Plus className="h-4 w-4" /> Add Rule</Button>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Rule Name</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Rate</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Scope</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((r) => (
                    <TableRow key={r.id} className="border-cv-line">
                      <TableCell className="font-bold text-cv-ink text-sm">{r.name}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{r.rate}%</TableCell>
                      <TableCell className="text-sm text-cv-body">{r.scope}</TableCell>
                      <TableCell>
                        <button onClick={() => toggleRuleStatus(r.id)}>
                          <StatusBadge status={r.status === 'ACTIVE' ? 'active' : 'suspended'} label={r.status === 'ACTIVE' ? 'Active' : 'Paused'} />
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <button onClick={() => deleteRule(r.id)} className="rounded-lg p-1.5 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-3.5 w-3.5 text-cv-red" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Partner Settings ── */}
        <TabsContent value="partner" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Partner Settings</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">Defaults and requirements for partner accounts</p>
              </div>
              <SaveButton onClick={() => handleSave('partner')} saved={savedTab === 'partner'} />
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <ToggleRow
                icon={UserCheck}
                title="Auto-approve new partners"
                description="Automatically approve partner applications without manual review."
                checked={partnerSettings.autoApprove}
                onCheckedChange={(v) => setPartnerSettings({ ...partnerSettings, autoApprove: v })}
              />
              <ToggleRow
                icon={Building}
                title="Require W-9 before payout"
                description="Partners must submit a W-9 form before their first payout."
                checked={partnerSettings.requireW9}
                onCheckedChange={(v) => setPartnerSettings({ ...partnerSettings, requireW9: v })}
              />
              <ToggleRow
                icon={Globe}
                title="Allow custom storefront domains"
                description="Partners can connect their own domain to their storefront."
                checked={partnerSettings.allowCustomDomains}
                onCheckedChange={(v) => setPartnerSettings({ ...partnerSettings, allowCustomDomains: v })}
              />
              <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-cv-line">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Minimum Payout Amount ($)</Label>
                  <div className="relative">
                    <Input type="number" value={partnerSettings.minPayoutAmount} onChange={(e) => setPartnerSettings({ ...partnerSettings, minPayoutAmount: e.target.value })} className="cv-input pl-9" />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-cv-muted">$</span>
                  </div>
                  <p className="text-xs text-cv-muted">Minimum balance required before a payout is processed.</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Default Storefront Theme</Label>
                  <Select value={partnerSettings.defaultStorefrontTheme} onValueChange={(v) => setPartnerSettings({ ...partnerSettings, defaultStorefrontTheme: v })}>
                    <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Careverse Default">Careverse Default</SelectItem>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                      <SelectItem value="Warm">Warm</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-cv-muted">Applied to new storefronts by default.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Storefront Settings ── */}
        <TabsContent value="storefront" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Storefront Settings</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">Defaults and policies for partner storefronts</p>
              </div>
              <SaveButton onClick={() => handleSave('storefront')} saved={savedTab === 'storefront'} />
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Default Intro Copy</Label>
                <Textarea value={storefrontSettings.defaultIntroCopy} onChange={(e) => setStorefrontSettings({ ...storefrontSettings, defaultIntroCopy: e.target.value })} className="cv-input min-h-[80px] rounded-2xl" />
                <p className="text-xs text-cv-muted">Pre-filled intro text for new storefronts.</p>
              </div>
              <ToggleRow
                icon={Globe}
                title="Allow custom domains"
                description="Partners can connect a custom domain to their storefront."
                checked={storefrontSettings.allowCustomDomains}
                onCheckedChange={(v) => setStorefrontSettings({ ...storefrontSettings, allowCustomDomains: v })}
              />
              <ToggleRow
                icon={Shield}
                title="Require storefront approval"
                description="Storefronts must be approved by an admin before going live."
                checked={storefrontSettings.requireApproval}
                onCheckedChange={(v) => setStorefrontSettings({ ...storefrontSettings, requireApproval: v })}
              />
              <div className="grid gap-2 max-w-xs pt-4 border-t border-cv-line">
                <Label className="text-sm font-bold text-cv-ink">Max Packages per Storefront</Label>
                <Input type="number" value={storefrontSettings.maxPackages} onChange={(e) => setStorefrontSettings({ ...storefrontSettings, maxPackages: e.target.value })} className="cv-input" />
                <p className="text-xs text-cv-muted">Maximum number of Careverse plans a storefront can feature.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tracking ── */}
        <TabsContent value="tracking" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Tracking Settings</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">How referrals are attributed and tracked</p>
              </div>
              <SaveButton onClick={() => handleSave('tracking')} saved={savedTab === 'tracking'} />
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Attribution Window (days)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                    <Input type="number" value={tracking.attributionWindow} onChange={(e) => setTracking({ ...tracking, attributionWindow: e.target.value })} className="cv-input pl-9" />
                  </div>
                  <p className="text-xs text-cv-muted">How long after a click a conversion can be attributed.</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Cookie Duration (days)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                    <Input type="number" value={tracking.cookieDuration} onChange={(e) => setTracking({ ...tracking, cookieDuration: e.target.value })} className="cv-input pl-9" />
                  </div>
                  <p className="text-xs text-cv-muted">How long the referral cookie stays active.</p>
                </div>
              </div>
              <div className="space-y-4 pt-2 border-t border-cv-line">
                <ToggleRow
                  icon={Crosshair}
                  title="First-click attribution"
                  description="Credit the first partner whose link was clicked, not the last."
                  checked={tracking.firstClick}
                  onCheckedChange={(v) => setTracking({ ...tracking, firstClick: v })}
                />
                <ToggleRow
                  icon={Globe}
                  title="Cross-domain tracking"
                  description="Track referrals across partner custom domains."
                  checked={tracking.crossDomain}
                  onCheckedChange={(v) => setTracking({ ...tracking, crossDomain: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Email ── */}
        <TabsContent value="email" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Email Configuration</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">Sender settings and test email delivery</p>
              </div>
              <SaveButton onClick={() => handleSave('email')} saved={savedTab === 'email'} />
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">From Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                    <Input value={emailCfg.fromEmail} onChange={(e) => setEmailCfg({ ...emailCfg, fromEmail: e.target.value })} className="cv-input pl-9" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Reply-To Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                    <Input value={emailCfg.replyTo} onChange={(e) => setEmailCfg({ ...emailCfg, replyTo: e.target.value })} className="cv-input pl-9" />
                  </div>
                </div>
              </div>
              <div className="grid gap-2 max-w-md pt-4 border-t border-cv-line">
                <Label className="text-sm font-bold text-cv-ink">Send Test Email</Label>
                <div className="flex items-center gap-2">
                  <Input value={emailCfg.testEmail} onChange={(e) => setEmailCfg({ ...emailCfg, testEmail: e.target.value })} placeholder="recipient@example.com" className="cv-input" />
                  <Button
                    onClick={() => { setSavedTab('test'); setTimeout(() => setSavedTab(null), 2500); }}
                    className="cv-btn-secondary cv-btn-sm rounded-full shrink-0"
                    disabled={!emailCfg.testEmail}
                  >
                    <Mail className="h-4 w-4" /> {savedTab === 'test' ? 'Sent!' : 'Send'}
                  </Button>
                </div>
                <p className="text-xs text-cv-muted">Sends a test email to verify your configuration.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Integrations ── */}
        <TabsContent value="integrations" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((int) => (
              <Card key={int.id} className="cv-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl shrink-0', int.connected ? 'bg-emerald-50' : 'bg-cv-soft')}>
                        <Plug className={cn('h-5 w-5', int.connected ? 'text-cv-good' : 'text-cv-ink')} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-cv-ink">{int.name}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cv-muted rounded bg-cv-soft px-1.5 py-0.5">{int.category}</span>
                        </div>
                        <p className="text-xs text-cv-body mt-1 leading-relaxed">{int.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cv-line">
                    {int.connected ? (
                      <StatusBadge status="connected" label="Connected" />
                    ) : (
                      <span className="text-xs text-cv-muted font-bold">Not connected</span>
                    )}
                    <Button
                      variant={int.connected ? 'outline' : 'default'}
                      className={cn('rounded-full text-xs font-bold h-9', int.connected ? 'border-cv-line text-cv-body hover:bg-cv-soft' : 'cv-btn-primary cv-btn-sm')}
                      onClick={() => toggleIntegration(int.id)}
                    >
                      {int.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Team ── */}
        <TabsContent value="team" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Team Members</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">People with access to the Careverse admin</p>
              </div>
              <Button className="cv-btn-primary cv-btn-sm rounded-full"><Plus className="h-4 w-4" /> Invite Member</Button>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Member</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Role</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Last Active</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right w-16" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map((m) => (
                    <TableRow key={m.id} className="border-cv-line">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={m.name} color="#18191D" size={32} />
                          <div>
                            <p className="text-sm font-bold text-cv-ink">{m.name}</p>
                            <p className="text-xs text-cv-muted">{m.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={m.role}>
                          <SelectTrigger className="cv-input h-9 w-[120px] text-sm font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Owner">Owner</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-cv-muted">{new Date(m.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                      <TableCell className="text-right">
                        {m.role !== 'Owner' && (
                          <button className="rounded-lg p-1.5 hover:bg-red-50 transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-cv-red" />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Security ── */}
        <TabsContent value="security" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">Security</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">Protect your admin account and platform</p>
              </div>
              <SaveButton onClick={() => handleSave('security')} saved={savedTab === 'security'} />
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <ToggleRow
                icon={Lock}
                title="Two-Factor Authentication"
                description="Require a verification code in addition to your password."
                checked={security.twoFactor}
                onCheckedChange={(v) => setSecurity({ ...security, twoFactor: v })}
              />
              <div className="grid gap-2 max-w-xs pt-4 border-t border-cv-line">
                <Label className="text-sm font-bold text-cv-ink">Session Timeout (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input type="number" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} className="cv-input pl-9" />
                </div>
                <p className="text-xs text-cv-muted">Automatically log out inactive admins after this period.</p>
              </div>
              <div className="grid gap-2 max-w-md pt-4 border-t border-cv-line">
                <Label className="text-sm font-bold text-cv-ink">IP Allowlist</Label>
                <Textarea
                  value={security.ipAllowlist}
                  onChange={(e) => setSecurity({ ...security, ipAllowlist: e.target.value })}
                  placeholder="203.0.113.0/24&#10;198.51.100.10"
                  className="cv-input min-h-[80px] rounded-2xl font-mono text-sm"
                />
                <p className="text-xs text-cv-muted">One IP or CIDR per line. Leave empty to allow all IPs.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── General Settings ── */}
        <TabsContent value="general" className="mt-0">
          <Card className="cv-card">
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-cv-ink">General Settings</CardTitle>
                <p className="text-xs text-cv-muted mt-0.5">Platform-wide configuration and branding</p>
              </div>
              <SaveButton onClick={() => handleSave('general')} saved={savedTab === 'general'} />
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Platform Name</Label>
                  <Input value={generalSettings.platformName} onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })} className="cv-input" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Support Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                    <Input value={generalSettings.supportEmail} onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })} className="cv-input pl-9" />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-cv-line">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}>
                    <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Date Format</Label>
                  <Select value={generalSettings.dateFormat} onValueChange={(v) => setGeneralSettings({ ...generalSettings, dateFormat: v })}>
                    <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Currency</Label>
                  <Select value={generalSettings.currency} onValueChange={(v) => setGeneralSettings({ ...generalSettings, currency: v })}>
                    <SelectTrigger className="cv-input"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 border-t border-cv-line">
                <ToggleRow
                  icon={Shield}
                  title="Maintenance mode"
                  description="Temporarily disable the partner portal for updates. Admin panel remains accessible."
                  checked={generalSettings.maintenanceMode}
                  onCheckedChange={(v) => setGeneralSettings({ ...generalSettings, maintenanceMode: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <Button onClick={onClick} className={cn('cv-btn-sm rounded-full', saved ? 'bg-cv-good text-white' : 'cv-btn-primary')}>
      {saved ? <><Check className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save</>}
    </Button>
  );
}

function ToggleRow({
  icon: Icon, title, description, checked, onCheckedChange,
}: {
  icon: React.ElementType; title: string; description: string; checked: boolean; onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-soft shrink-0">
          <Icon className="h-4 w-4 text-cv-ink" />
        </div>
        <div>
          <p className="text-sm font-bold text-cv-ink">{title}</p>
          <p className="text-xs text-cv-muted mt-0.5">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
