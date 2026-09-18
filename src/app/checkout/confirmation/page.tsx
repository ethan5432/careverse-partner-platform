'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowLeft, Shield, Mail, Calendar, Package, User, CreditCard, Heart, Phone, MessageCircle, ArrowRight, Bot } from 'lucide-react';
import { mockProducts, currentPartnerStorefront, currentPartner, mockOrders, mockMemberships } from '@/data/mock';
import { getPackageById } from '@/lib/package-catalog';
import type { MockOrder, MockMembership } from '@/data/mock/types';

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

  // Try sessionStorage first (from a fresh checkout), then mock data
  let sessionOrder: MockOrder | null = null;
  let sessionMembership: MockMembership | null = null;
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('careverse_last_order');
    const storedMem = sessionStorage.getItem('careverse_last_membership');
    if (stored) { try { sessionOrder = JSON.parse(stored) as MockOrder; } catch { sessionOrder = null; } }
    if (storedMem) { try { sessionMembership = JSON.parse(storedMem) as MockMembership; } catch { sessionMembership = null; } }
  }

  const mockOrder = sessionOrder || mockOrders.find((o) => o.reference === ref);
  const membershipIdParam = searchParams.get('membership') || '';
  const mockMembership = sessionMembership || mockMemberships.find((m) => m.id === membershipIdParam) || mockMemberships.find((m) => m.orderReference === ref);
  const product = mockProducts.find((p) => p.id === mockOrder?.productId) || getPackageById(mockOrder?.productId || '') || mockProducts[1];
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
        {/* Success banner — Step 1: You're covered */}
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mx-auto mb-4">
            <Check className="h-8 w-8 text-cv-good" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">You're Covered</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink mb-2">Your <span className="font-bold text-cv-ink">{order.productName}</span> membership is active</h1>
          <p className="text-cv-body text-lg">Your benefits are available right now — no waiting period.</p>
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

            {/* Step 2: Meet Lidia + Step 3: Manage your benefits — primary next step */}
            <Card className="cv-card border-cv-ink">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cv-ink text-white text-xs font-extrabold">2</span>
                  <span className="cv-eyebrow uppercase">Meet Lidia</span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cv-ink shrink-0"><Bot className="h-6 w-6 text-cv-red" /></div>
                  <div>
                    <h2 className="text-base font-bold text-cv-ink">Lidia is your AI care assistant</h2>
                    <p className="text-xs text-cv-muted mt-1 leading-relaxed">Lidia is the place to understand your benefits, find and use care services, get help navigating care, and manage your Careverse membership — all in one spot, anytime.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-start gap-2 rounded-lg bg-cv-soft p-2.5">
                    <Shield className="h-3.5 w-3.5 text-cv-ink shrink-0 mt-0.5" />
                    <p className="text-xs text-cv-body leading-relaxed">Understand what your plan covers</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-cv-soft p-2.5">
                    <Heart className="h-3.5 w-3.5 text-cv-ink shrink-0 mt-0.5" />
                    <p className="text-xs text-cv-body leading-relaxed">Find and use your benefits</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-cv-soft p-2.5">
                    <MessageCircle className="h-3.5 w-3.5 text-cv-ink shrink-0 mt-0.5" />
                    <p className="text-xs text-cv-body leading-relaxed">Get help navigating care</p>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-cv-soft p-2.5">
                    <Calendar className="h-3.5 w-3.5 text-cv-ink shrink-0 mt-0.5" />
                    <p className="text-xs text-cv-body leading-relaxed">Manage your membership</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 pt-3 border-t border-cv-line">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cv-ink text-white text-xs font-extrabold">3</span>
                  <span className="cv-eyebrow uppercase">Manage Your Benefits</span>
                </div>
                <Button className="cv-btn-primary w-full rounded-full" onClick={() => router.push(`/lidia?membership=${mockMembership?.id || ''}`)}>
                  <Heart className="h-4 w-4 mr-1.5" />
                  Go to Lidia
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
                <p className="text-center text-[10px] text-cv-muted mt-2">No separate account needed — Lidia knows your membership.</p>
              </CardContent>
            </Card>

            {/* Additional info */}
            <Card className="cv-card">
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-cv-ink mb-4">Good to know</h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail, title: 'Check your email', desc: `We've sent a welcome email to ${order.customerEmail || 'your email'} with your membership details.` },
                    { icon: Shield, title: 'Your benefits are active now', desc: 'Included services, product specials, and care allowance are available immediately — no waiting period.' },
                    { icon: Calendar, title: 'Manage your membership', desc: 'You can update your payment method or cancel anytime through Lidia or Careverse support. No fees, no penalties.' },
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
              <Button variant="outline" className="flex-1 rounded-full border-cv-line font-bold" onClick={() => router.push('/storefront')}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
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

            {mockMembership && (
              <Card className="cv-card border-cv-ink">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50"><Shield className="h-5 w-5 text-cv-good" /></div>
                    <div>
                      <p className="text-sm font-bold text-cv-ink">Membership Active</p>
                      <p className="text-xs text-cv-muted">ID: {mockMembership.id}</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-cv-good"><Check className="h-2.5 w-2.5" /> ACTIVE</span>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-cv-line">
                    <div className="flex justify-between text-xs"><span className="text-cv-muted">Plan</span><span className="font-bold text-cv-ink">{mockMembership.productName}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-cv-muted">Started</span><span className="font-bold text-cv-ink">{new Date(mockMembership.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-cv-muted">Monthly price</span><span className="font-bold text-cv-ink">${mockMembership.productPrice}/mo</span></div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-cv-line">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-cv-muted mb-2">Your benefits</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mockMembership.benefits.map((b, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-cv-soft px-2 py-0.5 text-[10px] font-bold text-cv-body"><Check className="h-2.5 w-2.5 text-cv-good" />{b}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
