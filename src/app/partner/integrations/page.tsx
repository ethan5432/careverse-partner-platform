'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Code2,
  Link as LinkIcon,
  ShoppingCart,
  MousePointerClick,
  Plug,
  Plus,
  Copy,
  Check,
  Trash2,
  Pencil,
  Key,
  Webhook as WebhookIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMockAuth } from '@/hooks/useMockAuth';
import { mockStorefronts, currentPartner, currentPartnerStorefront } from '@/data/mock';
import { getPackageCatalog } from '@/lib/package-catalog';
import {
  loadIntegrations,
  createIntegration,
  upsertIntegration,
  deleteIntegration,
  INTEGRATION_EVENTS,
  API_SCOPES,
  type IntegrationConfig,
  type IntegrationType,
  type IntegrationStatus,
} from '@/lib/integration-persistence';

const INTEGRATION_TYPES: {
  type: IntegrationType;
  label: string;
  icon: typeof Code2;
  description: string;
  useCase: string;
}[] = [
  {
    type: 'EMBED',
    label: 'Storefront / Website Embed',
    icon: Code2,
    description: 'Embed your Careverse storefront directly into your existing website with a lightweight snippet.',
    useCase: 'Best for partners with an existing website who want to offer Careverse plans without sending visitors away.',
  },
  {
    type: 'CHECKOUT_LINK',
    label: 'Direct Checkout Link',
    icon: ShoppingCart,
    description: 'A shareable link that sends customers straight to checkout for a specific Careverse package.',
    useCase: 'Best for email campaigns, SMS, or any channel where you want to drive direct purchases.',
  },
  {
    type: 'DEEP_LINK',
    label: 'Deep Link',
    icon: MousePointerClick,
    description: 'A trackable link to your storefront or a specific package page with campaign attribution built in.',
    useCase: 'Best for social media, paid ads, and any campaign where you need to track which source drove the click.',
  },
  {
    type: 'API',
    label: 'API Access',
    icon: Key,
    description: 'Programmatic access to your Careverse data — conversions, commissions, storefronts, and packages.',
    useCase: 'Best for agencies or partners with a custom dashboard, CRM, or reporting system.',
  },
  {
    type: 'WEBHOOK',
    label: 'Webhooks',
    icon: WebhookIcon,
    description: 'Real-time notifications sent to your server when key events happen in your Careverse account.',
    useCase: 'Best for automating workflows — trigger your own processes when conversions, commissions, or payouts occur.',
  },
];

export default function PartnerIntegrationsPage() {
  const router = useRouter();
  const { user } = useMockAuth();
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [showCreate, setShowCreate] = useState<IntegrationType | null>(null);
  const [editing, setEditing] = useState<IntegrationConfig | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setIntegrations(loadIntegrations());
  }, []);

  const handleSave = (config: IntegrationConfig) => {
    const updated = upsertIntegration(config);
    setIntegrations(updated);
    setShowCreate(null);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    const updated = deleteIntegration(id);
    setIntegrations(updated);
  };

  const handleToggleStatus = (config: IntegrationConfig) => {
    const newStatus: IntegrationStatus = config.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    handleSave({ ...config, status: newStatus });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const integrationsByType = (type: IntegrationType) =>
    integrations.filter((i) => i.type === type);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Integrations"
        title="Connect Careverse to your tools"
        description="Set up embeds, links, API access, and webhooks to integrate Careverse with your existing website, app, or reporting system."
      />

      {/* Integration type cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTEGRATION_TYPES.map((it) => {
          const count = integrationsByType(it.type).length;
          return (
            <Card key={it.type} className="cv-card flex flex-col">
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft shrink-0">
                    <it.icon className="h-5 w-5 text-cv-ink" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-cv-ink">{it.label}</p>
                      {count > 0 && (
                        <span className="inline-flex items-center justify-center rounded-full bg-cv-ink text-white text-[10px] font-bold h-5 min-w-5 px-1.5">
                          {count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-cv-body leading-relaxed mb-2">{it.description}</p>
                <p className="text-[11px] text-cv-muted leading-relaxed mb-4">
                  <span className="font-bold">Use case: </span>{it.useCase}
                </p>
                <Button
                  className="mt-auto rounded-full bg-cv-ink text-white hover:bg-cv-ink/90 text-xs font-bold"
                  onClick={() => { setEditing(null); setShowCreate(it.type); }}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Create {it.label}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Existing integrations */}
      {integrations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-cv-muted">Your Integrations</h2>
          {integrations.map((config) => (
            <IntegrationRow
              key={config.id}
              config={config}
              onEdit={() => { setEditing(config); setShowCreate(config.type); }}
              onDelete={() => handleDelete(config.id)}
              onToggle={() => handleToggleStatus(config)}
              onCopy={handleCopy}
              copiedId={copiedId}
            />
          ))}
        </div>
      )}

      {integrations.length === 0 && (
        <EmptyState
          icon={Plug}
          title="No integrations yet"
          description="Create your first integration to connect Careverse with your website, app, or reporting system. Choose an option above to get started."
        />
      )}

      {/* Create/Edit dialog */}
      {showCreate && (
        <IntegrationDialog
          type={showCreate}
          editing={editing}
          onClose={() => { setShowCreate(null); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function IntegrationRow({
  config,
  onEdit,
  onDelete,
  onToggle,
  onCopy,
  copiedId,
}: {
  config: IntegrationConfig;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const typeInfo = INTEGRATION_TYPES.find((t) => t.type === config.type)!;
  const copyId = `${config.id}-link`;

  const generatedLink = useMemo(() => {
    const base = `https://careverse.ai`;
    if (config.type === 'EMBED') {
      return `<script src="${base}/embed.js" data-storefront="${config.storefrontId || ''}" async></script>`;
    }
    if (config.type === 'CHECKOUT_LINK') {
      const params = new URLSearchParams();
      if (config.storefrontId) params.set('ref', config.storefrontId);
      if (config.packageId) params.set('product', config.packageId);
      if (config.campaignSource) params.set('utm_source', config.campaignSource);
      if (config.campaignId) params.set('campaign', config.campaignId);
      return `${base}/checkout?${params.toString()}`;
    }
    if (config.type === 'DEEP_LINK') {
      const params = new URLSearchParams();
      if (config.storefrontId) params.set('s', config.storefrontId);
      if (config.packageId) params.set('product', config.packageId);
      if (config.campaignSource) params.set('utm_source', config.campaignSource);
      if (config.campaignId) params.set('campaign', config.campaignId);
      return `${base}/storefront?${params.toString()}`;
    }
    return '';
  }, [config]);

  const statusColor: Record<IntegrationStatus, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PAUSED: 'bg-amber-50 text-amber-700 border-amber-200',
    DRAFT: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <Card className="cv-card">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft shrink-0">
            <typeInfo.icon className="h-5 w-5 text-cv-ink" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-bold text-cv-ink">{config.name}</p>
              <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold', statusColor[config.status])}>
                {config.status}
              </span>
              <span className="text-[10px] font-bold text-cv-muted uppercase tracking-wider">{typeInfo.label}</span>
            </div>

            {(config.type === 'EMBED' || config.type === 'CHECKOUT_LINK' || config.type === 'DEEP_LINK') && generatedLink && (
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-cv-soft px-3 py-1.5 text-xs text-cv-body font-mono">
                  {generatedLink}
                </code>
                <button
                  onClick={() => onCopy(generatedLink, copyId)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-cv-line bg-white hover:bg-cv-soft transition-colors shrink-0"
                >
                  {copiedId === copyId ? <Check className="h-3.5 w-3.5 text-cv-good" /> : <Copy className="h-3.5 w-3.5 text-cv-muted" />}
                </button>
              </div>
            )}

            {config.type === 'API' && (
              <div className="mt-2 flex items-center gap-2">
                <code className="rounded-lg bg-cv-soft px-3 py-1.5 text-xs text-cv-body font-mono">
                  {config.apiKeyPreview || 'No key generated'}
                </code>
              </div>
            )}

            {config.type === 'WEBHOOK' && (
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-cv-soft px-3 py-1.5 text-xs text-cv-body font-mono">
                  {config.webhookUrl || 'No URL configured'}
                </code>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onToggle} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-cv-soft transition-colors" title={config.status === 'ACTIVE' ? 'Pause' : 'Activate'}>
              <Switch checked={config.status === 'ACTIVE'} onCheckedChange={onToggle} />
            </button>
            <button onClick={onEdit} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-cv-soft transition-colors" title="Edit">
              <Pencil className="h-3.5 w-3.5 text-cv-muted" />
            </button>
            <button onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50 transition-colors" title="Delete">
              <Trash2 className="h-3.5 w-3.5 text-cv-red" />
            </button>
            {(config.type === 'API' || config.type === 'WEBHOOK') && (
              <button onClick={() => setExpanded(!expanded)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-cv-soft transition-colors" title="Details">
                {expanded ? <ChevronUp className="h-4 w-4 text-cv-muted" /> : <ChevronDown className="h-4 w-4 text-cv-muted" />}
              </button>
            )}
          </div>
        </div>

        {expanded && config.type === 'API' && (
          <div className="mt-4 pt-4 border-t border-cv-line space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">API Key</p>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft shrink-0">
                  <Key className="h-4 w-4 text-cv-ink" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-cv-ink">{config.apiKeyLabel || 'Live API Key'}</p>
                  <code className="text-xs text-cv-muted font-mono">{config.apiKeyPreview}</code>
                </div>
              </div>
              <p className="text-[10px] text-cv-muted mt-1.5">Your key is stored securely. The full key was shown once at creation — store it safely.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Scopes</p>
              <div className="flex flex-wrap gap-1.5">
                {(config.apiScopes || []).map((scope) => {
                  const scopeInfo = API_SCOPES.find((s) => s.value === scope);
                  return (
                    <span key={scope} className="inline-flex items-center rounded-full border border-cv-line bg-white px-2.5 py-1 text-[10px] font-bold text-cv-ink">
                      {scopeInfo?.label || scope}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="rounded-lg bg-cv-soft p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cv-muted mb-1">Base URL</p>
              <code className="text-xs text-cv-body font-mono">https://api.careverse.ai/v1</code>
            </div>
          </div>
        )}

        {expanded && config.type === 'WEBHOOK' && (
          <div className="mt-4 pt-4 border-t border-cv-line space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Endpoint</p>
              <code className="text-xs text-cv-body font-mono block break-all">{config.webhookUrl || 'Not configured'}</code>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Subscribed Events</p>
              <div className="space-y-1.5">
                {(config.webhookEvents || []).map((evt) => {
                  const eventInfo = INTEGRATION_EVENTS.find((e) => e.value === evt);
                  return (
                    <div key={evt} className="flex items-start gap-2 rounded-lg bg-cv-soft p-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-cv-good" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-cv-ink">{eventInfo?.label || evt}</p>
                        <p className="text-[10px] text-cv-muted">{eventInfo?.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Signing Secret</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-cv-muted font-mono">{config.webhookSecretPreview || 'Not generated'}</code>
              </div>
              <p className="text-[10px] text-cv-muted mt-1.5">Used to verify that incoming webhook events are from Careverse. The full secret was shown once at creation.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function IntegrationDialog({
  type,
  editing,
  onClose,
  onSave,
}: {
  type: IntegrationType;
  editing: IntegrationConfig | null;
  onClose: () => void;
  onSave: (config: IntegrationConfig) => void;
}) {
  const typeInfo = INTEGRATION_TYPES.find((t) => t.type === type)!;
  const packages = getPackageCatalog();
  const storefronts = mockStorefronts.filter((s) => s.partnerId === currentPartner.id);

  const [name, setName] = useState(editing?.name || '');
  const [storefrontId, setStorefrontId] = useState(editing?.storefrontId || currentPartnerStorefront.id);
  const [packageId, setPackageId] = useState(editing?.packageId || '');
  const [campaignSource, setCampaignSource] = useState(editing?.campaignSource || '');
  const [campaignId, setCampaignId] = useState(editing?.campaignId || '');
  const [webhookUrl, setWebhookUrl] = useState(editing?.webhookUrl || '');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(editing?.webhookEvents || ['conversion.created', 'commission.approved', 'payout.sent']);
  const [apiScopes, setApiScopes] = useState<string[]>(editing?.apiScopes || ['conversions:read', 'commissions:read', 'storefronts:read']);

  const handleToggleEvent = (event: string) => {
    setWebhookEvents((prev) => prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]);
  };

  const handleToggleScope = (scope: string) => {
    setApiScopes((prev) => prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const config = editing
      ? {
          ...editing,
          name: name.trim(),
          storefrontId,
          packageId: packageId || undefined,
          campaignSource: campaignSource || undefined,
          campaignId: campaignId || undefined,
          webhookUrl: webhookUrl || undefined,
          webhookEvents,
          apiScopes,
        }
      : createIntegration(type, name.trim(), {
          status: 'DRAFT',
          storefrontId,
          packageId: packageId || undefined,
          campaignSource: campaignSource || undefined,
          campaignId: campaignId || undefined,
          webhookUrl: webhookUrl || undefined,
          webhookEvents,
          apiScopes,
        });
    onSave(config);
  };

  const isLink = type === 'EMBED' || type === 'CHECKOUT_LINK' || type === 'DEEP_LINK';

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-cv-ink">
            {editing ? 'Edit' : 'Create'} {typeInfo.label}
          </DialogTitle>
          <DialogDescription className="text-sm text-cv-muted">{typeInfo.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid gap-2">
            <Label className="text-sm font-bold text-cv-ink">Integration Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="cv-input"
              placeholder="e.g., Website embed, Email checkout link, Q3 social campaign"
            />
          </div>

          {isLink && (
            <>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Storefront</Label>
                <Select value={storefrontId} onValueChange={setStorefrontId}>
                  <SelectTrigger className="cv-input">
                    <SelectValue placeholder="Select storefront" />
                  </SelectTrigger>
                  <SelectContent>
                    {storefronts.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-cv-muted">Your partner attribution is automatically included and invisible to customers.</p>
              </div>

              {type !== 'EMBED' && (
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Package (optional)</Label>
                  <Select value={packageId} onValueChange={setPackageId}>
                    <SelectTrigger className="cv-input">
                      <SelectValue placeholder="All packages" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name} — ${p.price}/mo</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-cv-muted">Link directly to a specific package checkout or page.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Campaign Source</Label>
                  <Input
                    value={campaignSource}
                    onChange={(e) => setCampaignSource(e.target.value)}
                    className="cv-input"
                    placeholder="e.g., newsletter, facebook"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Campaign ID</Label>
                  <Input
                    value={campaignId}
                    onChange={(e) => setCampaignId(e.target.value)}
                    className="cv-input"
                    placeholder="e.g., fall_promo"
                  />
                </div>
              </div>
              <p className="text-[10px] text-cv-muted">Campaign tracking is embedded in the link — customers never see these parameters.</p>
            </>
          )}

          {type === 'API' && (
            <div className="space-y-3">
              <div className="rounded-xl bg-cv-soft p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-cv-ink" />
                  <p className="text-xs font-bold text-cv-ink">API Key</p>
                </div>
                <p className="text-[11px] text-cv-muted leading-relaxed">
                  {editing
                    ? 'Your API key is already generated. You can adjust scopes below.'
                    : 'A new API key will be generated when you create this integration. You\'ll only see the full key once — store it securely.'}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-cv-ink mb-2">Scopes</p>
                <div className="space-y-2">
                  {API_SCOPES.map((scope) => (
                    <label key={scope.value} className="flex items-start gap-2.5 cursor-pointer">
                      <Switch checked={apiScopes.includes(scope.value)} onCheckedChange={() => handleToggleScope(scope.value)} />
                      <div>
                        <p className="text-xs font-bold text-cv-ink">{scope.label}</p>
                        <p className="text-[10px] text-cv-muted">{scope.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-cv-soft p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cv-muted mb-1">Base URL</p>
                <code className="text-xs text-cv-body font-mono">https://api.careverse.ai/v1</code>
              </div>
            </div>
          )}

          {type === 'WEBHOOK' && (
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Endpoint URL</Label>
                <Input
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="cv-input"
                  placeholder="https://your-server.com/webhooks/careverse"
                />
                <p className="text-[10px] text-cv-muted">We&apos;ll send POST requests to this URL when events occur.</p>
              </div>
              <div>
                <p className="text-xs font-bold text-cv-ink mb-2">Events to subscribe to</p>
                <div className="space-y-2">
                  {INTEGRATION_EVENTS.map((evt) => (
                    <label key={evt.value} className="flex items-start gap-2.5 cursor-pointer">
                      <Switch checked={webhookEvents.includes(evt.value)} onCheckedChange={() => handleToggleEvent(evt.value)} />
                      <div>
                        <p className="text-xs font-bold text-cv-ink">{evt.label}</p>
                        <p className="text-[10px] text-cv-muted">{evt.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-cv-soft p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <WebhookIcon className="h-4 w-4 text-cv-ink" />
                  <p className="text-xs font-bold text-cv-ink">Signing Secret</p>
                </div>
                <p className="text-[11px] text-cv-muted leading-relaxed">
                  {editing
                    ? 'Your signing secret is already generated. Use it to verify incoming webhook payloads.'
                    : 'A signing secret will be generated to verify that incoming events are from Careverse. You\'ll only see it once.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={onClose}>Cancel</Button>
          <Button className="cv-btn-primary rounded-full" onClick={handleSave} disabled={!name.trim()}>
            {editing ? 'Save Changes' : 'Create Integration'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
