import type {
  MockUser, MockPartner, MockProduct, MockStorefront,
  MockConversion, MockCommission, MockPayout, MockConversation,
  MockEmailCampaign, MockEmailAutomation, MockNetwork, MockResource,
  MockPartnerProfile, MockStorefrontSettings, MockNotificationSettings,
  MockPayoutSetup,
} from './types';

export const mockUsers: MockUser[] = [
  { id: 'u-admin-1', name: 'Sarah Chen', email: 'admin@careverse.ai', role: 'ADMIN', partnerType: 'CREATOR', status: 'ACTIVE', joinedDate: '2025-01-15', lastActive: '2026-09-15' },
  { id: 'u-partner-1', name: 'Marcus Johnson', email: 'marcus@carepartners.co', role: 'PARTNER', partnerType: 'NETWORK', status: 'ACTIVE', joinedDate: '2025-03-22', lastActive: '2026-09-14' },
  { id: 'u-partner-2', name: 'Emily Rodriguez', email: 'emily@healthhub.com', role: 'PARTNER', partnerType: 'CREATOR', status: 'ACTIVE', joinedDate: '2025-05-10', lastActive: '2026-09-13' },
  { id: 'u-partner-3', name: 'David Kim', email: 'david@careagency.io', role: 'PARTNER', partnerType: 'BUSINESS', status: 'ACTIVE', joinedDate: '2025-06-01', lastActive: '2026-09-12' },
  { id: 'u-partner-4', name: 'Lisa Thompson', email: 'lisa@wellnessgroup.net', role: 'PARTNER', partnerType: 'CREATOR', status: 'PENDING', joinedDate: '2026-09-01', lastActive: '2026-09-01' },
  { id: 'u-partner-5', name: 'James Wilson', email: 'james@carecollective.org', role: 'PARTNER', partnerType: 'BUSINESS', status: 'INCOMPLETE', joinedDate: '2026-08-20', lastActive: '2026-08-25' },
  { id: 'u-partner-6', name: 'Aisha Patel', email: 'aisha@familycarepartners.com', role: 'PARTNER', partnerType: 'BUSINESS', status: 'SUSPENDED', joinedDate: '2025-04-12', lastActive: '2026-07-30' },
];

export const mockPartners: MockPartner[] = [
  { id: 'p-1', name: 'Marcus Johnson', email: 'marcus@carepartners.co', type: 'NETWORK', status: 'ACTIVE', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', conversions: 142, revenue: 28480, commission: 5696, joinedDate: '2025-03-22', lastActive: '2026-09-14', avatarColor: '#E1062C' },
  { id: 'p-2', name: 'Emily Rodriguez', email: 'emily@healthhub.com', type: 'CREATOR', status: 'ACTIVE', storefrontId: 's-2', storefrontName: 'Emily\'s Health Hub', conversions: 87, revenue: 17400, commission: 3480, joinedDate: '2025-05-10', lastActive: '2026-09-13', avatarColor: '#0B9B6B' },
  { id: 'p-3', name: 'David Kim', email: 'david@careagency.io', type: 'BUSINESS', status: 'ACTIVE', storefrontId: 's-3', storefrontName: 'Care Agency Direct', conversions: 64, revenue: 12800, commission: 2560, joinedDate: '2025-06-01', lastActive: '2026-09-12', avatarColor: '#18191D' },
  { id: 'p-4', name: 'Lisa Thompson', email: 'lisa@wellnessgroup.net', type: 'CREATOR', status: 'PENDING', storefrontId: 's-4', storefrontName: 'Wellness with Lisa', conversions: 0, revenue: 0, commission: 0, joinedDate: '2026-09-01', lastActive: '2026-09-01', avatarColor: '#6B6E76' },
  { id: 'p-5', name: 'James Wilson', email: 'james@carecollective.org', type: 'BUSINESS', status: 'INCOMPLETE', storefrontId: 's-5', storefrontName: 'Care Collective', conversions: 0, revenue: 0, commission: 0, joinedDate: '2026-08-20', lastActive: '2026-08-25', avatarColor: '#4A4D55' },
  { id: 'p-6', name: 'Aisha Patel', email: 'aisha@familycarepartners.com', type: 'BUSINESS', status: 'SUSPENDED', storefrontId: 's-6', storefrontName: 'Family Care Partners', conversions: 23, revenue: 4600, commission: 920, joinedDate: '2025-04-12', lastActive: '2026-07-30', avatarColor: '#B10522' },
  { id: 'p-7', name: 'Tom Bradley', email: 'tom@bradleynetwork.com', type: 'NETWORK', status: 'ACTIVE', storefrontId: 's-7', storefrontName: 'Bradley Care Network', conversions: 98, revenue: 19600, commission: 3920, joinedDate: '2025-02-14', lastActive: '2026-09-11', avatarColor: '#0B9B6B' },
  { id: 'p-8', name: 'Nina Garcia', email: 'nina@carereferrals.co', type: 'CREATOR', status: 'ACTIVE', storefrontId: 's-8', storefrontName: 'Nina\'s Care Referrals', conversions: 51, revenue: 10200, commission: 2040, joinedDate: '2025-07-08', lastActive: '2026-09-10', avatarColor: '#E1062C' },
  { id: 'p-9', name: 'Robert Chang', email: 'robert@changcare.com', type: 'BUSINESS', status: 'ACTIVE', storefrontId: 's-9', storefrontName: 'Chang Care Solutions', conversions: 38, revenue: 7600, commission: 1520, joinedDate: '2025-08-15', lastActive: '2026-09-09', avatarColor: '#18191D' },
  { id: 'p-10', name: 'Sophie Martin', email: 'sophie@martinwellness.com', type: 'CREATOR', status: 'ACTIVE', storefrontId: 's-10', storefrontName: 'Sophie\'s Wellness Corner', conversions: 29, revenue: 5800, commission: 1160, joinedDate: '2025-09-20', lastActive: '2026-09-08', avatarColor: '#0B9B6B' },
];

export const mockProducts: MockProduct[] = [
  { id: 'prod-family', name: 'Family', price: 49, billingType: 'MONTHLY', status: 'ACTIVE', availability: 'AVAILABLE', description: 'Essential care benefits for the whole family — included services, lower prices on other care, product specials, and free samples.', features: ['Included services', 'Lower prices on other care', 'Product specials', 'Free samples & coupons', 'Care allowance', 'Health Advocacy where applicable'] },
  { id: 'prod-family-plus', name: 'Family Plus', price: 89, billingType: 'MONTHLY', status: 'ACTIVE', availability: 'AVAILABLE', description: 'Everything in Family, with enhanced benefits and expanded care allowance for families who need more coverage.', features: ['Everything in Family', 'Enhanced care allowance', 'Priority Health Advocacy', 'Expanded product specials', 'Exclusive free samples'], popular: true },
  { id: 'prod-care-circle', name: 'Care Circle', price: 149, billingType: 'MONTHLY', status: 'ACTIVE', availability: 'AVAILABLE', description: 'The most comprehensive Careverse plan — full benefits for extended families and care circles with the highest level of support.', features: ['Everything in Family Plus', 'Full care circle coverage', 'Dedicated Health Advocate', 'Premium product specials', 'Concierge care coordination'] },
];

export const mockStorefronts: MockStorefront[] = [
  { id: 's-1', partnerId: 'p-1', name: 'Marcus Care Partners', url: 'careverse.ai/s/marcus', status: 'LIVE', visitors: 3240, conversions: 142, revenue: 28480, commission: 5696, introCopy: 'Helping families access better, more affordable care.', packages: ['Family', 'Family Plus', 'Care Circle'], domainStatus: 'CONNECTED', customDomain: 'marcus.carepartners.co' },
  { id: 's-2', partnerId: 'p-2', name: 'Emily\'s Health Hub', url: 'careverse.ai/s/emily', status: 'LIVE', visitors: 1890, conversions: 87, revenue: 17400, commission: 3480, introCopy: 'Your trusted guide to family care benefits.', packages: ['Family', 'Family Plus'], domainStatus: 'NONE' },
  { id: 's-3', partnerId: 'p-3', name: 'Care Agency Direct', url: 'careverse.ai/s/david', status: 'LIVE', visitors: 1240, conversions: 64, revenue: 12800, commission: 2560, introCopy: 'Direct access to the care your family deserves.', packages: ['Family', 'Family Plus', 'Care Circle'], domainStatus: 'PENDING', customDomain: 'care.careagency.io' },
  { id: 's-4', partnerId: 'p-4', name: 'Wellness with Lisa', url: 'careverse.ai/s/lisa', status: 'DRAFT', visitors: 0, conversions: 0, revenue: 0, commission: 0, introCopy: '', packages: ['Family'], domainStatus: 'NONE' },
  { id: 's-5', partnerId: 'p-5', name: 'Care Collective', url: 'careverse.ai/s/james', status: 'DRAFT', visitors: 0, conversions: 0, revenue: 0, commission: 0, introCopy: '', packages: [], domainStatus: 'NONE' },
  { id: 's-6', partnerId: 'p-6', name: 'Family Care Partners', url: 'careverse.ai/s/aisha', status: 'LIVE', visitors: 560, conversions: 23, revenue: 4600, commission: 920, introCopy: 'Affordable family care solutions.', packages: ['Family'], domainStatus: 'NONE' },
  { id: 's-7', partnerId: 'p-7', name: 'Bradley Care Network', url: 'careverse.ai/s/tom', status: 'LIVE', visitors: 2890, conversions: 98, revenue: 19600, commission: 3920, introCopy: 'Building healthier communities together.', packages: ['Family', 'Family Plus', 'Care Circle'], domainStatus: 'CONNECTED', customDomain: 'care.bradleynetwork.com' },
  { id: 's-8', partnerId: 'p-8', name: 'Nina\'s Care Referrals', url: 'careverse.ai/s/nina', status: 'LIVE', visitors: 1560, conversions: 51, revenue: 10200, commission: 2040, introCopy: 'Simple care benefits for every family.', packages: ['Family', 'Family Plus'], domainStatus: 'NONE' },
  { id: 's-9', partnerId: 'p-9', name: 'Chang Care Solutions', url: 'careverse.ai/s/robert', status: 'LIVE', visitors: 980, conversions: 38, revenue: 7600, commission: 1520, introCopy: 'Expert guidance for your family\'s care.', packages: ['Family', 'Care Circle'], domainStatus: 'NONE' },
  { id: 's-10', partnerId: 'p-10', name: 'Sophie\'s Wellness Corner', url: 'careverse.ai/s/sophie', status: 'DRAFT', visitors: 320, conversions: 29, revenue: 5800, commission: 1160, introCopy: 'Wellness made simple for families.', packages: ['Family'], domainStatus: 'NONE' },
];

export const mockConversions: MockConversion[] = [
  { id: 'c-1', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'APPROVED', date: '2026-09-14', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', customerEmail: 'j.smith@email.com' },
  { id: 'c-2', plan: 'Care Circle', saleAmount: 149, commission: 29.80, status: 'APPROVED', date: '2026-09-13', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', customerEmail: 'm.park@email.com' },
  { id: 'c-3', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'PENDING', date: '2026-09-12', partnerId: 'p-2', partnerName: 'Emily Rodriguez', storefrontId: 's-2', storefrontName: 'Emily\'s Health Hub', attributionSource: 'Social Media', customerEmail: 'r.davis@email.com' },
  { id: 'c-4', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'PAID', date: '2026-09-10', partnerId: 'p-2', partnerName: 'Emily Rodriguez', storefrontId: 's-2', storefrontName: 'Emily\'s Health Hub', attributionSource: 'Storefront Link', customerEmail: 'k.chen@email.com' },
  { id: 'c-5', plan: 'Care Circle', saleAmount: 149, commission: 29.80, status: 'APPROVED', date: '2026-09-09', partnerId: 'p-3', partnerName: 'David Kim', storefrontId: 's-3', storefrontName: 'Care Agency Direct', attributionSource: 'Direct Referral', customerEmail: 'a.morales@email.com' },
  { id: 'c-6', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'REVERSED', date: '2026-09-08', partnerId: 'p-3', partnerName: 'David Kim', storefrontId: 's-3', storefrontName: 'Care Agency Direct', attributionSource: 'Storefront Link', customerEmail: 'b.foster@email.com' },
  { id: 'c-7', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'PAID', date: '2026-09-05', partnerId: 'p-7', partnerName: 'Tom Bradley', storefrontId: 's-7', storefrontName: 'Bradley Care Network', attributionSource: 'Storefront Link', customerEmail: 'c.nguyen@email.com' },
  { id: 'c-8', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'APPROVED', date: '2026-09-04', partnerId: 'p-8', partnerName: 'Nina Garcia', storefrontId: 's-8', storefrontName: 'Nina\'s Care Referrals', attributionSource: 'Email Campaign', customerEmail: 'd.brooks@email.com' },
  { id: 'c-9', plan: 'Care Circle', saleAmount: 149, commission: 29.80, status: 'PENDING', date: '2026-09-03', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', customerEmail: 'e.santos@email.com' },
  { id: 'c-10', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'APPROVED', date: '2026-09-01', partnerId: 'p-9', partnerName: 'Robert Chang', storefrontId: 's-9', storefrontName: 'Chang Care Solutions', attributionSource: 'Storefront Link', customerEmail: 'f.khan@email.com' },
  { id: 'c-11', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'PAID', date: '2026-08-28', partnerId: 'p-7', partnerName: 'Tom Bradley', storefrontId: 's-7', storefrontName: 'Bradley Care Network', attributionSource: 'Social Media', customerEmail: 'g.russell@email.com' },
  { id: 'c-12', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'APPROVED', date: '2026-08-25', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', customerEmail: 'h.adams@email.com' },
];

export const mockCommissions: MockCommission[] = mockConversions.map(c => ({
  id: `cm-${c.id}`, saleAmount: c.saleAmount, commissionRule: 'Standard 20%', rate: 0.20, commission: c.commission, status: c.status as any, date: c.date, conversionId: c.id, plan: c.plan, partnerId: c.partnerId,
}));

export const mockPayouts: MockPayout[] = [
  { id: 'po-1', partnerId: 'p-1', partnerName: 'Marcus Johnson', amount: 1240, status: 'PAID', date: '2026-09-01', method: 'Bank Transfer', reference: 'PAY-2026-0901' },
  { id: 'po-2', partnerId: 'p-2', partnerName: 'Emily Rodriguez', amount: 860, status: 'PAID', date: '2026-09-01', method: 'Bank Transfer', reference: 'PAY-2026-0902' },
  { id: 'po-3', partnerId: 'p-3', partnerName: 'David Kim', amount: 540, status: 'PROCESSING', date: '2026-09-10', method: 'Bank Transfer', reference: 'PAY-2026-0910' },
  { id: 'po-4', partnerId: 'p-7', partnerName: 'Tom Bradley', amount: 920, status: 'PAID', date: '2026-09-01', method: 'PayPal', reference: 'PAY-2026-0903' },
  { id: 'po-5', partnerId: 'p-8', partnerName: 'Nina Garcia', amount: 480, status: 'PENDING', date: '2026-09-12', method: 'Bank Transfer', reference: 'PAY-2026-0912' },
  { id: 'po-6', partnerId: 'p-9', partnerName: 'Robert Chang', amount: 320, status: 'PAID', date: '2026-08-15', method: 'Bank Transfer', reference: 'PAY-2026-0815' },
  { id: 'po-7', partnerId: 'p-1', partnerName: 'Marcus Johnson', amount: 1180, status: 'PAID', date: '2026-08-01', method: 'Bank Transfer', reference: 'PAY-2026-0801' },
  { id: 'po-8', partnerId: 'p-10', partnerName: 'Sophie Martin', amount: 240, status: 'FAILED', date: '2026-09-05', method: 'Bank Transfer', reference: 'PAY-2026-0905' },
];

export const mockConversations: MockConversation[] = [
  { id: 'conv-1', partnerId: 'p-1', partnerName: 'Marcus Johnson', partnerAvatarColor: '#E1062C', lastMessage: 'Thanks for the update on the payout schedule!', lastMessageDate: '2026-09-14', unread: false,
    messages: [
      { id: 'm-1', conversationId: 'conv-1', sender: 'PARTNER', senderName: 'Marcus Johnson', text: 'Hi team, when can I expect the next payout?', date: '2026-09-13' },
      { id: 'm-2', conversationId: 'conv-1', sender: 'ADMIN', senderName: 'Careverse Team', text: 'Hi Marcus! Payouts are processed on the 1st of each month. Your next one is scheduled for October 1st.', date: '2026-09-13' },
      { id: 'm-3', conversationId: 'conv-1', sender: 'PARTNER', senderName: 'Marcus Johnson', text: 'Thanks for the update on the payout schedule!', date: '2026-09-14' },
    ],
  },
  { id: 'conv-2', partnerId: 'p-2', partnerName: 'Emily Rodriguez', partnerAvatarColor: '#0B9B6B', lastMessage: 'Can I add Care Circle to my storefront?', lastMessageDate: '2026-09-12', unread: true,
    messages: [
      { id: 'm-4', conversationId: 'conv-2', sender: 'PARTNER', senderName: 'Emily Rodriguez', text: 'Can I add Care Circle to my storefront?', date: '2026-09-12' },
    ],
  },
  { id: 'conv-3', partnerId: 'p-3', partnerName: 'David Kim', partnerAvatarColor: '#18191D', lastMessage: 'My custom domain isn\'t working yet.', lastMessageDate: '2026-09-10', unread: true,
    messages: [
      { id: 'm-5', conversationId: 'conv-3', sender: 'PARTNER', senderName: 'David Kim', text: 'My custom domain isn\'t working yet.', date: '2026-09-10' },
      { id: 'm-6', conversationId: 'conv-3', sender: 'ADMIN', senderName: 'Careverse Team', text: 'We\'re looking into the DNS configuration for care.careagency.io. We\'ll have an update within 24 hours.', date: '2026-09-10' },
    ],
  },
  { id: 'conv-4', partnerId: 'p-7', partnerName: 'Tom Bradley', partnerAvatarColor: '#0B9B6B', lastMessage: 'The new network dashboard looks great!', lastMessageDate: '2026-09-08', unread: false,
    messages: [
      { id: 'm-7', conversationId: 'conv-4', sender: 'PARTNER', senderName: 'Tom Bradley', text: 'The new network dashboard looks great!', date: '2026-09-08' },
      { id: 'm-8', conversationId: 'conv-4', sender: 'ADMIN', senderName: 'Careverse Team', text: 'Glad you like it, Tom! We\'re rolling out more network features soon.', date: '2026-09-08' },
    ],
  },
];

export const mockEmailCampaigns: MockEmailCampaign[] = [
  { id: 'ec-1', name: 'Welcome New Partners', audience: 'New Partners', template: 'Welcome Email', subject: 'Welcome to Careverse Partners', schedule: 'Sent on signup', status: 'SENT', sentCount: 42, openRate: 0.72 },
  { id: 'ec-2', name: 'September Newsletter', audience: 'All Partners', template: 'Monthly Newsletter', subject: 'What\'s new at Careverse this September', schedule: '2026-09-20', status: 'SCHEDULED', sentCount: 0, openRate: 0 },
  { id: 'ec-3', name: 'Care Circle Launch', audience: 'Active Partners', template: 'Product Launch', subject: 'Introducing Care Circle — our most comprehensive plan', schedule: '2026-09-25', status: 'DRAFT', sentCount: 0, openRate: 0 },
];

export const mockEmailAutomations: MockEmailAutomation[] = [
  { id: 'ea-1', name: 'Partner Approved', trigger: 'Partner status → ACTIVE', audience: 'Partners', template: 'Approval Email', delay: 'Immediate', status: 'ACTIVE' },
  { id: 'ea-2', name: 'Account Activated', trigger: 'Account activated', audience: 'Partners', template: 'Activation Email', delay: 'Immediate', status: 'ACTIVE' },
  { id: 'ea-3', name: 'First Conversion', trigger: 'First conversion recorded', audience: 'Partners', template: 'First Conversion', delay: 'Immediate', status: 'ACTIVE' },
  { id: 'ea-4', name: 'Storefront Published', trigger: 'Storefront → LIVE', audience: 'Partners', template: 'Publish Confirmation', delay: 'Immediate', status: 'ACTIVE' },
  { id: 'ea-5', name: 'Commission Approved', trigger: 'Commission → APPROVED', audience: 'Partners', template: 'Commission Update', delay: 'Immediate', status: 'ACTIVE' },
  { id: 'ea-6', name: 'Payout Sent', trigger: 'Payout → PAID', audience: 'Partners', template: 'Payout Notification', delay: 'Immediate', status: 'ACTIVE' },
  { id: 'ea-7', name: 'No Activity Reminder', trigger: 'No conversions in 14 days', audience: 'Active Partners', template: 'Re-engagement', delay: '14 days', status: 'PAUSED' },
];

export const mockNetworks: MockNetwork[] = [
  { id: 'net-1', name: 'Marcus Care Network', partnerCount: 12, conversions: 340, revenue: 68000, networkEarnings: 6800,
    partners: [
      { id: 'np-1', name: 'Emily Rodriguez', type: 'CREATOR', conversions: 87, revenue: 17400, commission: 3480, joinedDate: '2025-05-10' },
      { id: 'np-2', name: 'David Kim', type: 'BUSINESS', conversions: 64, revenue: 12800, commission: 2560, joinedDate: '2025-06-01' },
      { id: 'np-3', name: 'Nina Garcia', type: 'CREATOR', conversions: 51, revenue: 10200, commission: 2040, joinedDate: '2025-07-08' },
      { id: 'np-4', name: 'Robert Chang', type: 'BUSINESS', conversions: 38, revenue: 7600, commission: 1520, joinedDate: '2025-08-15' },
      { id: 'np-5', name: 'Sophie Martin', type: 'CREATOR', conversions: 29, revenue: 5800, commission: 1160, joinedDate: '2025-09-20' },
    ],
  },
  { id: 'net-2', name: 'Bradley Care Network', partnerCount: 8, conversions: 195, revenue: 39000, networkEarnings: 3900,
    partners: [
      { id: 'np-6', name: 'Aisha Patel', type: 'BUSINESS', conversions: 23, revenue: 4600, commission: 920, joinedDate: '2025-04-12' },
      { id: 'np-7', name: 'Lisa Thompson', type: 'CREATOR', conversions: 31, revenue: 6200, commission: 1240, joinedDate: '2025-07-15' },
      { id: 'np-8', name: 'James Wilson', type: 'BUSINESS', conversions: 18, revenue: 3600, commission: 720, joinedDate: '2025-08-20' },
    ],
  },
];

export const mockResources: MockResource[] = [
  { id: 'r-1', title: 'Careverse Brand Guidelines', type: 'BRAND_ASSET', category: 'CREATOR', description: 'Logos, colors, and typography for your storefront and promotions.', url: '#', icon: 'palette' },
  { id: 'r-2', title: 'Approved Social Media Copy', type: 'COPY', category: 'CREATOR', description: 'Pre-written posts for Instagram, TikTok, and Facebook.', url: '#', icon: 'file-text' },
  { id: 'r-3', title: 'Product Information Sheet', type: 'PRODUCT_INFO', category: 'CREATOR', description: 'Complete details on Family, Family Plus, and Care Circle plans.', url: '#', icon: 'info' },
  { id: 'r-4', title: 'Getting Started Guide', type: 'GUIDE', category: 'CREATOR', description: 'Everything you need to launch your storefront and make your first sale.', url: '#', icon: 'book-open' },
  { id: 'r-5', title: 'How to Promote Careverse', type: 'VIDEO', category: 'CREATOR', description: 'A 10-minute walkthrough of best practices for promoting your storefront.', url: '#', icon: 'video' },
  { id: 'r-6', title: 'Agency Brand Kit', type: 'BRAND_ASSET', category: 'BUSINESS', description: 'Extended brand assets for agencies managing multiple storefronts.', url: '#', icon: 'palette' },
  { id: 'r-7', title: 'Client Onboarding Templates', type: 'COPY', category: 'BUSINESS', description: 'Email and document templates for onboarding your clients to Careverse.', url: '#', icon: 'file-text' },
  { id: 'r-8', title: 'Full Product Catalog', type: 'PRODUCT_INFO', category: 'BUSINESS', description: 'Detailed catalog with pricing, features, and comparison sheets for all plans.', url: '#', icon: 'info' },
  { id: 'r-9', title: 'Agency Playbook', type: 'GUIDE', category: 'BUSINESS', description: 'How to build and manage a portfolio of Careverse storefronts for your clients.', url: '#', icon: 'book-open' },
  { id: 'r-10', title: 'Client Management Best Practices', type: 'VIDEO', category: 'BUSINESS', description: 'Strategies for managing multiple partner accounts and reporting to clients.', url: '#', icon: 'video' },
  { id: 'r-11', title: 'Network Brand System', type: 'BRAND_ASSET', category: 'NETWORK', description: 'Complete brand system for network-level branding across all sub-partner storefronts.', url: '#', icon: 'palette' },
  { id: 'r-12', title: 'Network Recruiting Kit', type: 'COPY', category: 'NETWORK', description: 'Outreach templates and scripts for recruiting partners into your network.', url: '#', icon: 'file-text' },
  { id: 'r-13', title: 'Network Product Guide', type: 'PRODUCT_INFO', category: 'NETWORK', description: 'Advanced product documentation with network-specific commission structures.', url: '#', icon: 'info' },
  { id: 'r-14', title: 'Network Growth Playbook', type: 'GUIDE', category: 'NETWORK', description: 'Comprehensive guide to building, scaling, and managing a successful Careverse network.', url: '#', icon: 'book-open' },
  { id: 'r-15', title: 'Network Management Dashboard', type: 'VIDEO', category: 'NETWORK', description: 'Full walkthrough of the network management tools and reporting features.', url: '#', icon: 'video' },
];

export const currentPartner = mockPartners[0];
export const currentPartnerStorefront = mockStorefronts[0];

export const partnerDashboardStats = {
  available: 5696,
  pending: 1240,
  paid: 4456,
  conversions: 142,
  visitors: 3240,
  conversionRate: 4.38,
};

export const partnerPerformanceData = {
  '7D': [
    { date: 'Sep 9', revenue: 580, conversions: 4, commission: 116 },
    { date: 'Sep 10', revenue: 890, conversions: 6, commission: 178 },
    { date: 'Sep 11', revenue: 490, conversions: 3, commission: 98 },
    { date: 'Sep 12', revenue: 740, conversions: 5, commission: 148 },
    { date: 'Sep 13', revenue: 1030, conversions: 7, commission: 206 },
    { date: 'Sep 14', revenue: 680, conversions: 5, commission: 136 },
    { date: 'Sep 15', revenue: 890, conversions: 6, commission: 178 },
  ],
  '30D': [
    { date: 'Week 1', revenue: 4200, conversions: 28, commission: 840 },
    { date: 'Week 2', revenue: 5100, conversions: 34, commission: 1020 },
    { date: 'Week 3', revenue: 3800, conversions: 25, commission: 760 },
    { date: 'Week 4', revenue: 4900, conversions: 33, commission: 980 },
  ],
  '90D': [
    { date: 'Month 1', revenue: 12400, conversions: 82, commission: 2480 },
    { date: 'Month 2', revenue: 14800, conversions: 98, commission: 2960 },
    { date: 'Month 3', revenue: 11280, conversions: 75, commission: 2256 },
  ],
  'ALL': [
    { date: 'Q1 2025', revenue: 8200, conversions: 54, commission: 1640 },
    { date: 'Q2 2025', revenue: 15600, conversions: 104, commission: 3120 },
    { date: 'Q3 2025', revenue: 18900, conversions: 126, commission: 3780 },
    { date: 'Q4 2025', revenue: 14200, conversions: 95, commission: 2840 },
    { date: 'Q1 2026', revenue: 16800, conversions: 112, commission: 3360 },
    { date: 'Q2 2026', revenue: 19200, conversions: 128, commission: 3840 },
    { date: 'Q3 2026', revenue: 12480, conversions: 83, commission: 2496 },
  ],
};

export const adminDashboardStats = {
  totalRevenue: 106480,
  totalConversions: 672,
  totalCommissions: 21296,
  activePartners: 8,
  pendingPartners: 1,
  suspendedPartners: 1,
  totalStorefronts: 10,
  liveStorefronts: 8,
};

export const adminPerformanceData = [
  { date: 'Jan', revenue: 4200, conversions: 28 },
  { date: 'Feb', revenue: 5800, conversions: 39 },
  { date: 'Mar', revenue: 6400, conversions: 43 },
  { date: 'Apr', revenue: 7100, conversions: 47 },
  { date: 'May', revenue: 8200, conversions: 55 },
  { date: 'Jun', revenue: 9100, conversions: 61 },
  { date: 'Jul', revenue: 8800, conversions: 59 },
  { date: 'Aug', revenue: 10200, conversions: 68 },
  { date: 'Sep', revenue: 6480, conversions: 43 },
];

export const mockPartnerProfile: MockPartnerProfile = {
  name: 'Marcus Johnson',
  email: 'marcus@carepartners.co',
  bio: 'Helping families access better, more affordable care through the Careverse platform.',
};

export const mockStorefrontSettings: MockStorefrontSettings = {
  name: 'Marcus Care Partners',
  url: 'careverse.ai/s/marcus',
  status: 'LIVE',
};

export const mockNotificationSettings: MockNotificationSettings = {
  commissionApproved: true,
  payoutSent: true,
  newConversion: true,
  partnerNewsletter: false,
  productUpdates: true,
  accountAlerts: true,
};

export const mockPayoutSetup: MockPayoutSetup = {
  method: 'BANK_TRANSFER',
  status: 'connected',
  bankName: 'Chase Bank',
  accountLast4: '4821',
  routingNumber: '021000021',
};
