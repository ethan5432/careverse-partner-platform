import type { MockStorefront, StoreSection } from '@/data/mock/types';
import { currentPartnerStorefront } from '@/data/mock';

const STORE_CONFIG_KEY = 'careverse_store_config';
const VIDEO_DB_NAME = 'careverse_videos';
const VIDEO_STORE_NAME = 'videos';
const DB_VERSION = 1;

export type BrandMode = 'white-label' | 'co-branded' | 'careverse-branded';

export interface FontConfig {
  family: string;
  weight: string;
}

export interface StoreBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  primaryTextColor: string;
  mutedTextColor: string;
  borderColor: string;
  buttonTextColor: string;
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
  buttonWeight: string;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin' | 'x' | 'other';
  url: string;
  visible: boolean;
  order: number;
}

export interface StorefrontConfig {
  id: string;
  partnerId: string;
  name: string;
  url: string;
  status: 'LIVE' | 'DRAFT';
  logo: string;
  favicon: string;
  partnerPhoto: string;
  heroImage: string;
  sectionImages: Record<string, string>;
  introCopy: string;
  brandPresentation: string;
  heroHeadline: string;
  heroSupportingCopy: string;
  ctaText: string;
  aboutContent: string;
  customDomain: string;
  domainStatus: 'NONE' | 'PENDING' | 'CONNECTED';
  selectedPackages: string[];
  sections: StoreSection[];
  creatorContent: {
    id: string;
    source: 'EMBED' | 'UPLOAD';
    url: string;
    videoId?: string;
    title: string;
    caption: string;
    layout: 'ONE_COLUMN' | 'TWO_COLUMN' | 'THREE_COLUMN';
    order: number;
    sectionId: string;
  }[];
  brandMode: BrandMode;
  branding: StoreBranding;
  showProfile: boolean;
  showVerifiedBadge: boolean;
  showPoweredByFooter: boolean;
  showCareverseInHeader: boolean;
  showCareverseInFooter: boolean;
  socialLinks: SocialLink[];
  contactEmail: string;
  contactPhone: string;
  savedAt: string;
}

export const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif', preview: 'Aa' },
  { label: 'Georgia', value: 'Georgia, serif', preview: 'Aa' },
  { label: 'Poppins', value: 'Poppins, sans-serif', preview: 'Aa' },
  { label: 'Playfair Display', value: '"Playfair Display", serif', preview: 'Aa' },
  { label: 'Roboto', value: 'Roboto, sans-serif', preview: 'Aa' },
  { label: 'Lora', value: 'Lora, serif', preview: 'Aa' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif', preview: 'Aa' },
  { label: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif', preview: 'Aa' },
] as const;

export const FONT_WEIGHTS = [
  { label: 'Light (300)', value: '300' },
  { label: 'Regular (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi-Bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra-Bold (800)', value: '800' },
] as const;

export const DEFAULT_BRANDING: StoreBranding = {
  primaryColor: '#18191D',
  secondaryColor: '#E1062C',
  accentColor: '#0B9B6B',
  backgroundColor: '#F6F3EE',
  surfaceColor: '#FFFFFF',
  primaryTextColor: '#18191D',
  mutedTextColor: '#6B6E76',
  borderColor: '#E6E1D8',
  buttonTextColor: '#FFFFFF',
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  headingWeight: '700',
  bodyWeight: '400',
  buttonWeight: '800',
};

function defaultConfig(): StorefrontConfig {
  const sf = currentPartnerStorefront;
  return {
    id: sf.id,
    partnerId: sf.partnerId,
    name: sf.name,
    url: sf.url,
    status: sf.status,
    logo: sf.logo || '',
    favicon: '',
    partnerPhoto: sf.partnerPhoto || '',
    heroImage: '',
    sectionImages: {},
    introCopy: sf.introCopy,
    brandPresentation: sf.brandPresentation || '',
    heroHeadline: sf.heroHeadline || 'Quality care for your family',
    heroSupportingCopy: sf.heroSupportingCopy || '',
    ctaText: sf.ctaText || 'Request Care',
    aboutContent: sf.aboutContent || '',
    customDomain: sf.customDomain || '',
    domainStatus: sf.domainStatus,
    selectedPackages: sf.packages,
    sections: [
      { id: 'sec-hero', type: 'hero', visible: true },
      { id: 'sec-creator-0', type: 'creatorVideo', visible: true, columns: 1 },
      { id: 'sec-packages', type: 'packages', visible: true },
      { id: 'sec-benefits', type: 'benefits', visible: true },
      { id: 'sec-about', type: 'about', visible: true },
    ],
    creatorContent: (sf.creatorContent || []).map((c, i) => ({
      id: c.id,
      source: c.source,
      url: c.url,
      videoId: c.videoId,
      title: c.title || '',
      caption: c.caption || '',
      layout: c.layout,
      order: c.order,
      sectionId: c.sectionId || `sec-creator-${i}`,
    })),
    brandMode: 'co-branded',
    branding: { ...DEFAULT_BRANDING },
    showProfile: true,
    showVerifiedBadge: true,
    showPoweredByFooter: true,
    showCareverseInHeader: true,
    showCareverseInFooter: true,
    socialLinks: [],
    contactEmail: '',
    contactPhone: '',
    savedAt: new Date().toISOString(),
  };
}

export function loadStorefrontConfig(): StorefrontConfig {
  if (typeof window === 'undefined') return defaultConfig();
  try {
    const raw = localStorage.getItem(STORE_CONFIG_KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw) as Partial<StorefrontConfig>;
    const defaults = defaultConfig();
    return {
      ...defaults,
      ...parsed,
      branding: { ...defaults.branding, ...(parsed.branding || {}) },
      sectionImages: { ...(parsed.sectionImages || {}) },
      socialLinks: parsed.socialLinks || [],
      contactEmail: parsed.contactEmail || '',
      contactPhone: parsed.contactPhone || '',
    };
  } catch {
    return defaultConfig();
  }
}

export function saveStorefrontConfig(config: StorefrontConfig): void {
  if (typeof window === 'undefined') return;
  const toSave = { ...config, savedAt: new Date().toISOString() };
  localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(toSave));
}

export function hasSavedConfig(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORE_CONFIG_KEY) !== null;
}

export function resetStorefrontConfig(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORE_CONFIG_KEY);
}

// ─── Multi-storefront support (Business / Agency) ───────────────────────────

const MULTI_STORE_KEY = 'careverse_multi_storefronts';

export interface StorefrontSummary {
  id: string;
  name: string;
  status: 'LIVE' | 'DRAFT';
  customDomain: string;
  domainStatus: 'NONE' | 'PENDING' | 'CONNECTED';
  url: string;
  selectedPackages: string[];
  createdAt: string;
  savedAt: string;
}

function defaultNewConfig(name: string): StorefrontConfig {
  const base = defaultConfig();
  const id = `sf-${Date.now()}`;
  return {
    ...base,
    id,
    name,
    url: `careverse.ai/s/${name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}`,
    status: 'DRAFT',
    domainStatus: 'NONE',
    customDomain: '',
    savedAt: new Date().toISOString(),
  };
}

export function loadAllStorefrontConfigs(): StorefrontConfig[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MULTI_STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StorefrontConfig[];
  } catch {
    return [];
  }
}

function saveAllStorefrontConfigs(configs: StorefrontConfig[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MULTI_STORE_KEY, JSON.stringify(configs));
}

export function loadStorefrontConfigById(id: string): StorefrontConfig | null {
  const all = loadAllStorefrontConfigs();
  return all.find((c) => c.id === id) || null;
}

export function saveStorefrontConfigById(config: StorefrontConfig): void {
  const all = loadAllStorefrontConfigs();
  const idx = all.findIndex((c) => c.id === config.id);
  const toSave = { ...config, savedAt: new Date().toISOString() };
  if (idx >= 0) {
    all[idx] = toSave;
  } else {
    all.push(toSave);
  }
  saveAllStorefrontConfigs(all);
}

export function createStorefront(name: string): StorefrontConfig {
  const config = defaultNewConfig(name);
  saveStorefrontConfigById(config);
  return config;
}

// ─── Storefront templates ───────────────────────────────────────────────────

export interface StorefrontTemplate {
  id: string;
  name: string;
  description: string;
  branding: StoreBranding;
  brandMode: BrandMode;
  heroHeadline: string;
  heroSupportingCopy: string;
  ctaText: string;
  aboutContent: string;
  sections: StoreSection[];
  showProfile: boolean;
  showVerifiedBadge: boolean;
  showPoweredByFooter: boolean;
  showCareverseInHeader: boolean;
  showCareverseInFooter: boolean;
  selectedPackages: string[];
}

export const STOREFRONT_TEMPLATES: StorefrontTemplate[] = [
  {
    id: 'tpl-warm-family',
    name: 'Warm Family Care',
    description: 'A friendly, approachable storefront with warm tones — ideal for family-focused care advisors.',
    branding: {
      ...DEFAULT_BRANDING,
      primaryColor: '#2D5F3F',
      secondaryColor: '#E08D3C',
      accentColor: '#5BA85B',
      backgroundColor: '#FAF6F0',
      surfaceColor: '#FFFFFF',
      primaryTextColor: '#2D5F3F',
      mutedTextColor: '#6B8E72',
      borderColor: '#E0D5C8',
      buttonTextColor: '#FFFFFF',
      headingFont: 'Lora, serif',
      bodyFont: 'Inter, sans-serif',
    },
    brandMode: 'co-branded',
    heroHeadline: 'Quality care for your family',
    heroSupportingCopy: 'I help families like yours discover affordable, comprehensive care benefits through Careverse.',
    ctaText: 'Request Care',
    aboutContent: 'As a dedicated care advocate, I connect families with the best Careverse membership plans. My goal is simple: make quality healthcare accessible and affordable for everyone.',
    sections: [
      { id: 'sec-hero', type: 'hero', visible: true },
      { id: 'sec-creator-0', type: 'creatorVideo', visible: true, columns: 1 },
      { id: 'sec-packages', type: 'packages', visible: true },
      { id: 'sec-benefits', type: 'benefits', visible: true },
      { id: 'sec-about', type: 'about', visible: true },
    ],
    showProfile: true,
    showVerifiedBadge: true,
    showPoweredByFooter: true,
    showCareverseInHeader: true,
    showCareverseInFooter: true,
    selectedPackages: ['Family', 'Family Plus'],
  },
  {
    id: 'tpl-pro-agency',
    name: 'Professional Agency',
    description: 'A clean, corporate storefront with neutral tones — ideal for agencies managing client referrals.',
    branding: {
      ...DEFAULT_BRANDING,
      primaryColor: '#1A3C5E',
      secondaryColor: '#2563EB',
      accentColor: '#0B9B6B',
      backgroundColor: '#F8FAFC',
      surfaceColor: '#FFFFFF',
      primaryTextColor: '#1A3C5E',
      mutedTextColor: '#64748B',
      borderColor: '#E2E8F0',
      buttonTextColor: '#FFFFFF',
      headingFont: 'Montserrat, sans-serif',
      bodyFont: 'Inter, sans-serif',
    },
    brandMode: 'co-branded',
    heroHeadline: 'Expert guidance for your family\'s care',
    heroSupportingCopy: 'We connect your family with comprehensive Careverse care benefits — trusted by professionals.',
    ctaText: 'Get Started',
    aboutContent: 'Our agency specializes in helping families navigate Careverse membership options. With years of experience in care advocacy, we ensure you get the right plan for your needs.',
    sections: [
      { id: 'sec-hero', type: 'hero', visible: true },
      { id: 'sec-packages', type: 'packages', visible: true },
      { id: 'sec-benefits', type: 'benefits', visible: true },
      { id: 'sec-about', type: 'about', visible: true },
    ],
    showProfile: false,
    showVerifiedBadge: false,
    showPoweredByFooter: true,
    showCareverseInHeader: true,
    showCareverseInFooter: true,
    selectedPackages: ['Family', 'Family Plus', 'Care Circle'],
  },
  {
    id: 'tpl-wellness-creator',
    name: 'Wellness Creator',
    description: 'A vibrant, health-forward storefront — ideal for creators and influencers in the wellness space.',
    branding: {
      ...DEFAULT_BRANDING,
      primaryColor: '#0B6E4F',
      secondaryColor: '#E1062C',
      accentColor: '#F59E0B',
      backgroundColor: '#F0FDF4',
      surfaceColor: '#FFFFFF',
      primaryTextColor: '#0B6E4F',
      mutedTextColor: '#6B8E72',
      borderColor: '#DCFCE7',
      buttonTextColor: '#FFFFFF',
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Inter, sans-serif',
    },
    brandMode: 'co-branded',
    heroHeadline: 'Wellness made simple for families',
    heroSupportingCopy: 'Discover the care benefits your family deserves — recommended by someone who uses them.',
    ctaText: 'Explore Plans',
    aboutContent: 'I share my family\'s wellness journey and help others discover the Careverse plans that make quality care accessible and affordable.',
    sections: [
      { id: 'sec-hero', type: 'hero', visible: true },
      { id: 'sec-creator-0', type: 'creatorVideo', visible: true, columns: 1 },
      { id: 'sec-creator-1', type: 'creatorVideo', visible: true, columns: 2 },
      { id: 'sec-packages', type: 'packages', visible: true },
      { id: 'sec-benefits', type: 'benefits', visible: true },
      { id: 'sec-about', type: 'about', visible: true },
    ],
    showProfile: true,
    showVerifiedBadge: true,
    showPoweredByFooter: true,
    showCareverseInHeader: true,
    showCareverseInFooter: true,
    selectedPackages: ['Family', 'Family Plus'],
  },
];

export function createStorefrontFromTemplate(name: string, templateId: string): StorefrontConfig {
  const tpl = STOREFRONT_TEMPLATES.find((t) => t.id === templateId);
  const base = defaultNewConfig(name);
  if (!tpl) return base;
  const config: StorefrontConfig = {
    ...base,
    branding: { ...tpl.branding },
    brandMode: tpl.brandMode,
    heroHeadline: tpl.heroHeadline,
    heroSupportingCopy: tpl.heroSupportingCopy,
    ctaText: tpl.ctaText,
    aboutContent: tpl.aboutContent,
    sections: tpl.sections.map((s) => ({ ...s })),
    showProfile: tpl.showProfile,
    showVerifiedBadge: tpl.showVerifiedBadge,
    showPoweredByFooter: tpl.showPoweredByFooter,
    showCareverseInHeader: tpl.showCareverseInHeader,
    showCareverseInFooter: tpl.showCareverseInFooter,
    selectedPackages: [...tpl.selectedPackages],
    socialLinks: [],
  };
  saveStorefrontConfigById(config);
  return config;
}

export function duplicateStorefront(id: string): StorefrontConfig | null {
  const original = loadStorefrontConfigById(id);
  if (!original) return null;
  const newId = `sf-${Date.now()}`;
  const copy: StorefrontConfig = {
    ...original,
    id: newId,
    name: `${original.name} (Copy)`,
    url: `careverse.ai/s/${(original.name + '-copy').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}`,
    status: 'DRAFT',
    domainStatus: 'NONE',
    customDomain: '',
    socialLinks: [],
    savedAt: new Date().toISOString(),
  };
  saveStorefrontConfigById(copy);
  return copy;
}

export function deleteStorefront(id: string): void {
  const all = loadAllStorefrontConfigs();
  saveAllStorefrontConfigs(all.filter((c) => c.id !== id));
}

export function getStorefrontSummaries(): StorefrontSummary[] {
  return loadAllStorefrontConfigs().map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    customDomain: c.customDomain,
    domainStatus: c.domainStatus,
    url: c.url,
    selectedPackages: c.selectedPackages,
    createdAt: c.savedAt,
    savedAt: c.savedAt,
  }));
}

// ─── IndexedDB for video files ─────────────────────────────────────────────

function openVideoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(VIDEO_DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) {
        db.createObjectStore(VIDEO_STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeVideoFile(id: string, file: File): Promise<string> {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, 'readwrite');
    const store = tx.objectStore(VIDEO_STORE_NAME);
    store.put({ id, file, name: file.name, type: file.type, size: file.size, storedAt: new Date().toISOString() });
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getVideoFile(id: string): Promise<{ file: File; name: string; type: string } | null> {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, 'readonly');
    const store = tx.objectStore(VIDEO_STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => {
      if (req.result) resolve({ file: req.result.file, name: req.result.name, type: req.result.type });
      else resolve(null);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteVideoFile(id: string): Promise<void> {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, 'readwrite');
    const store = tx.objectStore(VIDEO_STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getVideoObjectURL(id: string): Promise<string | null> {
  const result = await getVideoFile(id);
  if (!result) return null;
  return URL.createObjectURL(result.file);
}

export async function deleteAllVideoFiles(): Promise<void> {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, 'readwrite');
    const store = tx.objectStore(VIDEO_STORE_NAME);
    store.clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
