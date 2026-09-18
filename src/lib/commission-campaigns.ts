import type { PartnerType } from '@/data/mock/types';

// ─── Core Types ─────────────────────────────────────────────────────────────

export type CampaignStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'PAUSED'
  | 'ENDED'
  | 'ARCHIVED';

export type CommissionBasis = 'REVENUE' | 'MARGIN' | 'FIXED';
export type CommissionStructureType = 'FLAT' | 'TIERS' | 'CUSTOM_PARTNER' | 'FIXED_AMOUNT';

export type ProductScope = 'ALL' | 'SELECTED' | 'SINGLE';
export type PartnerScope = 'ALL_TYPE' | 'SELECTED' | 'PARTNER_GROUP';

export interface VolumeTier {
  id: string;
  minQualifying: number;
  maxQualifying: number | null;
  rate: number;
}

export interface CommissionBonus {
  id: string;
  description: string;
  threshold: number;
  amount: number;
}

export interface CommissionRule {
  id: string;
  structureType: CommissionStructureType;
  basis: CommissionBasis;
  defaultRate: number;
  fixedAmount: number | null;
  tiers: VolumeTier[];
  customPartnerRates: Record<string, number>;
  bonuses: CommissionBonus[];
}

export interface ProductEconomics {
  productId: string;
  customerPrice: number;
  discounts: number;
  netRevenue: number;
  processingFee: number;
  otherFees: number;
  providerCost: number;
  minCareverseContribution: number | null;
}

export interface CampaignVersion {
  version: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  rule: CommissionRule;
  products: string[];
  partners: string[];
  changedBy: string;
  changeDescription: string;
}

export interface CampaignHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  actor: string;
}

export interface CampaignPerformance {
  qualifyingMemberships: number;
  revenueGenerated: number;
  partnerCommissions: number;
  contributionBeforeCommission: number;
  contributionAfterCommission: number;
  averageCommission: number;
  refunds: number;
  topPartners: { partnerId: string; partnerName: string; memberships: number; commission: number }[];
}

export interface CommissionCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  productScope: ProductScope;
  productIds: string[];
  partnerScope: PartnerScope;
  partnerType: PartnerType | null;
  partnerIds: string[];
  storefrontIds: string[];
  startDate: string;
  endDate: string | null;
  internalDescription: string;
  rule: CommissionRule;
  economics: ProductEconomics[];
  versions: CampaignVersion[];
  history: CampaignHistoryEntry[];
  isSpecial: boolean;
  isProductSpecific: boolean;
  isPartnerSpecific: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionSnapshot {
  id: string;
  campaignId: string;
  campaignVersion: number;
  productId: string;
  partnerId: string;
  basis: CommissionBasis;
  rate: number;
  applicableTier: string | null;
  eligibleAmount: number;
  commissionAmount: number;
  effectiveDate: string;
}

export interface EffectiveCommissionResult {
  campaign: CommissionCampaign | null;
  campaignName: string;
  partnerId: string;
  productId: string;
  tier: string | null;
  basis: CommissionBasis;
  rate: number;
  expectedCommission: number;
  reason: string;
}

// ─── Default Economics per Product ──────────────────────────────────────────

const DEFAULT_ECONOMICS: Record<string, Omit<ProductEconomics, 'productId' | 'minCareverseContribution'>> = {
  'prod-family': { customerPrice: 49, discounts: 0, netRevenue: 49, processingFee: 1.47, otherFees: 0, providerCost: 24.5 },
  'prod-family-plus': { customerPrice: 89, discounts: 0, netRevenue: 89, processingFee: 2.67, otherFees: 0, providerCost: 44.5 },
  'prod-care-circle': { customerPrice: 149, discounts: 0, netRevenue: 149, processingFee: 4.47, otherFees: 0, providerCost: 74.5 },
};

export function getDefaultEconomics(productId: string): ProductEconomics {
  const base = DEFAULT_ECONOMICS[productId];
  if (base) return { ...base, productId, minCareverseContribution: null };
  return { productId, customerPrice: 0, discounts: 0, netRevenue: 0, processingFee: 0, otherFees: 0, providerCost: 0, minCareverseContribution: null };
}

export function calculateEconomics(econ: ProductEconomics, rate: number): {
  contributionBeforeCommission: number;
  partnerCommission: number;
  careverseContribution: number;
  marginRetained: number;
  maxAllowedRate: number | null;
} {
  const contributionBeforeCommission = econ.netRevenue - econ.processingFee - econ.otherFees - econ.providerCost;
  const partnerCommission = contributionBeforeCommission * rate;
  const careverseContribution = contributionBeforeCommission - partnerCommission;
  const marginRetained = careverseContribution / Math.max(contributionBeforeCommission, 0.01);
  let maxAllowedRate: number | null = null;
  if (econ.minCareverseContribution !== null && contributionBeforeCommission > 0) {
    maxAllowedRate = Math.max(0, 1 - econ.minCareverseContribution / contributionBeforeCommission);
  }
  return { contributionBeforeCommission, partnerCommission, careverseContribution, marginRetained, maxAllowedRate };
}

// ─── Seed Campaigns ─────────────────────────────────────────────────────────

function seedCampaigns(): CommissionCampaign[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'camp-001',
      name: 'Standard Creator Commission',
      status: 'ACTIVE',
      productScope: 'ALL',
      productIds: [],
      partnerScope: 'ALL_TYPE',
      partnerType: 'CREATOR',
      partnerIds: [],
      storefrontIds: [],
      startDate: '2025-01-01',
      endDate: null,
      internalDescription: 'Default commission for all creators — 20% of revenue.',
      rule: {
        id: 'rule-001',
        structureType: 'FLAT',
        basis: 'REVENUE',
        defaultRate: 0.20,
        fixedAmount: null,
        tiers: [],
        customPartnerRates: {},
        bonuses: [],
      },
      economics: [],
      versions: [
        { version: 1, effectiveFrom: '2025-01-01', effectiveTo: null, rule: { id: 'rule-001', structureType: 'FLAT', basis: 'REVENUE', defaultRate: 0.20, fixedAmount: null, tiers: [], customPartnerRates: {}, bonuses: [] }, products: [], partners: [], changedBy: 'Admin', changeDescription: 'Initial creation' },
      ],
      history: [
        { id: 'h-001', timestamp: '2025-01-01T00:00:00Z', action: 'CREATED', description: 'Campaign created with 20% flat rate for creators', actor: 'Admin' },
      ],
      isSpecial: false,
      isProductSpecific: false,
      isPartnerSpecific: false,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: now,
    },
    {
      id: 'camp-002',
      name: 'Standard Business Commission',
      status: 'ACTIVE',
      productScope: 'ALL',
      productIds: [],
      partnerScope: 'ALL_TYPE',
      partnerType: 'BUSINESS',
      partnerIds: [],
      storefrontIds: [],
      startDate: '2025-01-01',
      endDate: null,
      internalDescription: 'Default commission for all business/agency partners — 20% of revenue.',
      rule: {
        id: 'rule-002',
        structureType: 'FLAT',
        basis: 'REVENUE',
        defaultRate: 0.20,
        fixedAmount: null,
        tiers: [],
        customPartnerRates: {},
        bonuses: [],
      },
      economics: [],
      versions: [
        { version: 1, effectiveFrom: '2025-01-01', effectiveTo: null, rule: { id: 'rule-002', structureType: 'FLAT', basis: 'REVENUE', defaultRate: 0.20, fixedAmount: null, tiers: [], customPartnerRates: {}, bonuses: [] }, products: [], partners: [], changedBy: 'Admin', changeDescription: 'Initial creation' },
      ],
      history: [
        { id: 'h-002', timestamp: '2025-01-01T00:00:00Z', action: 'CREATED', description: 'Campaign created with 20% flat rate for businesses', actor: 'Admin' },
      ],
      isSpecial: false,
      isProductSpecific: false,
      isPartnerSpecific: false,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: now,
    },
    {
      id: 'camp-003',
      name: 'Family Plus Launch Special',
      status: 'ACTIVE',
      productScope: 'SINGLE',
      productIds: ['prod-family-plus'],
      partnerScope: 'ALL_TYPE',
      partnerType: 'CREATOR',
      partnerIds: [],
      storefrontIds: [],
      startDate: '2026-09-20',
      endDate: '2026-09-30',
      internalDescription: 'Temporary launch special — 60% commission on Family Plus for creators.',
      rule: {
        id: 'rule-003',
        structureType: 'FLAT',
        basis: 'MARGIN',
        defaultRate: 0.60,
        fixedAmount: null,
        tiers: [],
        customPartnerRates: {},
        bonuses: [
          { id: 'b-001', description: 'Bonus after 10 qualifying memberships', threshold: 10, amount: 25 },
        ],
      },
      economics: [
        { ...getDefaultEconomics('prod-family-plus'), minCareverseContribution: 30 },
      ],
      versions: [
        { version: 1, effectiveFrom: '2026-09-20', effectiveTo: null, rule: { id: 'rule-003', structureType: 'FLAT', basis: 'MARGIN', defaultRate: 0.60, fixedAmount: null, tiers: [], customPartnerRates: {}, bonuses: [{ id: 'b-001', description: 'Bonus after 10 qualifying memberships', threshold: 10, amount: 25 }] }, products: ['prod-family-plus'], partners: [], changedBy: 'Admin', changeDescription: 'Initial creation — 60% margin-based with $25 bonus' },
      ],
      history: [
        { id: 'h-003', timestamp: '2026-09-18T00:00:00Z', action: 'CREATED', description: 'Launch special created: 60% on Family Plus, Sep 20-30', actor: 'Admin' },
      ],
      isSpecial: true,
      isProductSpecific: true,
      isPartnerSpecific: false,
      createdAt: '2026-09-18T00:00:00Z',
      updatedAt: now,
    },
    {
      id: 'camp-004',
      name: 'Creator Volume Tiers',
      status: 'ACTIVE',
      productScope: 'ALL',
      productIds: [],
      partnerScope: 'ALL_TYPE',
      partnerType: 'CREATOR',
      partnerIds: [],
      storefrontIds: [],
      startDate: '2025-06-01',
      endDate: null,
      internalDescription: 'Volume-based tiers for creators — qualifying memberships only.',
      rule: {
        id: 'rule-004',
        structureType: 'TIERS',
        basis: 'MARGIN',
        defaultRate: 0.40,
        fixedAmount: null,
        tiers: [
          { id: 't-1', minQualifying: 0, maxQualifying: 9, rate: 0.40 },
          { id: 't-2', minQualifying: 10, maxQualifying: 24, rate: 0.45 },
          { id: 't-3', minQualifying: 25, maxQualifying: 49, rate: 0.50 },
          { id: 't-4', minQualifying: 50, maxQualifying: null, rate: 0.55 },
        ],
        customPartnerRates: {},
        bonuses: [],
      },
      economics: [],
      versions: [
        { version: 1, effectiveFrom: '2025-06-01', effectiveTo: null, rule: { id: 'rule-004', structureType: 'TIERS', basis: 'MARGIN', defaultRate: 0.40, fixedAmount: null, tiers: [{ id: 't-1', minQualifying: 0, maxQualifying: 9, rate: 0.40 }, { id: 't-2', minQualifying: 10, maxQualifying: 24, rate: 0.45 }, { id: 't-3', minQualifying: 25, maxQualifying: 49, rate: 0.50 }, { id: 't-4', minQualifying: 50, maxQualifying: null, rate: 0.55 }], customPartnerRates: {}, bonuses: [] }, products: [], partners: [], changedBy: 'Admin', changeDescription: 'Initial creation — 4-tier volume structure' },
      ],
      history: [
        { id: 'h-004', timestamp: '2025-06-01T00:00:00Z', action: 'CREATED', description: 'Volume tier campaign created (0-9: 40%, 10-24: 45%, 25-49: 50%, 50+: 55%)', actor: 'Admin' },
      ],
      isSpecial: false,
      isProductSpecific: false,
      isPartnerSpecific: false,
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: now,
    },
    {
      id: 'camp-005',
      name: 'Marcus Johnson — Custom Terms',
      status: 'ACTIVE',
      productScope: 'ALL',
      productIds: [],
      partnerScope: 'SELECTED',
      partnerType: null,
      partnerIds: ['p-1'],
      storefrontIds: [],
      startDate: '2025-07-01',
      endDate: null,
      internalDescription: 'Custom negotiated rate for Marcus Johnson — 25% of revenue.',
      rule: {
        id: 'rule-005',
        structureType: 'CUSTOM_PARTNER',
        basis: 'REVENUE',
        defaultRate: 0.20,
        fixedAmount: null,
        tiers: [],
        customPartnerRates: { 'p-1': 0.25 },
        bonuses: [],
      },
      economics: [],
      versions: [
        { version: 1, effectiveFrom: '2025-07-01', effectiveTo: null, rule: { id: 'rule-005', structureType: 'CUSTOM_PARTNER', basis: 'REVENUE', defaultRate: 0.20, fixedAmount: null, tiers: [], customPartnerRates: { 'p-1': 0.25 }, bonuses: [] }, products: [], partners: ['p-1'], changedBy: 'Admin', changeDescription: 'Custom 25% rate for Marcus Johnson' },
      ],
      history: [
        { id: 'h-005', timestamp: '2025-07-01T00:00:00Z', action: 'CREATED', description: 'Partner-specific campaign: Marcus Johnson at 25%', actor: 'Admin' },
      ],
      isSpecial: false,
      isProductSpecific: false,
      isPartnerSpecific: true,
      createdAt: '2025-07-01T00:00:00Z',
      updatedAt: now,
    },
  ];
}

// ─── Persistence ────────────────────────────────────────────────────────────

const CAMPAIGNS_KEY = 'careverse_commission_campaigns';

export function loadCampaigns(): CommissionCampaign[] {
  if (typeof window === 'undefined') return seedCampaigns();
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    if (!raw) {
      const seeded = seedCampaigns();
      saveCampaigns(seeded);
      return seeded;
    }
    return JSON.parse(raw) as CommissionCampaign[];
  } catch {
    return seedCampaigns();
  }
}

export function saveCampaigns(campaigns: CommissionCampaign[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

// ─── Campaign CRUD ──────────────────────────────────────────────────────────

export function createCampaign(data: Partial<CommissionCampaign>): CommissionCampaign {
  const now = new Date().toISOString();
  const id = `camp-${Date.now()}`;
  const campaign: CommissionCampaign = {
    id,
    name: data.name || 'Untitled Campaign',
    status: data.status || 'DRAFT',
    productScope: data.productScope || 'ALL',
    productIds: data.productIds || [],
    partnerScope: data.partnerScope || 'ALL_TYPE',
    partnerType: data.partnerType || null,
    partnerIds: data.partnerIds || [],
    storefrontIds: data.storefrontIds || [],
    startDate: data.startDate || now.split('T')[0],
    endDate: data.endDate || null,
    internalDescription: data.internalDescription || '',
    rule: data.rule || {
      id: `rule-${Date.now()}`,
      structureType: 'FLAT',
      basis: 'REVENUE',
      defaultRate: 0.20,
      fixedAmount: null,
      tiers: [],
      customPartnerRates: {},
      bonuses: [],
    },
    economics: data.economics || [],
    versions: [
      {
        version: 1,
        effectiveFrom: now,
        effectiveTo: null,
        rule: data.rule || { id: `rule-${Date.now()}`, structureType: 'FLAT', basis: 'REVENUE', defaultRate: 0.20, fixedAmount: null, tiers: [], customPartnerRates: {}, bonuses: [] },
        products: data.productIds || [],
        partners: data.partnerIds || [],
        changedBy: 'Admin',
        changeDescription: 'Initial creation',
      },
    ],
    history: [
      { id: `h-${Date.now()}`, timestamp: now, action: 'CREATED', description: `Campaign "${data.name || 'Untitled'}" created`, actor: 'Admin' },
    ],
    isSpecial: data.isSpecial || false,
    isProductSpecific: (data.productScope === 'SINGLE' || data.productScope === 'SELECTED'),
    isPartnerSpecific: (data.partnerScope === 'SELECTED'),
    createdAt: now,
    updatedAt: now,
  };
  return campaign;
}

export function duplicateCampaign(campaign: CommissionCampaign): CommissionCampaign {
  const now = new Date().toISOString();
  const id = `camp-${Date.now()}`;
  return {
    ...campaign,
    id,
    name: `${campaign.name} (Copy)`,
    status: 'DRAFT',
    createdAt: now,
    updatedAt: now,
    versions: [...campaign.versions],
    history: [
      ...campaign.history,
      { id: `h-${Date.now()}`, timestamp: now, action: 'DUPLICATED', description: `Duplicated from "${campaign.name}"`, actor: 'Admin' },
    ],
  };
}

export function addCampaignVersion(campaign: CommissionCampaign, newRule: CommissionRule, changeDescription: string): CommissionCampaign {
  const now = new Date().toISOString();
  const lastVersion = campaign.versions[campaign.versions.length - 1];
  const updatedVersions = campaign.versions.map(v => v.version === lastVersion.version ? { ...v, effectiveTo: now } : v);
  const newVersion: CampaignVersion = {
    version: lastVersion.version + 1,
    effectiveFrom: now,
    effectiveTo: null,
    rule: newRule,
    products: campaign.productIds,
    partners: campaign.partnerIds,
    changedBy: 'Admin',
    changeDescription,
  };
  return {
    ...campaign,
    rule: newRule,
    versions: [...updatedVersions, newVersion],
    history: [
      ...campaign.history,
      { id: `h-${Date.now()}`, timestamp: now, action: 'VERSION_CREATED', description: `Version ${newVersion.version}: ${changeDescription}`, actor: 'Admin' },
    ],
    updatedAt: now,
  };
}

// ─── Effective Commission Resolution ────────────────────────────────────────
// Precedence:
// 1. Partner-specific campaign
// 2. Partner + product campaign
// 3. Active product promotion
// 4. Partner volume tier
// 5. Partner-type campaign
// 6. Global/default

export function resolveEffectiveCommission(
  campaigns: CommissionCampaign[],
  partnerId: string,
  partnerType: PartnerType,
  productId: string,
  qualifyingMemberships: number,
  date: string,
): EffectiveCommissionResult {
  const active = campaigns.filter(c => c.status === 'ACTIVE' || c.status === 'SCHEDULED');
  const dateActive = active.filter(c => {
    const startOk = c.startDate <= date;
    const endOk = !c.endDate || c.endDate >= date;
    return startOk && endOk;
  });

  // 1. Partner-specific campaign
  const partnerSpecific = dateActive.find(c =>
    c.partnerScope === 'SELECTED' &&
    c.partnerIds.includes(partnerId) &&
    (c.productScope === 'ALL' || c.productIds.includes(productId))
  );
  if (partnerSpecific) {
    const rate = partnerSpecific.rule.customPartnerRates[partnerId] ?? partnerSpecific.rule.defaultRate;
    const tier = getTierForQualifying(partnerSpecific, qualifyingMemberships);
    return {
      campaign: partnerSpecific,
      campaignName: partnerSpecific.name,
      partnerId,
      productId,
      tier,
      basis: partnerSpecific.rule.basis,
      rate,
      expectedCommission: 0,
      reason: `Partner-specific campaign "${partnerSpecific.name}" applies — takes highest precedence`,
    };
  }

  // 2. Partner + product campaign
  const partnerProduct = dateActive.find(c =>
    c.partnerScope === 'SELECTED' &&
    c.partnerIds.includes(partnerId) &&
    c.productScope === 'SINGLE' &&
    c.productIds.includes(productId)
  );
  if (partnerProduct) {
    const rate = partnerProduct.rule.customPartnerRates[partnerId] ?? partnerProduct.rule.defaultRate;
    return {
      campaign: partnerProduct,
      campaignName: partnerProduct.name,
      partnerId,
      productId,
      tier: null,
      basis: partnerProduct.rule.basis,
      rate,
      expectedCommission: 0,
      reason: `Partner + product campaign "${partnerProduct.name}" applies`,
    };
  }

  // 3. Active product promotion
  const productPromo = dateActive.find(c =>
    c.productScope === 'SINGLE' &&
    c.productIds.includes(productId) &&
    c.partnerScope === 'ALL_TYPE'
  );
  if (productPromo) {
    const tier = getTierForQualifying(productPromo, qualifyingMemberships);
    return {
      campaign: productPromo,
      campaignName: productPromo.name,
      partnerId,
      productId,
      tier,
      basis: productPromo.rule.basis,
      rate: productPromo.rule.defaultRate,
      expectedCommission: 0,
      reason: `Product promotion "${productPromo.name}" applies to this product`,
    };
  }

  // 4. Partner volume tier
  const tierCampaign = dateActive.find(c =>
    c.rule.structureType === 'TIERS' &&
    c.partnerType === partnerType &&
    c.partnerScope === 'ALL_TYPE'
  );
  if (tierCampaign) {
    const tier = getTierForQualifying(tierCampaign, qualifyingMemberships);
    const rate = getTierRate(tierCampaign, qualifyingMemberships);
    return {
      campaign: tierCampaign,
      campaignName: tierCampaign.name,
      partnerId,
      productId,
      tier,
      basis: tierCampaign.rule.basis,
      rate,
      expectedCommission: 0,
      reason: `Volume tier campaign "${tierCampaign.name}" — ${qualifyingMemberships} qualifying memberships → tier ${tier || 'default'}`,
    };
  }

  // 5. Partner-type campaign
  const typeCampaign = dateActive.find(c =>
    c.partnerType === partnerType &&
    c.partnerScope === 'ALL_TYPE' &&
    c.rule.structureType === 'FLAT'
  );
  if (typeCampaign) {
    return {
      campaign: typeCampaign,
      campaignName: typeCampaign.name,
      partnerId,
      productId,
      tier: null,
      basis: typeCampaign.rule.basis,
      rate: typeCampaign.rule.defaultRate,
      expectedCommission: 0,
      reason: `Partner-type campaign "${typeCampaign.name}" — default ${partnerType.toLowerCase()} rate`,
    };
  }

  // 6. Global default
  return {
    campaign: null,
    campaignName: 'Default (20% revenue)',
    partnerId,
    productId,
    tier: null,
    basis: 'REVENUE',
    rate: 0.20,
    expectedCommission: 0,
    reason: 'No campaign matched — using global default 20% of revenue',
  };
}

function getTierForQualifying(campaign: CommissionCampaign, qualifying: number): string | null {
  if (campaign.rule.tiers.length === 0) return null;
  const tier = campaign.rule.tiers.find(t =>
    qualifying >= t.minQualifying && (t.maxQualifying === null || qualifying <= t.maxQualifying)
  );
  return tier ? `${tier.minQualifying}-${tier.maxQualifying ?? '∞'} (${(tier.rate * 100).toFixed(0)}%)` : null;
}

function getTierRate(campaign: CommissionCampaign, qualifying: number): number {
  if (campaign.rule.tiers.length === 0) return campaign.rule.defaultRate;
  const tier = campaign.rule.tiers.find(t =>
    qualifying >= t.minQualifying && (t.maxQualifying === null || qualifying <= t.maxQualifying)
  );
  return tier ? tier.rate : campaign.rule.defaultRate;
}

// ─── Simulated Performance ──────────────────────────────────────────────────

export function getSimulatedPerformance(campaign: CommissionCampaign): CampaignPerformance {
  // Derive from mock commissions for realism
  const allCommissions = 13;
  const qualifyingMemberships = Math.floor(Math.random() * 50) + 10;
  const revenueGenerated = qualifyingMemberships * 89;
  const contributionBefore = revenueGenerated * 0.5;
  const partnerCommissions = revenueGenerated * campaign.rule.defaultRate;
  const contributionAfter = contributionBefore - partnerCommissions;
  return {
    qualifyingMemberships,
    revenueGenerated,
    partnerCommissions,
    contributionBeforeCommission: contributionBefore,
    contributionAfterCommission: contributionAfter,
    averageCommission: qualifyingMemberships > 0 ? partnerCommissions / qualifyingMemberships : 0,
    refunds: Math.floor(qualifyingMemberships * 0.03),
    topPartners: [
      { partnerId: 'p-2', partnerName: 'Emily Rodriguez', memberships: 18, commission: 18 * 89 * campaign.rule.defaultRate },
      { partnerId: 'p-8', partnerName: 'Nina Garcia', memberships: 12, commission: 12 * 89 * campaign.rule.defaultRate },
    ],
  };
}

// ─── Helpers for Partner-Facing Views ───────────────────────────────────────

export function getCampaignsForPartner(
  campaigns: CommissionCampaign[],
  partnerId: string,
  partnerType: PartnerType,
): CommissionCampaign[] {
  return campaigns.filter(c => {
    if (c.status !== 'ACTIVE') return false;
    // Partner-specific
    if (c.partnerScope === 'SELECTED' && c.partnerIds.includes(partnerId)) return true;
    // Product-specific for all of a type
    if (c.productScope === 'SINGLE' && c.partnerType === partnerType && c.partnerScope === 'ALL_TYPE') return true;
    // Volume tiers for this type
    if (c.rule.structureType === 'TIERS' && c.partnerType === partnerType && c.partnerScope === 'ALL_TYPE') return true;
    // Special for this type
    if (c.isSpecial && c.partnerType === partnerType && c.partnerScope === 'ALL_TYPE') return true;
    return false;
  });
}

export function hasUniqueOffer(
  campaigns: CommissionCampaign[],
  partnerId: string,
  partnerType: PartnerType,
): boolean {
  return getCampaignsForPartner(campaigns, partnerId, partnerType).length > 0;
}
