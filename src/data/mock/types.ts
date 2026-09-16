export type PartnerType = 'CREATOR' | 'BUSINESS' | 'NETWORK';
export type PartnerStatus = 'ACTIVE' | 'PENDING' | 'INCOMPLETE' | 'SUSPENDED';
export type AccountState = 'ACTIVE' | 'PENDING' | 'INCOMPLETE' | 'SUSPENDED';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'PARTNER';
  partnerType: PartnerType;
  status: PartnerStatus;
  avatar?: string;
  joinedDate: string;
  lastActive: string;
}

export interface MockPartner {
  id: string;
  name: string;
  email: string;
  type: PartnerType;
  status: PartnerStatus;
  storefrontId: string;
  storefrontName: string;
  conversions: number;
  revenue: number;
  commission: number;
  joinedDate: string;
  lastActive: string;
  avatarColor: string;
}

export interface MockProduct {
  id: string;
  name: string;
  price: number;
  billingType: 'MONTHLY' | 'ANNUAL';
  status: 'ACTIVE' | 'DRAFT';
  availability: 'AVAILABLE' | 'COMING_SOON';
  description: string;
  features: string[];
  popular?: boolean;
}

export interface MockStorefront {
  id: string;
  partnerId: string;
  name: string;
  url: string;
  status: 'LIVE' | 'DRAFT';
  visitors: number;
  conversions: number;
  revenue: number;
  commission: number;
  logo?: string;
  partnerPhoto?: string;
  introCopy: string;
  packages: string[];
  customDomain?: string;
  domainStatus: 'NONE' | 'PENDING' | 'CONNECTED';
}

export type ConversionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REVERSED';

export interface MockConversion {
  id: string;
  plan: string;
  saleAmount: number;
  commission: number;
  status: ConversionStatus;
  date: string;
  partnerId: string;
  partnerName: string;
  storefrontId: string;
  storefrontName: string;
  attributionSource: string;
  customerEmail: string;
}

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REVERSED';

export interface MockCommission {
  id: string;
  saleAmount: number;
  commissionRule: string;
  rate: number;
  commission: number;
  status: CommissionStatus;
  date: string;
  conversionId: string;
  plan: string;
  partnerId: string;
}

export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface MockPayout {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  status: PayoutStatus;
  date: string;
  method: string;
  reference: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  sender: 'PARTNER' | 'ADMIN';
  senderName: string;
  text: string;
  date: string;
}

export interface MockConversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatarColor: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: boolean;
  messages: MockMessage[];
}

export interface MockEmailCampaign {
  id: string;
  name: string;
  audience: string;
  template: string;
  subject: string;
  schedule: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  sentCount: number;
  openRate: number;
}

export interface MockEmailAutomation {
  id: string;
  name: string;
  trigger: string;
  audience: string;
  template: string;
  delay: string;
  status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
}

export interface MockNetwork {
  id: string;
  name: string;
  partnerCount: number;
  conversions: number;
  revenue: number;
  networkEarnings: number;
  partners: MockNetworkPartner[];
}

export interface MockNetworkPartner {
  id: string;
  name: string;
  type: PartnerType;
  conversions: number;
  revenue: number;
  commission: number;
  joinedDate: string;
}

export type ResourceIconKey = 'palette' | 'file-text' | 'info' | 'book-open' | 'video' | 'image' | 'file' | 'layers' | 'megaphone' | 'gift' | 'presentation' | 'users';
export type ResourcePackage = 'CREATOR' | 'BUSINESS' | 'NETWORK';

export interface MockResource {
  id: string;
  title: string;
  type: 'GUIDE' | 'BRAND_ASSET' | 'COPY' | 'PRODUCT_INFO' | 'VIDEO' | 'download' | 'link';
  category: ResourcePackage;
  description: string;
  url: string;
  icon: ResourceIconKey;
}

export interface MockPartnerProfile {
  name: string;
  email: string;
  bio: string;
}

export interface MockStorefrontSettings {
  name: string;
  url: string;
  status: 'LIVE' | 'DRAFT';
}

export interface MockNotificationSettings {
  commissionApproved: boolean;
  payoutSent: boolean;
  newConversion: boolean;
  partnerNewsletter: boolean;
  productUpdates: boolean;
  accountAlerts: boolean;
}

export type PayoutSetupMethod = 'BANK_TRANSFER' | 'PAYPAL';
export type PayoutSetupStatus = 'connected' | 'none' | 'processing';

export interface MockPayoutSetup {
  method: PayoutSetupMethod;
  status: PayoutSetupStatus;
  bankName?: string;
  accountLast4?: string;
  routingNumber?: string;
  paypalEmail?: string;
}

export type AdminActivityType = 'APPLICATION' | 'APPROVAL' | 'STOREFRONT_PUBLISHED' | 'CONVERSION' | 'COMMISSION' | 'PAYOUT';

export interface MockAdminActivity {
  id: string;
  type: AdminActivityType;
  description: string;
  partnerName: string;
  amount?: number;
  date: string;
}

export type PartnerActivityType = 'APPLICATION' | 'APPROVAL' | 'ACTIVATED' | 'STOREFRONT_CREATED' | 'STOREFRONT_PUBLISHED' | 'CONVERSION' | 'COMMISSION' | 'MESSAGE';

export interface MockPartnerActivityItem {
  id: string;
  type: PartnerActivityType;
  description: string;
  date: string;
}

export interface MockNeedsAttentionItem {
  id: string;
  type: 'APPLICATION' | 'ONBOARDING' | 'PAYOUT' | 'STOREFRONT' | 'ACCOUNT';
  title: string;
  description: string;
  partnerId: string;
  partnerName: string;
  severity: 'info' | 'warning' | 'error';
}

export interface MockPartnerNote {
  id: string;
  partnerId: string;
  text: string;
  author: string;
  date: string;
}

export type AdminTimeRange = '7D' | '30D' | '90D' | 'ALL';
export type AdminMetric = 'revenue' | 'conversions' | 'commission';

export interface AdminPerformancePoint {
  date: string;
  revenue: number;
  conversions: number;
  commission: number;
}
