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
} from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import type { PartnerType } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const countries = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Other',
];

const socialPlatforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter/X', 'Facebook', 'LinkedIn', 'Blog/Website', 'Other'];

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
  const [socialPlatform, setSocialPlatform] = useState('Instagram');
  const [socialHandle, setSocialHandle] = useState('');

  // Business fields
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

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
      displayName, website, socialPlatform, socialHandle,
      legalBusinessName, brandName, businessWebsite, businessDescription,
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="socialPlatform" className="text-xs font-bold uppercase text-cv-muted">Primary Social Platform</Label>
                  <select
                    id="socialPlatform"
                    value={socialPlatform}
                    onChange={(e) => setSocialPlatform(e.target.value)}
                    className="cv-input h-12 w-full rounded-2xl border border-cv-line bg-white text-sm font-bold text-cv-ink"
                  >
                    {socialPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="socialHandle" className="text-xs font-bold uppercase text-cv-muted">Social Handle / Profile URL</Label>
                  <Input id="socialHandle" value={socialHandle} onChange={(e) => setSocialHandle(e.target.value)} className="cv-input" placeholder="@janesmith" />
                </div>
              </div>
            </div>
          )}

          {/* Business-specific fields */}
          {partnerType === 'BUSINESS' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cv-ink uppercase tracking-wider pb-2 border-b border-cv-line">Business Details</h3>
              <div className="space-y-1.5">
                <Label htmlFor="legalBusinessName" className="text-xs font-bold uppercase text-cv-muted">Legal Business Name</Label>
                <Input id="legalBusinessName" value={legalBusinessName} onChange={(e) => setLegalBusinessName(e.target.value)} className="cv-input" placeholder="Smith Wellness LLC" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brandName" className="text-xs font-bold uppercase text-cv-muted">Brand / Business Name</Label>
                <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="cv-input" placeholder="Smith Wellness" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessWebsite" className="text-xs font-bold uppercase text-cv-muted">Website</Label>
                <Input id="businessWebsite" type="url" value={businessWebsite} onChange={(e) => setBusinessWebsite(e.target.value)} className="cv-input" placeholder="https://smithwellness.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="businessDescription" className="text-xs font-bold uppercase text-cv-muted">What does your business do?</Label>
                <textarea
                  id="businessDescription"
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  rows={3}
                  className="cv-input w-full resize-none py-3 px-4"
                  placeholder="We help families navigate care options..."
                />
              </div>
            </div>
          )}

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
