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
  Mail, Lock, User, Phone, Globe, ArrowRight, ArrowLeft,
  Loader as Loader2, Check, User as UserIcon, Building,
  Plus, Trash2, Link as LinkIcon,
} from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import type { PartnerType, CreatorProfile, BusinessProfile, BusinessEntityType, BusinessCategory, BusinessOperatingDuration } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Other',
];

const socialPlatforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter/X', 'Facebook', 'LinkedIn', 'Blog/Website', 'Other'];

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

const bookOfBusinessOptions = ['Less than 50', '50–100', '100–500', '500–1,000', '1,000–5,000', '5,000+'];
const monthlyVolumeOptions = ['Less than 10', '10–50', '50–100', '100–500', '500+'];
const performanceOptions = ['Just getting started', 'Growing steadily', 'Established and scaling', 'High volume'];
const reachOptions = ['Email marketing', 'Social media', 'Website / blog', 'In-person events', 'Paid advertising', 'Referral / word of mouth', 'Other'];
const paidAdOptions = ['Yes, actively', 'Yes, occasionally', 'No, but planning to', 'No'];
const authorityOptions = ['I am the decision maker', 'I recommend and co-decide', 'I need approval from others'];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useMockAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [partnerType, setPartnerType] = useState<PartnerType>('CREATOR');

  // Common fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [stateProvince, setStateProvince] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  // Creator fields
  const [displayName, setDisplayName] = useState('');
  const [website, setWebsite] = useState('');
  const [creatorProfiles, setCreatorProfiles] = useState<CreatorProfile[]>([
    { id: `cp-${Date.now()}`, platform: 'Instagram', handle: '', profileUrl: '' },
  ]);

  // Business fields — basic
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [businessEntityType, setBusinessEntityType] = useState<BusinessEntityType>('LLC');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [registrationStateProvinceCountry, setRegistrationStateProvinceCountry] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessMailingAddress, setBusinessMailingAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>('BENEFITS_HR');
  const [businessOperatingDuration, setBusinessOperatingDuration] = useState<BusinessOperatingDuration>('LESS_THAN_1_YEAR');
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([
    { id: `bp-${Date.now()}`, platform: 'LinkedIn', profileUrl: '' },
  ]);
  // Business fields — existing questions
  const [bookOfBusinessSize, setBookOfBusinessSize] = useState('');
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState('');
  const [expectedPerformance, setExpectedPerformance] = useState('');
  const [howCustomersReachCareverse, setHowCustomersReachCareverse] = useState('');
  const [paidAdvertising, setPaidAdvertising] = useState('');
  const [decisionMakingAuthority, setDecisionMakingAuthority] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !phone) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      setError('You must accept the Terms and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    const result = signup({
      firstName, lastName, email, phone, country, stateProvince,
      partnerType, password, acceptTerms, acceptPrivacy,
      displayName, website,
      creatorProfiles: partnerType === 'CREATOR' ? creatorProfiles.filter(p => p.handle.trim() || p.profileUrl.trim()) : undefined,
      legalBusinessName, brandName, businessEntityType, businessRegistrationNumber,
      registrationStateProvinceCountry, businessWebsite, businessMailingAddress,
      businessDescription, businessCategory, businessOperatingDuration,
      bookOfBusinessSize, estimatedMonthlyVolume, expectedPerformance,
      howCustomersReachCareverse, paidAdvertising, decisionMakingAuthority,
      businessProfiles: partnerType === 'BUSINESS' ? businessProfiles.filter(p => p.profileUrl.trim()) : undefined,
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
            <span className="cv-eyebrow uppercase">Partner Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink tracking-tight">Create your partner account</h1>
          <p className="text-cv-muted text-sm mt-2">Join the Careverse partner program and start earning</p>
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

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-bold uppercase text-cv-muted">First name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="cv-input pl-10" placeholder="Jane" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-bold uppercase text-cv-muted">Last name *</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="cv-input" placeholder="Smith" required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase text-cv-muted">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="cv-input pl-10" placeholder="you@example.com" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold uppercase text-cv-muted">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="cv-input pl-10" placeholder="+1 (555) 000-0000" required />
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
                <Label htmlFor="displayName" className="text-xs font-bold uppercase text-cv-muted">Public / Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="cv-input" placeholder="Jane Smith Wellness" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs font-bold uppercase text-cv-muted">Website</Label>
                <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="cv-input" placeholder="https://janesmith.com" />
              </div>

              {/* Multiple creator profiles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Public Profiles</Label>
                  <span className="text-[10px] text-cv-muted">Add one or more platforms</span>
                </div>
                {creatorProfiles.map((profile, idx) => (
                  <div key={profile.id} className="rounded-xl border border-cv-line p-4 space-y-3 bg-cv-soft/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cv-ink">Profile {idx + 1}</span>
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
                        <Label className="text-[10px] font-bold uppercase text-cv-muted">Handle</Label>
                        <Input
                          value={profile.handle}
                          onChange={(e) => setCreatorProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, handle: e.target.value } : p))}
                          className="cv-input"
                          placeholder="@janesmith"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-cv-muted">Profile URL</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                        <Input
                          type="url"
                          value={profile.profileUrl}
                          onChange={(e) => setCreatorProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, profileUrl: e.target.value } : p))}
                          className="cv-input pl-10"
                          placeholder="https://instagram.com/janesmith"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-cv-muted">Follower Count (optional)</Label>
                      <Input
                        type="number"
                        value={profile.followerCount ?? ''}
                        onChange={(e) => setCreatorProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, followerCount: e.target.value ? parseInt(e.target.value) : undefined } : p))}
                        className="cv-input"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCreatorProfiles(prev => [...prev, { id: `cp-${Date.now()}`, platform: 'Instagram', handle: '', profileUrl: '' }])}
                  className="flex items-center gap-2 text-xs font-bold text-cv-ink hover:text-cv-red transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another profile
                </button>
              </div>
            </div>
          )}

          {/* Business-specific fields */}
          {partnerType === 'BUSINESS' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Business Information</h3>
              <div className="space-y-1.5">
                <Label htmlFor="legalBusinessName" className="text-xs font-bold uppercase text-cv-muted">Legal Business Name *</Label>
                <Input id="legalBusinessName" value={legalBusinessName} onChange={(e) => setLegalBusinessName(e.target.value)} className="cv-input" placeholder="Smith Wellness LLC" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brandName" className="text-xs font-bold uppercase text-cv-muted">Brand / Company Name (if different)</Label>
                <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="cv-input" placeholder="Smith Wellness" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Business Entity Type *</Label>
                  <select
                    value={businessEntityType}
                    onChange={(e) => setBusinessEntityType(e.target.value as BusinessEntityType)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    {businessEntityTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="businessRegistrationNumber" className="text-xs font-bold uppercase text-cv-muted">Business Registration Number</Label>
                  <Input id="businessRegistrationNumber" value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} className="cv-input" placeholder="Where applicable" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="registrationStateProvinceCountry" className="text-xs font-bold uppercase text-cv-muted">Registration State / Province / Country</Label>
                <Input id="registrationStateProvinceCountry" value={registrationStateProvinceCountry} onChange={(e) => setRegistrationStateProvinceCountry(e.target.value)} className="cv-input" placeholder="Where applicable" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessWebsite" className="text-xs font-bold uppercase text-cv-muted">Business Website *</Label>
                <Input id="businessWebsite" type="url" value={businessWebsite} onChange={(e) => setBusinessWebsite(e.target.value)} className="cv-input" placeholder="https://smithwellness.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessMailingAddress" className="text-xs font-bold uppercase text-cv-muted">Business Mailing Address *</Label>
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
                  <Label className="text-xs font-bold uppercase text-cv-muted">Business Category *</Label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value as BusinessCategory)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    {businessCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">How long has the business been operating? *</Label>
                  <select
                    value={businessOperatingDuration}
                    onChange={(e) => setBusinessOperatingDuration(e.target.value as BusinessOperatingDuration)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    {operatingDurations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Public business profiles (up to 3) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Public Business Profiles (optional, up to 3)</Label>
                </div>
                {businessProfiles.map((profile, idx) => (
                  <div key={profile.id} className="rounded-xl border border-cv-line p-4 space-y-3 bg-cv-soft/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cv-ink">Profile {idx + 1}</span>
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
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-cv-muted">Platform</Label>
                        <select
                          value={profile.platform}
                          onChange={(e) => setBusinessProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, platform: e.target.value } : p))}
                          className="cv-input h-11 w-full rounded-xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                        >
                          {socialPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-cv-muted">Profile URL</Label>
                        <Input
                          type="url"
                          value={profile.profileUrl}
                          onChange={(e) => setBusinessProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, profileUrl: e.target.value } : p))}
                          className="cv-input"
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
                    Add another profile
                  </button>
                )}
              </div>

              {/* Existing business questions */}
              <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pt-2 pb-2 border-b border-cv-line">Business & Partnership Questions</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Approximate size of your book of business</Label>
                  <select
                    value={bookOfBusinessSize}
                    onChange={(e) => setBookOfBusinessSize(e.target.value)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    <option value="">Select...</option>
                    {bookOfBusinessOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Estimated monthly Careverse membership volume</Label>
                  <select
                    value={estimatedMonthlyVolume}
                    onChange={(e) => setEstimatedMonthlyVolume(e.target.value)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    <option value="">Select...</option>
                    {monthlyVolumeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-cv-muted">Expected performance</Label>
                <select
                  value={expectedPerformance}
                  onChange={(e) => setExpectedPerformance(e.target.value)}
                  className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                >
                  <option value="">Select...</option>
                  {performanceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-cv-muted">How will customers reach Careverse through you?</Label>
                <select
                  value={howCustomersReachCareverse}
                  onChange={(e) => setHowCustomersReachCareverse(e.target.value)}
                  className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                >
                  <option value="">Select...</option>
                  {reachOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Paid advertising</Label>
                  <select
                    value={paidAdvertising}
                    onChange={(e) => setPaidAdvertising(e.target.value)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    <option value="">Select...</option>
                    {paidAdOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-cv-muted">Decision-making authority</Label>
                  <select
                    value={decisionMakingAuthority}
                    onChange={(e) => setDecisionMakingAuthority(e.target.value)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    <option value="">Select...</option>
                    {authorityOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data Purpose */}
          <div className="rounded-xl border border-cv-line bg-cv-soft/30 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">Why we ask for this information</p>
            <p className="text-xs text-cv-body leading-relaxed">
              We use the information you provide to review your partnership application, verify your business or organization, assess your fit for the Careverse partner program, create and manage your partner account, and administer your partnership. See our{' '}
              <a href="https://careverse.ai/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-cv-ink underline">Privacy Policy</a>
              {' '}for more details.
            </p>
          </div>

          {/* Password */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Security</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold uppercase text-cv-muted">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="cv-input pl-10" placeholder="At least 8 characters" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase text-cv-muted">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="cv-input pl-10" placeholder="Re-enter password" required />
                </div>
              </div>
            </div>
          </div>

          {/* Agreements */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} className="mt-0.5" />
              <span className="text-xs text-cv-body leading-relaxed">
                I accept the <a href="https://careverse.ai/terms" target="_blank" rel="noopener noreferrer" className="font-bold text-cv-ink underline">Terms of Service</a>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={acceptPrivacy} onCheckedChange={(v) => setAcceptPrivacy(v === true)} className="mt-0.5" />
              <span className="text-xs text-cv-body leading-relaxed">
                I accept the <a href="https://careverse.ai/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-cv-ink underline">Privacy Policy</a>
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
