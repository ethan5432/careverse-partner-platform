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
  partnerAvailability: 'ALL' | 'CREATOR' | 'BUSINESS' | 'NETWORK';
  benefits: { title: string; description: string }[];
  sourceId?: string;
  syncStatus: 'SYNCED' | 'PENDING_SYNC' | 'LOCAL_ONLY';
  lastSyncedAt?: string;
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
  heroHeadline?: string;
  heroSupportingCopy?: string;
  ctaText?: string;
  aboutContent?: string;
  brandPresentation?: string;
  creatorContent?: MockCreatorContent[];
  sections?: StoreSection[];
}

export type ContentSource = 'EMBED' | 'UPLOAD';
export type ContentPlacement = 'TOP' | 'MIDDLE' | 'BOTTOM';
export type ContentLayout = 'ONE_COLUMN' | 'TWO_COLUMN' | 'THREE_COLUMN';

export type StoreSectionType = 'hero' | 'creatorVideo' | 'packages' | 'benefits' | 'about';

export interface StoreSection {
  id: string;
  type: StoreSectionType;
  visible: boolean;
}

export interface MockCreatorContent {
  id: string;
  source: ContentSource;
  url: string;
  videoId?: string;
  title?: string;
  caption?: string;
  placement: ContentPlacement;
  layout: ContentLayout;
  order: number;
}

export type ConversionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REVERSED';
export type AttributionState = 'ATTRIBUTED' | 'PENDING' | 'UNATTRIBUTED' | 'REVERSED';

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
  attributionState: AttributionState;
  clickId: string;
  customerName: string;
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
  approvedDate?: string;
  paidDate?: string;
  reversedDate?: string;
  conversionId: string;
  plan: string;
  partnerId: string;
  partnerName: string;
  storefrontName: string;
  customerName: string;
  clickId: string;
  attributionSource: string;
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

export interface MockEmailTemplate {
  id: string;
  name: string;
  trigger: string;
  subject: string;
  body: string;
  audience: string;
  enabled: boolean;
  lastEdited: string;
}

export interface MockScheduledEmail {
  id: string;
  campaignId: string;
  campaignName: string;
  audience: string;
  subject: string;
  scheduledDate: string;
  status: 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED';
  recipientCount: number;
}

export type NetworkStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export interface MockNetworkPartner {
  id: string;
  name: string;
  type: PartnerType;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  storefrontName: string;
  storefrontStatus: 'LIVE' | 'DRAFT';
  conversions: number;
  revenue: number;
  commission: number;
  networkEarnings: number;
  joinedDate: string;
  lastActive: string;
  avatarColor: string;
}

export interface MockNetworkActivity {
  id: string;
  networkId: string;
  type: 'PARTNER_JOINED' | 'CONVERSION' | 'PAYOUT' | 'STOREFRONT_PUBLISHED' | 'COMMISSION';
  description: string;
  partnerName: string;
  amount?: number;
  date: string;
}

export interface MockNetwork {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  status: NetworkStatus;
  partnerCount: number;
  activePartnerCount: number;
  conversions: number;
  revenue: number;
  networkEarnings: number;
  createdDate: string;
  partners: MockNetworkPartner[];
  activity: MockNetworkActivity[];
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

export interface MockOrder {
  id: string;
  reference: string;
  productId: string;
  productName: string;
  productPrice: number;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  paymentMethod: 'CARD' | 'PAYPAL' | 'BANK_TRANSFER';
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'CANCELLED';
  date: string;
  partnerId: string;
  partnerName: string;
  storefrontId: string;
  storefrontName: string;
  amount: number;
  membershipId?: string;
}

export interface MockMembership {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  productPrice: number;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate: string;
  endDate: string;
  partnerId: string;
  partnerName: string;
  storefrontId: string;
  storefrontName: string;
  orderId: string;
  orderReference: string;
  benefits: string[];
  benefitDetails: { title: string; description: string }[];
  humanHelpEligible: boolean;
}
