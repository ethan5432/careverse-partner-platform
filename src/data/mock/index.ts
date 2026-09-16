import type {
  MockUser, MockPartner, MockProduct, MockStorefront,
  MockConversion, MockCommission, MockPayout, MockConversation,
  MockEmailCampaign, MockEmailAutomation, MockNetwork, MockResource,
  MockPartnerProfile, MockStorefrontSettings, MockNotificationSettings,
  MockPayoutSetup, MockAdminActivity, MockNeedsAttentionItem,
  MockPartnerNote, MockPartnerActivityItem, AdminTimeRange, AdminMetric,
  AdminPerformancePoint, CommissionStatus,
  MockEmailTemplate, MockScheduledEmail,
  NetworkStatus, MockNetworkActivity, MockOrder,
  MockCreatorContent, ContentSource, ContentPlacement, ContentLayout,
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
  { id: 'prod-family', name: 'Family', price: 49, billingType: 'MONTHLY', status: 'ACTIVE', availability: 'AVAILABLE', partnerAvailability: 'ALL', description: 'Essential care benefits for the whole family — included services, lower prices on other care, product specials, and free samples.', features: ['Included services', 'Lower prices on other care', 'Product specials', 'Free samples & coupons', 'Care allowance', 'Health Advocacy where applicable'], sourceId: 'cv-benefits-family-001', syncStatus: 'SYNCED', lastSyncedAt: '2026-09-15T10:00:00Z',
    benefits: [
      { title: 'Included Services', description: 'Access to essential care services at no additional cost.' },
      { title: 'Care Allowance', description: 'Monthly allowance for out-of-pocket care expenses.' },
      { title: 'Product Specials', description: 'Exclusive discounts on health and wellness products.' },
      { title: 'Health Advocacy', description: 'Professional guidance for navigating care options.' },
    ] },
  { id: 'prod-family-plus', name: 'Family Plus', price: 89, billingType: 'MONTHLY', status: 'ACTIVE', availability: 'AVAILABLE', partnerAvailability: 'ALL', description: 'Everything in Family, with enhanced benefits and expanded care allowance for families who need more coverage.', features: ['Everything in Family', 'Enhanced care allowance', 'Priority Health Advocacy', 'Expanded product specials', 'Exclusive free samples'], popular: true, sourceId: 'cv-benefits-family-plus-001', syncStatus: 'SYNCED', lastSyncedAt: '2026-09-15T10:00:00Z',
    benefits: [
      { title: 'Enhanced Care Allowance', description: 'Doubled monthly allowance for comprehensive care needs.' },
      { title: 'Priority Health Advocacy', description: 'Dedicated advocate with priority response times.' },
      { title: 'Expanded Product Specials', description: 'Broader range of discounted products and services.' },
      { title: 'Exclusive Free Samples', description: 'Curated samples of premium health products.' },
    ] },
  { id: 'prod-care-circle', name: 'Care Circle', price: 149, billingType: 'MONTHLY', status: 'ACTIVE', availability: 'AVAILABLE', partnerAvailability: 'ALL', description: 'The most comprehensive Careverse plan — full benefits for extended families and care circles with the highest level of support.', features: ['Everything in Family Plus', 'Full care circle coverage', 'Dedicated Health Advocate', 'Premium product specials', 'Concierge care coordination'], sourceId: 'cv-benefits-care-circle-001', syncStatus: 'SYNCED', lastSyncedAt: '2026-09-15T10:00:00Z',
    benefits: [
      { title: 'Full Care Circle Coverage', description: 'Covers extended family members and care circle participants.' },
      { title: 'Dedicated Health Advocate', description: 'A personal advocate assigned to your care circle.' },
      { title: 'Premium Product Specials', description: 'Top-tier discounts on premium health and wellness brands.' },
      { title: 'Concierge Care Coordination', description: 'White-glove coordination for all care appointments and services.' },
    ] },
];

export const mockStorefronts: MockStorefront[] = [
  { id: 's-1', partnerId: 'p-1', name: 'Marcus Care Partners', url: 'careverse.ai/s/marcus', status: 'LIVE', visitors: 3240, conversions: 142, revenue: 28480, commission: 5696, introCopy: 'Helping families access better, more affordable care.', packages: ['Family', 'Family Plus', 'Care Circle'], domainStatus: 'CONNECTED', customDomain: 'marcus.carepartners.co', heroHeadline: 'Quality care for your family', heroSupportingCopy: 'I help families like yours discover affordable, comprehensive care benefits through Careverse.', ctaText: 'Request Care', aboutContent: 'As a dedicated care advocate, I connect families with the best Careverse membership plans. My goal is simple: make quality healthcare accessible and affordable for everyone.', brandPresentation: 'Trusted, family-focused care guidance', creatorContent: [
    { id: 'cc-1', source: 'EMBED', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Why I chose Careverse', caption: 'A quick story about how Careverse helped my family.', placement: 'TOP', layout: 'ONE_COLUMN', order: 0 },
    { id: 'cc-2', source: 'EMBED', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Family Plus walkthrough', caption: 'See what is included in the Family Plus plan.', placement: 'MIDDLE', layout: 'TWO_COLUMN', order: 1 },
  ] },
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
  { id: 'c-1', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'APPROVED', date: '2026-09-14', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', attributionState: 'ATTRIBUTED', clickId: 'clk-a1b2c3d4', customerName: 'Jennifer Smith', customerEmail: 'j.smith@email.com' },
  { id: 'c-2', plan: 'Care Circle', saleAmount: 149, commission: 29.80, status: 'APPROVED', date: '2026-09-13', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', attributionState: 'ATTRIBUTED', clickId: 'clk-e5f6g7h8', customerName: 'Michael Park', customerEmail: 'm.park@email.com' },
  { id: 'c-3', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'PENDING', date: '2026-09-12', partnerId: 'p-2', partnerName: 'Emily Rodriguez', storefrontId: 's-2', storefrontName: 'Emily\'s Health Hub', attributionSource: 'Social Media', attributionState: 'PENDING', clickId: 'clk-i9j0k1l2', customerName: 'Rachel Davis', customerEmail: 'r.davis@email.com' },
  { id: 'c-4', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'PAID', date: '2026-09-10', partnerId: 'p-2', partnerName: 'Emily Rodriguez', storefrontId: 's-2', storefrontName: 'Emily\'s Health Hub', attributionSource: 'Storefront Link', attributionState: 'ATTRIBUTED', clickId: 'clk-m3n4o5p6', customerName: 'Kevin Chen', customerEmail: 'k.chen@email.com' },
  { id: 'c-5', plan: 'Care Circle', saleAmount: 149, commission: 29.80, status: 'APPROVED', date: '2026-09-09', partnerId: 'p-3', partnerName: 'David Kim', storefrontId: 's-3', storefrontName: 'Care Agency Direct', attributionSource: 'Direct Referral', attributionState: 'ATTRIBUTED', clickId: 'clk-q7r8s9t0', customerName: 'Anthony Morales', customerEmail: 'a.morales@email.com' },
  { id: 'c-6', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'REVERSED', date: '2026-09-08', partnerId: 'p-3', partnerName: 'David Kim', storefrontId: 's-3', storefrontName: 'Care Agency Direct', attributionSource: 'Storefront Link', attributionState: 'REVERSED', clickId: 'clk-u1v2w3x4', customerName: 'Brandon Foster', customerEmail: 'b.foster@email.com' },
  { id: 'c-7', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'PAID', date: '2026-09-05', partnerId: 'p-7', partnerName: 'Tom Bradley', storefrontId: 's-7', storefrontName: 'Bradley Care Network', attributionSource: 'Storefront Link', attributionState: 'ATTRIBUTED', clickId: 'clk-y5z6a7b8', customerName: 'Catherine Nguyen', customerEmail: 'c.nguyen@email.com' },
  { id: 'c-8', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'APPROVED', date: '2026-09-04', partnerId: 'p-8', partnerName: 'Nina Garcia', storefrontId: 's-8', storefrontName: 'Nina\'s Care Referrals', attributionSource: 'Email Campaign', attributionState: 'ATTRIBUTED', clickId: 'clk-c9d0e1f2', customerName: 'Daniel Brooks', customerEmail: 'd.brooks@email.com' },
  { id: 'c-9', plan: 'Care Circle', saleAmount: 149, commission: 29.80, status: 'PENDING', date: '2026-09-03', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', attributionState: 'PENDING', clickId: 'clk-g3h4i5j6', customerName: 'Eduardo Santos', customerEmail: 'e.santos@email.com' },
  { id: 'c-10', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'APPROVED', date: '2026-09-01', partnerId: 'p-9', partnerName: 'Robert Chang', storefrontId: 's-9', storefrontName: 'Chang Care Solutions', attributionSource: 'Storefront Link', attributionState: 'ATTRIBUTED', clickId: 'clk-k7l8m9n0', customerName: 'Farah Khan', customerEmail: 'f.khan@email.com' },
  { id: 'c-11', plan: 'Family', saleAmount: 49, commission: 9.80, status: 'PAID', date: '2026-08-28', partnerId: 'p-7', partnerName: 'Tom Bradley', storefrontId: 's-7', storefrontName: 'Bradley Care Network', attributionSource: 'Social Media', attributionState: 'UNATTRIBUTED', clickId: 'clk-o1p2q3r4', customerName: 'Gregory Russell', customerEmail: 'g.russell@email.com' },
  { id: 'c-12', plan: 'Family Plus', saleAmount: 89, commission: 17.80, status: 'APPROVED', date: '2026-08-25', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', attributionSource: 'Storefront Link', attributionState: 'ATTRIBUTED', clickId: 'clk-s5t6u7v8', customerName: 'Hannah Adams', customerEmail: 'h.adams@email.com' },
];

export const mockCommissions: MockCommission[] = mockConversions.map(c => ({
  id: `cm-${c.id}`, saleAmount: c.saleAmount, commissionRule: 'Standard 20%', rate: 0.20, commission: c.commission,
  status: c.status as CommissionStatus,
  date: c.date,
  approvedDate: c.status === 'APPROVED' || c.status === 'PAID' ? c.date : undefined,
  paidDate: c.status === 'PAID' ? c.date : undefined,
  reversedDate: c.status === 'REVERSED' ? c.date : undefined,
  conversionId: c.id, plan: c.plan, partnerId: c.partnerId,
  partnerName: c.partnerName, storefrontName: c.storefrontName,
  customerName: c.customerName, clickId: c.clickId, attributionSource: c.attributionSource,
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

export const mockEmailTemplates: MockEmailTemplate[] = [
  { id: 'et-1', name: 'Partner Approved', trigger: 'Partner status → ACTIVE', subject: 'Your Careverse partner account is approved!', audience: 'Partners', enabled: true, lastEdited: '2026-08-15',
    body: `Hi {{partner_name}},

Great news — your Careverse partner application has been approved! You can now access your partner dashboard, set up your storefront, and start earning commissions.

Next steps:
1. Complete your storefront setup
2. Choose which Careverse packages to feature
3. Share your storefront link with your audience

Welcome to the Careverse partner community!

The Careverse Team` },
  { id: 'et-2', name: 'Account Activated', trigger: 'Account activated', subject: 'Your Careverse account is now active', audience: 'Partners', enabled: true, lastEdited: '2026-08-15',
    body: `Hi {{partner_name}},

Your Careverse account is now fully activated. Your storefront is live and ready to accept customers.

You can log in to your dashboard anytime at careverse.ai/partner to track conversions, view commissions, and manage your payout settings.

The Careverse Team` },
  { id: 'et-3', name: 'First Conversion', trigger: 'First conversion recorded', subject: 'You just made your first sale!', audience: 'Partners', enabled: true, lastEdited: '2026-09-01',
    body: `Hi {{partner_name}},

Congratulations on your first conversion! {{customer_name}} just purchased {{package_name}} through your storefront.

Commission earned: {{commission_amount}}

This is just the beginning. Keep promoting your storefront to earn more.

The Careverse Team` },
  { id: 'et-4', name: 'Storefront Published', trigger: 'Storefront → LIVE', subject: 'Your storefront is now live!', audience: 'Partners', enabled: true, lastEdited: '2026-08-20',
    body: `Hi {{partner_name}},

Your storefront "{{storefront_name}}" is now live and visible to customers at {{storefront_url}}.

Share your link on social media, in emails, or anywhere your audience is. Every purchase through your link earns you a commission.

The Careverse Team` },
  { id: 'et-5', name: 'Commission Approved', trigger: 'Commission → APPROVED', subject: 'Your commission has been approved', audience: 'Partners', enabled: true, lastEdited: '2026-09-05',
    body: `Hi {{partner_name}},

A commission of {{commission_amount}} from your {{package_name}} conversion has been approved and is now available for payout.

View your commission details in your partner dashboard.

The Careverse Team` },
  { id: 'et-6', name: 'Payout Sent', trigger: 'Payout → PAID', subject: 'Your payout has been sent', audience: 'Partners', enabled: true, lastEdited: '2026-09-10',
    body: `Hi {{partner_name}},

A payout of {{payout_amount}} has been sent to your account via {{payout_method}}.

Reference: {{payout_reference}}
Expected arrival: 1-3 business days

Thank you for being a valued Careverse partner.

The Careverse Team` },
  { id: 'et-7', name: 'No Activity Reminder', trigger: 'No conversions in 14 days', subject: 'Tips to boost your Careverse conversions', audience: 'Active Partners', enabled: false, lastEdited: '2026-08-25',
    body: `Hi {{partner_name}},

We noticed you haven't had a conversion in the last 14 days. Here are some tips to get back on track:

1. Refresh your storefront intro copy
2. Share your link on a new platform
3. Try one of our pre-written social media posts in the Resource Library
4. Feature the popular Family Plus plan

We're here to help you succeed!

The Careverse Team` },
];

export const mockScheduledEmails: MockScheduledEmail[] = [
  { id: 'se-1', campaignId: 'ec-2', campaignName: 'September Newsletter', audience: 'All Partners', subject: "What's new at Careverse this September", scheduledDate: '2026-09-20', status: 'SCHEDULED', recipientCount: 42 },
  { id: 'se-2', campaignId: 'ec-3', campaignName: 'Care Circle Launch', audience: 'Active Partners', subject: 'Introducing Care Circle — our most comprehensive plan', scheduledDate: '2026-09-25', status: 'SCHEDULED', recipientCount: 8 },
];

export const mockNetworks: MockNetwork[] = [
  { id: 'net-1', name: 'Marcus Care Network', ownerId: 'p-1', ownerName: 'Marcus Johnson', status: 'ACTIVE', partnerCount: 5, activePartnerCount: 4, conversions: 269, revenue: 53800, networkEarnings: 5380, createdDate: '2025-04-01',
    partners: [
      { id: 'np-1', name: 'Emily Rodriguez', type: 'CREATOR', status: 'ACTIVE', storefrontName: 'Emily Care Tips', storefrontStatus: 'LIVE', conversions: 87, revenue: 17400, commission: 3480, networkEarnings: 870, joinedDate: '2025-05-10', lastActive: '2026-09-14', avatarColor: '#0B9B6B' },
      { id: 'np-2', name: 'David Kim', type: 'BUSINESS', status: 'ACTIVE', storefrontName: 'Care Agency Pro', storefrontStatus: 'LIVE', conversions: 64, revenue: 12800, commission: 2560, networkEarnings: 640, joinedDate: '2025-06-01', lastActive: '2026-09-12', avatarColor: '#18191D' },
      { id: 'np-3', name: 'Nina Garcia', type: 'CREATOR', status: 'ACTIVE', storefrontName: 'Nina Wellness Hub', storefrontStatus: 'LIVE', conversions: 51, revenue: 10200, commission: 2040, networkEarnings: 510, joinedDate: '2025-07-08', lastActive: '2026-09-13', avatarColor: '#E1062C' },
      { id: 'np-4', name: 'Robert Chang', type: 'BUSINESS', status: 'ACTIVE', storefrontName: 'Chang Care Solutions', storefrontStatus: 'LIVE', conversions: 38, revenue: 7600, commission: 1520, networkEarnings: 380, joinedDate: '2025-08-15', lastActive: '2026-09-10', avatarColor: '#0B9B6B' },
      { id: 'np-5', name: 'Sophie Martin', type: 'CREATOR', status: 'PENDING', storefrontName: 'Sophie Care Corner', storefrontStatus: 'DRAFT', conversions: 29, revenue: 5800, commission: 1160, networkEarnings: 290, joinedDate: '2025-09-20', lastActive: '2026-09-08', avatarColor: '#E1062C' },
    ],
    activity: [
      { id: 'na-1-1', networkId: 'net-1', type: 'CONVERSION', description: 'Family Plus conversion', partnerName: 'Emily Rodriguez', amount: 199, date: '2026-09-14' },
      { id: 'na-1-2', networkId: 'net-1', type: 'STOREFRONT_PUBLISHED', description: 'Storefront published', partnerName: 'Nina Garcia', date: '2026-09-13' },
      { id: 'na-1-3', networkId: 'net-1', type: 'CONVERSION', description: 'Care Circle conversion', partnerName: 'David Kim', amount: 399, date: '2026-09-12' },
      { id: 'na-1-4', networkId: 'net-1', type: 'PAYOUT', description: 'Commission payout sent', partnerName: 'Robert Chang', amount: 1520, date: '2026-09-10' },
      { id: 'na-1-5', networkId: 'net-1', type: 'PARTNER_JOINED', description: 'New partner joined network', partnerName: 'Sophie Martin', date: '2025-09-20' },
    ],
  },
  { id: 'net-2', name: 'Bradley Care Network', ownerId: 'p-7', ownerName: 'Tom Bradley', status: 'ACTIVE', partnerCount: 3, activePartnerCount: 2, conversions: 72, revenue: 14400, networkEarnings: 1440, createdDate: '2025-03-15',
    partners: [
      { id: 'np-6', name: 'Aisha Patel', type: 'BUSINESS', status: 'SUSPENDED', storefrontName: 'Patel Care Group', storefrontStatus: 'DRAFT', conversions: 23, revenue: 4600, commission: 920, networkEarnings: 230, joinedDate: '2025-04-12', lastActive: '2026-07-30', avatarColor: '#18191D' },
      { id: 'np-7', name: 'Lisa Thompson', type: 'CREATOR', status: 'ACTIVE', storefrontName: 'Lisa Care Stories', storefrontStatus: 'LIVE', conversions: 31, revenue: 6200, commission: 1240, networkEarnings: 310, joinedDate: '2025-07-15', lastActive: '2026-09-15', avatarColor: '#E1062C' },
      { id: 'np-8', name: 'James Wilson', type: 'BUSINESS', status: 'ACTIVE', storefrontName: 'Wilson Care Partners', storefrontStatus: 'LIVE', conversions: 18, revenue: 3600, commission: 720, networkEarnings: 180, joinedDate: '2025-08-20', lastActive: '2026-09-11', avatarColor: '#0B9B6B' },
    ],
    activity: [
      { id: 'na-2-1', networkId: 'net-2', type: 'PARTNER_JOINED', description: 'New partner joined network', partnerName: 'Lisa Thompson', date: '2025-07-15' },
      { id: 'na-2-2', networkId: 'net-2', type: 'CONVERSION', description: 'Family conversion', partnerName: 'Lisa Thompson', amount: 99, date: '2026-09-15' },
      { id: 'na-2-3', networkId: 'net-2', type: 'COMMISSION', description: 'Commission approved', partnerName: 'James Wilson', amount: 720, date: '2026-09-11' },
      { id: 'na-2-4', networkId: 'net-2', type: 'STOREFRONT_PUBLISHED', description: 'Storefront published', partnerName: 'James Wilson', date: '2025-08-25' },
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

export const adminPerformanceByRange: Record<AdminTimeRange, AdminPerformancePoint[]> = {
  '7D': [
    { date: 'Sep 10', revenue: 1240, conversions: 8, commission: 248 },
    { date: 'Sep 11', revenue: 980, conversions: 6, commission: 196 },
    { date: 'Sep 12', revenue: 1520, conversions: 10, commission: 304 },
    { date: 'Sep 13', revenue: 1890, conversions: 13, commission: 378 },
    { date: 'Sep 14', revenue: 1340, conversions: 9, commission: 268 },
    { date: 'Sep 15', revenue: 1670, conversions: 11, commission: 334 },
    { date: 'Sep 16', revenue: 1120, conversions: 7, commission: 224 },
  ],
  '30D': [
    { date: 'Week 1', revenue: 8400, conversions: 56, commission: 1680 },
    { date: 'Week 2', revenue: 10200, conversions: 68, commission: 2040 },
    { date: 'Week 3', revenue: 7600, conversions: 50, commission: 1520 },
    { date: 'Week 4', revenue: 9800, conversions: 65, commission: 1960 },
  ],
  '90D': [
    { date: 'Jul', revenue: 24800, conversions: 164, commission: 4960 },
    { date: 'Aug', revenue: 29600, conversions: 196, commission: 5920 },
    { date: 'Sep', revenue: 18200, conversions: 121, commission: 3640 },
  ],
  'ALL': [
    { date: 'Q1 2025', revenue: 16400, conversions: 108, commission: 3280 },
    { date: 'Q2 2025', revenue: 31200, conversions: 208, commission: 6240 },
    { date: 'Q3 2025', revenue: 37800, conversions: 252, commission: 7560 },
    { date: 'Q4 2025', revenue: 28400, conversions: 190, commission: 5680 },
    { date: 'Q1 2026', revenue: 33600, conversions: 224, commission: 6720 },
    { date: 'Q2 2026', revenue: 38400, conversions: 256, commission: 7680 },
    { date: 'Q3 2026', revenue: 24960, conversions: 166, commission: 4992 },
  ],
};

export const mockAdminActivity: MockAdminActivity[] = [
  { id: 'aa-1', type: 'APPLICATION', description: 'Partner application submitted', partnerName: 'Lisa Thompson', date: '2026-09-15' },
  { id: 'aa-2', type: 'APPROVAL', description: 'Partner approved', partnerName: 'Emily Rodriguez', date: '2026-09-14' },
  { id: 'aa-3', type: 'STOREFRONT_PUBLISHED', description: 'Storefront published', partnerName: 'Marcus Johnson', date: '2026-09-13' },
  { id: 'aa-4', type: 'CONVERSION', description: 'New conversion recorded', partnerName: 'Tom Bradley', amount: 149, date: '2026-09-13' },
  { id: 'aa-5', type: 'COMMISSION', description: 'Commission approved', partnerName: 'Emily Rodriguez', amount: 17.80, date: '2026-09-12' },
  { id: 'aa-6', type: 'PAYOUT', description: 'Payout sent', partnerName: 'Marcus Johnson', amount: 1240, date: '2026-09-10' },
  { id: 'aa-7', type: 'CONVERSION', description: 'New conversion recorded', partnerName: 'Nina Garcia', amount: 49, date: '2026-09-09' },
  { id: 'aa-8', type: 'APPLICATION', description: 'Partner application submitted', partnerName: 'James Wilson', date: '2026-09-08' },
];

export const mockNeedsAttention: MockNeedsAttentionItem[] = [
  { id: 'na-1', type: 'APPLICATION', title: 'New partner application', description: 'Lisa Thompson applied as Creator — awaiting review.', partnerId: 'p-4', partnerName: 'Lisa Thompson', severity: 'info' },
  { id: 'na-2', type: 'ONBOARDING', title: 'Incomplete onboarding', description: 'James Wilson has not completed storefront setup.', partnerId: 'p-5', partnerName: 'James Wilson', severity: 'warning' },
  { id: 'na-3', type: 'PAYOUT', title: 'Payout failed', description: 'Payout to Sophie Martin failed — bank account issue.', partnerId: 'p-10', partnerName: 'Sophie Martin', severity: 'error' },
  { id: 'na-4', type: 'STOREFRONT', title: 'Storefront domain pending', description: "David Kim's custom domain DNS is not yet verified.", partnerId: 'p-3', partnerName: 'David Kim', severity: 'warning' },
  { id: 'na-5', type: 'ACCOUNT', title: 'Account suspended', description: "Aisha Patel's account is suspended — review required.", partnerId: 'p-6', partnerName: 'Aisha Patel', severity: 'error' },
];

export const mockPartnerNotes: MockPartnerNote[] = [
  { id: 'pn-1', partnerId: 'p-1', text: 'Top performer — consistently drives high-volume conversions. Consider featuring in partner spotlight.', author: 'Sarah Chen', date: '2026-09-10' },
  { id: 'pn-2', partnerId: 'p-1', text: 'Requested higher commission tier for Q4. Escalating to leadership.', author: 'Sarah Chen', date: '2026-09-05' },
  { id: 'pn-3', partnerId: 'p-2', text: 'Great content creator. Engagement on social posts is above average.', author: 'Sarah Chen', date: '2026-09-08' },
  { id: 'pn-4', partnerId: 'p-6', text: 'Multiple chargebacks reported. Suspended pending fraud review.', author: 'Sarah Chen', date: '2026-07-30' },
];

export function getPartnerActivity(partnerId: string): MockPartnerActivityItem[] {
  const partner = mockPartners.find((p) => p.id === partnerId);
  if (!partner) return [];
  const items: MockPartnerActivityItem[] = [
    { id: `pa-${partnerId}-1`, type: 'APPLICATION', description: 'Partner application submitted', date: partner.joinedDate },
    { id: `pa-${partnerId}-2`, type: 'APPROVAL', description: 'Application approved by admin', date: partner.joinedDate },
  ];
  if (partner.status === 'ACTIVE' || partner.status === 'SUSPENDED') {
    items.push({ id: `pa-${partnerId}-3`, type: 'ACTIVATED', description: 'Account activated', date: partner.joinedDate });
    items.push({ id: `pa-${partnerId}-4`, type: 'STOREFRONT_CREATED', description: `Storefront "${partner.storefrontName}" created`, date: partner.joinedDate });
  }
  const storefront = mockStorefronts.find((s) => s.id === partner.storefrontId);
  if (storefront && storefront.status === 'LIVE') {
    items.push({ id: `pa-${partnerId}-5`, type: 'STOREFRONT_PUBLISHED', description: 'Storefront published', date: partner.lastActive });
  }
  const convs = mockConversions.filter((c) => c.partnerId === partnerId);
  convs.slice(0, 3).forEach((c, i) => {
    items.push({ id: `pa-${partnerId}-conv-${i}`, type: 'CONVERSION', description: `${c.plan} conversion — ${c.saleAmount}`, date: c.date });
    items.push({ id: `pa-${partnerId}-comm-${i}`, type: 'COMMISSION', description: `Commission ${c.status.toLowerCase()} — ${c.commission.toFixed(2)}`, date: c.date });
  });
  const conv = mockConversations.find((c) => c.partnerId === partnerId);
  if (conv) {
    items.push({ id: `pa-${partnerId}-msg`, type: 'MESSAGE', description: 'Message exchanged with partner', date: conv.lastMessageDate });
  }
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const mockReportSummaries = {
  partners: {
    total: mockPartners.length,
    active: mockPartners.filter((p) => p.status === 'ACTIVE').length,
    pending: mockPartners.filter((p) => p.status === 'PENDING').length,
    suspended: mockPartners.filter((p) => p.status === 'SUSPENDED').length,
    creators: mockPartners.filter((p) => p.type === 'CREATOR').length,
    businesses: mockPartners.filter((p) => p.type === 'BUSINESS').length,
    networks: mockPartners.filter((p) => p.type === 'NETWORK').length,
  },
  storefronts: {
    total: mockStorefronts.length,
    live: mockStorefronts.filter((s) => s.status === 'LIVE').length,
    draft: mockStorefronts.filter((s) => s.status === 'DRAFT').length,
    withCustomDomain: mockStorefronts.filter((s) => s.domainStatus === 'CONNECTED').length,
    totalVisitors: mockStorefronts.reduce((s, st) => s + st.visitors, 0),
  },
  conversions: {
    total: mockConversions.length,
    approved: mockConversions.filter((c) => c.status === 'APPROVED').length,
    pending: mockConversions.filter((c) => c.status === 'PENDING').length,
    rejected: mockConversions.filter((c) => c.status === 'REVERSED').length,
    avgValue: Math.round(mockConversions.reduce((s, c) => s + c.saleAmount, 0) / mockConversions.length),
  },
  revenue: {
    total: mockStorefronts.reduce((s, st) => s + st.revenue, 0),
    avgPerStorefront: Math.round(mockStorefronts.reduce((s, st) => s + st.revenue, 0) / mockStorefronts.filter((s) => s.status === 'LIVE').length),
    topPlan: 'Family Plus',
    monthlyGrowth: 18,
  },
  commissions: {
    total: mockCommissions.reduce((s, c) => s + c.commission, 0),
    approved: mockCommissions.filter((c) => c.status === 'APPROVED').reduce((s, c) => s + c.commission, 0),
    pending: mockCommissions.filter((c) => c.status === 'PENDING').reduce((s, c) => s + c.commission, 0),
    avgRate: 20,
  },
  payouts: {
    total: mockPayouts.reduce((s, p) => s + p.amount, 0),
    paid: mockPayouts.filter((p) => p.status === 'PAID').reduce((s, p) => s + p.amount, 0),
    pending: mockPayouts.filter((p) => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0),
    count: mockPayouts.length,
  },
  networks: {
    total: mockNetworks.length,
    totalPartners: mockNetworks.reduce((s, n) => s + n.activePartnerCount, 0),
    totalRevenue: mockNetworks.reduce((s, n) => s + n.revenue, 0),
    totalEarnings: mockNetworks.reduce((s, n) => s + n.networkEarnings, 0),
  },
};

export const mockOrders: MockOrder[] = [
  { id: 'o-1', reference: 'CV-2026-0914-A1B2', productId: 'prod-family-plus', productName: 'Family Plus', productPrice: 89, customerName: 'Jennifer Smith', customerEmail: 'j.smith@email.com', billingAddress: '123 Oak St', billingCity: 'Springfield', billingState: 'IL', billingZip: '62701', paymentMethod: 'CARD', status: 'COMPLETED', date: '2026-09-14', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', amount: 89 },
  { id: 'o-2', reference: 'CV-2026-0913-C3D4', productId: 'prod-care-circle', productName: 'Care Circle', productPrice: 149, customerName: 'Michael Park', customerEmail: 'm.park@email.com', billingAddress: '456 Pine Ave', billingCity: 'Portland', billingState: 'OR', billingZip: '97201', paymentMethod: 'PAYPAL', status: 'COMPLETED', date: '2026-09-13', partnerId: 'p-1', partnerName: 'Marcus Johnson', storefrontId: 's-1', storefrontName: 'Marcus Care Partners', amount: 149 },
];
