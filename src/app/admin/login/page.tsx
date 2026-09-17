'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Loader as Loader2, ArrowRight } from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useMockAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password, 'ADMIN');
    if (result.success) {
      router.push('/admin');
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
          <div className="flex justify-center mb-4">
            <CareverseMark size={40} />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Admin Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink tracking-tight">Careverse Admin</h1>
          <p className="text-cv-muted text-sm mt-2">Sign in to the admin dashboard</p>
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
              <Label htmlFor="admin-email" className="text-xs font-bold text-cv-ink uppercase tracking-wider">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@careverse.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cv-input pl-10"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-xs font-bold text-cv-ink uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cv-muted" />
                <Input
                  id="admin-password"
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

          <div className="mt-5 text-center">
            <Link href="/forgot-password" className="text-sm text-cv-muted hover:text-cv-ink transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-cv-muted">
            Partner user?{' '}
            <Link href="/login" className="font-bold text-cv-ink hover:underline">
              Partner sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
