export type WhiteLabelStatus = 'ENABLED' | 'DISABLED' | 'PENDING_REVIEW';

export interface WhiteLabelConfig {
  partnerId: string;
  // Platform branding
  platformName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  // Custom domain
  customDomain: string;
  domainStatus: 'NONE' | 'PENDING' | 'CONNECTED';
  // Login / auth screens
  loginLogoUrl: string;
  loginHeadline: string;
  loginSubtext: string;
  loginBackgroundColor: string;
  // Email branding
  emailFromName: string;
  emailHeaderColor: string;
  emailShowLogo: boolean;
  // Communications
  communicationSenderName: string;
  communicationFooterText: string;
  // Required disclosures (not removable)
  showCareverseDisclosure: boolean;
  showLegalText: boolean;
  // Status
  status: WhiteLabelStatus;
  enabledByAdmin: boolean;
  savedAt: string;
}

// Admin-controlled settings
export interface WhiteLabelAdminConfig {
  whiteLabelEnabled: boolean;
  eligiblePartnerTypes: string[];
  approvedDomains: string[];
  requireDomainVerification: boolean;
  requireCareverseDisclosure: boolean;
  requireLegalText: boolean;
  maxCustomDomains: number;
  savedAt: string;
}

const PARTNER_KEY = (partnerId: string) => `careverse_whitelabel_${partnerId}`;
const ADMIN_KEY = 'careverse_whitelabel_admin';

export const DEFAULT_WHITE_LABEL: Omit<WhiteLabelConfig, 'partnerId'> = {
  platformName: 'Careverse Partners',
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#18191D',
  secondaryColor: '#E1062C',
  accentColor: '#0B9B6B',
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  customDomain: '',
  domainStatus: 'NONE',
  loginLogoUrl: '',
  loginHeadline: 'Welcome back',
  loginSubtext: 'Sign in to your partner dashboard',
  loginBackgroundColor: '#F6F3EE',
  emailFromName: 'Careverse Team',
  emailHeaderColor: '#18191D',
  emailShowLogo: true,
  communicationSenderName: 'Careverse Team',
  communicationFooterText: '',
  showCareverseDisclosure: true,
  showLegalText: true,
  status: 'DISABLED',
  enabledByAdmin: false,
  savedAt: '',
};

const DEFAULT_ADMIN: WhiteLabelAdminConfig = {
  whiteLabelEnabled: true,
  eligiblePartnerTypes: ['BUSINESS'],
  approvedDomains: [],
  requireDomainVerification: true,
  requireCareverseDisclosure: true,
  requireLegalText: true,
  maxCustomDomains: 1,
  savedAt: '',
};

export function loadWhiteLabelConfig(partnerId: string): WhiteLabelConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_WHITE_LABEL, partnerId, savedAt: '' };
  try {
    const raw = localStorage.getItem(PARTNER_KEY(partnerId));
    if (!raw) return { ...DEFAULT_WHITE_LABEL, partnerId, savedAt: '' };
    const parsed = JSON.parse(raw) as Partial<WhiteLabelConfig>;
    return {
      ...DEFAULT_WHITE_LABEL,
      ...parsed,
      partnerId,
      showCareverseDisclosure: true,
      showLegalText: true,
    } as WhiteLabelConfig;
  } catch {
    return { ...DEFAULT_WHITE_LABEL, partnerId, savedAt: '' };
  }
}

export function saveWhiteLabelConfig(config: WhiteLabelConfig): void {
  if (typeof window === 'undefined') return;
  const toSave = { ...config, savedAt: new Date().toISOString(), showCareverseDisclosure: true, showLegalText: true };
  localStorage.setItem(PARTNER_KEY(config.partnerId), JSON.stringify(toSave));
}

export function loadWhiteLabelAdminConfig(): WhiteLabelAdminConfig {
  if (typeof window === 'undefined') return DEFAULT_ADMIN;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return DEFAULT_ADMIN;
    const parsed = JSON.parse(raw) as Partial<WhiteLabelAdminConfig>;
    return { ...DEFAULT_ADMIN, ...parsed } as WhiteLabelAdminConfig;
  } catch {
    return DEFAULT_ADMIN;
  }
}

export function saveWhiteLabelAdminConfig(config: WhiteLabelAdminConfig): void {
  if (typeof window === 'undefined') return;
  const toSave = { ...config, savedAt: new Date().toISOString() };
  localStorage.setItem(ADMIN_KEY, JSON.stringify(toSave));
}

export function isWhiteLabelEligible(partnerType: string, adminConfig?: WhiteLabelAdminConfig): boolean {
  const cfg = adminConfig || loadWhiteLabelAdminConfig();
  return cfg.whiteLabelEnabled && cfg.eligiblePartnerTypes.includes(partnerType);
}

export const WL_FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Lora', value: 'Lora, serif' },
  { label: 'Playfair Display', value: '"Playfair Display", serif' },
  { label: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
] as const;
