import type { MockStorefront, StoreSection } from '@/data/mock/types';
import { currentPartnerStorefront } from '@/data/mock';

const STORE_CONFIG_KEY = 'careverse_store_config';
const VIDEO_DB_NAME = 'careverse_videos';
const VIDEO_STORE_NAME = 'videos';
const DB_VERSION = 1;

export interface StorefrontConfig {
  id: string;
  partnerId: string;
  name: string;
  url: string;
  status: 'LIVE' | 'DRAFT';
  logo: string;
  partnerPhoto: string;
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
  brandingMode: 'partner-first' | 'careverse-first' | 'co-branded';
  savedAt: string;
}

function defaultConfig(): StorefrontConfig {
  const sf = currentPartnerStorefront;
  return {
    id: sf.id,
    partnerId: sf.partnerId,
    name: sf.name,
    url: sf.url,
    status: sf.status,
    logo: sf.logo || '',
    partnerPhoto: sf.partnerPhoto || '',
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
    brandingMode: 'co-branded',
    savedAt: new Date().toISOString(),
  };
}

export function loadStorefrontConfig(): StorefrontConfig {
  if (typeof window === 'undefined') return defaultConfig();
  try {
    const raw = localStorage.getItem(STORE_CONFIG_KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw) as StorefrontConfig;
    return { ...defaultConfig(), ...parsed };
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
