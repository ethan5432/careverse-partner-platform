export type BillingOption = 'MONTHLY' | 'ANNUAL';
export type PackageAvailability = 'AVAILABLE' | 'COMING_SOON';
export type PartnerAvailability = 'ALL' | 'CREATOR' | 'BUSINESS';

export interface PackageBenefit {
  title: string;
  description: string;
}

export interface PackageEligibility {
  whoIsEligible: string;
  requirements: string[];
}

export interface PackageLimits {
  maxMembers: number | null;
  monthlyCareAllowance: string;
  includedVisits: string;
  notes: string;
}

export interface PackageDisclosure {
  legalText: string;
  cancellationPolicy: string;
  autoRenewal: string;
  additionalFees: string;
}

export interface CareversePackage {
  id: string;
  name: string;
  price: number;
  billingOption: BillingOption;
  availability: PackageAvailability;
  partnerAvailability: PartnerAvailability;
  description: string;
  features: string[];
  benefits: PackageBenefit[];
  eligibility: PackageEligibility;
  limits: PackageLimits;
  disclosure: PackageDisclosure;
  popular: boolean;
}

const catalog: CareversePackage[] = [
  {
    id: 'cv-family-monthly',
    name: 'Family',
    price: 49,
    billingOption: 'MONTHLY',
    availability: 'AVAILABLE',
    partnerAvailability: 'ALL',
    description:
      'Essential care benefits for the whole family — included services, lower prices on other care, product specials, and free samples.',
    features: [
      'Included services',
      'Lower prices on other care',
      'Product specials',
      'Free samples & coupons',
      'Care allowance',
      'Health Advocacy where applicable',
    ],
    benefits: [
      { title: 'Included Services', description: 'Access to essential care services at no additional cost.' },
      { title: 'Care Allowance', description: 'Monthly allowance for out-of-pocket care expenses.' },
      { title: 'Product Specials', description: 'Exclusive discounts on health and wellness products.' },
      { title: 'Health Advocacy', description: 'Professional guidance for navigating care options.' },
    ],
    eligibility: {
      whoIsEligible: 'Individuals and families seeking essential care coverage.',
      requirements: ['Must be 18 or older to purchase', 'Available in all 50 states'],
    },
    limits: {
      maxMembers: 4,
      monthlyCareAllowance: '$200/month',
      includedVisits: '2 included visits per month',
      notes: 'Additional visits subject to discounted rates.',
    },
    disclosure: {
      legalText:
        'This is not insurance. Careverse Family is a membership program providing access to discounted care services and products.',
      cancellationPolicy: 'Cancel anytime. Cancellation takes effect at the end of the current billing cycle.',
      autoRenewal: 'Membership automatically renews monthly until cancelled.',
      additionalFees: 'Some services may require additional fees not covered by the membership.',
    },
    popular: false,
  },
  {
    id: 'cv-family-plus-monthly',
    name: 'Family Plus',
    price: 89,
    billingOption: 'MONTHLY',
    availability: 'AVAILABLE',
    partnerAvailability: 'ALL',
    description:
      'Everything in Family, with enhanced benefits and expanded care allowance for families who need more coverage.',
    features: [
      'Everything in Family',
      'Enhanced care allowance',
      'Priority Health Advocacy',
      'Expanded product specials',
      'Exclusive free samples',
    ],
    benefits: [
      { title: 'Enhanced Care Allowance', description: 'Doubled monthly allowance for comprehensive care needs.' },
      { title: 'Priority Health Advocacy', description: 'Dedicated advocate with priority response times.' },
      { title: 'Expanded Product Specials', description: 'Broader range of discounted products and services.' },
      { title: 'Exclusive Free Samples', description: 'Curated samples of premium health products.' },
    ],
    eligibility: {
      whoIsEligible: 'Families needing enhanced care coverage beyond the essential plan.',
      requirements: ['Must be 18 or older to purchase', 'Available in all 50 states'],
    },
    limits: {
      maxMembers: 6,
      monthlyCareAllowance: '$400/month',
      includedVisits: '4 included visits per month',
      notes: 'Additional visits subject to discounted rates.',
    },
    disclosure: {
      legalText:
        'This is not insurance. Careverse Family Plus is a membership program providing access to enhanced discounted care services and products.',
      cancellationPolicy: 'Cancel anytime. Cancellation takes effect at the end of the current billing cycle.',
      autoRenewal: 'Membership automatically renews monthly until cancelled.',
      additionalFees: 'Some services may require additional fees not covered by the membership.',
    },
    popular: true,
  },
  {
    id: 'cv-care-circle-monthly',
    name: 'Care Circle',
    price: 149,
    billingOption: 'MONTHLY',
    availability: 'AVAILABLE',
    partnerAvailability: 'ALL',
    description:
      'The most comprehensive Careverse plan — full benefits for extended families and care circles with the highest level of support.',
    features: [
      'Everything in Family Plus',
      'Full care circle coverage',
      'Dedicated Health Advocate',
      'Premium product specials',
      'Concierge care coordination',
    ],
    benefits: [
      { title: 'Full Care Circle Coverage', description: 'Covers extended family members and care circle participants.' },
      { title: 'Dedicated Health Advocate', description: 'A personal advocate assigned to your care circle.' },
      { title: 'Premium Product Specials', description: 'Top-tier discounts on premium health and wellness brands.' },
      { title: 'Concierge Care Coordination', description: 'White-glove coordination for all care appointments and services.' },
    ],
    eligibility: {
      whoIsEligible: 'Extended families and care circles requiring the highest level of support.',
      requirements: ['Must be 18 or older to purchase', 'Available in all 50 states', 'Initial onboarding call required'],
    },
    limits: {
      maxMembers: 10,
      monthlyCareAllowance: '$800/month',
      includedVisits: '8 included visits per month',
      notes: 'Additional visits subject to discounted rates. Concierge coordination included.',
    },
    disclosure: {
      legalText:
        'This is not insurance. Careverse Care Circle is a premium membership program providing access to comprehensive discounted care services, coordination, and products.',
      cancellationPolicy: 'Cancel anytime. Cancellation takes effect at the end of the current billing cycle.',
      autoRenewal: 'Membership automatically renews monthly until cancelled.',
      additionalFees: 'Some services may require additional fees not covered by the membership.',
    },
    popular: false,
  },
];

const catalogMap = new Map(catalog.map((p) => [p.id, p]));

const nameToIdMap = new Map(
  catalog.map((p) => [p.name.toLowerCase(), p.id]),
);

export function getPackageCatalog(): CareversePackage[] {
  return catalog;
}

export function getAvailablePackages(): CareversePackage[] {
  return catalog.filter((p) => p.availability === 'AVAILABLE');
}

export function getPackageById(id: string): CareversePackage | undefined {
  return catalogMap.get(id);
}

export function packageIdFromName(name: string): string | undefined {
  return nameToIdMap.get(name.toLowerCase());
}

export function migratePackageNamesToIds(names: string[]): string[] {
  const ids: string[] = [];
  for (const name of names) {
    const id = packageIdFromName(name);
    if (id) {
      ids.push(id);
    } else if (getPackageById(name)) {
      ids.push(name);
    }
  }
  return ids;
}

export function resolvePackages(ids: string[]): CareversePackage[] {
  return ids
    .map((id) => getPackageById(id))
    .filter((p): p is CareversePackage => Boolean(p));
}
