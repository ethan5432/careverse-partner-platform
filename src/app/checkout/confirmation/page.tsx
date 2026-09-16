'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowLeft, Shield, Mail, Calendar, Package, User, CreditCard, Sparkles, Heart, Phone } from 'lucide-react';
import { mockProducts, currentPartnerStorefront, currentPartner, mockOrders } from '@/data/mock';
import type { MockOrder } from '@/data/mock/types';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="cv-page min-h-screen flex items-center justify-center"><div className="text-sm text-cv-muted">Loading confirmation...</div></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const orderId = searchParams.get('order') || '';

  // Try to find the order in mock data, or construct from query params
  const mockOrder = mockOrders.find((o) => o.reference === ref);
  const product = mockProducts.find((p) => p.id === mockOrder?.productId) || mockProducts[1];
  const storefront = currentPartnerStorefront;
  const partner = currentPartner;

  // Use mock order if found, otherwise build from what we know
  const order: MockOrder = mockOrder || {
    id: orderId || 'o-new',
    reference: ref || 'CV-2026-0916-XXXX',
    productId: product.id,
    productName: product.name,
    productPrice: product.price,
    customerName: 'Customer',
    customerEmail: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    paymentMethod: 'CARD',
    status: 'COMPLETED',
    date: new Date().toISOString().split('T')[0],
    partnerId: partner.id,
    partnerName: partner.name,
    storefrontId: storefront.id,
    storefrontName: storefront.name,
    amount: product.price,
  };

  const fmtMoney = (n: number) => `$${n}`;
  const partnerInitial = storefront.name.charAt(0);
  const paymentLabel = order.paymentMethod === 'CARD' ? 'Credit Card' : order.paymentMethod === 'PAYPAL' ? 'PayPal' : 'Bank Transfer';

  return (
    <div className="cv-page min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-5 lg:px-8 h-[72px]">
          <div className="flex items-center gap-3">
            <CareverseMark size={28} />
            <div className="h-5 w-px bg-cv-line" />
            <span className="text-sm font-extrabold text-cv-ink">Order Confirmation</span>
          </div>
          <button onClick={() => router.push('/storefront')} className="flex items-center gap-1.5 text-sm font-bold text-cv-body hover:text-cv-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Storefront
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
        {/* Success banner */}
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mx-auto mb-4">
            <Check className="h-8 w-8 text-cv-good" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Purchase Complete</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink mb-2">Welcome to the Careverse family!</h1>
          <p className="text-cv-body text-lg">Your <span className="font-bold text-cv-ink">{order.productName}</span> membership is now active.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Order details */}
          <div className="space-y-6">
            <Card className="cv-card">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-base font-bold text-cv-ink">Order Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-cv-line">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft">
                        <Package className="h-4 w-4 text-cv-ink" />
                      </div>
                      <span className="text-sm font-bold text-cv-ink">Package</span>
                    </div>
                    <span className="text-sm font-bold text-cv-ink">{order.productName}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-cv-line">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft">
                        <Shield className="h-4 w-4 text-cv-ink" />
                      </div>
                      <span className="text-sm font-bold text-cv-ink">Amount</span>
                    </div>
                    <span className="text-sm font-bold text-cv-ink">{fmtMoney(order.amount)}/mo</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-cv-line">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft">
                        <CreditCard className="h-4 w-4 text-cv-ink" />
                      </div>
                      <span className="text-sm font-bold text-cv-ink">Payment Method</span>
                    </div>
                    <span className="text-sm font-bold text-cv-ink">{paymentLabel}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-cv-line">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft">
                        <Calendar className="h-4 w-4 text-cv-ink" />
                      </div>
                      <span className="text-sm font-bold text-cv-ink">Date</span>
                    </div>
                    <span className="text-sm font-bold text-cv-ink">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-cv-line">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft">
                        <Mail className="h-4 w-4 text-cv-ink" />
                      </div>
                      <span className="text-sm font-bold text-cv-ink">Customer Email</span>
                    </div>
                    <span className="text-sm font-bold text-cv-ink truncate ml-2">{order.customerEmail || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cv-soft">
                        <User className="h-4 w-4 text-cv-ink" />
                      </div>
                      <span className="text-sm font-bold text-cv-ink">Customer Name</span>
                    </div>
                    <span className="text-sm font-bold text-cv-ink">{order.customerName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next steps */}
            <Card className="cv-card">
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-cv-ink mb-4">What happens next?</h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail, title: 'Check your email', desc: `We've sent a welcome email to ${order.customerEmail || 'your email'} with your membership details and login instructions.` },
                    { icon: Heart, title: 'Meet Lidia, your AI care assistant', desc: 'Lidia is free for everyone. Ask questions, get guidance, and find the care your family needs — available 24/7.' },
                    { icon: Shield, title: 'Start using your benefits', desc: 'Your included services, product specials, and care allowance are available immediately. No waiting period.' },
                    { icon: Calendar, title: 'Manage your membership', desc: 'Log in anytime to view your benefits, update your payment method, or cancel. Cancel anytime, no fees.' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-soft shrink-0">
                        <step.icon className="h-4 w-4 text-cv-ink" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-cv-ink">{step.title}</p>
                        <p className="text-xs text-cv-muted mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="cv-btn-primary flex-1 rounded-full" onClick={() => router.push('/storefront')}>
                <Sparkles className="h-4 w-4 mr-1.5" />
                Start Using Benefits
              </Button>
              <Button variant="outline" className="flex-1 rounded-full border-cv-line font-bold" onClick={() => router.push('/storefront')}>
                Back to Storefront
              </Button>
            </div>
          </div>

          {/* Reference + attribution sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="cv-card">
              <CardContent className="p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Confirmation Number</p>
                <p className="text-xl font-bold text-cv-ink break-all">{order.reference}</p>
                <p className="text-xs text-cv-muted mt-3">Save this number for your records. You can use it to reference this purchase in support conversations.</p>
              </CardContent>
            </Card>

            <Card className="cv-card">
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-3">Referred by</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-ink text-white text-lg font-extrabold">
                    {partnerInitial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-cv-ink">{storefront.name}</p>
                    <p className="text-xs text-cv-muted">Verified Careverse Partner</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-cv-line space-y-2">
                  <div className="flex items-center gap-2 text-xs text-cv-body">
                    <Shield className="h-3.5 w-3.5 text-cv-good" />
                    <span>Careverse Verified Partner</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cv-body">
                    <Calendar className="h-3.5 w-3.5 text-cv-muted" />
                    <span>Partner since {new Date(partner.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cv-card bg-cv-soft">
              <CardContent className="p-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-ink mx-auto mb-3">
                  <Heart className="h-5 w-5 text-cv-red" />
                </div>
                <p className="text-sm font-bold text-cv-ink">Need help?</p>
                <p className="text-xs text-cv-muted mt-1 mb-3">Our support team is available 24/7</p>
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-cv-ink">
                  <Mail className="h-3.5 w-3.5" />
                  support@careverse.ai
                </div>
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-cv-ink mt-1">
                  <Phone className="h-3.5 w-3.5" />
                  1-800-CAREVERSE
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
