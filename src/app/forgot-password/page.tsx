'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CareverseLogo } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, ArrowLeft, ArrowRight, CheckCircle2, Loader as Loader2 } from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';

type Step = 'request' | 'sent' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset, resetPassword } = useMockAuth();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    const result = requestPasswordReset(email);
    setLoading(false);
    if (result.success) {
      setStep('sent');
    } else {
      setError(result.error || 'Something went wrong.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = resetPassword(email, newPassword);
    setLoading(false);
    if (result.success) {
      setStep('success');
      setTimeout(() => router.push('/login'), 3000);
    } else {
      setError(result.error || 'Something went wrong.');
    }
  };

  return (
    <div className="cv-page min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
          </Link>
          <CareverseLogo size={40} className="justify-center mb-4" />
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Partner Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-cv-ink tracking-tight">Reset your password</h1>
        </div>

        <div className="cv-card p-8">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step: Request email */}
          {step === 'request' && (
            <form onSubmit={handleRequest} className="space-y-5">
              <p className="text-sm text-cv-muted">Enter your email address and we&apos;ll send you a link to reset your password.</p>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase text-cv-muted">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="cv-input pl-10" placeholder="you@example.com" required autoFocus />
                </div>
              </div>
              <button type="submit" disabled={loading || !email} className="cv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send reset link <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}

          {/* Step: Email sent confirmation */}
          {step === 'sent' && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cv-soft">
                  <Mail className="h-7 w-7 text-cv-ink" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-cv-ink">Check your email</h2>
                <p className="text-sm text-cv-muted mt-2">
                  We sent a password reset link to <span className="font-bold text-cv-ink">{email}</span>.
                  Click the link to set a new password.
                </p>
              </div>
              <div className="rounded-xl bg-cv-soft p-4">
                <p className="text-xs text-cv-muted mb-2">For this demo, simulate clicking the reset link:</p>
                <Button onClick={() => setStep('reset')} variant="outline" className="rounded-full border-cv-ink font-bold text-cv-ink hover:bg-cv-soft w-full">
                  Open reset link
                </Button>
              </div>
              <button onClick={() => setStep('request')} className="text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors w-full">
                Use a different email
              </button>
            </div>
          )}

          {/* Step: Reset password */}
          {step === 'reset' && (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="text-center space-y-1">
                <div className="flex justify-center mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cv-soft">
                    <Lock className="h-7 w-7 text-cv-ink" />
                  </div>
                </div>
                <h2 className="text-lg font-bold text-cv-ink">Set a new password</h2>
                <p className="text-sm text-cv-muted">Choose a new password for your account.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs font-bold uppercase text-cv-muted">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="cv-input pl-10" placeholder="At least 8 characters" required autoFocus />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-new" className="text-xs font-bold uppercase text-cv-muted">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                  <Input id="confirm-new" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="cv-input pl-10" placeholder="Re-enter password" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="cv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reset password <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-7 w-7 text-cv-good" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-cv-ink">Password reset!</h2>
                <p className="text-sm text-cv-muted mt-2">
                  Your password has been updated. Redirecting you to sign in...
                </p>
              </div>
              <Link href="/login">
                <Button className="cv-btn-primary w-full rounded-full">
                  Sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
