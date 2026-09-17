'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CareverseLogo } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail, Lock, Check, ArrowRight, ArrowLeft, Loader as Loader2,
  CheckCircle2, User, Phone, Globe, Building, Clock,
} from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';

type Step = 'pending' | 'email' | 'password' | 'profile' | 'complete';

export default function ActivatePage() {
  const router = useRouter();
  const { application, approveApplication, activateAccount, setEmailVerified, emailVerified } = useMockAuth();
  const [step, setStep] = useState<Step>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile review / completion
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (application) {
      if (application.applicationState === 'SUBMITTED') {
        setStep('pending');
      } else if (application.applicationState === 'APPROVED' && !application.activatedAt) {
        setStep(emailVerified ? 'password' : 'email');
      } else if (application.activatedAt) {
        setStep('complete');
      } else {
        setStep('pending');
      }
      // Pre-fill from application
      if (application.partnerType === 'CREATOR') {
        setDisplayName(application.displayName || `${application.firstName} ${application.lastName}`);
        setWebsite(application.website || '');
      } else {
        setDisplayName(application.brandName || application.legalBusinessName || `${application.firstName} ${application.lastName}`);
        setWebsite(application.businessWebsite || '');
      }
      setPhone(application.phone || '');
    }
  }, [application, emailVerified]);

  const handleSimulateApproval = () => {
    if (application) {
      approveApplication(application.id);
      setStep('email');
    }
  };

  const handleConfirmEmail = () => {
    setEmailVerified(true);
    setStep('password');
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setStep('profile');
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }
    setLoading(true);
    const result = activateAccount(password);
    setLoading(false);
    if (result.success) {
      setStep('complete');
      setTimeout(() => router.push('/partner'), 3000);
    } else {
      setError(result.error || 'Activation failed.');
    }
  };

  if (!application) {
    return (
      <div className="cv-page min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <CareverseLogo size={40} className="justify-center mb-6" />
          <div className="cv-card p-8 space-y-4">
            <h1 className="text-xl font-bold text-cv-ink">No application found</h1>
            <p className="text-sm text-cv-muted">You need to submit a partner application first.</p>
            <Link href="/signup">
              <Button className="cv-btn-primary w-full rounded-full">Create an account</Button>
            </Link>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-page min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
          <CareverseLogo size={40} className="justify-center mb-4" />
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Account Activation</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink tracking-tight">Activate your account</h1>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(['pending', 'email', 'password', 'profile', 'complete'] as Step[]).map((s, i) => {
            const currentIdx = (['pending', 'email', 'password', 'profile', 'complete'] as Step[]).indexOf(step);
            const isDone = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <React.Fragment key={s}>
                {i > 0 && <div className={cn('h-0.5 w-8', isDone ? 'bg-cv-good' : 'bg-cv-line')} />}
                <div className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all',
                  isDone ? 'bg-cv-good text-white' : isActive ? 'bg-cv-ink text-white' : 'bg-cv-soft text-cv-muted'
                )}>
                  {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="cv-card p-6 sm:p-8">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step: Pending */}
          {step === 'pending' && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cv-ink">Application Pending Review</h2>
                <p className="text-sm text-cv-muted mt-2">
                  Hi {application.firstName}, your application is being reviewed by our team.
                  You&apos;ll receive an email at <span className="font-bold text-cv-ink">{application.email}</span> once approved.
                </p>
              </div>
              <div className="rounded-xl bg-cv-soft p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-cv-good" />
                  <span className="text-cv-body">Application submitted</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-cv-body">Awaiting admin review (1-2 business days)</span>
                </div>
              </div>
              <p className="text-xs text-cv-muted">For this demo, you can simulate the approval process.</p>
              <Button onClick={handleSimulateApproval} className="cv-btn-primary w-full rounded-full">
                Simulate approval
              </Button>
            </div>
          )}

          {/* Step: Email confirmation */}
          {step === 'email' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cv-soft">
                    <Mail className="h-7 w-7 text-cv-ink" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-cv-ink">Confirm your email</h2>
                <p className="text-sm text-cv-muted">
                  We sent a verification link to <span className="font-bold text-cv-ink">{application.email}</span>.
                  Click the link to confirm your email address.
                </p>
              </div>
              <div className="rounded-xl bg-cv-soft p-4 text-center">
                <p className="text-xs text-cv-muted mb-2">For this demo, simulate email verification:</p>
                <Button onClick={handleConfirmEmail} variant="outline" className="rounded-full border-cv-ink font-bold text-cv-ink hover:bg-cv-soft">
                  <Check className="h-4 w-4 mr-1.5" />
                  Verify email
                </Button>
              </div>
            </div>
          )}

          {/* Step: Password */}
          {step === 'password' && (
            <form onSubmit={handleSetPassword} className="space-y-5">
              <div className="text-center space-y-2 mb-2">
                <div className="flex justify-center mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cv-soft">
                    <Lock className="h-7 w-7 text-cv-ink" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-cv-ink">Create your password</h2>
                <p className="text-sm text-cv-muted">Choose a password to secure your partner account.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-password" className="text-xs font-bold uppercase text-cv-muted">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="act-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="cv-input pl-10" placeholder="At least 8 characters" required autoFocus />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-confirm" className="text-xs font-bold uppercase text-cv-muted">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="act-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="cv-input pl-10" placeholder="Re-enter password" required />
                </div>
              </div>
              <button type="submit" className="cv-btn-primary w-full flex items-center justify-center gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Step: Profile review */}
          {step === 'profile' && (
            <form onSubmit={handleCompleteProfile} className="space-y-5">
              <div className="text-center space-y-2 mb-2">
                <div className="flex justify-center mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cv-soft">
                    <User className="h-7 w-7 text-cv-ink" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-cv-ink">Review your profile</h2>
                <p className="text-sm text-cv-muted">Confirm your details and complete any missing information.</p>
              </div>

              {/* Read-only application summary */}
              <div className="rounded-xl bg-cv-soft p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-bold uppercase text-cv-muted">Name:</span> <span className="text-cv-ink">{application.firstName} {application.lastName}</span></div>
                  <div><span className="font-bold uppercase text-cv-muted">Email:</span> <span className="text-cv-ink">{application.email}</span></div>
                  <div><span className="font-bold uppercase text-cv-muted">Type:</span> <span className="text-cv-ink">{application.partnerType === 'CREATOR' ? 'Creator' : 'Business / Agency'}</span></div>
                  <div><span className="font-bold uppercase text-cv-muted">Country:</span> <span className="text-cv-ink">{application.country}</span></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="act-display-name" className="text-xs font-bold uppercase text-cv-muted">
                  {application.partnerType === 'CREATOR' ? 'Display Name *' : 'Brand Name *'}
                </Label>
                <Input id="act-display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="cv-input" placeholder="Your public name" required autoFocus />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-phone" className="text-xs font-bold uppercase text-cv-muted">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="act-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="cv-input pl-10" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-website" className="text-xs font-bold uppercase text-cv-muted">Website</Label>
                <Input id="act-website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="cv-input" placeholder="https://yourwebsite.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-bio" className="text-xs font-bold uppercase text-cv-muted">Bio</Label>
                <textarea
                  id="act-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="cv-input w-full resize-none py-3 px-4"
                  placeholder="Tell customers about yourself or your business."
                />
              </div>

              <button type="submit" disabled={loading} className="cv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Activate account <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-8 w-8 text-cv-good" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cv-ink">Account activated!</h2>
                <p className="text-sm text-cv-muted mt-2">
                  Welcome to Careverse Partners. Your account is now active. Redirecting you to
                  your dashboard to get started...
                </p>
              </div>
              <Link href="/partner">
                <Button className="cv-btn-primary w-full rounded-full">
                  Go to dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
