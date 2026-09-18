export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type ControlledContentType =
  | 'FAQ'
  | 'BENEFIT_EXPLANATION'
  | 'CAREVERSE_EXPLANATION'
  | 'REQUIRED_DISCLOSURE'
  | 'TESTIMONIAL'
  | 'PROMO_COPY';

export interface FAQItem {
  id: string;
  type: 'FAQ';
  question: string;
  answer: string;
  category: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface BenefitExplanation {
  id: string;
  type: 'BENEFIT_EXPLANATION';
  title: string;
  description: string;
  icon: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface CareverseExplanation {
  id: string;
  type: 'CAREVERSE_EXPLANATION';
  title: string;
  body: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface RequiredDisclosure {
  id: string;
  type: 'REQUIRED_DISCLOSURE';
  title: string;
  body: string;
  legalText: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ApprovedTestimonial {
  id: string;
  type: 'TESTIMONIAL';
  authorName: string;
  authorRole: string;
  quote: string;
  rating: number;
  avatarColor: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface PromoCopy {
  id: string;
  type: 'PROMO_COPY';
  title: string;
  body: string;
  placement: 'HERO' | 'BENEFITS' | 'PACKAGES' | 'FOOTER' | 'GENERAL';
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export type ControlledContentItem =
  | FAQItem
  | BenefitExplanation
  | CareverseExplanation
  | RequiredDisclosure
  | ApprovedTestimonial
  | PromoCopy;

export interface ContentCatalog {
  faqs: FAQItem[];
  benefitExplanations: BenefitExplanation[];
  careverseExplanations: CareverseExplanation[];
  requiredDisclosures: RequiredDisclosure[];
  testimonials: ApprovedTestimonial[];
  promoCopy: PromoCopy[];
}

// ─── Seed data ──────────────────────────────────────────────────────────────

const now = () => new Date().toISOString();

function seedFAQs(): FAQItem[] {
  return [
    {
      id: 'faq-1',
      type: 'FAQ',
      question: 'Is Careverse insurance?',
      answer:
        'No. Careverse is a membership program that provides access to discounted care services, product specials, and care coordination. It is not a substitute for health insurance.',
      category: 'General',
      status: 'PUBLISHED',
      order: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'faq-2',
      type: 'FAQ',
      question: 'Can I cancel my membership anytime?',
      answer:
        'Yes. You can cancel your Careverse membership at any time with no fees or penalties. Your benefits remain active until the end of your current billing cycle.',
      category: 'Billing',
      status: 'PUBLISHED',
      order: 2,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'faq-3',
      type: 'FAQ',
      question: 'How does the care allowance work?',
      answer:
        'Your monthly care allowance can be used toward eligible care services. The allowance resets each month and does not roll over. Unused funds expire at the end of the billing cycle.',
      category: 'Benefits',
      status: 'PUBLISHED',
      order: 3,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'faq-4',
      type: 'FAQ',
      question: 'What is included in the health advocacy benefit?',
      answer:
        'Health advocacy gives you access to a dedicated advocate who can help you navigate care options, coordinate appointments, and answer questions about your benefits. Availability depends on your plan.',
      category: 'Benefits',
      status: 'PUBLISHED',
      order: 4,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'faq-5',
      type: 'FAQ',
      question: 'Are there any waiting periods?',
      answer:
        'Included services are available immediately upon enrollment with no waiting period. There are no pre-existing condition exclusions.',
      category: 'Coverage',
      status: 'PUBLISHED',
      order: 5,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'faq-6',
      type: 'FAQ',
      question: 'Is Careverse available in my state?',
      answer:
        'Careverse memberships are available in all 50 states. Some services may vary by location, but the core benefits are available nationwide.',
      category: 'General',
      status: 'DRAFT',
      order: 6,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
}

function seedBenefitExplanations(): BenefitExplanation[] {
  return [
    {
      id: 'be-1',
      type: 'BENEFIT_EXPLANATION',
      title: 'Included Services',
      description: 'Access essential care services at no additional cost — no waiting period, no copay.',
      icon: 'stethoscope',
      status: 'PUBLISHED',
      order: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'be-2',
      type: 'BENEFIT_EXPLANATION',
      title: 'Lower Prices on Other Care',
      description: 'Save on specialist visits, urgent care, and other services not included in your plan.',
      icon: 'wallet',
      status: 'PUBLISHED',
      order: 2,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'be-3',
      type: 'BENEFIT_EXPLANATION',
      title: 'Product Specials',
      description: 'Exclusive discounts on health and wellness products from trusted brands.',
      icon: 'gift',
      status: 'PUBLISHED',
      order: 3,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'be-4',
      type: 'BENEFIT_EXPLANATION',
      title: 'Free Samples & Coupons',
      description: 'Try premium health products with free samples and exclusive coupons.',
      icon: 'gift',
      status: 'PUBLISHED',
      order: 4,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'be-5',
      type: 'BENEFIT_EXPLANATION',
      title: 'Care Allowance',
      description: 'A monthly allowance you can spend on eligible care services for your family.',
      icon: 'wallet',
      status: 'PUBLISHED',
      order: 5,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'be-6',
      type: 'BENEFIT_EXPLANATION',
      title: 'Health Advocacy',
      description: 'Get help from a dedicated advocate to navigate care options and coordinate appointments.',
      icon: 'heart',
      status: 'PUBLISHED',
      order: 6,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
}

function seedCareverseExplanations(): CareverseExplanation[] {
  return [
    {
      id: 'ce-1',
      type: 'CAREVERSE_EXPLANATION',
      title: 'What is Careverse?',
      body:
        'Careverse is a membership-based care platform that connects families with affordable, comprehensive care benefits. We are not insurance — we are a better way to access the care your family needs, with included services, discounted care, product specials, and dedicated advocacy support.',
      status: 'PUBLISHED',
      order: 1,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
}

function seedRequiredDisclosures(): RequiredDisclosure[] {
  return [
    {
      id: 'rd-1',
      type: 'REQUIRED_DISCLOSURE',
      title: 'Membership Disclosure',
      body: 'Careverse memberships are not insurance products.',
      legalText:
        'This is not insurance. Careverse is a membership program providing access to discounted care services and products. Benefits and savings may vary by plan and location.',
      status: 'PUBLISHED',
      order: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'rd-2',
      type: 'REQUIRED_DISCLOSURE',
      title: 'Cancellation Policy',
      body: 'Cancel anytime — no fees, no penalties.',
      legalText:
        'You may cancel your Careverse membership at any time. Cancellation takes effect at the end of your current billing cycle. No cancellation fees or penalties apply.',
      status: 'PUBLISHED',
      order: 2,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'rd-3',
      type: 'REQUIRED_DISCLOSURE',
      title: 'Auto-Renewal Notice',
      body: 'Your membership renews automatically each billing cycle.',
      legalText:
        'Your Careverse membership automatically renews on a monthly basis until you cancel. You will be charged the same price as your current plan at each renewal.',
      status: 'PUBLISHED',
      order: 3,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
}

function seedTestimonials(): ApprovedTestimonial[] {
  return [
    {
      id: 'ts-1',
      type: 'TESTIMONIAL',
      authorName: 'Sarah M.',
      authorRole: 'Family Plan Member',
      quote:
        'Careverse has been a game-changer for our family. The included services alone save us hundreds every month, and the care allowance lets us choose the care we actually need.',
      rating: 5,
      avatarColor: '#E1062C',
      status: 'PUBLISHED',
      order: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'ts-2',
      type: 'TESTIMONIAL',
      authorName: 'James T.',
      authorRole: 'Family Plus Member',
      quote:
        'The health advocacy benefit is incredible. My advocate helped me find a specialist and coordinated everything. I never knew healthcare could be this easy.',
      rating: 5,
      avatarColor: '#0B9B6B',
      status: 'PUBLISHED',
      order: 2,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'ts-3',
      type: 'TESTIMONIAL',
      authorName: 'Patricia L.',
      authorRole: 'Care Circle Member',
      quote:
        'With an extended family, the Care Circle plan covers everyone. The concierge coordination means we never have to worry about scheduling or finding providers.',
      rating: 5,
      avatarColor: '#2563EB',
      status: 'DRAFT',
      order: 3,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
}

function seedPromoCopy(): PromoCopy[] {
  return [
    {
      id: 'pc-1',
      type: 'PROMO_COPY',
      title: 'Hero Subheadline',
      body: 'Affordable, comprehensive care benefits for your family — no insurance required.',
      placement: 'HERO',
      status: 'PUBLISHED',
      order: 1,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'pc-2',
      type: 'PROMO_COPY',
      title: 'Benefits Section Intro',
      body: 'Every Careverse membership includes a comprehensive set of benefits designed to keep your family healthy and save you money.',
      placement: 'BENEFITS',
      status: 'PUBLISHED',
      order: 2,
      createdAt: now(),
      updatedAt: now(),
    },
  ];
}

function seedCatalog(): ContentCatalog {
  return {
    faqs: seedFAQs(),
    benefitExplanations: seedBenefitExplanations(),
    careverseExplanations: seedCareverseExplanations(),
    requiredDisclosures: seedRequiredDisclosures(),
    testimonials: seedTestimonials(),
    promoCopy: seedPromoCopy(),
  };
}

// ─── Persistence ─────────────────────────────────────────────────────────────

const CONTENT_CATALOG_KEY = 'careverse_content_catalog';

export function loadContentCatalog(): ContentCatalog {
  if (typeof window === 'undefined') return seedCatalog();
  try {
    const raw = localStorage.getItem(CONTENT_CATALOG_KEY);
    if (!raw) {
      const seeded = seedCatalog();
      saveContentCatalog(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<ContentCatalog>;
    return {
      faqs: parsed.faqs || seedFAQs(),
      benefitExplanations: parsed.benefitExplanations || seedBenefitExplanations(),
      careverseExplanations: parsed.careverseExplanations || seedCareverseExplanations(),
      requiredDisclosures: parsed.requiredDisclosures || seedRequiredDisclosures(),
      testimonials: parsed.testimonials || seedTestimonials(),
      promoCopy: parsed.promoCopy || seedPromoCopy(),
    };
  } catch {
    return seedCatalog();
  }
}

export function saveContentCatalog(catalog: ContentCatalog): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONTENT_CATALOG_KEY, JSON.stringify(catalog));
}

export function resetContentCatalog(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONTENT_CATALOG_KEY);
}

// ─── Selectors (published-only for storefront consumption) ───────────────────

export function getPublishedFAQs(catalog: ContentCatalog): FAQItem[] {
  return catalog.faqs
    .filter((f) => f.status === 'PUBLISHED')
    .sort((a, b) => a.order - b.order);
}

export function getPublishedBenefitExplanations(catalog: ContentCatalog): BenefitExplanation[] {
  return catalog.benefitExplanations
    .filter((b) => b.status === 'PUBLISHED')
    .sort((a, b) => a.order - b.order);
}

export function getPublishedCareverseExplanations(catalog: ContentCatalog): CareverseExplanation[] {
  return catalog.careverseExplanations
    .filter((c) => c.status === 'PUBLISHED')
    .sort((a, b) => a.order - b.order);
}

export function getPublishedDisclosures(catalog: ContentCatalog): RequiredDisclosure[] {
  return catalog.requiredDisclosures
    .filter((d) => d.status === 'PUBLISHED')
    .sort((a, b) => a.order - b.order);
}

export function getPublishedTestimonials(catalog: ContentCatalog): ApprovedTestimonial[] {
  return catalog.testimonials
    .filter((t) => t.status === 'PUBLISHED')
    .sort((a, b) => a.order - b.order);
}

export function getPublishedPromoCopy(catalog: ContentCatalog): PromoCopy[] {
  return catalog.promoCopy
    .filter((p) => p.status === 'PUBLISHED')
    .sort((a, b) => a.order - b.order);
}

// ─── CRUD helpers ────────────────────────────────────────────────────────────

export function createFAQ(data: Partial<FAQItem>): FAQItem {
  const ts = now();
  return {
    id: `faq-${Date.now()}`,
    type: 'FAQ',
    question: data.question || 'New question',
    answer: data.answer || '',
    category: data.category || 'General',
    status: 'DRAFT',
    order: data.order ?? 100,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function createBenefitExplanation(data: Partial<BenefitExplanation>): BenefitExplanation {
  const ts = now();
  return {
    id: `be-${Date.now()}`,
    type: 'BENEFIT_EXPLANATION',
    title: data.title || 'New benefit',
    description: data.description || '',
    icon: data.icon || 'gift',
    status: 'DRAFT',
    order: data.order ?? 100,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function createCareverseExplanation(data: Partial<CareverseExplanation>): CareverseExplanation {
  const ts = now();
  return {
    id: `ce-${Date.now()}`,
    type: 'CAREVERSE_EXPLANATION',
    title: data.title || 'New explanation',
    body: data.body || '',
    status: 'DRAFT',
    order: data.order ?? 100,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function createRequiredDisclosure(data: Partial<RequiredDisclosure>): RequiredDisclosure {
  const ts = now();
  return {
    id: `rd-${Date.now()}`,
    type: 'REQUIRED_DISCLOSURE',
    title: data.title || 'New disclosure',
    body: data.body || '',
    legalText: data.legalText || '',
    status: 'DRAFT',
    order: data.order ?? 100,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function createTestimonial(data: Partial<ApprovedTestimonial>): ApprovedTestimonial {
  const ts = now();
  return {
    id: `ts-${Date.now()}`,
    type: 'TESTIMONIAL',
    authorName: data.authorName || 'New author',
    authorRole: data.authorRole || '',
    quote: data.quote || '',
    rating: data.rating ?? 5,
    avatarColor: data.avatarColor || '#E1062C',
    status: 'DRAFT',
    order: data.order ?? 100,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function createPromoCopy(data: Partial<PromoCopy>): PromoCopy {
  const ts = now();
  return {
    id: `pc-${Date.now()}`,
    type: 'PROMO_COPY',
    title: data.title || 'New promo copy',
    body: data.body || '',
    placement: data.placement || 'GENERAL',
    status: 'DRAFT',
    order: data.order ?? 100,
    createdAt: ts,
    updatedAt: ts,
  };
}
