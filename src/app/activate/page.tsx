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
  Lock, Check, ArrowRight, ArrowLeft, Loader as Loader2,
  CheckCircle2, Clock,
} from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';

type Step = 'pending' | 'password' | 'complete';

export default function ActivatePage() {
  const router = useRouter();
  const { application, activateAccount } = useMockAuth();
  const [step, setStep] = useState<Step>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (application) {
      if (application.applicationState === 'SUBMITTED' || application.applicationState === 'IN_REVIEW') {
        setStep('pending');
      } else if (application.applicationState === 'APPROVED' && !application.activatedAt) {
        setStep('password');
      } else if (application.applicationState === 'REJECTED') {
        setStep('pending');
      } else if (application.activatedAt) {
        setStep('complete');
      } else {
        setStep('pending');
      }
    }
  }, [application]);

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
              <Button className="cv-btn-primary w-full rounded-full">Apply to become a partner</Button>
            </Link>
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isRejected = application.applicationState === 'REJECTED';

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
          {(['pending', 'password', 'complete'] as Step[]).map((s, i) => {
            const currentIdx = (['pending', 'password', 'complete'] as Step[]).indexOf(step);
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

          {/* Step: Pending — application submitted, awaiting admin review */}
          {step === 'pending' && !isRejected && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cv-ink">Application Submitted / In Review</h2>
                <p className="text-sm text-cv-muted mt-2">
                  Hi {application.fullName}, your application is being reviewed by our team.
                  You&apos;ll receive an email at <span className="font-bold text-cv-ink">{application.email}</span> once a decision has been made.
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
                <div className="flex items-center gap-2 text-sm opacity-40">
                  <Clock className="h-4 w-4 text-cv-muted" />
                  <span className="text-cv-body">Set password and activate account</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-40">
                  <Clock className="h-4 w-4 text-cv-muted" />
                  <span className="text-cv-body">Dashboard access</span>
                </div>
              </div>
              <p className="text-xs text-cv-muted">
                Once your application is accepted, you&apos;ll receive an email with a secure activation link to set your password.
              </p>
            </div>
          )}

          {/* Step: Rejected */}
          {step === 'pending' && isRejected && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <span className="text-xl font-bold text-cv-red">!</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cv-ink">Application Not Accepted</h2>
                <p className="text-sm text-cv-muted mt-2">
                  Hi {application.fullName}, thank you for your interest in the Careverse Partner Program.
                  Unfortunately, we are unable to accept your application at this time.
                </p>
              </div>
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </div>
          )}

          {/* Step: Password — application approved, set password */}
          {step === 'password' && (
            <form onSubmit={handleSetPassword} className="space-y-5">
              <div className="text-center space-y-2 mb-2">
                <div className="flex justify-center mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cv-soft">
                    <Lock className="h-7 w-7 text-cv-ink" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-cv-ink">Create your password</h2>
                <p className="text-sm text-cv-muted">
                  Your application has been accepted. Create a password to activate your partner account.
                </p>
              </div>

              {/* Application summary — read only */}
              <div className="rounded-xl bg-cv-soft p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-bold uppercase text-cv-muted">Name:</span> <span className="text-cv-ink">{application.fullName}</span></div>
                  <div><span className="font-bold uppercase text-cv-muted">Email:</span> <span className="text-cv-ink">{application.email}</span></div>
                  <div><span className="font-bold uppercase text-cv-muted">Type:</span> <span className="text-cv-ink">{application.partnerType === 'CREATOR' ? 'Creator' : 'Business / Agency'}</span></div>
                  <div><span className="font-bold uppercase text-cv-muted">Country:</span> <span className="text-cv-ink">{application.country}</span></div>
                </div>
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
