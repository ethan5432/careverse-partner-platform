import type { CustomerAttribution } from '@/data/mock/types';
import { currentPartner, currentPartnerStorefront } from '@/data/mock';

const ATTRIBUTION_KEY = 'careverse_customer_attribution';

export function captureAttributionFromParams(params: URLSearchParams): CustomerAttribution | null {
  const partnerId = params.get('ref') || params.get('partner') || params.get('p');
  const storefrontId = params.get('store') || params.get('s');
  const campaignId = params.get('campaign') || params.get('cmp') || undefined;
  const campaignSource = params.get('utm_source') || params.get('source') || undefined;
  const clickId = params.get('click') || params.get('click_id') || undefined;

  // If we have explicit partner/storefront params, build attribution from them
  if (partnerId || storefrontId) {
    const partner = currentPartner;
    const storefront = currentPartnerStorefront;
    return {
      partnerId: partnerId || partner.id,
      partnerName: partner.name,
      storefrontId: storefrontId || storefront.id,
      storefrontName: storefront.name,
      campaignId,
      campaignSource,
      clickId,
      attributionSource: campaignSource || 'Storefront Link',
      firstTouchAt: new Date().toISOString(),
    };
  }

  // If campaign source exists without partner, still capture for future matching
  if (campaignSource || campaignId || clickId) {
    const partner = currentPartner;
    const storefront = currentPartnerStorefront;
    return {
      partnerId: partner.id,
      partnerName: partner.name,
      storefrontId: storefront.id,
      storefrontName: storefront.name,
      campaignId,
      campaignSource,
      clickId,
      attributionSource: campaignSource || 'Storefront Link',
      firstTouchAt: new Date().toISOString(),
    };
  }

  return null;
}

export function saveCustomerAttribution(attribution: CustomerAttribution): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
}

export function loadCustomerAttribution(): CustomerAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerAttribution;
  } catch {
    return null;
  }
}

export function clearCustomerAttribution(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ATTRIBUTION_KEY);
}

export function buildDefaultAttribution(): CustomerAttribution {
  const partner = currentPartner;
  const storefront = currentPartnerStorefront;
  return {
    partnerId: partner.id,
    partnerName: partner.name,
    storefrontId: storefront.id,
    storefrontName: storefront.name,
    attributionSource: 'Storefront Link',
    firstTouchAt: new Date().toISOString(),
  };
}

export function mergeAttribution(
  persisted: CustomerAttribution | null,
  sessionAttribution: CustomerAttribution | null,
): CustomerAttribution {
  // Session-level attribution (from current storefront visit) takes priority
  // over persisted (from a prior visit), but either way the originating
  // partner relationship is preserved for the customer journey.
  if (sessionAttribution) return sessionAttribution;
  if (persisted) return persisted;
  return buildDefaultAttribution();
}
