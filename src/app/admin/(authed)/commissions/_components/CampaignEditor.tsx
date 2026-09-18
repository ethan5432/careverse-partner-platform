'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Zap } from 'lucide-react';
import { mockProducts, mockPartners } from '@/data/mock';
import type { PartnerType } from '@/data/mock/types';
import {
  createCampaign, addCampaignVersion, getDefaultEconomics, calculateEconomics,
  type CommissionCampaign, type CampaignStatus, type CommissionBasis, type CommissionStructureType,
  type ProductScope, type PartnerScope, type VolumeTier, type CommissionRule, type ProductEconomics,
} from '@/lib/commission-campaigns';

const fmtMoney2 = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtPct = (n: number) => `${(n * 100).toFixed(0)}%`;

export function CampaignEditor({
  campaign,
  onSave,
  onClose,
}: {
  campaign: CommissionCampaign | null;
  onSave: (campaign: CommissionCampaign, isNew: boolean) => void;
  onClose: () => void;
}) {
  const isNew = !campaign;
  const [name, setName] = useState(campaign?.name || '');
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status || 'DRAFT');
  const [startDate, setStartDate] = useState(campaign?.startDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(campaign?.endDate || '');
  const [description, setDescription] = useState(campaign?.internalDescription || '');
  const [productScope, setProductScope] = useState<ProductScope>(campaign?.productScope || 'ALL');
  const [productIds, setProductIds] = useState<string[]>(campaign?.productIds || []);
  const [partnerScope, setPartnerScope] = useState<PartnerScope>(campaign?.partnerScope || 'ALL_TYPE');
  const [partnerType, setPartnerType] = useState<PartnerType | null>(campaign?.partnerType || 'CREATOR');
  const [partnerIds, setPartnerIds] = useState<string[]>(campaign?.partnerIds || []);
  const [structureType, setStructureType] = useState<CommissionStructureType>(campaign?.rule.structureType || 'FLAT');
  const [basis, setBasis] = useState<CommissionBasis>(campaign?.rule.basis || 'REVENUE');
  const [defaultRate, setDefaultRate] = useState(campaign?.rule.defaultRate || 0.20);
  const [fixedAmount, setFixedAmount] = useState(campaign?.rule.fixedAmount || 0);
  const [tiers, setTiers] = useState<VolumeTier[]>(campaign?.rule.tiers || []);
  const [customPartnerRates, setCustomPartnerRates] = useState<Record<string, number>>(campaign?.rule.customPartnerRates || {});
  const [economics, setEconomics] = useState<ProductEconomics[]>(campaign?.economics || []);
  const [isSpecial, setIsSpecial] = useState(campaign?.isSpecial || false);
  const [simPartner, setSimPartner] = useState(mockPartners[0]?.id || '');
  const [simProduct, setSimProduct] = useState(mockProducts[0]?.id || '');
  const [simAmount, setSimAmount] = useState(89);
  const [simDiscount, setSimDiscount] = useState(0);

  const rule: CommissionRule = {
    id: campaign?.rule.id || `rule-${Date.now()}`,
    structureType, basis, defaultRate, fixedAmount, tiers, customPartnerRates,
    bonuses: campaign?.rule.bonuses || [],
  };

  const handleSave = () => {
    const data: Partial<CommissionCampaign> = {
      name, status, startDate, endDate: endDate || null,
      internalDescription: description, productScope, productIds,
      partnerScope, partnerType: partnerScope === 'ALL_TYPE' ? partnerType : null,
      partnerIds, storefrontIds: [], rule, economics, isSpecial,
      isProductSpecific: productScope === 'SINGLE' || productScope === 'SELECTED',
      isPartnerSpecific: partnerScope === 'SELECTED',
    };
    if (isNew) {
      onSave(createCampaign(data), true);
    } else if (campaign) {
      const rateChanged = campaign.rule.defaultRate !== defaultRate || campaign.rule.basis !== basis || campaign.rule.structureType !== structureType;
      if (rateChanged) {
        onSave(addCampaignVersion({ ...campaign, ...data, updatedAt: new Date().toISOString() } as CommissionCampaign, rule, `Commission changed from ${fmtPct(campaign.rule.defaultRate)} to ${fmtPct(defaultRate)}`), false);
      } else {
        onSave({ ...campaign, ...data, updatedAt: new Date().toISOString() } as CommissionCampaign, false);
      }
    }
  };

  const toggleProduct = (id: string) => {
    setProductIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    if (!economics.find(e => e.productId === id)) setEconomics(prev => [...prev, getDefaultEconomics(id)]);
  };
  const togglePartner = (id: string) => setPartnerIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const addTier = () => setTiers(prev => [...prev, { id: `t-${Date.now()}`, minQualifying: prev.length === 0 ? 0 : (prev[prev.length - 1].maxQualifying || 0) + 1, maxQualifying: null, rate: 0.40 }]);
  const updateTier = (id: string, field: keyof VolumeTier, value: number | null) => setTiers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  const removeTier = (id: string) => setTiers(prev => prev.filter(t => t.id !== id));
  const updateEconomics = (productId: string, field: keyof ProductEconomics, value: number | null) => setEconomics(prev => prev.map(e => e.productId === productId ? { ...e, [field]: value } : e));

  const simResult = useMemo(() => {
    const econ = economics.find(e => e.productId === simProduct) || getDefaultEconomics(simProduct);
    const netAmount = simAmount - simDiscount;
    const contributionBefore = netAmount - econ.processingFee - econ.otherFees - econ.providerCost;
    const rate = customPartnerRates[simPartner] ?? defaultRate;
    const commission = basis === 'FIXED' ? (fixedAmount || 0) : contributionBefore * rate;
    const careverseContribution = contributionBefore - commission;
    const marginRetained = contributionBefore > 0 ? careverseContribution / contributionBefore : 0;
    return { netAmount, contributionBefore, commission, careverseContribution, marginRetained, rate };
  }, [simProduct, simAmount, simDiscount, economics, customPartnerRates, defaultRate, basis, fixedAmount, simPartner]);

  const eligiblePartners = mockPartners.filter(p => p.status === 'ACTIVE' && (partnerScope !== 'ALL_TYPE' || !partnerType || p.type === partnerType));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto cv-card border-cv-line rounded-2xl bg-white p-0">
        <DialogHeader className="p-6 pb-4 border-b border-cv-line sticky top-0 bg-white z-10">
          <DialogTitle className="text-lg font-bold text-cv-ink">{isNew ? 'Create Campaign' : `Edit ${campaign?.name}`}</DialogTitle>
          <DialogDescription className="text-sm text-cv-muted">{isNew ? 'Define commission terms, products, partners, and economics.' : 'Changes to commission rate create a new version — historical terms are preserved.'}</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Basics */}
          <Section title="Campaign Basics">
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label className="text-sm font-bold">Campaign name</Label><Input value={name} onChange={e => setName(e.target.value)} className="cv-input" placeholder="e.g. Family Plus Launch Special" /></div>
              <div><Label className="text-sm font-bold">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as CampaignStatus)}><SelectTrigger className="cv-input"><SelectValue /></SelectTrigger><SelectContent>
                  {['DRAFT','SCHEDULED','ACTIVE','PAUSED','ENDED','ARCHIVED'].map(s => <SelectItem key={s} value={s}>{s.charAt(0)+s.slice(1).toLowerCase()}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div><Label className="text-sm font-bold">Start date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">End date (optional)</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="cv-input" /></div>
              <div className="sm:col-span-2"><Label className="text-sm font-bold">Internal description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="cv-input min-h-[60px]" placeholder="Internal notes — not visible to partners" /></div>
              <div className="sm:col-span-2"><label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={isSpecial} onCheckedChange={(v) => setIsSpecial(v === true)} /><span className="text-sm font-bold text-cv-ink flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Mark as temporary special offer</span></label></div>
            </div>
          </Section>

          {/* Product Selection */}
          <Section title="Product Selection" subtitle="Choose which Careverse catalog products this campaign applies to.">
            <div className="flex items-center gap-2 mb-3">
              {(['ALL','SELECTED','SINGLE'] as ProductScope[]).map(s => (
                <button key={s} onClick={() => setProductScope(s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-bold transition-colors', productScope === s ? 'bg-cv-ink text-white' : 'bg-cv-soft text-cv-muted hover:text-cv-ink')}>{s==='ALL'?'All products':s==='SELECTED'?'Selected products':'One product'}</button>
              ))}
            </div>
            {(productScope === 'SELECTED' || productScope === 'SINGLE') && (
              <div className="space-y-2">
                {mockProducts.map(p => (
                  <label key={p.id} className="flex items-center gap-3 rounded-xl border border-cv-line p-3 cursor-pointer hover:bg-cv-soft/50">
                    <Checkbox checked={productIds.includes(p.id)} onCheckedChange={() => productScope === 'SINGLE' ? setProductIds([p.id]) : toggleProduct(p.id)} />
                    <div className="flex-1"><p className="text-sm font-bold text-cv-ink">{p.name}</p><p className="text-xs text-cv-muted">{p.billingType} · ${p.price}/mo · {p.partnerAvailability.toLowerCase()}</p></div>
                    <span className="text-xs font-bold text-cv-body">{p.availability === 'AVAILABLE' ? 'Available' : 'Coming soon'}</span>
                  </label>
                ))}
              </div>
            )}
            {productScope === 'ALL' && <div className="rounded-xl bg-cv-soft p-3"><p className="text-xs text-cv-body">This campaign applies to all Careverse catalog products.</p></div>}
          </Section>

          {/* Partner Assignment */}
          <Section title="Partner Assignment" subtitle="Define who receives this campaign.">
            <div className="flex items-center gap-2 mb-3">
              {(['ALL_TYPE','SELECTED','PARTNER_GROUP'] as PartnerScope[]).map(s => (
                <button key={s} onClick={() => setPartnerScope(s)} className={cn('rounded-lg px-3 py-1.5 text-xs font-bold transition-colors', partnerScope === s ? 'bg-cv-ink text-white' : 'bg-cv-soft text-cv-muted hover:text-cv-ink')}>{s==='ALL_TYPE'?'All of a type':s==='SELECTED'?'Selected partners':'Partner group'}</button>
              ))}
            </div>
            {partnerScope === 'ALL_TYPE' && (
              <div><Label className="text-sm font-bold">Partner type</Label>
                <Select value={partnerType || 'CREATOR'} onValueChange={(v) => setPartnerType(v as PartnerType)}><SelectTrigger className="cv-input"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="CREATOR">Creator</SelectItem><SelectItem value="BUSINESS">Business / Agency</SelectItem>
                </SelectContent></Select>
              </div>
            )}
            {partnerScope === 'SELECTED' && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {mockPartners.filter(p => p.status === 'ACTIVE').map(p => (
                  <label key={p.id} className="flex items-center gap-3 rounded-xl border border-cv-line p-3 cursor-pointer hover:bg-cv-soft/50">
                    <Checkbox checked={partnerIds.includes(p.id)} onCheckedChange={() => togglePartner(p.id)} />
                    <div className="flex-1"><p className="text-sm font-bold text-cv-ink">{p.name}</p><p className="text-xs text-cv-muted">{p.type === 'CREATOR' ? 'Creator' : 'Business / Agency'} · {p.conversions} conversions</p></div>
                  </label>
                ))}
              </div>
            )}
          </Section>

          {/* Commission Structure */}
          <Section title="Commission Structure" subtitle="Choose how partners earn.">
            <div className="grid gap-3 sm:grid-cols-2 mb-3">
              <div><Label className="text-sm font-bold">Structure type</Label>
                <Select value={structureType} onValueChange={(v) => setStructureType(v as CommissionStructureType)}><SelectTrigger className="cv-input"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="FLAT">One commission rate</SelectItem><SelectItem value="TIERS">Volume tiers</SelectItem><SelectItem value="CUSTOM_PARTNER">Custom partner rate</SelectItem><SelectItem value="FIXED_AMOUNT">Fixed amount</SelectItem>
                </SelectContent></Select>
              </div>
              <div><Label className="text-sm font-bold">Commission basis</Label>
                <Select value={basis} onValueChange={(v) => setBasis(v as CommissionBasis)}><SelectTrigger className="cv-input"><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="REVENUE">Revenue-based</SelectItem><SelectItem value="MARGIN">Margin-based</SelectItem><SelectItem value="FIXED">Fixed amount</SelectItem>
                </SelectContent></Select>
              </div>
            </div>
            {(structureType === 'FLAT' || structureType === 'TIERS' || structureType === 'CUSTOM_PARTNER') && (
              <div className="mb-3"><Label className="text-sm font-bold">Default rate</Label>
                <div className="flex items-center gap-2"><Input type="number" step="0.01" min="0" max="1" value={defaultRate} onChange={e => setDefaultRate(parseFloat(e.target.value) || 0)} className="cv-input w-24" /><span className="text-sm text-cv-muted">= {fmtPct(defaultRate)}</span></div>
              </div>
            )}
            {structureType === 'FIXED_AMOUNT' && (
              <div className="mb-3"><Label className="text-sm font-bold">Fixed amount per sale</Label>
                <div className="flex items-center gap-2"><span className="text-sm text-cv-muted">$</span><Input type="number" value={fixedAmount} onChange={e => setFixedAmount(parseFloat(e.target.value) || 0)} className="cv-input w-24" /></div>
              </div>
            )}
            {structureType === 'TIERS' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between"><Label className="text-sm font-bold">Volume tiers</Label><Button size="sm" variant="outline" onClick={addTier} className="rounded-full text-xs"><Plus className="h-3 w-3" /> Add tier</Button></div>
                {tiers.map(t => (
                  <div key={t.id} className="flex items-center gap-2 rounded-xl border border-cv-line p-3">
                    <Input type="number" placeholder="Min" value={t.minQualifying} onChange={e => updateTier(t.id, 'minQualifying', parseInt(e.target.value) || 0)} className="cv-input w-20" />
                    <span className="text-xs text-cv-muted">to</span>
                    <Input type="number" placeholder="Max" value={t.maxQualifying ?? ''} onChange={e => updateTier(t.id, 'maxQualifying', e.target.value ? parseInt(e.target.value) : null)} className="cv-input w-20" />
                    <span className="text-xs text-cv-muted">→</span>
                    <Input type="number" step="0.01" value={t.rate} onChange={e => updateTier(t.id, 'rate', parseFloat(e.target.value) || 0)} className="cv-input w-20" />
                    <span className="text-xs font-bold text-cv-ink">{fmtPct(t.rate)}</span>
                    <button onClick={() => removeTier(t.id)} className="ml-auto rounded-lg p-1.5 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-cv-red" /></button>
                  </div>
                ))}
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3"><p className="text-xs text-amber-800">Tiers are <strong>prospective</strong>: previous qualifying purchases keep their original rate. New purchases use the newly achieved tier rate.</p></div>
              </div>
            )}
            {structureType === 'CUSTOM_PARTNER' && partnerIds.length > 0 && (
              <div className="space-y-2"><Label className="text-sm font-bold">Custom rates per partner</Label>
                {partnerIds.map(pid => {
                  const partner = mockPartners.find(p => p.id === pid);
                  if (!partner) return null;
                  return (
                    <div key={pid} className="flex items-center gap-2 rounded-xl border border-cv-line p-3">
                      <span className="text-sm font-bold text-cv-ink flex-1">{partner.name}</span>
                      <Input type="number" step="0.01" value={customPartnerRates[pid] ?? defaultRate} onChange={e => setCustomPartnerRates(prev => ({ ...prev, [pid]: parseFloat(e.target.value) || 0 }))} className="cv-input w-20" />
                      <span className="text-xs font-bold text-cv-ink">{fmtPct(customPartnerRates[pid] ?? defaultRate)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Margin Economics */}
          {productIds.length > 0 && (productScope === 'SELECTED' || productScope === 'SINGLE') && (
            <Section title="Margin Economics (Admin Only)" subtitle="Internal cost structure — not visible to partners.">
              <div className="space-y-3">
                {productIds.map(pid => {
                  const product = mockProducts.find(p => p.id === pid);
                  const econ = economics.find(e => e.productId === pid) || getDefaultEconomics(pid);
                  if (!product) return null;
                  const econCalc = calculateEconomics(econ, customPartnerRates[partnerIds[0]] ?? defaultRate);
                  return (
                    <Card key={pid} className="border border-cv-line">
                      <CardContent className="p-4 space-y-3">
                        <p className="text-sm font-bold text-cv-ink">{product.name}</p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                          <EconField label="Customer price" value={econ.customerPrice} onChange={(v) => updateEconomics(pid, 'customerPrice', v)} />
                          <EconField label="Less discounts" value={econ.discounts} onChange={(v) => updateEconomics(pid, 'discounts', v)} />
                          <EconField label="Net revenue" value={econ.netRevenue} onChange={(v) => updateEconomics(pid, 'netRevenue', v)} />
                          <EconField label="Processing fees" value={econ.processingFee} onChange={(v) => updateEconomics(pid, 'processingFee', v)} />
                          <EconField label="Other fees" value={econ.otherFees} onChange={(v) => updateEconomics(pid, 'otherFees', v)} />
                          <EconField label="Provider cost" value={econ.providerCost} onChange={(v) => updateEconomics(pid, 'providerCost', v)} />
                        </div>
                        <div className="rounded-lg bg-cv-soft p-3 space-y-1">
                          <div className="flex justify-between"><span className="text-xs text-cv-muted">Contribution margin before commission</span><span className="text-xs font-bold text-cv-ink">{fmtMoney2(econCalc.contributionBeforeCommission)}</span></div>
                          <div className="flex justify-between"><span className="text-xs text-cv-muted">Partner commission ({fmtPct(customPartnerRates[partnerIds[0]] ?? defaultRate)})</span><span className="text-xs font-bold text-cv-red">{fmtMoney2(econCalc.partnerCommission)}</span></div>
                          <div className="flex justify-between"><span className="text-xs text-cv-muted">Careverse contribution after commission</span><span className="text-xs font-bold text-cv-good">{fmtMoney2(econCalc.careverseContribution)}</span></div>
                          <div className="flex justify-between"><span className="text-xs text-cv-muted">Margin retained</span><span className="text-xs font-bold text-cv-ink">{fmtPct(econCalc.marginRetained)}</span></div>
                        </div>
                        <div><Label className="text-xs font-bold">Min Careverse contribution (guardrail)</Label>
                          <div className="flex items-center gap-2"><span className="text-xs text-cv-muted">$</span>
                            <Input type="number" value={econ.minCareverseContribution ?? ''} onChange={e => updateEconomics(pid, 'minCareverseContribution', e.target.value ? parseFloat(e.target.value) : null)} className="cv-input w-24" placeholder="Optional" />
                            {econCalc.maxAllowedRate !== null && <span className="text-xs text-cv-muted">Max allowed rate: <strong className="text-cv-ink">{fmtPct(econCalc.maxAllowedRate)}</strong></span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Commission Simulator */}
          <Section title="Commission Simulator" subtitle="Test commission calculations before publishing.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-3">
              <div><Label className="text-sm font-bold">Partner</Label>
                <Select value={simPartner} onValueChange={setSimPartner}><SelectTrigger className="cv-input"><SelectValue /></SelectTrigger><SelectContent>
                  {eligiblePartners.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div><Label className="text-sm font-bold">Product</Label>
                <Select value={simProduct} onValueChange={setSimProduct}><SelectTrigger className="cv-input"><SelectValue /></SelectTrigger><SelectContent>
                  {mockProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent></Select>
              </div>
              <div><Label className="text-sm font-bold">Sale amount</Label><Input type="number" value={simAmount} onChange={e => setSimAmount(parseFloat(e.target.value) || 0)} className="cv-input" /></div>
              <div><Label className="text-sm font-bold">Discount</Label><Input type="number" value={simDiscount} onChange={e => setSimDiscount(parseFloat(e.target.value) || 0)} className="cv-input" /></div>
            </div>
            {simResult && (
              <div className="rounded-xl border border-cv-line p-4 bg-cv-soft/50">
                <div className="grid gap-2 sm:grid-cols-3">
                  <SimField label="Customer payment" value={fmtMoney2(simResult.netAmount)} />
                  <SimField label="Eligible margin" value={fmtMoney2(simResult.contributionBefore)} />
                  <SimField label="Commission rate" value={fmtPct(simResult.rate)} />
                  <SimField label="Partner commission" value={fmtMoney2(simResult.commission)} highlight />
                  <SimField label="Careverse contribution" value={fmtMoney2(simResult.careverseContribution)} />
                  <SimField label="Margin retained" value={fmtPct(simResult.marginRetained)} />
                </div>
              </div>
            )}
          </Section>
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-cv-line sticky bottom-0 bg-white">
          <Button variant="outline" onClick={onClose} className="rounded-full border-cv-line font-bold">Cancel</Button>
          <Button className="bg-cv-ink text-white hover:bg-cv-ink/90 rounded-full font-bold" onClick={handleSave} disabled={!name}>{isNew ? 'Create campaign' : 'Save changes'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (<div className="rounded-xl border border-cv-line p-4 space-y-3"><div><p className="text-sm font-bold text-cv-ink">{title}</p>{subtitle && <p className="text-xs text-cv-muted mt-0.5">{subtitle}</p>}</div>{children}</div>);
}
function EconField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (<div className="flex items-center justify-between rounded-lg bg-cv-soft px-3 py-2"><span className="text-xs text-cv-muted">{label}</span><Input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} className="cv-input w-20 h-8 text-xs" /></div>);
}
function SimField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (<div className={cn('rounded-lg p-3', highlight ? 'bg-cv-ink text-white' : 'bg-white border border-cv-line')}><p className={cn('text-[10px] font-bold uppercase tracking-wider', highlight ? 'text-white/70' : 'text-cv-muted')}>{label}</p><p className={cn('text-lg font-bold mt-0.5', highlight ? 'text-white' : 'text-cv-ink')}>{value}</p></div>);
}
