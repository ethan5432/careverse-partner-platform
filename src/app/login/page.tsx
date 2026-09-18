'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CareverseLogo } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Loader as Loader2, ArrowRight, UserPlus } from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';

export default function PartnerLoginPage() {
  const router = useRouter();
  const { login, switchPartnerType, application } = useMockAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password, 'PARTNER');
    if (result.success) {
      if (application && (application.applicationState === 'SUBMITTED' || application.applicationState === 'IN_REVIEW')) {
        router.push('/activate');
      } else if (application && application.applicationState === 'APPROVED' && !application.activatedAt) {
        router.push('/activate');
      } else if (application && application.applicationState === 'REJECTED') {
        router.push('/activate');
      } else {
        router.push('/partner');
      }
    } else {
      setError(result.error || 'Sign in failed');
    }
    setLoading(false);
  };

  return (
    <div className="cv-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <CareverseLogo size={40} className="justify-center mb-4" />
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Partner Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink tracking-tight">Careverse Partners</h1>
          <p className="text-cv-muted text-sm mt-2">Sign in to your partner account</p>
        </div>

        {/* Login Card */}
        <div className="cv-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-cv-ink uppercase tracking-wider">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cv-input pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-cv-ink uppercase tracking-wider">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-cv-muted hover:text-cv-ink transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cv-input pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="cv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-cv-line">
            <p className="text-center text-sm text-cv-muted mb-3">
              New to Careverse?
            </p>
            <Link href="/signup">
              <Button
                variant="outline"
                className="w-full rounded-full border-cv-ink font-bold text-cv-ink hover:bg-cv-soft"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create a partner account
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-cv-muted">
            Admin user?{' '}
            <Link href="/admin/login" className="font-bold text-cv-ink hover:underline">
              Admin sign in
            </Link>
          </p>
          <p className="text-xs text-cv-muted">
            Lidia is free for everyone. Building the world&apos;s largest AI-powered care network.
          </p>
        </div>
      </div>
    </div>
  );
}
