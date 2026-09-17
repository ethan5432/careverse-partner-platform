import type {
  CreatorProfile,
  StorefrontApplication,
  StorefrontApplicationContent,
  StorefrontApplicationStatus,
  StorefrontAccessState,
  AffiliateLink,
} from '@/data/mock/types';

const PROFILES_KEY = 'careverse_creator_profiles';
const APPLICATIONS_KEY = 'careverse_storefront_applications';
const ACCESS_KEY = 'careverse_storefront_access';
const AFFILIATE_KEY = 'careverse_affiliate_links';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function loadCreatorProfiles(partnerId: string): CreatorProfile[] {
  const all = read<Record<string, CreatorProfile[]>>(PROFILES_KEY, {});
  return all[partnerId] || [];
}

export function saveCreatorProfiles(partnerId: string, profiles: CreatorProfile[]): void {
  const all = read<Record<string, CreatorProfile[]>>(PROFILES_KEY, {});
  all[partnerId] = profiles;
  write(PROFILES_KEY, all);
}

export function loadStorefrontApplications(): StorefrontApplication[] {
  return read<StorefrontApplication[]>(APPLICATIONS_KEY, []);
}

export function saveStorefrontApplications(apps: StorefrontApplication[]): void {
  write(APPLICATIONS_KEY, apps);
}

export function loadStorefrontApplicationsByPartner(partnerId: string): StorefrontApplication[] {
  return loadStorefrontApplications().filter((a) => a.partnerId === partnerId);
}

export function loadPendingStorefrontApplication(partnerId: string): StorefrontApplication | null {
  const apps = loadStorefrontApplicationsByPartner(partnerId);
  const pending = apps.find((a) => a.status === 'SUBMITTED' || a.status === 'IN_REVIEW');
  return pending || null;
}

export function submitStorefrontApplication(
  partnerId: string,
  partnerName: string,
  partnerEmail: string,
  profiles: CreatorProfile[],
  content: StorefrontApplicationContent[],
): StorefrontApplication {
  const apps = loadStorefrontApplications();
  const app: StorefrontApplication = {
    id: `sfa-${Date.now()}`,
    partnerId,
    partnerName,
    partnerEmail,
    profiles,
    contentSubmissions: content,
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
  };
  apps.push(app);
  saveStorefrontApplications(apps);
  return app;
}

export function updateStorefrontApplicationStatus(
  appId: string,
  status: StorefrontApplicationStatus,
  reviewedBy?: string,
  feedback?: string,
): StorefrontApplication | null {
  const apps = loadStorefrontApplications();
  const idx = apps.findIndex((a) => a.id === appId);
  if (idx === -1) return null;
  apps[idx] = {
    ...apps[idx],
    status,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewedBy || apps[idx].reviewedBy,
    feedback: feedback || apps[idx].feedback,
  };
  saveStorefrontApplications(apps);
  return apps[idx];
}

export function loadStorefrontAccess(partnerId: string): StorefrontAccessState {
  const all = read<Record<string, StorefrontAccessState>>(ACCESS_KEY, {});
  return all[partnerId] || 'NONE';
}

export function saveStorefrontAccess(partnerId: string, state: StorefrontAccessState): void {
  const all = read<Record<string, StorefrontAccessState>>(ACCESS_KEY, {});
  all[partnerId] = state;
  write(ACCESS_KEY, all);
}

export function grantStorefrontAccess(partnerId: string): void {
  saveStorefrontAccess(partnerId, 'UNLOCKED');
}

export function revokeStorefrontAccess(partnerId: string): void {
  saveStorefrontAccess(partnerId, 'LOCKED');
}

export function hasStorefrontAccess(partnerId: string): boolean {
  return loadStorefrontAccess(partnerId) === 'UNLOCKED';
}

function generateAffiliateCode(partnerId: string): string {
  const hash = partnerId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(-6);
  return `cv-${hash}-${Date.now().toString(36).slice(-4)}`;
}

export function loadAffiliateLink(partnerId: string): AffiliateLink {
  const all = read<Record<string, AffiliateLink>>(AFFILIATE_KEY, {});
  if (all[partnerId]) return all[partnerId];
  const code = generateAffiliateCode(partnerId);
  const link: AffiliateLink = {
    id: `aff-${Date.now()}`,
    partnerId,
    code,
    url: `https://careverse.ai/r/${code}`,
    clicks: 0,
    conversions: 0,
  };
  all[partnerId] = link;
  write(AFFILIATE_KEY, all);
  return link;
}

export function recordAffiliateClick(partnerId: string): void {
  const all = read<Record<string, AffiliateLink>>(AFFILIATE_KEY, {});
  if (all[partnerId]) {
    all[partnerId].clicks += 1;
    write(AFFILIATE_KEY, all);
  }
}

export function loadAllAffiliateLinks(): AffiliateLink[] {
  return Object.values(read<Record<string, AffiliateLink>>(AFFILIATE_KEY, {}));
}
