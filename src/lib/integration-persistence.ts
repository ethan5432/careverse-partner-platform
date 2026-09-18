export type IntegrationType = 'EMBED' | 'CHECKOUT_LINK' | 'DEEP_LINK' | 'API' | 'WEBHOOK';

export type IntegrationStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT';

export interface IntegrationConfig {
  id: string;
  type: IntegrationType;
  name: string;
  status: IntegrationStatus;
  createdAt: string;
  updatedAt: string;
  // Link/embed config
  storefrontId?: string;
  packageId?: string;
  campaignSource?: string;
  campaignId?: string;
  // API config
  apiKeyLabel?: string;
  apiKeyPreview?: string;
  apiScopes?: string[];
  // Webhook config
  webhookUrl?: string;
  webhookEvents?: string[];
  webhookSecretLabel?: string;
  webhookSecretPreview?: string;
}

const STORAGE_KEY = 'careverse_partner_integrations';

function generateId(): string {
  return `int-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}

export function loadIntegrations(): IntegrationConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as IntegrationConfig[];
  } catch {
    return [];
  }
}

export function saveIntegrations(integrations: IntegrationConfig[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations));
}

export function createIntegration(
  type: IntegrationType,
  name: string,
  options: Partial<Omit<IntegrationConfig, 'id' | 'type' | 'name' | 'createdAt' | 'updatedAt'>> = {},
): IntegrationConfig {
  const now = new Date().toISOString();
  const config: IntegrationConfig = {
    id: generateId(),
    type,
    name,
    status: 'DRAFT',
    createdAt: now,
    updatedAt: now,
    ...options,
  };

  if (type === 'API' && !config.apiKeyPreview) {
    const generatedKey = `cv_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    config.apiKeyLabel = 'Live API Key';
    config.apiKeyPreview = maskKey(generatedKey);
    config.apiScopes = config.apiScopes || ['conversions:read', 'commissions:read', 'storefronts:read'];
  }

  if (type === 'WEBHOOK' && !config.webhookSecretPreview) {
    const generatedSecret = `whsec_${Math.random().toString(36).substring(2, 16)}`;
    config.webhookSecretLabel = 'Webhook Signing Secret';
    config.webhookSecretPreview = maskKey(generatedSecret);
    config.webhookEvents = config.webhookEvents || ['conversion.created', 'commission.approved', 'payout.sent'];
  }

  return config;
}

export function upsertIntegration(config: IntegrationConfig): IntegrationConfig[] {
  const integrations = loadIntegrations();
  const idx = integrations.findIndex((i) => i.id === config.id);
  const updated = { ...config, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    integrations[idx] = updated;
  } else {
    integrations.push(updated);
  }
  saveIntegrations(integrations);
  return integrations;
}

export function deleteIntegration(id: string): IntegrationConfig[] {
  const integrations = loadIntegrations().filter((i) => i.id !== id);
  saveIntegrations(integrations);
  return integrations;
}

export const INTEGRATION_EVENTS = [
  { value: 'conversion.created', label: 'Conversion Created', description: 'A new conversion is recorded from your storefront or link.' },
  { value: 'commission.approved', label: 'Commission Approved', description: 'A commission changes to APPROVED status.' },
  { value: 'commission.paid', label: 'Commission Paid', description: 'A commission is included in a paid payout.' },
  { value: 'payout.sent', label: 'Payout Sent', description: 'A payout is sent to your bank or PayPal account.' },
  { value: 'storefront.published', label: 'Storefront Published', description: 'Your storefront status changes to LIVE.' },
  { value: 'storefront.suspended', label: 'Storefront Suspended', description: 'Your storefront is suspended by Careverse admin.' },
];

export const API_SCOPES = [
  { value: 'conversions:read', label: 'Read conversions', description: 'View conversion records and attribution details.' },
  { value: 'commissions:read', label: 'Read commissions', description: 'View commission records and status.' },
  { value: 'storefronts:read', label: 'Read storefronts', description: 'View storefront configuration and status.' },
  { value: 'packages:read', label: 'Read package catalog', description: 'View available Careverse packages and pricing.' },
];
