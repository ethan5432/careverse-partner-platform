export interface Campaign {
  id: string;
  name: string;
  source: string;
  ref: string;
  destination?: string;
  storefrontId?: string;
  storefrontName?: string;
  campaignUrl?: string;
  createdAt: string;
  clicks: number;
  conversions: number;
}

const CAMPAIGN_KEY = 'careverse_campaigns';
const DEFAULT_CAMPAIGNS: Campaign[] = [
  { id: 'camp-demo-1', name: 'Summer Instagram Push', source: 'instagram', ref: 'camp-summer-ig', createdAt: '2026-08-01T10:00:00Z', clicks: 142, conversions: 8 },
  { id: 'camp-demo-2', name: 'Email Newsletter September', source: 'email', ref: 'camp-sep-email', createdAt: '2026-09-01T12:00:00Z', clicks: 89, conversions: 3 },
];

export function loadCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return DEFAULT_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(CAMPAIGN_KEY);
    if (!raw) return DEFAULT_CAMPAIGNS;
    const parsed = JSON.parse(raw) as Campaign[];
    if (!Array.isArray(parsed)) return DEFAULT_CAMPAIGNS;
    return parsed;
  } catch {
    return DEFAULT_CAMPAIGNS;
  }
}

export function saveCampaigns(campaigns: Campaign[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaigns));
}

export function createCampaign(
  name: string,
  source: string,
  destination?: string,
  storefrontId?: string,
  storefrontName?: string,
  campaignUrl?: string,
): Campaign {
  const ref = `camp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const campaign: Campaign = {
    id: `camp-${Date.now()}`,
    name,
    source: source || 'direct',
    ref,
    destination,
    storefrontId,
    storefrontName,
    campaignUrl,
    createdAt: new Date().toISOString(),
    clicks: 0,
    conversions: 0,
  };
  const campaigns = loadCampaigns();
  campaigns.push(campaign);
  saveCampaigns(campaigns);
  return campaign;
}

export function deleteCampaign(id: string): void {
  const campaigns = loadCampaigns().filter(c => c.id !== id);
  saveCampaigns(campaigns);
}

export function buildStorefrontUrl(baseUrl: string): string {
  if (typeof window === 'undefined') return baseUrl;
  if (baseUrl.startsWith('http')) return baseUrl;
  return `${window.location.origin}${baseUrl.startsWith('/') ? '' : '/'}${baseUrl}`;
}

export function buildAffiliateUrl(baseUrl: string, ref: string): string {
  const full = buildStorefrontUrl(baseUrl);
  const sep = full.includes('?') ? '&' : '?';
  return `${full}${sep}ref=${encodeURIComponent(ref)}`;
}

export function buildCampaignUrl(baseUrl: string, campaign: Campaign): string {
  return buildAffiliateUrl(baseUrl, campaign.ref);
}
