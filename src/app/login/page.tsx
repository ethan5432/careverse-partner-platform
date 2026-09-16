'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CareverseLogo } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Loader as Loader2, ArrowRight } from 'lucide-react';
import { useMockAuth } from '@/hooks/useMockAuth';
import type { PartnerType } from '@/data/mock/types';
import { cn } from '@/lib/utils';
import { User, Building, Network as NetworkIcon, Check } from 'lucide-react';

const roleOptions: { value: PartnerType; label: string; description: string; icon: typeof User }[] = [
  { value: 'CREATOR', label: 'Creator', description: 'Content creators & influencers', icon: User },
  { value: 'BUSINESS', label: 'Business / Agency', description: 'Agencies & businesses', icon: Building },
  { value: 'NETWORK', label: 'Network', description: 'Network partners managing sub-partners', icon: NetworkIcon },
];

export default function PartnerLoginPage() {
  const router = useRouter();
  const { login, switchPartnerType } = useMockAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedType, setSelectedType] = useState<PartnerType>('CREATOR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(email, password, 'PARTNER');
    if (result.success) {
      switchPartnerType(selectedType);
      router.push('/partner');
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
              <Label htmlFor="password" className="text-xs font-bold text-cv-ink uppercase tracking-wider">
                Password
              </Label>
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

            {/* Role selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-cv-ink uppercase tracking-wider">
                Partner Type
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((opt) => {
                  const isSelected = selectedType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSelectedType(opt.value)}
                      className={cn(
                        'relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all',
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
                      <opt.icon className={cn('h-4 w-4', isSelected ? 'text-cv-ink' : 'text-cv-muted')} />
                      <span className={cn('text-[10px] font-bold leading-tight', isSelected ? 'text-cv-ink' : 'text-cv-muted')}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-cv-muted">
                {roleOptions.find((o) => o.value === selectedType)?.description}
              </p>
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
            <Link href="#" className="text-sm text-cv-muted hover:text-cv-ink transition-colors">
              Forgot password?
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
