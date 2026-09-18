'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CareverseLogo } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Mail, User, Phone, Globe, ArrowRight, ArrowLeft,
  Loader as Loader2, Check, User as UserIcon, Building,
  Plus, Trash2, Link as LinkIcon,
} from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import type { PartnerType, CreatorProfile, BusinessProfile, BusinessEntityType, BusinessCategory, BusinessOperatingDuration } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Other',
];

const socialPlatforms = ['Instagram', 'TikTok', 'YouTube', 'X', 'Facebook', 'LinkedIn', 'Other'];

const businessEntityTypes: { value: BusinessEntityType; label: string }[] = [
  { value: 'LLC', label: 'LLC' },
  { value: 'CORPORATION', label: 'Corporation' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'SOLE_PROPRIETOR', label: 'Sole proprietor' },
  { value: 'NONPROFIT', label: 'Nonprofit' },
  { value: 'OTHER', label: 'Other' },
];

const businessCategories: { value: BusinessCategory; label: string }[] = [
  { value: 'BENEFITS_HR', label: 'Benefits / HR' },
  { value: 'FINANCIAL_SERVICES', label: 'Financial services' },
  { value: 'INSURANCE_BROKER', label: 'Insurance / broker' },
  { value: 'CARE_HEALTHCARE_SERVICES', label: 'Care / healthcare services' },
  { value: 'WELLNESS', label: 'Wellness' },
  { value: 'PROFESSIONAL_SERVICES', label: 'Professional services' },
  { value: 'MARKETING_AGENCY', label: 'Marketing / agency' },
  { value: 'COMMUNITY_MEMBERSHIP_ORGANIZATION', label: 'Community / membership organization' },
  { value: 'OTHER', label: 'Other' },
];

const operatingDurations: { value: BusinessOperatingDuration; label: string }[] = [
  { value: 'LESS_THAN_1_YEAR', label: 'Less than 1 year' },
  { value: '1_TO_2_YEARS', label: '1–2 years' },
  { value: '3_TO_5_YEARS', label: '3–5 years' },
  { value: '6_TO_10_YEARS', label: '6–10 years' },
  { value: '10_PLUS_YEARS', label: '10+ years' },
];

const acquisitionMethodOptions = [
  'Organic social', 'Your website', 'Email', 'Paid advertising', 'Direct sales', 'Client / member distribution', 'Other',
];

const advertisingPlatformOptions = ['Meta', 'Google', 'TikTok', 'YouTube', 'Other'];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useMockAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [partnerType, setPartnerType] = useState<PartnerType>('CREATOR');

  // Basic Information — all applicants
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [stateProvince, setStateProvince] = useState('');

  // Creator fields
  const [creatorName, setCreatorName] = useState('');
  const [website, setWebsite] = useState('');
  const [creatorProfiles, setCreatorProfiles] = useState<CreatorProfile[]>([
    { id: `cp-${Date.now()}`, platform: 'Instagram', handle: '', profileUrl: '', followerCount: 0 },
  ]);

  // Business fields
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>('BENEFITS_HR');
  const [businessEntityType, setBusinessEntityType] = useState<BusinessEntityType>('LLC');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [registrationLocation, setRegistrationLocation] = useState('');
  const [businessMailingAddress, setBusinessMailingAddress] = useState('');
  const [businessOperatingDuration, setBusinessOperatingDuration] = useState<BusinessOperatingDuration>('LESS_THAN_1_YEAR');
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([
    { id: `bp-${Date.now()}`, platform: 'LinkedIn', profileUrl: '' },
  ]);
  const [bookOfBusinessDescription, setBookOfBusinessDescription] = useState('');
  const [estimatedVolumeDescription, setEstimatedVolumeDescription] = useState('');

  // Partnership expectations — all applicants
  const [partnershipExpectations, setPartnershipExpectations] = useState('');

  // Customer acquisition — all applicants
  const [acquisitionMethods, setAcquisitionMethods] = useState<string[]>([]);
  const [acquisitionOtherDetail, setAcquisitionOtherDetail] = useState('');

  // Paid advertising — all applicants
  const [purchasesAdvertising, setPurchasesAdvertising] = useState<'YES' | 'NO' | ''>('');
  const [advertisingPlatforms, setAdvertisingPlatforms] = useState<string[]>([]);
  const [advertisingPlatformOtherDetail, setAdvertisingPlatformOtherDetail] = useState('');

  // Decision-making authority — all applicants
  const [hasDecisionAuthority, setHasDecisionAuthority] = useState<'YES' | 'NO' | ''>('');
  const [decisionMakerName, setDecisionMakerName] = useState('');
  const [decisionMakerRole, setDecisionMakerRole] = useState('');
  const [decisionMakerEmail, setDecisionMakerEmail] = useState('');

  // Final confirmations
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [confirmNoGuarantee, setConfirmNoGuarantee] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const toggleAcquisitionMethod = (method: string) => {
    setAcquisitionMethods(prev => prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]);
  };

  const toggleAdvertisingPlatform = (platform: string) => {
    setAdvertisingPlatforms(prev => prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic information validation
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!country) { setError('Please select your country.'); return; }

    // Creator-specific validation
    if (partnerType === 'CREATOR') {
      if (!creatorName.trim()) { setError('Please enter your creator / public name.'); return; }
      const validProfiles = creatorProfiles.filter(p => p.handle.trim() || p.profileUrl.trim());
      if (validProfiles.length === 0) { setError('Please add at least one social account.'); return; }
      for (const p of validProfiles) {
        if (!p.handle.trim() && !p.profileUrl.trim()) { setError('Each social account needs a handle or profile URL.'); return; }
        if (!p.followerCount || p.followerCount <= 0) { setError('Please enter an approximate follower count for each social account.'); return; }
        if (p.platform === 'Other' && !p.platformOther?.trim()) { setError('Please specify the platform for "Other" social accounts.'); return; }
      }
    }

    // Business-specific validation
    if (partnerType === 'BUSINESS') {
      if (!legalBusinessName.trim()) { setError('Please enter your legal business name.'); return; }
      if (!businessWebsite.trim()) { setError('Please enter your business website.'); return; }
      if (!businessDescription.trim()) { setError('Please describe what your business primarily does.'); return; }
      if (!businessRegistrationNumber.trim()) { setError('Please enter your registration number.'); return; }
      if (!registrationLocation.trim()) { setError('Please enter your registration location.'); return; }
      if (!businessMailingAddress.trim()) { setError('Please enter your mailing address.'); return; }
      if (!bookOfBusinessDescription.trim()) { setError('Please tell us about the approximate size of your current book of business.'); return; }
      if (!estimatedVolumeDescription.trim()) { setError('Please tell us about the membership volume you could realistically generate.'); return; }
    }

    // Partnership expectations validation
    if (!partnershipExpectations.trim()) { setError('Please tell us how you expect to perform with Careverse.'); return; }

    // Customer acquisition validation
    if (acquisitionMethods.length === 0) { setError('Please select at least one way customers will reach Careverse.'); return; }
    if (acquisitionMethods.includes('Other') && !acquisitionOtherDetail.trim()) { setError('Please specify the "Other" acquisition method.'); return; }

    // Paid advertising validation
    if (!purchasesAdvertising) { setError('Please indicate whether you purchase advertising.'); return; }
    if (purchasesAdvertising === 'YES') {
      if (advertisingPlatforms.length === 0) { setError('Please select at least one advertising platform.'); return; }
      if (advertisingPlatforms.includes('Other') && !advertisingPlatformOtherDetail.trim()) { setError('Please specify the "Other" advertising platform.'); return; }
    }

    // Decision-making authority validation
    if (!hasDecisionAuthority) { setError('Please indicate your decision-making authority.'); return; }
    if (hasDecisionAuthority === 'NO') {
      if (!decisionMakerName.trim()) { setError('Please enter the decision-maker name.'); return; }
      if (!decisionMakerRole.trim()) { setError('Please enter the decision-maker role.'); return; }
      if (!decisionMakerEmail.trim()) { setError('Please enter the decision-maker email.'); return; }
    }

    // Final confirmations
    if (!confirmAccurate) { setError('Please confirm that the information in your application is accurate.'); return; }
    if (!confirmNoGuarantee) { setError('Please confirm that you understand submission does not guarantee acceptance.'); return; }
    if (!acceptTerms) { setError('You must agree to the Careverse Partner Terms to continue.'); return; }

    setLoading(true);
    const result = signup({
      fullName,
      email,
      phone,
      country,
      stateProvince,
      partnerType,
      creatorName: partnerType === 'CREATOR' ? creatorName : undefined,
      website: partnerType === 'CREATOR' ? website : undefined,
      creatorProfiles: partnerType === 'CREATOR' ? creatorProfiles.filter(p => p.handle.trim() || p.profileUrl.trim()) : undefined,
      legalBusinessName: partnerType === 'BUSINESS' ? legalBusinessName : undefined,
      brandName: partnerType === 'BUSINESS' ? brandName : undefined,
      businessWebsite: partnerType === 'BUSINESS' ? businessWebsite : undefined,
      businessDescription: partnerType === 'BUSINESS' ? businessDescription : undefined,
      businessCategory: partnerType === 'BUSINESS' ? businessCategory : undefined,
      businessEntityType: partnerType === 'BUSINESS' ? businessEntityType : undefined,
      businessRegistrationNumber: partnerType === 'BUSINESS' ? businessRegistrationNumber : undefined,
      registrationLocation: partnerType === 'BUSINESS' ? registrationLocation : undefined,
      businessMailingAddress: partnerType === 'BUSINESS' ? businessMailingAddress : undefined,
      businessOperatingDuration: partnerType === 'BUSINESS' ? businessOperatingDuration : undefined,
      businessProfiles: partnerType === 'BUSINESS' ? businessProfiles.filter(p => p.profileUrl.trim()) : undefined,
      bookOfBusinessDescription: partnerType === 'BUSINESS' ? bookOfBusinessDescription : undefined,
      estimatedVolumeDescription: partnerType === 'BUSINESS' ? estimatedVolumeDescription : undefined,
      partnershipExpectations,
      acquisitionMethods,
      acquisitionOtherDetail: acquisitionMethods.includes('Other') ? acquisitionOtherDetail : undefined,
      purchasesAdvertising: purchasesAdvertising as 'YES' | 'NO',
      advertisingPlatforms: purchasesAdvertising === 'YES' ? advertisingPlatforms : undefined,
      advertisingPlatformOtherDetail: purchasesAdvertising === 'YES' && advertisingPlatforms.includes('Other') ? advertisingPlatformOtherDetail : undefined,
      hasDecisionAuthority: hasDecisionAuthority as 'YES' | 'NO',
      decisionMakerName: hasDecisionAuthority === 'NO' ? decisionMakerName : undefined,
      decisionMakerRole: hasDecisionAuthority === 'NO' ? decisionMakerRole : undefined,
      decisionMakerEmail: hasDecisionAuthority === 'NO' ? decisionMakerEmail : undefined,
      confirmAccurate,
      confirmNoGuarantee,
      acceptTerms,
    });
    setLoading(false);

    if (result.success) {
      router.push('/signup/submitted');
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="cv-page min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
          <CareverseLogo size={40} className="justify-center mb-4" />
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Partner Program</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink tracking-tight">Partner Application</h1>
          <p className="text-cv-muted text-sm mt-2">Apply to join the Careverse partner program</p>
        </div>

        <form onSubmit={handleSubmit} className="cv-card p-6 sm:p-8 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Partner Type Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">Partner Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'CREATOR' as PartnerType, label: 'Creator', desc: 'Content creators & influencers', icon: UserIcon },
                { value: 'BUSINESS' as PartnerType, label: 'Business / Agency', desc: 'Agencies & businesses', icon: Building },
              ]).map((opt) => {
                const isSelected = partnerType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPartnerType(opt.value)}
                    className={cn(
                      'relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all',
                      isSelected
                        ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink'
                        : 'border-cv-line hover:border-cv-ink/30 hover:bg-cv-soft/50'
                    )}
                  >
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cv-ink">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                    <opt.icon className={cn('h-5 w-5', isSelected ? 'text-cv-ink' : 'text-cv-muted')} />
                    <span className={cn('text-xs font-bold', isSelected ? 'text-cv-ink' : 'text-cv-muted')}>{opt.label}</span>
                    <span className={cn('text-[10px] leading-tight', isSelected ? 'text-cv-body' : 'text-cv-muted')}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Basic Information</h3>
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-bold uppercase text-cv-muted">Full name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="cv-input pl-10" placeholder="Jane Smith" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase text-cv-muted">Email address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="cv-input pl-10" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold uppercase text-cv-muted">Phone number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="cv-input pl-10" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-xs font-bold uppercase text-cv-muted">Country *</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="cv-input pl-10 h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stateProvince" className="text-xs font-bold uppercase text-cv-muted">State / Province</Label>
                <Input id="stateProvince" value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} className="cv-input" placeholder="CA" />
              </div>
            </div>
          </div>

          {/* Creator-specific fields */}
          {partnerType === 'CREATOR' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Creator Details</h3>
              <div className="space-y-1.5">
                <Label htmlFor="creatorName" className="text-xs font-bold uppercase text-cv-muted">Creator / public name *</Label>
                <Input id="creatorName" value={creatorName} onChange={(e) => setCreatorName(e.target.value)} className="cv-input" placeholder="Jane Smith Wellness" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs font-bold uppercase text-cv-muted">Website</Label>
                <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="cv-input" placeholder="https://janesmith.com" />
              </div>

              {/* Social accounts — at least one required */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Social Accounts (at least one required)</Label>
                  <span className="text-[10px] text-cv-muted">Add one or more platforms</span>
                </div>
                {creatorProfiles.map((profile, idx) => (
                  <div key={profile.id} className="rounded-xl border border-cv-line p-4 space-y-3 bg-cv-soft/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cv-ink">Account {idx + 1}</span>
                      {creatorProfiles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCreatorProfiles(prev => prev.filter(p => p.id !== profile.id))}
                          className="text-cv-muted hover:text-cv-red transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-cv-muted">Platform</Label>
                        <select
                          value={profile.platform}
                          onChange={(e) => setCreatorProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, platform: e.target.value } : p))}
                          className="cv-input h-11 w-full rounded-xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                        >
                          {socialPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-cv-muted">Handle or profile URL</Label>
                        <Input
                          value={profile.handle}
                          onChange={(e) => setCreatorProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, handle: e.target.value } : p))}
                          className="cv-input"
                          placeholder="@janesmith or https://instagram.com/janesmith"
                        />
                      </div>
                    </div>
                    {profile.platform === 'Other' && (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-cv-muted">Please specify *</Label>
                        <Input
                          value={profile.platformOther ?? ''}
                          onChange={(e) => setCreatorProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, platformOther: e.target.value } : p))}
                          className="cv-input"
                          placeholder="Platform name"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-cv-muted">Approximate followers *</Label>
                      <Input
                        type="number"
                        value={profile.followerCount || ''}
                        onChange={(e) => setCreatorProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, followerCount: e.target.value ? parseInt(e.target.value) : 0 } : p))}
                        className="cv-input"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCreatorProfiles(prev => [...prev, { id: `cp-${Date.now()}`, platform: 'Instagram', handle: '', profileUrl: '', followerCount: 0 }])}
                  className="flex items-center gap-2 text-xs font-bold text-cv-ink hover:text-cv-red transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another social account
                </button>
              </div>
            </div>
          )}

          {/* Business-specific fields */}
          {partnerType === 'BUSINESS' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Business / Agency Information</h3>
              <div className="space-y-1.5">
                <Label htmlFor="legalBusinessName" className="text-xs font-bold uppercase text-cv-muted">Legal business name *</Label>
                <Input id="legalBusinessName" value={legalBusinessName} onChange={(e) => setLegalBusinessName(e.target.value)} className="cv-input" placeholder="Smith Wellness LLC" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brandName" className="text-xs font-bold uppercase text-cv-muted">Brand / company name (if different)</Label>
                <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="cv-input" placeholder="Smith Wellness" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessWebsite" className="text-xs font-bold uppercase text-cv-muted">Website *</Label>
                <Input id="businessWebsite" type="url" value={businessWebsite} onChange={(e) => setBusinessWebsite(e.target.value)} className="cv-input" placeholder="https://smithwellness.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessDescription" className="text-xs font-bold uppercase text-cv-muted">What does your business primarily do? *</Label>
                <textarea
                  id="businessDescription"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  rows={3}
                  className="cv-input w-full resize-none py-3 px-4"
                  placeholder="We help families navigate care options..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Business category *</Label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value as BusinessCategory)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    {businessCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Entity type *</Label>
                  <select
                    value={businessEntityType}
                    onChange={(e) => setBusinessEntityType(e.target.value as BusinessEntityType)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    {businessEntityTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="businessRegistrationNumber" className="text-xs font-bold uppercase text-cv-muted">Registration number *</Label>
                  <Input id="businessRegistrationNumber" value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} className="cv-input" placeholder="Where applicable" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="registrationLocation" className="text-xs font-bold uppercase text-cv-muted">Registration location *</Label>
                  <Input id="registrationLocation" value={registrationLocation} onChange={(e) => setRegistrationLocation(e.target.value)} className="cv-input" placeholder="State / Province / Country" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessMailingAddress" className="text-xs font-bold uppercase text-cv-muted">Mailing address *</Label>
                <textarea
                  id="businessMailingAddress"
                  value={businessMailingAddress}
                  onChange={(e) => setBusinessMailingAddress(e.target.value)}
                  rows={2}
                  className="cv-input w-full resize-none py-3 px-4"
                  placeholder="Street, City, State, ZIP, Country"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-cv-muted">How long has the business operated? *</Label>
                <select
                  value={businessOperatingDuration}
                  onChange={(e) => setBusinessOperatingDuration(e.target.value as BusinessOperatingDuration)}
                  className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                >
                  {operatingDurations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              {/* Public business/profile links — optional */}
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase text-cv-muted">Public business / profile links (optional)</Label>
                {businessProfiles.map((profile, idx) => (
                  <div key={profile.id} className="rounded-xl border border-cv-line p-4 space-y-3 bg-cv-soft/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cv-ink">Link {idx + 1}</span>
                      {businessProfiles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setBusinessProfiles(prev => prev.filter(p => p.id !== profile.id))}
                          className="text-cv-muted hover:text-cv-red transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-cv-muted">Profile URL</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                        <Input
                          type="url"
                          value={profile.profileUrl}
                          onChange={(e) => setBusinessProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, profileUrl: e.target.value } : p))}
                          className="cv-input pl-10"
                          placeholder="https://linkedin.com/company/smithwellness"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {businessProfiles.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setBusinessProfiles(prev => [...prev, { id: `bp-${Date.now()}`, platform: 'LinkedIn', profileUrl: '' }])}
                    className="flex items-center gap-2 text-xs font-bold text-cv-ink hover:text-cv-red transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add another link
                  </button>
                )}
              </div>

              {/* Book of business — long text */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-cv-muted">Tell us about the approximate size of your current book of business. *</Label>
                <textarea
                  value={bookOfBusinessDescription}
                  onChange={(e) => setBookOfBusinessDescription(e.target.value)}
                  rows={3}
                  className="cv-input w-full resize-none py-3 px-4"
                  placeholder="Describe the approximate size of your current book of business."
                />
              </div>

              {/* Estimated Careverse membership volume — long text */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-cv-muted">What level of monthly Careverse membership volume do you believe you could realistically generate? *</Label>
                <textarea
                  value={estimatedVolumeDescription}
                  onChange={(e) => setEstimatedVolumeDescription(e.target.value)}
                  rows={3}
                  className="cv-input w-full resize-none py-3 px-4"
                  placeholder="Describe the membership volume you believe you could realistically generate."
                />
              </div>
            </div>
          )}

          {/* Partnership Expectations — all applicants */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Partnership Expectations</h3>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-cv-muted">How do you expect to perform with Careverse? *</Label>
              <p className="text-[11px] text-cv-muted -mt-0.5">Tell us briefly how you expect to generate Careverse memberships and what level of volume you believe is realistic.</p>
              <textarea
                value={partnershipExpectations}
                onChange={(e) => setPartnershipExpectations(e.target.value)}
                rows={3}
                className="cv-input w-full resize-none py-3 px-4"
                placeholder="How you expect to perform with Careverse..."
              />
            </div>
          </div>

          {/* Customer Acquisition — all applicants */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Customer Acquisition</h3>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-cv-muted">How will customers reach Careverse through your partnership? * (select all that apply)</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {acquisitionMethodOptions.map(method => (
                  <label key={method} className="flex items-center gap-2.5 cursor-pointer rounded-lg border border-cv-line p-2.5 hover:bg-cv-soft/50 transition-colors">
                    <Checkbox
                      checked={acquisitionMethods.includes(method)}
                      onCheckedChange={() => toggleAcquisitionMethod(method)}
                    />
                    <span className="text-xs font-bold text-cv-body">{method}</span>
                  </label>
                ))}
              </div>
              {acquisitionMethods.includes('Other') && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-cv-muted">Please specify *</Label>
                  <Input
                    value={acquisitionOtherDetail}
                    onChange={(e) => setAcquisitionOtherDetail(e.target.value)}
                    className="cv-input"
                    placeholder="Describe the other method"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Paid Advertising — all applicants */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Paid Advertising</h3>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-cv-muted">Do you purchase advertising specifically to generate customers or conversions? *</Label>
              <div className="flex gap-3">
                {(['YES', 'NO'] as const).map(opt => (
                  <label key={opt} className={cn(
                    'flex items-center gap-2.5 cursor-pointer rounded-lg border px-4 py-2.5 transition-colors',
                    purchasesAdvertising === opt ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink' : 'border-cv-line hover:bg-cv-soft/50'
                  )}>
                    <Checkbox
                      checked={purchasesAdvertising === opt}
                      onCheckedChange={() => setPurchasesAdvertising(opt)}
                    />
                    <span className="text-xs font-bold text-cv-body">{opt === 'YES' ? 'Yes' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>
            {purchasesAdvertising === 'YES' && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-cv-muted">Where do you typically purchase advertising? (select all that apply) *</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {advertisingPlatformOptions.map(platform => (
                    <label key={platform} className="flex items-center gap-2.5 cursor-pointer rounded-lg border border-cv-line p-2.5 hover:bg-cv-soft/50 transition-colors">
                      <Checkbox
                        checked={advertisingPlatforms.includes(platform)}
                        onCheckedChange={() => toggleAdvertisingPlatform(platform)}
                      />
                      <span className="text-xs font-bold text-cv-body">{platform}</span>
                    </label>
                  ))}
                </div>
                {advertisingPlatforms.includes('Other') && (
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase text-cv-muted">Please specify *</Label>
                    <Input
                      value={advertisingPlatformOtherDetail}
                      onChange={(e) => setAdvertisingPlatformOtherDetail(e.target.value)}
                      className="cv-input"
                      placeholder="Describe the other platform"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Decision-Making Authority — all applicants */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Decision-Making Authority</h3>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-cv-muted">Are you authorized to make decisions about this partnership on behalf of yourself or your organization? *</Label>
              <div className="flex flex-col gap-2">
                <label className={cn(
                  'flex items-center gap-2.5 cursor-pointer rounded-lg border px-4 py-2.5 transition-colors',
                  hasDecisionAuthority === 'YES' ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink' : 'border-cv-line hover:bg-cv-soft/50'
                )}>
                  <Checkbox
                    checked={hasDecisionAuthority === 'YES'}
                    onCheckedChange={() => setHasDecisionAuthority('YES')}
                  />
                  <span className="text-xs font-bold text-cv-body">Yes — I can approve and enter into this partnership</span>
                </label>
                <label className={cn(
                  'flex items-center gap-2.5 cursor-pointer rounded-lg border px-4 py-2.5 transition-colors',
                  hasDecisionAuthority === 'NO' ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink' : 'border-cv-line hover:bg-cv-soft/50'
                )}>
                  <Checkbox
                    checked={hasDecisionAuthority === 'NO'}
                    onCheckedChange={() => setHasDecisionAuthority('NO')}
                  />
                  <span className="text-xs font-bold text-cv-body">No — someone else needs to approve it</span>
                </label>
              </div>
            </div>
            {hasDecisionAuthority === 'NO' && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-cv-muted">Decision-maker name *</Label>
                  <Input value={decisionMakerName} onChange={(e) => setDecisionMakerName(e.target.value)} className="cv-input" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-cv-muted">Decision-maker role *</Label>
                  <Input value={decisionMakerRole} onChange={(e) => setDecisionMakerRole(e.target.value)} className="cv-input" placeholder="CEO" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-cv-muted">Decision-maker email *</Label>
                  <Input type="email" value={decisionMakerEmail} onChange={(e) => setDecisionMakerEmail(e.target.value)} className="cv-input" placeholder="john@company.com" />
                </div>
              </div>
            )}
          </div>

          {/* Data Notice */}
          <div className="rounded-xl border border-cv-line bg-cv-soft/30 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Data Notice</p>
            <p className="text-xs text-cv-body leading-relaxed">
              We use the information you provide to review your application, create and manage your partner account, configure tracking, and determine the appropriate partner relationship and commission structure.
            </p>
          </div>

          {/* Final Confirmations */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={confirmAccurate} onCheckedChange={(v) => setConfirmAccurate(v === true)} className="mt-0.5" />
              <span className="text-xs text-cv-body leading-relaxed">
                I confirm that the information in this application is accurate.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={confirmNoGuarantee} onCheckedChange={(v) => setConfirmNoGuarantee(v === true)} className="mt-0.5" />
              <span className="text-xs text-cv-body leading-relaxed">
                I understand that submitting an application does not guarantee acceptance or a particular commission rate.
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} className="mt-0.5" />
              <span className="text-xs text-cv-body leading-relaxed">
                I agree to the <a href="https://careverse.ai/terms" target="_blank" rel="noopener noreferrer" className="font-bold text-cv-ink underline">Careverse Partner Terms</a>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Submit application
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-cv-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-cv-ink hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
