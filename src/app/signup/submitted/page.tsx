'use client';

import React from 'react';
import Link from 'next/link';
import { CareverseLogo } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function SignupSubmittedPage() {
  return (
    <div className="cv-page min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <CareverseLogo size={40} className="justify-center mb-6" />

        <div className="cv-card p-8 space-y-6">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="cv-red-rule" />
              <span className="cv-eyebrow uppercase">Application Submitted</span>
            </div>
            <h1 className="text-2xl font-bold text-cv-ink tracking-tight">Your application is in</h1>
          </div>

          <p className="text-sm text-cv-body leading-relaxed">
            Thank you for applying to the Careverse Partner Program. Our team will review your
            application and get back to you within 1-2 business days. You&apos;ll receive an email
            once your application is approved.
          </p>

          <div className="rounded-xl bg-cv-soft p-4 text-left space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-cv-good shrink-0" />
              <span className="text-xs font-bold text-cv-ink">Application received</span>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <Clock className="h-4 w-4 text-cv-muted shrink-0" />
              <span className="text-xs font-bold text-cv-muted">Pending review</span>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <Clock className="h-4 w-4 text-cv-muted shrink-0" />
              <span className="text-xs font-bold text-cv-muted">Account activation</span>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <Clock className="h-4 w-4 text-cv-muted shrink-0" />
              <span className="text-xs font-bold text-cv-muted">Dashboard access</span>
            </div>
          </div>

          <p className="text-xs text-cv-muted">
            For this demo, you can simulate approval by going to the activation page.
          </p>

          <Link href="/activate">
            <Button className="cv-btn-primary w-full rounded-full">
              Continue to activation
            </Button>
          </Link>

          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-bold text-cv-muted hover:text-cv-ink transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
