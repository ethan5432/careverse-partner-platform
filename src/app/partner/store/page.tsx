'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import {
  LayoutDashboard, Package, Palette, Target, Video, Globe, Eye, Rocket,
  Save, Check, ChevronUp, ChevronDown, Trash2, Plus, Upload, ExternalLink,
  ArrowUp, ArrowDown, X, Play, ImageIcon, Lock, Settings, Star,
  Share2, Trash, Plus as PlusIcon,
} from 'lucide-react';
import { mockProducts, currentPartnerStorefront, partnerDashboardStats } from '@/data/mock';
import type { StoreSection, StoreSectionType } from '@/data/mock/types';
import {
  loadStorefrontConfig, saveStorefrontConfig, StorefrontConfig, StoreBranding,
  storeVideoFile, getVideoObjectURL, deleteVideoFile,
  FONT_OPTIONS, FONT_WEIGHTS, DEFAULT_BRANDING, BrandMode,
} from '@/lib/store-persistence';
import { cn } from '@/lib/utils';
import { useMockAuth } from '@/hooks/useMockAuth';
import { ShareStoreDialog } from '@/components/shared/ShareStoreDialog';
import type { SocialLink } from '@/lib/store-persistence';

const socialPlatforms: { value: SocialLink['platform']; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X' },
];

type BuilderTab = 'overview' | 'packages' | 'branding' | 'positioning' | 'content' | 'sections' | 'domain' | 'preview' | 'publish';

const tabs: { value: BuilderTab; label: string; icon: typeof Package }[] = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'sections', label: 'Sections', icon: Settings },
  { value: 'packages', label: 'Packages', icon: Package },
  { value: 'branding', label: 'Branding', icon: Palette },
  { value: 'positioning', label: 'Positioning', icon: Target },
  { value: 'content', label: 'Creator Content', icon: Video },
  { value: 'domain', label: 'Domain', icon: Globe },
  { value: 'preview', label: 'Preview', icon: Eye },
  { value: 'publish', label: 'Publish', icon: Rocket },
];

const colorFields: { key: keyof StoreBranding; label: string }[] = [
  { key: 'primaryColor', label: 'Primary' },
  { key: 'secondaryColor', label: 'Secondary' },
  { key: 'accentColor', label: 'Accent' },
  { key: 'backgroundColor', label: 'Background' },
  { key: 'surfaceColor', label: 'Surface / Card' },
  { key: 'primaryTextColor', label: 'Primary Text' },
  { key: 'mutedTextColor', label: 'Muted Text' },
  { key: 'borderColor', label: 'Border' },
  { key: 'buttonTextColor', label: 'Button Text' },
];

const sectionTypeLabels: Record<StoreSectionType, string> = {
  hero: 'Hero',
  creatorVideo: 'Creator Video / Content',
  packages: 'Packages',
  benefits: 'Benefits',
  about: 'About',
  footer: 'Footer',
};

const sectionTypeIcons: Record<StoreSectionType, typeof Package> = {
  hero: Target,
  creatorVideo: Video,
  packages: Package,
  benefits: Star,
  about: LayoutDashboard,
  footer: Globe,
};

function fmtMoney(n: number) {
  return `${n}/mo`;
}

interface CreatorBlock {
  id: string;
  source: 'EMBED' | 'UPLOAD';
  url: string;
  videoId?: string;
  title: string;
  caption: string;
  layout: 'ONE_COLUMN' | 'TWO_COLUMN' | 'THREE_COLUMN';
  order: number;
  sectionId: string;
}

function gridColsFor(n: number): string {
  if (n === 2) return 'grid-cols-2';
  if (n === 3) return 'grid-cols-3';
  return 'grid-cols-1';
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-start gap-3 text-left rounded-xl border border-cv-line p-3 hover:bg-cv-soft/50 transition-colors">
      <div className={cn('flex h-5 w-5 items-center justify-center rounded-md border-2 shrink-0 mt-0.5 transition-all', value ? 'border-cv-ink bg-cv-ink' : 'border-cv-line')}>
        {value && <Check className="h-3 w-3 text-white" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-cv-ink">{label}</p>
        <p className="text-xs text-cv-muted">{desc}</p>
      </div>
    </button>
  );
}

export default function PartnerStorePage() {
  const router = useRouter();
  const { onboarding, updateOnboarding } = useMockAuth();
  const [activeTab, setActiveTab] = useState<BuilderTab>('overview');
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Config state
  const [storefrontName, setStorefrontName] = useState('');
  const [logo, setLogo] = useState('');
  const [partnerPhoto, setPartnerPhoto] = useState('');
  const [introCopy, setIntroCopy] = useState('');
  const [brandPresentation, setBrandPresentation] = useState('');
  const [brandingMode, setBrandingMode] = useState<BrandMode>('co-branded');
  const [branding, setBranding] = useState<StoreBranding>({ ...DEFAULT_BRANDING });
  const [favicon, setFavicon] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
  const [showProfile, setShowProfile] = useState(true);
  const [showVerifiedBadge, setShowVerifiedBadge] = useState(true);
  const [showPoweredByFooter, setShowPoweredByFooter] = useState(true);
  const [showCareverseInHeader, setShowCareverseInHeader] = useState(true);
  const [showCareverseInFooter, setShowCareverseInFooter] = useState(true);
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSupportingCopy, setHeroSupportingCopy] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [domainStatus, setDomainStatus] = useState<'NONE' | 'PENDING' | 'CONNECTED'>('NONE');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [sections, setSections] = useState<StoreSection[]>([]);
  const [contentBlocks, setContentBlocks] = useState<CreatorBlock[]>([]);
  const [publishStatus, setPublishStatus] = useState<'LIVE' | 'DRAFT'>('DRAFT');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Video preview URLs for uploaded videos
  const [videoPreviews, setVideoPreviews] = useState<Record<string, string>>({});

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const heroImageInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved config on mount
  useEffect(() => {
    const config = loadStorefrontConfig();
    setStorefrontName(config.name);
    setLogo(config.logo);
    setPartnerPhoto(config.partnerPhoto);
    setIntroCopy(config.introCopy);
    setBrandPresentation(config.brandPresentation);
    setBrandingMode(config.brandMode);
    setBranding(config.branding);
    setFavicon(config.favicon);
    setHeroImage(config.heroImage);
    setSectionImages(config.sectionImages);
    setShowProfile(config.showProfile);
    setShowVerifiedBadge(config.showVerifiedBadge);
    setShowPoweredByFooter(config.showPoweredByFooter);
    setShowCareverseInHeader(config.showCareverseInHeader);
    setShowCareverseInFooter(config.showCareverseInFooter);
    setHeroHeadline(config.heroHeadline);
    setHeroSupportingCopy(config.heroSupportingCopy);
    setCtaText(config.ctaText);
    setAboutContent(config.aboutContent);
    setCustomDomain(config.customDomain);
    setDomainStatus(config.domainStatus);
    setSelectedPackages(config.selectedPackages);
    setSections(config.sections);
    setContentBlocks(config.creatorContent);
    setPublishStatus(config.status);
    setSocialLinks(config.socialLinks || []);
    setLoaded(true);

    // Load video previews for uploaded content
    const loadVideos = async () => {
      const previews: Record<string, string> = {};
      for (const block of config.creatorContent) {
        if (block.source === 'UPLOAD' && block.videoId) {
          const url = await getVideoObjectURL(block.videoId);
          if (url) previews[block.id] = url;
        }
      }
      setVideoPreviews(previews);
    };
    loadVideos();
  }, []);

  // Build config from state
  const buildConfig = useCallback((): StorefrontConfig => ({
    id: currentPartnerStorefront.id,
    partnerId: currentPartnerStorefront.partnerId,
    name: storefrontName,
    url: currentPartnerStorefront.url,
    status: publishStatus,
    logo,
    favicon,
    partnerPhoto,
    heroImage,
    sectionImages,
    introCopy,
    brandPresentation,
    heroHeadline,
    heroSupportingCopy,
    ctaText,
    aboutContent,
    customDomain,
    domainStatus,
    selectedPackages,
    sections,
    creatorContent: contentBlocks,
    brandMode: brandingMode,
    branding,
    showProfile,
    showVerifiedBadge,
    showPoweredByFooter,
    showCareverseInHeader,
    showCareverseInFooter,
    socialLinks,
    savedAt: new Date().toISOString(),
  }), [storefrontName, logo, favicon, partnerPhoto, heroImage, sectionImages, introCopy, brandPresentation, brandingMode, branding,
       heroHeadline, heroSupportingCopy, ctaText, aboutContent, customDomain,
       domainStatus, selectedPackages, sections, contentBlocks, publishStatus,
       showProfile, showVerifiedBadge, showPoweredByFooter, showCareverseInHeader, showCareverseInFooter,
       socialLinks]);

  const handleSave = () => {
    saveStorefrontConfig(buildConfig());
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
    if (!onboarding.storeCustomized) updateOnboarding({ storeCustomized: true });
    if (!onboarding.packagesChosen && selectedPackages.length > 0) updateOnboarding({ packagesChosen: true });
    if (!onboarding.contentAdded && contentBlocks.length > 0) updateOnboarding({ contentAdded: true });
  };

  // Mark dirty on any change
  const markDirty = () => { if (loaded) setDirty(true); };

  // ─── Section management ──────────────────────────────────────────────────

  const moveSection = (idx: number, dir: 'up' | 'down') => {
    const newSections = [...sections];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= newSections.length) return;
    [newSections[idx], newSections[target]] = [newSections[target], newSections[idx]];
    setSections(newSections);
    markDirty();
  };

  const toggleSectionVisible = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    markDirty();
  };

  const addCreatorVideoSection = () => {
    const sectionId = `sec-creator-${Date.now()}`;
    const newSection: StoreSection = {
      id: sectionId,
      type: 'creatorVideo',
      visible: true,
      columns: 1,
    };
    const insertIdx = sections.length - 1 < 0 ? 0 : sections.length - 1;
    const newSections = [...sections];
    newSections.splice(insertIdx, 0, newSection);
    setSections(newSections);
    markDirty();
    return sectionId;
  };

  const removeSection = (id: string) => {
    if (id === 'sec-hero' || id === 'sec-packages' || id === 'sec-benefits') return;
    setSections(sections.filter(s => s.id !== id));
    markDirty();
  };

  // ─── Package management ──────────────────────────────────────────────────

  const availableProducts = mockProducts.filter(p => p.availability === 'AVAILABLE');

  const togglePackage = (pkgName: string) => {
    if (selectedPackages.includes(pkgName)) {
      setSelectedPackages(selectedPackages.filter(p => p !== pkgName));
    } else {
      setSelectedPackages([...selectedPackages, pkgName]);
    }
    markDirty();
  };

  const movePackage = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= selectedPackages.length) return;
    const newPkgs = [...selectedPackages];
    [newPkgs[idx], newPkgs[target]] = [newPkgs[target], newPkgs[idx]];
    setSelectedPackages(newPkgs);
    markDirty();
  };

  // ─── Content block management ────────────────────────────────────────────

  const addContentBlock = (sectionId?: string) => {
    let targetSectionId = sectionId;
    if (!targetSectionId) {
      targetSectionId = addCreatorVideoSection();
    }
    const newBlock: CreatorBlock = {
      id: `cc-${Date.now()}`,
      source: 'EMBED',
      url: '',
      title: '',
      caption: '',
      layout: 'ONE_COLUMN',
      order: contentBlocks.length,
      sectionId: targetSectionId,
    };
    setContentBlocks([...contentBlocks, newBlock]);
    markDirty();
  };

  const updateContentBlock = (id: string, partial: Partial<CreatorBlock>) => {
    setContentBlocks(contentBlocks.map(b => b.id === id ? { ...b, ...partial } : b));
    markDirty();
  };

  const removeContentBlock = (id: string) => {
    const block = contentBlocks.find(b => b.id === id);
    setContentBlocks(contentBlocks.filter(b => b.id !== id));
    // Remove the section if this was the last video in it
    if (block) {
      const remainingInSection = contentBlocks.filter(b => b.sectionId === block.sectionId && b.id !== id);
      if (remainingInSection.length === 0) {
        setSections(prev => prev.filter(s => s.id !== block.sectionId));
      }
    }
    markDirty();
  };

  const moveContentBlock = (blockId: string, dir: 'up' | 'down') => {
    const block = contentBlocks.find(b => b.id === blockId);
    if (!block) return;
    const sectionBlocks = contentBlocks.filter(b => b.sectionId === block.sectionId).sort((a, b) => a.order - b.order);
    const idxInSection = sectionBlocks.findIndex(b => b.id === blockId);
    const target = dir === 'up' ? idxInSection - 1 : idxInSection + 1;
    if (target < 0 || target >= sectionBlocks.length) return;
    const targetBlock = sectionBlocks[target];
    const newBlocks = contentBlocks.map(b => {
      if (b.id === blockId) return { ...b, order: targetBlock.order };
      if (b.id === targetBlock.id) return { ...b, order: block.order };
      return b;
    });
    setContentBlocks(newBlocks);
    markDirty();
  };

  const moveContentBlockToSection = (blockId: string, targetSectionId: string) => {
    const targetBlocks = contentBlocks.filter(b => b.sectionId === targetSectionId);
    const maxOrder = targetBlocks.reduce((max, b) => Math.max(max, b.order), -1);
    setContentBlocks(contentBlocks.map(b =>
      b.id === blockId ? { ...b, sectionId: targetSectionId, order: maxOrder + 1 } : b
    ));
    // Remove source section if empty
    const block = contentBlocks.find(b => b.id === blockId);
    if (block) {
      const remaining = contentBlocks.filter(b => b.sectionId === block.sectionId && b.id !== blockId);
      if (remaining.length === 0) {
        setSections(prev => prev.filter(s => s.id !== block.sectionId));
      }
    }
    markDirty();
  };

  const updateSectionColumns = (sectionId: string, columns: 1 | 2 | 3) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, columns } : s));
    markDirty();
  };

  const videoSections = sections.filter(s => s.type === 'creatorVideo');
  const blocksBySection = (sectionId: string) =>
    contentBlocks.filter(b => b.sectionId === sectionId).sort((a, b) => a.order - b.order);

  // ─── Video upload ────────────────────────────────────────────────────────

  const handleVideoUpload = async (blockId: string, file: File) => {
    const videoId = `vid-${blockId}-${Date.now()}`;
    try {
      await storeVideoFile(videoId, file);
      const url = URL.createObjectURL(file);
      setVideoPreviews(prev => ({ ...prev, [blockId]: url }));
      updateContentBlock(blockId, { source: 'UPLOAD', videoId, url: '' });
    } catch {
      // Silently fail — user can retry
    }
  };

  // ─── Logo / Photo upload ─────────────────────────────────────────────────

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
      markDirty();
    };
    reader.readAsDataURL(file);
  };

  const updateBranding = (key: keyof StoreBranding, value: string) => {
    setBranding(prev => ({ ...prev, [key]: value }));
    markDirty();
  };

  // ─── Social link management ──────────────────────────────────────────────

  const addSocialLink = () => {
    const usedPlatforms = socialLinks.map(s => s.platform);
    const available = socialPlatforms.find(p => !usedPlatforms.includes(p.value));
    if (!available) return;
    const newLink: SocialLink = {
      id: `social-${Date.now()}`,
      platform: available.value,
      url: '',
      visible: true,
      order: socialLinks.length,
    };
    setSocialLinks([...socialLinks, newLink]);
    markDirty();
  };

  const updateSocialLink = (id: string, partial: Partial<SocialLink>) => {
    setSocialLinks(socialLinks.map(s => s.id === id ? { ...s, ...partial } : s));
    markDirty();
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i })));
    markDirty();
  };

  const moveSocialLink = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= socialLinks.length) return;
    const newLinks = [...socialLinks];
    [newLinks[idx], newLinks[target]] = [newLinks[target], newLinks[idx]];
    setSocialLinks(newLinks.map((s, i) => ({ ...s, order: i })));
    markDirty();
  };

  const brandingCssVars: React.CSSProperties = {
    ['--ink' as string]: branding.primaryColor,
    ['--body' as string]: branding.mutedTextColor,
    ['--muted' as string]: branding.mutedTextColor,
    ['--cream' as string]: branding.backgroundColor,
    ['--soft' as string]: branding.backgroundColor,
    ['--white' as string]: branding.surfaceColor,
    ['--line' as string]: branding.borderColor,
    ['--red' as string]: branding.secondaryColor,
    ['--red-deep' as string]: branding.secondaryColor,
    ['--night' as string]: branding.primaryColor,
    ['--night-text' as string]: branding.mutedTextColor,
    ['--good' as string]: branding.accentColor,
  };

  const isWhiteLabel = brandingMode === 'white-label';
  const isCareverseBranded = brandingMode === 'careverse-branded';
  const isCoBranded = brandingMode === 'co-branded';

  // ─── Save keyboard shortcut ──────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Don't render until loaded
  if (!loaded) {
    return (
      <div className="cv-page min-h-[60vh] flex items-center justify-center">
        <div className="text-sm text-cv-muted">Loading store editor...</div>
      </div>
    );
  }

  const partnerInitial = storefrontName.charAt(0) || 'M';

  return (
    <div className="cv-page min-h-screen">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="cv-red-rule" />
              <span className="cv-eyebrow uppercase">Store</span>
            </div>
            <h1 className="text-2xl font-bold text-cv-ink">Edit Store</h1>
            <p className="text-sm text-cv-muted mt-1">Customize your storefront, manage packages, and publish to your audience.</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold"
              onClick={() => router.push('/storefront')}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              View Store
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-cv-line font-bold"
              onClick={() => setShareDialogOpen(true)}
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Share
            </Button>
            <Button
              className={cn('cv-btn-primary rounded-full', saved && 'bg-cv-good')}
              onClick={handleSave}
            >
              {saved ? <><Check className="h-4 w-4 mr-1.5" /> Saved!</> : <><Save className="h-4 w-4 mr-1.5" /> {dirty ? 'Save Changes' : 'Saved'}</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-cv-line">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-colors -mb-[1px]',
              activeTab === tab.value
                ? 'border-cv-ink text-cv-ink'
                : 'border-transparent text-cv-muted hover:text-cv-body'
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Overview tab ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="cv-card"><CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Status</p>
              <p className="text-lg font-bold text-cv-ink">{publishStatus}</p>
            </CardContent></Card>
            <Card className="cv-card"><CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Store URL</p>
              <p className="text-lg font-bold text-cv-ink truncate">{currentPartnerStorefront.url}</p>
            </CardContent></Card>
            <Card className="cv-card"><CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Visitors</p>
              <p className="text-lg font-bold text-cv-ink">{partnerDashboardStats.visitors.toLocaleString()}</p>
            </CardContent></Card>
            <Card className="cv-card"><CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Conversions</p>
              <p className="text-lg font-bold text-cv-ink">{partnerDashboardStats.conversions}</p>
            </CardContent></Card>
            <Card className="cv-card"><CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Revenue</p>
              <p className="text-lg font-bold text-cv-ink">${partnerDashboardStats.available.toLocaleString()}</p>
            </CardContent></Card>
            <Card className="cv-card"><CardContent className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1">Selected Packages</p>
              <p className="text-lg font-bold text-cv-ink">{selectedPackages.length}</p>
            </CardContent></Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Sections', tab: 'sections' as BuilderTab, icon: Settings, desc: 'Reorder store sections' },
              { label: 'Packages', tab: 'packages' as BuilderTab, icon: Package, desc: 'Select and reorder plans' },
              { label: 'Branding', tab: 'branding' as BuilderTab, icon: Palette, desc: 'Logo, photo, colors' },
              { label: 'Creator Content', tab: 'content' as BuilderTab, icon: Video, desc: 'Videos and embeds' },
            ].map((item) => (
              <Card key={item.label} className="cv-card hover:border-cv-ink transition-colors cursor-pointer" onClick={() => setActiveTab(item.tab)}>
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft mb-3">
                    <item.icon className="h-5 w-5 text-cv-ink" />
                  </div>
                  <p className="text-sm font-bold text-cv-ink mb-1">{item.label}</p>
                  <p className="text-xs text-cv-muted mb-3">{item.desc}</p>
                  <span className="text-xs font-bold text-cv-ink flex items-center gap-1">Manage <ChevronUp className="h-3 w-3 rotate-90" /></span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ─── Sections tab ─── */}
      {activeTab === 'sections' && (
        <div className="max-w-2xl space-y-4">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Store Section Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-cv-muted mb-4">Drag sections up and down to control the order they appear on your storefront. The preview and public store will reflect this exact order.</p>
              {sections.map((section, idx) => {
                const Icon = sectionTypeIcons[section.type];
                return (
                  <div key={section.id} className="flex items-center gap-3 rounded-xl border border-cv-line p-3 bg-white">
                    <div className="flex flex-col">
                      <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="text-cv-muted hover:text-cv-ink disabled:opacity-30 transition-colors">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} className="text-cv-muted hover:text-cv-ink disabled:opacity-30 transition-colors">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft shrink-0">
                      <Icon className="h-4 w-4 text-cv-ink" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-cv-ink">{sectionTypeLabels[section.type]}</p>
                      <p className="text-[10px] text-cv-muted">Position {idx + 1}{!section.visible && ' — hidden'}</p>
                    </div>
                    <button
                      onClick={() => toggleSectionVisible(section.id)}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-colors',
                        section.visible ? 'bg-emerald-50 text-cv-good' : 'bg-cv-soft text-cv-muted'
                      )}
                    >
                      {section.visible ? 'Visible' : 'Hidden'}
                    </button>
                    {!['sec-hero', 'sec-packages', 'sec-benefits'].includes(section.id) && (
                      <button onClick={() => removeSection(section.id)} className="text-cv-muted hover:text-cv-red transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
              <Button variant="outline" className="w-full rounded-xl border-cv-line font-bold mt-3" onClick={addCreatorVideoSection}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Creator Video Section
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Packages tab ─── */}
      {activeTab === 'packages' && (
        <div className="max-w-2xl space-y-4">
          <Card className="cv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-cv-muted">
                <Lock className="h-3.5 w-3.5" />
                Careverse manages all package content — pricing, benefits, and descriptions. You can select and reorder packages on your storefront.
              </div>
            </CardContent>
          </Card>

          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Your Storefront Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedPackages.length === 0 && (
                <p className="text-sm text-cv-muted text-center py-6">No packages selected yet. Add packages from the list below.</p>
              )}
              {selectedPackages.map((pkgName, idx) => {
                const product = mockProducts.find(p => p.name === pkgName);
                if (!product) return null;
                return (
                  <div key={pkgName} className="flex items-center gap-3 rounded-xl border border-cv-line p-3">
                    <div className="flex flex-col">
                      <button onClick={() => movePackage(idx, 'up')} disabled={idx === 0} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button onClick={() => movePackage(idx, 'down')} disabled={idx === selectedPackages.length - 1} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cv-ink text-white text-[10px] font-extrabold">{idx + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-cv-ink">{product.name} {product.popular && <span className="ml-1 inline-flex items-center rounded-full bg-cv-red/10 px-1.5 py-0.5 text-[9px] font-extrabold text-cv-red">POPULAR</span>}</p>
                      <p className="text-xs text-cv-muted">{fmtMoney(product.price)} — {product.billingType.toLowerCase()}</p>
                    </div>
                    <button onClick={() => togglePackage(pkgName)} className="text-xs font-bold text-cv-muted hover:text-cv-red transition-colors">Remove</button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Available Careverse Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {availableProducts.map((product) => {
                const isSelected = selectedPackages.includes(product.name);
                return (
                  <div key={product.id} className="rounded-xl border border-cv-line p-3">
                    <button onClick={() => togglePackage(product.name)} className="w-full flex items-center gap-3 text-left">
                      <div className={cn('flex h-5 w-5 items-center justify-center rounded-md border-2 shrink-0', isSelected ? 'border-cv-ink bg-cv-ink' : 'border-cv-line')}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-cv-ink">{product.name} {product.popular && <span className="ml-1 inline-flex items-center rounded-full bg-cv-red/10 px-1.5 py-0.5 text-[9px] font-extrabold text-cv-red">POPULAR</span>}</p>
                        <p className="text-xs text-cv-muted">{fmtMoney(product.price)} — {product.description.slice(0, 80)}...</p>
                      </div>
                      <Lock className="h-3.5 w-3.5 text-cv-muted shrink-0" />
                    </button>
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-cv-line space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-cv-muted">Package features (managed by Careverse)</p>
                        <div className="flex flex-wrap gap-1">
                          {product.features.map((f, i) => (
                            <span key={i} className="inline-flex items-center gap-0.5 rounded-full bg-cv-soft px-2 py-0.5 text-[10px] font-bold text-cv-body"><Lock className="h-2 w-2" />{f}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Branding tab ─── */}
      {activeTab === 'branding' && (
        <div className="max-w-2xl space-y-4">
          {/* Brand Mode */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Store Brand Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-cv-muted">Control how your storefront presents branding alongside Careverse.</p>
              {([
                { value: 'white-label' as BrandMode, label: 'White-Label', desc: 'Only your brand is visible. No Careverse branding anywhere in the customer-facing presentation.' },
                { value: 'co-branded' as BrandMode, label: 'Co-Branded', desc: 'Your brand is primary. Careverse appears in small controlled places you choose below.' },
                { value: 'careverse-branded' as BrandMode, label: 'Careverse-Branded', desc: 'Full Careverse-forward presentation with your partner identity.' },
              ]).map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => { setBrandingMode(mode.value); markDirty(); }}
                  className={cn(
                    'w-full text-left rounded-xl border p-3 transition-all',
                    brandingMode === mode.value ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink' : 'border-cv-line hover:bg-cv-soft/50'
                  )}
                >
                  <p className="text-sm font-bold text-cv-ink">{mode.label}</p>
                  <p className="text-xs text-cv-muted">{mode.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Careverse Branding Controls — only for co-branded and careverse-branded */}
          {!isWhiteLabel && (
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-cv-ink">Careverse Branding Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-cv-muted">Choose where Careverse branding appears. These are separate from required product and legal information.</p>

                <ToggleRow
                  label="Show Careverse in header"
                  desc="Display a small Careverse mark next to your brand in the store header."
                  value={showCareverseInHeader}
                  onChange={(v) => { setShowCareverseInHeader(v); markDirty(); }}
                />
                <ToggleRow
                  label="Show Careverse in footer"
                  desc="Display Careverse branding in the footer area."
                  value={showCareverseInFooter}
                  onChange={(v) => { setShowCareverseInFooter(v); markDirty(); }}
                />
                <ToggleRow
                  label="Show Careverse Verified profile"
                  desc="Show a partner profile card with optional Careverse Verified treatment."
                  value={showProfile}
                  onChange={(v) => { setShowProfile(v); markDirty(); }}
                />
                {showProfile && (
                  <div className="ml-4 mt-2">
                    <ToggleRow
                      label="Show Careverse Verified badge"
                      desc="Display the verified badge on your profile card."
                      value={showVerifiedBadge}
                      onChange={(v) => { setShowVerifiedBadge(v); markDirty(); }}
                    />
                  </div>
                )}
                <ToggleRow
                  label="Show Powered by Careverse in footer"
                  desc="Independent from the verified profile — controls only the footer attribution."
                  value={showPoweredByFooter}
                  onChange={(v) => { setShowPoweredByFooter(v); markDirty(); }}
                />
              </CardContent>
            </Card>
          )}

          {/* Brand Identity */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Brand Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Storefront name */}
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Storefront Name</Label>
                <Input value={storefrontName} onChange={(e) => { setStorefrontName(e.target.value); markDirty(); }} className="cv-input" />
              </div>

              {/* Logo + Favicon */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Logo</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-cv-line bg-cv-soft overflow-hidden shrink-0">
                      {logo ? <img src={logo} alt="Logo" className="h-full w-full object-contain" /> : <span className="text-lg font-extrabold text-cv-ink">{partnerInitial}</span>}
                    </div>
                    <div className="flex-1">
                      <input ref={logoInputRef} type="file" accept="image/png,image/svg+xml,image/jpeg" className="hidden" onChange={(e) => handleImageUpload(e, setLogo)} />
                      <Button variant="outline" className="rounded-full border-cv-line font-bold text-xs" onClick={() => logoInputRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
                      </Button>
                      {logo && <button onClick={() => { setLogo(''); markDirty(); }} className="text-[10px] font-bold text-cv-red ml-2">Remove</button>}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Favicon</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-cv-line bg-cv-soft overflow-hidden shrink-0">
                      {favicon ? <img src={favicon} alt="Favicon" className="h-full w-full object-contain" /> : <ImageIcon className="h-5 w-5 text-cv-muted" />}
                    </div>
                    <div className="flex-1">
                      <input ref={faviconInputRef} type="file" accept="image/png,image/svg+xml,image/x-icon,image/jpeg" className="hidden" onChange={(e) => handleImageUpload(e, setFavicon)} />
                      <Button variant="outline" className="rounded-full border-cv-line font-bold text-xs" onClick={() => faviconInputRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
                      </Button>
                      {favicon && <button onClick={() => { setFavicon(''); markDirty(); }} className="text-[10px] font-bold text-cv-red ml-2">Remove</button>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner photo + Hero image */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Partner / Profile Image</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-cv-line bg-cv-soft overflow-hidden shrink-0">
                      {partnerPhoto ? <img src={partnerPhoto} alt="Partner" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-cv-muted" />}
                    </div>
                    <div className="flex-1">
                      <input ref={photoInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleImageUpload(e, setPartnerPhoto)} />
                      <Button variant="outline" className="rounded-full border-cv-line font-bold text-xs" onClick={() => photoInputRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
                      </Button>
                      {partnerPhoto && <button onClick={() => { setPartnerPhoto(''); markDirty(); }} className="text-[10px] font-bold text-cv-red ml-2">Remove</button>}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Hero Image</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-cv-line bg-cv-soft overflow-hidden shrink-0">
                      {heroImage ? <img src={heroImage} alt="Hero" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-cv-muted" />}
                    </div>
                    <div className="flex-1">
                      <input ref={heroImageInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleImageUpload(e, setHeroImage)} />
                      <Button variant="outline" className="rounded-full border-cv-line font-bold text-xs" onClick={() => heroImageInputRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload
                      </Button>
                      {heroImage && <button onClick={() => { setHeroImage(''); markDirty(); }} className="text-[10px] font-bold text-cv-red ml-2">Remove</button>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand presentation */}
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Brand Presentation / Tagline</Label>
                <Input value={brandPresentation} onChange={(e) => { setBrandPresentation(e.target.value); markDirty(); }} className="cv-input" maxLength={80} placeholder="Trusted, family-focused care guidance" />
                <p className="text-[10px] text-cv-muted">{brandPresentation.length}/80 — appears under your storefront name</p>
              </div>

              {/* Intro copy */}
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Short Intro Copy</Label>
                <Textarea value={introCopy} onChange={(e) => { setIntroCopy(e.target.value); markDirty(); }} className="cv-input min-h-[70px]" maxLength={200} placeholder="Helping families access better, more affordable care." />
                <p className="text-[10px] text-cv-muted">{introCopy.length}/200</p>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {colorFields.map((field) => (
                  <div key={field.key} className="flex items-center gap-2 rounded-xl border border-cv-line p-2.5">
                    <input
                      type="color"
                      value={branding[field.key] as string}
                      onChange={(e) => updateBranding(field.key, e.target.value)}
                      className="h-9 w-9 rounded-lg border border-cv-line cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-cv-ink">{field.label}</p>
                      <p className="text-[10px] text-cv-muted font-mono">{branding[field.key] as string}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-3 rounded-full border-cv-line font-bold text-xs" onClick={() => { setBranding({ ...DEFAULT_BRANDING }); markDirty(); }}>
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>

          {/* Fonts */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Heading font */}
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Heading Font</Label>
                <select
                  value={branding.headingFont}
                  onChange={(e) => updateBranding('headingFont', e.target.value)}
                  className="cv-input rounded-xl"
                >
                  {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <p className="text-2xl text-cv-ink" style={{ fontFamily: branding.headingFont, fontWeight: branding.headingWeight }}>Quality Care</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Heading Weight</Label>
                <select value={branding.headingWeight} onChange={(e) => updateBranding('headingWeight', e.target.value)} className="cv-input rounded-xl">
                  {FONT_WEIGHTS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>

              {/* Body font */}
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Body Font</Label>
                <select
                  value={branding.bodyFont}
                  onChange={(e) => updateBranding('bodyFont', e.target.value)}
                  className="cv-input rounded-xl"
                >
                  {FONT_OPTIONS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <p className="text-sm text-cv-body" style={{ fontFamily: branding.bodyFont, fontWeight: branding.bodyWeight }}>Helping families access better, more affordable care.</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Body Weight</Label>
                <select value={branding.bodyWeight} onChange={(e) => updateBranding('bodyWeight', e.target.value)} className="cv-input rounded-xl">
                  {FONT_WEIGHTS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>

              {/* Button weight */}
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Button / Text Weight</Label>
                <select value={branding.buttonWeight} onChange={(e) => updateBranding('buttonWeight', e.target.value)} className="cv-input rounded-xl">
                  {FONT_WEIGHTS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-cv-muted">Add your social media profiles. Only configured links will appear as icons in your storefront footer.</p>
              {socialLinks.length === 0 && (
                <div className="rounded-xl border border-dashed border-cv-line p-6 text-center">
                  <p className="text-sm text-cv-muted mb-2">No social links added yet</p>
                </div>
              )}
              {socialLinks.map((link, idx) => {
                const platformLabel = socialPlatforms.find(p => p.value === link.platform)?.label || link.platform;
                return (
                  <div key={link.id} className="flex items-center gap-2 rounded-xl border border-cv-line p-3">
                    <div className="flex flex-col">
                      <button onClick={() => moveSocialLink(idx, 'up')} disabled={idx === 0} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                      <button onClick={() => moveSocialLink(idx, 'down')} disabled={idx === socialLinks.length - 1} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                    </div>
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, { platform: e.target.value as SocialLink['platform'] })}
                      className="text-xs font-bold border border-cv-line rounded-md px-2 py-2 bg-white text-cv-ink shrink-0"
                    >
                      {socialPlatforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                    <Input
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                      className="cv-input text-xs flex-1"
                      placeholder={`https://${platformLabel.toLowerCase()}.com/yourprofile`}
                    />
                    <button
                      onClick={() => updateSocialLink(link.id, { visible: !link.visible })}
                      className={cn('text-[10px] font-bold px-2 py-1 rounded-md transition-colors', link.visible ? 'text-cv-good bg-emerald-50' : 'text-cv-muted bg-cv-soft')}
                    >
                      {link.visible ? 'Show' : 'Hide'}
                    </button>
                    <button onClick={() => removeSocialLink(link.id)} className="text-cv-muted hover:text-cv-red transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              {socialLinks.length < 6 && (
                <Button variant="outline" className="rounded-full border-cv-line font-bold text-xs" onClick={addSocialLink}>
                  <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                  Add social link
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Live branding preview */}
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-cv-line overflow-hidden" style={brandingCssVars}>
                <div className="p-6" style={{ backgroundColor: 'var(--cream)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    {logo ? <img src={logo} alt="Logo" className="h-10 w-10 object-contain rounded-lg" /> : <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-extrabold" style={{ backgroundColor: 'var(--ink)' }}>{partnerInitial}</div>}
                    <div>
                      <p className="text-sm font-extrabold" style={{ color: 'var(--ink)', fontFamily: branding.headingFont }}>{storefrontName || 'Your Store'}</p>
                      {brandPresentation && <p className="text-[10px]" style={{ color: 'var(--muted)' }}>{brandPresentation}</p>}
                    </div>
                  </div>
                  <h2 className="mb-2" style={{ color: 'var(--ink)', fontFamily: branding.headingFont, fontWeight: branding.headingWeight, fontSize: 28 }}>Quality care for your family</h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--body)', fontFamily: branding.bodyFont, fontWeight: branding.bodyWeight }}>{heroSupportingCopy || introCopy || 'Helping families access better, more affordable care.'}</p>
                  <span className="inline-flex items-center rounded-full px-6 py-2.5 text-sm" style={{ backgroundColor: 'var(--ink)', color: branding.buttonTextColor, fontWeight: branding.buttonWeight }}>
                    {ctaText || 'Request Care'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Positioning tab ─── */}
      {activeTab === 'positioning' && (
        <div className="max-w-lg space-y-4">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Hero & Positioning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Hero Headline</Label>
                <Input value={heroHeadline} onChange={(e) => { setHeroHeadline(e.target.value); markDirty(); }} className="cv-input" maxLength={60} placeholder="Quality care for your family" />
                <p className="text-[10px] text-cv-muted">{heroHeadline.length}/60</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Hero Supporting Copy</Label>
                <Textarea value={heroSupportingCopy} onChange={(e) => { setHeroSupportingCopy(e.target.value); markDirty(); }} className="cv-input min-h-[70px]" maxLength={160} placeholder="I help families like yours discover affordable, comprehensive care benefits through Careverse." />
                <p className="text-[10px] text-cv-muted">{heroSupportingCopy.length}/160</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">CTA Button Text</Label>
                <Input value={ctaText} onChange={(e) => { setCtaText(e.target.value); markDirty(); }} className="cv-input" maxLength={20} placeholder="Request Care" />
                <p className="text-[10px] text-cv-muted">{ctaText.length}/20</p>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">About / Positioning Content</Label>
                <Textarea value={aboutContent} onChange={(e) => { setAboutContent(e.target.value); markDirty(); }} className="cv-input min-h-[120px]" maxLength={500} placeholder="Tell families about your care philosophy and experience..." />
                <p className="text-[10px] text-cv-muted">{aboutContent.length}/500</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Creator Content tab ─── */}
      {activeTab === 'content' && (
        <div className="max-w-2xl space-y-4">
          <Card className="cv-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-cv-muted">
                <Video className="h-3.5 w-3.5" />
                Create video sections, add multiple videos to each section, and choose how many columns they display in. Videos can be reordered within a section or moved between sections.
              </div>
            </CardContent>
          </Card>

          {videoSections.length === 0 && (
            <Card className="cv-card">
              <CardContent className="p-8 text-center">
                <Video className="h-10 w-10 text-cv-muted mx-auto mb-3" />
                <p className="text-sm font-bold text-cv-ink mb-1">No video sections yet</p>
                <p className="text-xs text-cv-muted mb-4">Create a video section to start adding videos to your storefront.</p>
                <Button className="cv-btn-primary rounded-full" onClick={() => addContentBlock()}><Plus className="h-4 w-4 mr-1.5" /> Create Video Section</Button>
              </CardContent>
            </Card>
          )}

          {videoSections.map((vSection, sIdx) => {
            const sectionBlocks = blocksBySection(vSection.id);
            const otherSections = videoSections.filter(s => s.id !== vSection.id);
            return (
              <Card key={vSection.id} className="cv-card">
                <CardContent className="p-4 space-y-4">
                  {/* Section header */}
                  <div className="flex items-center gap-2 pb-3 border-b border-cv-line">
                    <div className="flex flex-col">
                      <button onClick={() => moveSection(sections.indexOf(vSection), 'up')} disabled={sections.indexOf(vSection) === 0} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button onClick={() => moveSection(sections.indexOf(vSection), 'down')} disabled={sections.indexOf(vSection) === sections.length - 1} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-soft shrink-0">
                      <Video className="h-4 w-4 text-cv-ink" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-cv-ink">Video Section {sIdx + 1}</p>
                      <p className="text-[10px] text-cv-muted">{sectionBlocks.length} video{sectionBlocks.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={() => { sectionBlocks.forEach(b => removeContentBlock(b.id)); }} className="text-cv-muted hover:text-cv-red transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>

                  {/* Column selector */}
                  <div className="grid gap-2">
                    <Label className="text-xs font-bold text-cv-ink">Columns</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {([1, 2, 3] as const).map((n) => (
                        <button
                          key={n}
                          onClick={() => updateSectionColumns(vSection.id, n)}
                          className={cn(
                            'rounded-lg border p-2 text-center text-[10px] font-bold transition-all',
                            (vSection.columns || 1) === n ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink text-cv-ink' : 'border-cv-line text-cv-muted'
                          )}
                        >
                          {n === 1 ? '1 Column' : n === 2 ? '2 Columns' : '3 Columns'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Videos in this section */}
                  {sectionBlocks.map((block, bIdx) => (
                    <div key={block.id} className="rounded-xl border border-cv-line p-3 space-y-3 bg-cv-cream/40">
                      {/* Block header */}
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <button onClick={() => moveContentBlock(block.id, 'up')} disabled={bIdx === 0} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                          <button onClick={() => moveContentBlock(block.id, 'down')} disabled={bIdx === sectionBlocks.length - 1} className="text-cv-muted hover:text-cv-ink disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                        </div>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cv-ink text-white text-[9px] font-extrabold">{bIdx + 1}</span>
                        <p className="text-xs font-bold text-cv-ink flex-1">{block.title || `Video ${bIdx + 1}`}</p>
                        <button onClick={() => removeContentBlock(block.id)} className="text-cv-muted hover:text-cv-red transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>

                      {/* Source toggle */}
                      <div className="grid grid-cols-2 gap-2">
                        {(['EMBED', 'UPLOAD'] as const).map((src) => (
                          <button
                            key={src}
                            onClick={() => updateContentBlock(block.id, { source: src })}
                            className={cn(
                              'rounded-lg border p-1.5 text-center text-[10px] font-bold transition-all',
                              block.source === src ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink text-cv-ink' : 'border-cv-line text-cv-muted'
                            )}
                          >
                            {src === 'EMBED' ? 'Embed URL' : 'Upload Video'}
                          </button>
                        ))}
                      </div>

                      {/* URL or upload */}
                      {block.source === 'EMBED' ? (
                        <div className="grid gap-1.5">
                          <Input
                            value={block.url}
                            onChange={(e) => updateContentBlock(block.id, { url: e.target.value })}
                            className="cv-input text-xs"
                            placeholder="https://www.youtube.com/embed/..."
                          />
                          {block.url && (
                            <div className="rounded-lg overflow-hidden border border-cv-line">
                              <iframe src={block.url} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="grid gap-1.5">
                          <input
                            ref={(el) => { fileInputRefs.current[block.id] = el; }}
                            type="file"
                            accept="video/mp4,video/webm,video/ogg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleVideoUpload(block.id, file);
                            }}
                          />
                          {videoPreviews[block.id] ? (
                            <div className="relative rounded-lg overflow-hidden border border-cv-line">
                              <video src={videoPreviews[block.id]} controls className="w-full aspect-video" />
                              <button
                                onClick={() => {
                                  URL.revokeObjectURL(videoPreviews[block.id]);
                                  setVideoPreviews(prev => { const c = { ...prev }; delete c[block.id]; return c; });
                                  updateContentBlock(block.id, { videoId: undefined, url: '' });
                                }}
                                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => fileInputRefs.current[block.id]?.click()}
                              className="w-full rounded-lg border-2 border-dashed border-cv-line p-4 text-center hover:border-cv-ink hover:bg-cv-soft/50 transition-colors"
                            >
                              <Upload className="h-5 w-5 text-cv-muted mx-auto mb-1" />
                              <p className="text-[10px] font-bold text-cv-ink">Upload video</p>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Title + Caption */}
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input value={block.title} onChange={(e) => updateContentBlock(block.id, { title: e.target.value })} className="cv-input text-xs" placeholder="Title (optional)" />
                        <Input value={block.caption} onChange={(e) => updateContentBlock(block.id, { caption: e.target.value })} className="cv-input text-xs" placeholder="Caption (optional)" />
                      </div>

                      {/* Move to section */}
                      {otherSections.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-cv-muted">Move to:</span>
                          <select
                            value=""
                            onChange={(e) => { if (e.target.value) moveContentBlockToSection(block.id, e.target.value); }}
                            className="text-[10px] font-bold border border-cv-line rounded-md px-2 py-1 bg-white text-cv-ink"
                          >
                            <option value="">Select section...</option>
                            {otherSections.map((s, i) => (
                              <option key={s.id} value={s.id}>Video Section {videoSections.indexOf(s) + 1}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add video to this section */}
                  <Button variant="outline" className="w-full rounded-xl border-cv-line font-bold text-xs" onClick={() => addContentBlock(vSection.id)}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Video to Section
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          <Button variant="outline" className="w-full rounded-xl border-cv-line font-bold" onClick={() => addContentBlock()}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Video Section
          </Button>
        </div>
      )}

      {/* ─── Domain tab ─── */}
      {activeTab === 'domain' && (
        <div className="max-w-lg space-y-4">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Domain Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Careverse-Hosted URL</Label>
                <div className="flex items-center gap-2 rounded-xl bg-cv-soft p-3">
                  <Globe className="h-4 w-4 text-cv-muted" />
                  <span className="text-sm font-bold text-cv-ink flex-1">{currentPartnerStorefront.url}</span>
                  <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-bold text-cv-ink">Custom Domain</Label>
                <Input value={customDomain} onChange={(e) => { setCustomDomain(e.target.value); markDirty(); }} className="cv-input" placeholder="care.yourdomain.com" />
                <p className="text-[10px] text-cv-muted">
                  {domainStatus === 'CONNECTED' && 'Your custom domain is connected and active.'}
                  {domainStatus === 'PENDING' && 'DNS configuration is in progress. This usually takes 24-48 hours.'}
                  {domainStatus === 'NONE' && 'Enter your custom domain to configure DNS settings.'}
                </p>
              </div>
              {domainStatus !== 'CONNECTED' && customDomain && (
                <Button variant="outline" className="rounded-full border-cv-line font-bold" onClick={() => { setDomainStatus('PENDING'); markDirty(); }}>
                  Configure DNS
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Preview tab ─── */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-cv-ink">Storefront Preview</CardTitle>
                <div className="flex gap-1">
                  {(['desktop', 'mobile'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPreviewMode(mode)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                        previewMode === mode ? 'bg-cv-ink text-white' : 'bg-cv-soft text-cv-muted'
                      )}
                    >
                      {mode === 'desktop' ? 'Desktop' : 'Mobile'}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn('mx-auto rounded-xl overflow-hidden border border-cv-line transition-all', previewMode === 'mobile' ? 'w-[375px]' : 'w-full')} style={{ ...brandingCssVars, backgroundColor: 'var(--cream)' }}>
                {/* Header bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--line)' }}>
                  {logo ? <img src={logo} alt="Logo" className="h-7 w-7 object-contain" /> : <div className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-extrabold" style={{ backgroundColor: 'var(--ink)' }}>{partnerInitial}</div>}
                  <span className="text-sm font-extrabold" style={{ color: 'var(--ink)', fontFamily: branding.headingFont }}>{storefrontName}</span>
                  {brandPresentation && <span className="text-[10px] hidden sm:inline" style={{ color: 'var(--muted)' }}>— {brandPresentation}</span>}
                  {!isWhiteLabel && showCareverseInHeader && (
                    <span className="flex items-center gap-1 ml-1">
                      <CareverseMark size={14} />
                    </span>
                  )}
                  <span className="ml-auto text-[10px] font-bold" style={{ color: 'var(--muted)' }}>Preview</span>
                </div>

                {/* Dynamic sections based on section order */}
                <div className="space-y-0">
                  {sections.filter(s => s.visible).map((section) => {
                    if (section.type === 'hero') {
                      return (
                        <div key={section.id} className="px-6 py-8" style={{ backgroundColor: 'var(--white)' }}>
                          <div className="mb-2" style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
                          <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>Care Benefits</span>
                          {heroImage && <img src={heroImage} alt="Hero" className="w-full rounded-xl mb-4 mt-2 max-h-48 object-cover" />}
                          <h2 className="text-xl font-bold mt-2 mb-3" style={{ color: 'var(--ink)', fontFamily: branding.headingFont, fontWeight: branding.headingWeight }}>{heroHeadline || 'Quality care for your family'}</h2>
                          <p className="text-sm mb-4" style={{ color: 'var(--muted)', fontFamily: branding.bodyFont, fontWeight: branding.bodyWeight }}>{heroSupportingCopy || introCopy}</p>
                          <span className="inline-flex items-center rounded-full px-4 py-2 text-xs" style={{ backgroundColor: 'var(--ink)', color: branding.buttonTextColor, fontWeight: branding.buttonWeight }}>{ctaText || 'Request Care'}</span>
                        </div>
                      );
                    }
                    if (section.type === 'creatorVideo') {
                      const sectionBlocks = contentBlocks.filter(b => b.sectionId === section.id).sort((a, b) => a.order - b.order);
                      if (sectionBlocks.length === 0) return null;
                      const cols = section.columns || 1;
                      return (
                        <div key={section.id} className="px-6 py-6" style={{ backgroundColor: 'var(--cream)' }}>
                          {sectionBlocks[0].title && <p className="text-sm font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: branding.headingFont }}>{sectionBlocks[0].title}</p>}
                          <div className={cn('grid gap-3', gridColsFor(cols))}>
                            {sectionBlocks.map((block) => (
                              <div key={block.id}>
                                {block.source === 'EMBED' && block.url ? (
                                  <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
                                    <iframe src={block.url} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                  </div>
                                ) : block.source === 'UPLOAD' && videoPreviews[block.id] ? (
                                  <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
                                    <video src={videoPreviews[block.id]} controls className="w-full aspect-video" />
                                  </div>
                                ) : (
                                  <div className="rounded-lg border-2 border-dashed aspect-video flex items-center justify-center" style={{ borderColor: 'var(--line)' }}>
                                    <Play className="h-8 w-8" style={{ color: 'var(--muted)' }} />
                                  </div>
                                )}
                                {block.caption && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{block.caption}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (section.type === 'packages') {
                      return (
                        <div key={section.id} className="px-6 py-8" style={{ backgroundColor: 'var(--white)' }}>
                          <div className="mb-2" style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
                          <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>Packages</span>
                          <h3 className="text-lg font-bold mt-1 mb-4" style={{ color: 'var(--ink)', fontFamily: branding.headingFont, fontWeight: branding.headingWeight }}>Choose your plan</h3>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {selectedPackages.map((pkgName) => {
                              const product = mockProducts.find(p => p.name === pkgName);
                              if (!product) return null;
                              return (
                                <div key={product.id} className={cn('rounded-xl border p-4', product.popular ? 'ring-1' : '')} style={{ borderColor: product.popular ? 'var(--ink)' : 'var(--line)' }}>
                                  {product.popular && <span className="text-[9px] font-extrabold" style={{ color: 'var(--red)' }}>MOST POPULAR</span>}
                                  <p className="text-sm font-bold mt-1" style={{ color: 'var(--ink)' }}>{product.name}</p>
                                  <p className="text-lg font-extrabold mt-1" style={{ color: 'var(--ink)' }}>{fmtMoney(product.price)}</p>
                                  <p className="text-[10px] mt-1 line-clamp-2" style={{ color: 'var(--muted)' }}>{product.description}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    if (section.type === 'benefits') {
                      return (
                        <div key={section.id} className="px-6 py-8" style={{ backgroundColor: 'var(--cream)' }}>
                          <div className="mb-2" style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
                          <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>Benefits</span>
                          <h3 className="text-lg font-bold mt-1 mb-4" style={{ color: 'var(--ink)', fontFamily: branding.headingFont, fontWeight: branding.headingWeight }}>What&apos;s included</h3>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {['Included Services', 'Lower Prices', 'Product Specials', 'Free Samples', 'Care Allowance', 'Health Advocacy'].map((b) => (
                              <div key={b} className="flex items-center gap-2 rounded-lg p-2.5 border" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--line)' }}>
                                <Check className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--good)' }} />
                                <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{b}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (section.type === 'about' && aboutContent) {
                      return (
                        <div key={section.id} className="px-6 py-8" style={{ backgroundColor: 'var(--white)' }}>
                          <div className="mb-2" style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
                          <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>About</span>
                          <h3 className="text-lg font-bold mt-1 mb-3" style={{ color: 'var(--ink)', fontFamily: branding.headingFont, fontWeight: branding.headingWeight }}>About {storefrontName}</h3>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', fontFamily: branding.bodyFont, fontWeight: branding.bodyWeight }}>{aboutContent}</p>
                          {showProfile && !isWhiteLabel && (
                            <div className="flex items-center gap-3 mt-4">
                              {partnerPhoto ? <img src={partnerPhoto} alt="Partner" className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-extrabold" style={{ backgroundColor: 'var(--ink)' }}>{partnerInitial}</div>}
                              <div>
                                <p className="text-xs font-bold" style={{ color: 'var(--ink)' }}>{storefrontName}</p>
                                {showVerifiedBadge && <p className="text-[10px]" style={{ color: 'var(--good)' }}>Careverse Verified</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    if (section.type === 'footer') {
                      return (
                        <div key={section.id} className="px-6 py-6" style={{ backgroundColor: 'var(--ink)' }}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs" style={{ color: 'var(--night-text)' }}>© 2026 {storefrontName}</span>
                            {!isWhiteLabel && showPoweredByFooter && (
                              <span className="text-[10px]" style={{ color: 'var(--night-text)' }}>Powered by Careverse</span>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>

                <div className="px-6 py-4 border-t" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--line)' }}>
                  <Button variant="outline" className="w-full rounded-full border-cv-line font-bold text-xs" onClick={() => router.push('/storefront')}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Open Full Storefront
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── Publish tab ─── */}
      {activeTab === 'publish' && (
        <div className="max-w-lg space-y-4">
          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Publish Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-cv-soft p-4">
                <div>
                  <p className="text-sm font-bold text-cv-ink">Current status: {publishStatus}</p>
                  <p className="text-xs text-cv-muted mt-0.5">{publishStatus === 'LIVE' ? 'Your store is visible to customers.' : 'Your store is not yet visible to customers.'}</p>
                </div>
                <StatusBadge status={publishStatus === 'LIVE' ? 'live' : 'draft'} />
              </div>
              <Button
                className={cn('w-full rounded-full', publishStatus === 'LIVE' ? 'cv-btn-outline border-cv-line' : 'cv-btn-primary')}
                onClick={() => {
                  const newStatus = publishStatus === 'LIVE' ? 'DRAFT' : 'LIVE';
                  setPublishStatus(newStatus);
                  markDirty();
                  if (newStatus === 'LIVE') {
                    updateOnboarding({ storePublished: true, storeShared: true });
                  }
                }}
              >
                {publishStatus === 'LIVE' ? 'Unpublish Store' : 'Publish Store'}
              </Button>
              {publishStatus === 'LIVE' && (
                <Button
                  variant="outline"
                  className="w-full rounded-full border-cv-line font-bold mt-3"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share your store
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="cv-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cv-ink">Storefront Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'At least one package selected', done: selectedPackages.length > 0 },
                { label: 'Storefront name set', done: storefrontName.length > 0 },
                { label: 'Intro copy written', done: introCopy.length > 0 },
                { label: 'Hero headline set', done: heroHeadline.length > 0 },
                { label: 'Content blocks added (optional)', done: contentBlocks.length > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn('flex h-5 w-5 items-center justify-center rounded-full', item.done ? 'bg-emerald-50' : 'bg-cv-soft')}>
                    {item.done ? <Check className="h-3 w-3 text-cv-good" /> : <span className="h-1.5 w-1.5 rounded-full bg-cv-muted" />}
                  </div>
                  <span className={cn('text-xs', item.done ? 'font-bold text-cv-ink' : 'text-cv-muted')}>{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <ShareStoreDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        storeUrl={currentPartnerStorefront.url}
        storeName={storefrontName || currentPartnerStorefront.name}
        isPublished={publishStatus === 'LIVE'}
      />
    </div>
  );
}
