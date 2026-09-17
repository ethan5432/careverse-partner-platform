import type { MockResource } from '@/data/mock/types';
import { mockResources } from '@/data/mock';

const RESOURCE_CATALOG_KEY = 'careverse_resource_catalog';
const ASSET_DB_NAME = 'careverse_resource_assets';
const ASSET_STORE = 'files';
const DB_VERSION = 1;

const SUPPORTED_EXTENSIONS = [
  'pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif',
  'mp4', 'mov', 'webm',
  'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'zip', 'txt', 'csv',
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export function getSupportedExtensions(): string[] {
  return [...SUPPORTED_EXTENSIONS];
}

export function getMaxFileSize(): number {
  return MAX_FILE_SIZE;
}

export function isSupportedFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return SUPPORTED_EXTENSIONS.includes(ext);
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export type AssetKind = 'image' | 'video' | 'pdf' | 'document' | 'archive' | 'other';

export function getAssetKind(fileExt: string): AssetKind {
  const ext = fileExt.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return 'image';
  if (['mp4', 'mov', 'webm'].includes(ext)) return 'video';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(ext)) return 'document';
  if (ext === 'zip') return 'archive';
  return 'other';
}

export function canPreviewInBrowser(fileExt: string): boolean {
  const kind = getAssetKind(fileExt);
  return kind === 'image' || kind === 'video' || kind === 'pdf';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── localStorage catalog ───────────────────────────────────────────────────

function seedCatalog(): MockResource[] {
  return mockResources.map((r) => ({
    ...r,
    assetSource: 'EXTERNAL' as const,
    url: r.url === '#' ? '' : r.url,
  }));
}

export function loadResourceCatalog(): MockResource[] {
  if (typeof window === 'undefined') return seedCatalog();
  try {
    const raw = localStorage.getItem(RESOURCE_CATALOG_KEY);
    if (!raw) {
      const seeded = seedCatalog();
      saveResourceCatalog(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as MockResource[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = seedCatalog();
      saveResourceCatalog(seeded);
      return seeded;
    }
    return parsed;
  } catch {
    return seedCatalog();
  }
}

export function saveResourceCatalog(resources: MockResource[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RESOURCE_CATALOG_KEY, JSON.stringify(resources));
}

export function resetResourceCatalog(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RESOURCE_CATALOG_KEY);
}

// ─── IndexedDB for uploaded asset files ──────────────────────────────────────

function openAssetDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(ASSET_DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ASSET_STORE)) {
        db.createObjectStore(ASSET_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeAssetFile(id: string, file: File): Promise<void> {
  const db = await openAssetDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE, 'readwrite');
    const store = tx.objectStore(ASSET_STORE);
    store.put({ id, file, name: file.name, type: file.type, size: file.size, storedAt: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAssetFile(id: string): Promise<{ file: File; name: string; type: string; size: number } | null> {
  const db = await openAssetDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE, 'readonly');
    const store = tx.objectStore(ASSET_STORE);
    const req = store.get(id);
    req.onsuccess = () => {
      if (req.result) resolve({ file: req.result.file, name: req.result.name, type: req.result.type, size: req.result.size });
      else resolve(null);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteAssetFile(id: string): Promise<void> {
  const db = await openAssetDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE, 'readwrite');
    const store = tx.objectStore(ASSET_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAssetObjectURL(id: string): Promise<string | null> {
  const result = await getAssetFile(id);
  if (!result) return null;
  return URL.createObjectURL(result.file);
}

export async function downloadAssetFile(id: string, fallbackName?: string): Promise<void> {
  const result = await getAssetFile(id);
  if (!result) return;
  const url = URL.createObjectURL(result.file);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.name || fallbackName || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Resource CRUD helpers ───────────────────────────────────────────────────

export function createResource(data: Partial<MockResource>): MockResource {
  const now = new Date().toISOString();
  return {
    id: `r-${Date.now()}`,
    title: data.title || 'Untitled resource',
    type: data.type || 'GUIDE',
    category: data.category || 'ALL',
    description: data.description || '',
    url: data.url || '',
    icon: data.icon || 'file',
    thumbnail: data.thumbnail,
    published: data.published ?? false,
    order: data.order ?? 100,
    createdAt: now,
    updatedAt: now,
    assetSource: data.assetSource,
    assetId: data.assetId,
    fileName: data.fileName,
    fileSize: data.fileSize,
    fileType: data.fileType,
    fileExt: data.fileExt,
  };
}

export function isResourceAvailable(resource: MockResource): boolean {
  if (resource.assetSource === 'UPLOAD' && resource.assetId) return true;
  if (resource.assetSource === 'EXTERNAL' && resource.url && resource.url !== '#' && resource.url !== '') return true;
  return false;
}
