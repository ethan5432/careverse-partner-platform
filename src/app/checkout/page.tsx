'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft, CreditCard, Wallet, Building, Shield, Loader2, AlertCircle, Lock } from 'lucide-react';
import { mockProducts, currentPartnerStorefront, currentPartner, mockOrders } from '@/data/mock';
import type { MockOrder } from '@/data/mock/types';
import { cn } from '@/lib/utils';

type CheckoutState = 'form' | 'processing' | 'success' | 'failed';
type PaymentMethod = 'CARD' | 'PAYPAL' | 'BANK_TRANSFER';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="cv-page min-h-screen flex items-center justify-center"><div className="text-sm text-cv-muted">Loading checkout...</div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product') || 'prod-family-plus';
  const product = mockProducts.find((p) => p.id === productId) || mockProducts[0];
  const storefront = currentPartnerStorefront;
  const partner = currentPartner;

  const [state, setState] = useState<CheckoutState>('form');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [completedOrder, setCompletedOrder] = useState<MockOrder | null>(null);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    paypalEmail: '',
    bankAccount: '',
  });

  const fmtMoney = (n: number) => `$${n}`;
  const partnerInitial = storefront.name.charAt(0);

  const isFormValid = () => {
    if (!form.customerName || !form.customerEmail || !form.billingAddress || !form.billingCity || !form.billingState || !form.billingZip) return false;
    if (paymentMethod === 'CARD' && (!form.cardNumber || !form.cardExpiry || !form.cardCvc)) return false;
    if (paymentMethod === 'PAYPAL' && !form.paypalEmail) return false;
    if (paymentMethod === 'BANK_TRANSFER' && !form.bankAccount) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setState('processing');
    setTimeout(() => {
      const reference = `CV-2026-0916-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const order: MockOrder = {
        id: `o-${Date.now()}`,
        reference,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        billingAddress: form.billingAddress,
        billingCity: form.billingCity,
        billingState: form.billingState,
        billingZip: form.billingZip,
        paymentMethod,
        status: 'COMPLETED',
        date: new Date().toISOString().split('T')[0],
        partnerId: partner.id,
        partnerName: partner.name,
        storefrontId: storefront.id,
        storefrontName: storefront.name,
        amount: product.price,
      };
      setCompletedOrder(order);
      setState('success');
    }, 2500);
  };

  const handleSimulateFailure = () => {
    setState('processing');
    setTimeout(() => setState('failed'), 2000);
  };

  // ─── Success state ───
  if (state === 'success' && completedOrder) {
    return (
      <div className="cv-page min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="cv-card p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mx-auto mb-5">
              <Check className="h-8 w-8 text-cv-good" />
            </div>
            <h1 className="text-2xl font-bold text-cv-ink mb-2">Payment Successful!</h1>
            <p className="text-sm text-cv-muted mb-6">Your {product.name} membership is now active.</p>
            <div className="rounded-xl bg-cv-soft p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-xs text-cv-muted">Reference</span><span className="text-sm font-bold text-cv-ink">{completedOrder.reference}</span></div>
              <div className="flex justify-between"><span className="text-xs text-cv-muted">Amount</span><span className="text-sm font-bold text-cv-ink">{fmtMoney(completedOrder.amount)}/mo</span></div>
              <div className="flex justify-between"><span className="text-xs text-cv-muted">Email</span><span className="text-sm font-bold text-cv-ink truncate ml-2">{completedOrder.customerEmail}</span></div>
            </div>
            <Button className="cv-btn-primary w-full rounded-full mb-2" onClick={() => router.push(`/checkout/confirmation?order=${completedOrder.id}&ref=${completedOrder.reference}`)}>
              View Confirmation
            </Button>
            <Button variant="outline" className="w-full rounded-full border-cv-line font-bold" onClick={() => router.push('/storefront')}>
              Back to Storefront
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Failed state ───
  if (state === 'failed') {
    return (
      <div className="cv-page min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="cv-card p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mx-auto mb-5">
              <AlertCircle className="h-8 w-8 text-cv-red" />
            </div>
            <h1 className="text-2xl font-bold text-cv-ink mb-2">Payment Failed</h1>
            <p className="text-sm text-cv-muted mb-6">Your payment could not be processed. Please check your payment details and try again.</p>
            <Button className="cv-btn-primary w-full rounded-full mb-2" onClick={() => setState('form')}>
              Try Again
            </Button>
            <Button variant="outline" className="w-full rounded-full border-cv-line font-bold" onClick={() => router.push('/storefront')}>
              Back to Storefront
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Processing state ───
  if (state === 'processing') {
    return (
      <div className="cv-page min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="cv-card p-8 text-center">
            <div className="relative mx-auto h-12 w-12 mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-cv-line" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cv-ink" />
            </div>
            <h1 className="text-xl font-bold text-cv-ink mb-2">Processing Payment...</h1>
            <p className="text-sm text-cv-muted">Securely processing your {product.name} membership. Please don&apos;t close this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Checkout form state ───
  const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
    { value: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
    { value: 'PAYPAL', label: 'PayPal', icon: Wallet },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building },
  ];

  return (
    <div className="cv-page min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 lg:px-8 h-[72px]">
          <div className="flex items-center gap-3">
            <CareverseMark size={28} />
            <div className="h-5 w-px bg-cv-line" />
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cv-ink text-white text-xs font-extrabold">
                {partnerInitial}
              </div>
              <span className="text-sm font-extrabold text-cv-ink">{storefront.name}</span>
            </div>
          </div>
          <button onClick={() => router.push('/storefront')} className="flex items-center gap-1.5 text-sm font-bold text-cv-body hover:text-cv-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Storefront
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Checkout</span>
          </div>
          <h1 className="text-3xl font-bold text-cv-ink">Complete your purchase</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer info */}
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-cv-ink">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">Full Name</Label>
                    <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="cv-input" placeholder="Jane Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">Email</Label>
                    <Input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className="cv-input" placeholder="jane@email.com" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing info */}
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-cv-ink">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-bold text-cv-ink">Street Address</Label>
                  <Input value={form.billingAddress} onChange={(e) => setForm({ ...form, billingAddress: e.target.value })} className="cv-input" placeholder="123 Main St" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">City</Label>
                    <Input value={form.billingCity} onChange={(e) => setForm({ ...form, billingCity: e.target.value })} className="cv-input" placeholder="Springfield" required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">State</Label>
                    <Input value={form.billingState} onChange={(e) => setForm({ ...form, billingState: e.target.value })} className="cv-input" placeholder="IL" maxLength={2} required />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-cv-ink">ZIP</Label>
                    <Input value={form.billingZip} onChange={(e) => setForm({ ...form, billingZip: e.target.value })} className="cv-input" placeholder="62701" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment method */}
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-cv-ink">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.value}
                      type="button"
                      onClick={() => setPaymentMethod(pm.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all',
                        paymentMethod === pm.value ? 'border-cv-ink bg-cv-soft ring-1 ring-cv-ink' : 'border-cv-line hover:bg-cv-soft/50'
                      )}
                    >
                      <pm.icon className={cn('h-5 w-5', paymentMethod === pm.value ? 'text-cv-ink' : 'text-cv-muted')} />
                      <span className={cn('text-[10px] font-bold leading-tight', paymentMethod === pm.value ? 'text-cv-ink' : 'text-cv-muted')}>
                        {pm.label}
                      </span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'CARD' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid gap-2">
                      <Label className="text-sm font-bold text-cv-ink">Card Number</Label>
                      <Input value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} className="cv-input" placeholder="4242 4242 4242 4242" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold text-cv-ink">Expiry</Label>
                        <Input value={form.cardExpiry} onChange={(e) => setForm({ ...form, cardExpiry: e.target.value })} className="cv-input" placeholder="MM/YY" required />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold text-cv-ink">CVC</Label>
                        <Input value={form.cardCvc} onChange={(e) => setForm({ ...form, cardCvc: e.target.value })} className="cv-input" placeholder="123" maxLength={4} required />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'PAYPAL' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid gap-2">
                      <Label className="text-sm font-bold text-cv-ink">PayPal Email</Label>
                      <Input type="email" value={form.paypalEmail} onChange={(e) => setForm({ ...form, paypalEmail: e.target.value })} className="cv-input" placeholder="jane@paypal.com" required />
                    </div>
                    <p className="text-xs text-cv-muted">You&apos;ll be redirected to PayPal to complete your purchase.</p>
                  </div>
                )}

                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="space-y-4 pt-2">
                    <div className="grid gap-2">
                      <Label className="text-sm font-bold text-cv-ink">Bank Account Number</Label>
                      <Input value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} className="cv-input" placeholder="000123456789" required />
                    </div>
                    <p className="text-xs text-cv-muted">Bank transfers take 2-3 business days to process.</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-cv-muted pt-2">
                  <Lock className="h-3.5 w-3.5" />
                  Payments are secure and encrypted. This is a mock checkout — no real payment will be processed.
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="cv-btn-primary flex-1 rounded-full" disabled={!isFormValid()}>
                <Check className="h-4 w-4 mr-1.5" />
                Complete Purchase — {fmtMoney(product.price)}/mo
              </Button>
              <Button type="button" variant="outline" className="rounded-full border-cv-line font-bold" onClick={handleSimulateFailure}>
                Simulate Failed Payment
              </Button>
            </div>
          </form>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="cv-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-cv-ink">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product */}
                <div className="flex items-start gap-3 pb-4 border-b border-cv-line">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft shrink-0">
                    <Shield className="h-5 w-5 text-cv-ink" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-cv-ink">{product.name}</p>
                    <p className="text-xs text-cv-muted mt-0.5">{product.billingType.charAt(0) + product.billingType.slice(1).toLowerCase()} billing</p>
                  </div>
                  <p className="text-sm font-bold text-cv-ink">{fmtMoney(product.price)}</p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted">What&apos;s included</p>
                  {product.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-50 shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-cv-good" />
                      </div>
                      <span className="text-xs text-cv-body">{f}</span>
                    </div>
                  ))}
                  {product.features.length > 4 && <p className="text-xs text-cv-muted">+ {product.features.length - 4} more benefits</p>}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-cv-line">
                  <div className="flex justify-between text-sm">
                    <span className="text-cv-body">Subtotal</span>
                    <span className="font-bold text-cv-ink">{fmtMoney(product.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cv-body">Setup fee</span>
                    <span className="font-bold text-cv-good">$0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-cv-body">Tax</span>
                    <span className="font-bold text-cv-good">$0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-cv-line">
                    <span className="text-sm font-bold text-cv-ink">Total today</span>
                    <span className="text-lg font-bold text-cv-ink">{fmtMoney(product.price)}<span className="text-xs text-cv-muted">/mo</span></span>
                  </div>
                </div>

                {/* Attribution */}
                <div className="pt-4 border-t border-cv-line">
                  <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-2">Referred by</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-ink text-white text-xs font-extrabold">
                      {partnerInitial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cv-ink">{storefront.name}</p>
                      <p className="text-[10px] text-cv-muted">Careverse Partner</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
