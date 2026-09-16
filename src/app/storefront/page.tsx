'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Check, Heart, Shield, Sparkles, ArrowRight, X, Wallet, Star, Clock, Users, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { mockProducts, currentPartnerStorefront } from '@/data/mock';
import { cn } from '@/lib/utils';

export default function StorefrontPage() {
  const router = useRouter();
  const [purchasedPlan, setPurchasedPlan] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const handlePurchase = (product: typeof mockProducts[0]) => {
    router.push(`/checkout?product=${product.id}`);
  };

  const fmtMoney = (n: number) => `$${n}/mo`;
  const partnerInitial = currentPartnerStorefront.name.charAt(0);

  return (
    <div className="cv-page min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 lg:px-8 h-[72px]">
          <div className="flex items-center gap-3">
            <CareverseMark size={32} />
            <div className="h-6 w-px bg-cv-line" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cv-ink text-white text-sm font-extrabold">
                {partnerInitial}
              </div>
              <div>
                <p className="text-sm font-extrabold text-cv-ink">{currentPartnerStorefront.name}</p>
                <p className="text-[10px] text-cv-muted">Careverse Partner</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#packages" className="hidden sm:block text-sm font-bold text-cv-body hover:text-cv-ink transition-colors">
              Packages
            </a>
            <a href="#benefits" className="hidden sm:block text-sm font-bold text-cv-body hover:text-cv-ink transition-colors">
              Benefits
            </a>
            <a href="#lidia" className="hidden sm:block text-sm font-bold text-cv-body hover:text-cv-ink transition-colors">
              Lidia
            </a>
            <button className="cv-btn-primary cv-btn-sm px-5">Request Care</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-cv-cream">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="cv-red-rule" />
                <span className="cv-eyebrow uppercase">Care Benefits</span>
              </div>
              <h1 className="cv-h1 mb-6">
                Quality <span className="cv-red">care</span> for your family, at a price you can afford.
              </h1>
              <p className="text-lg text-cv-body leading-relaxed max-w-xl mb-6" style={{ fontSize: 20, lineHeight: 1.62 }}>
                {currentPartnerStorefront.introCopy} Careverse gives your family access to included services, lower prices on other care, product specials, and free samples — all in one simple membership.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="cv-btn-primary px-8 flex items-center gap-2" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
                  See packages
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="cv-btn-secondary px-8">See how it works</button>
              </div>
              {/* Proof chips */}
              <div className="flex flex-wrap gap-3 mt-8">
                {['No waiting periods', 'Cancel anytime', 'Lidia included free'].map((chip) => (
                  <div key={chip} className="flex items-center gap-1.5 bg-white rounded-full border border-cv-line px-3 py-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: '#E8FBF4' }}>
                      <Check className="h-3 w-3 text-cv-good" />
                    </div>
                    <span className="text-xs font-extrabold text-cv-ink">{chip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner profile card */}
            <div className="cv-card p-6 max-w-xs w-full hidden lg:block">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cv-ink text-white text-3xl font-extrabold mb-4">
                  {partnerInitial}
                </div>
                <p className="text-lg font-extrabold text-cv-ink">{currentPartnerStorefront.name}</p>
                <p className="text-xs text-cv-muted mt-1">Verified Careverse Partner</p>
                <div className="flex items-center gap-1 mt-3">
                  <Star className="h-4 w-4 fill-cv-red text-cv-red" />
                  <Star className="h-4 w-4 fill-cv-red text-cv-red" />
                  <Star className="h-4 w-4 fill-cv-red text-cv-red" />
                  <Star className="h-4 w-4 fill-cv-red text-cv-red" />
                  <Star className="h-4 w-4 fill-cv-red text-cv-red" />
                  <span className="text-xs font-bold text-cv-ink ml-1">5.0</span>
                </div>
                <div className="w-full mt-5 pt-5 border-t border-cv-line space-y-2">
                  <div className="flex items-center gap-2 text-xs text-cv-body">
                    <Shield className="h-3.5 w-3.5 text-cv-good" />
                    <span>Careverse Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cv-body">
                    <Users className="h-3.5 w-3.5 text-cv-muted" />
                    <span>{currentPartnerStorefront.visitors.toLocaleString()} families helped</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cv-body">
                    <Clock className="h-3.5 w-3.5 text-cv-muted" />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="bg-cv-soft py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="cv-red-rule" />
              <span className="cv-eyebrow uppercase">Plans</span>
            </div>
            <h2 className="cv-h2">Choose your package</h2>
            <p className="text-cv-body mt-3 text-lg">Every plan includes Lidia, free for everyone.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className={cn(
                  'cv-card p-8 flex flex-col relative',
                  product.popular && 'ring-2 ring-cv-ink'
                )}
              >
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cv-ink text-white text-xs font-extrabold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="cv-h3 mb-2">{product.name}</h3>
                <p className="text-sm text-cv-muted mb-4">{product.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-cv-ink">{fmtMoney(product.price)}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-cv-body">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: '#E8FBF4' }}>
                        <Check className="h-3 w-3 text-cv-good" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Plan details toggle */}
                <button
                  onClick={() => setExpandedPlan(expandedPlan === product.id ? null : product.id)}
                  className="text-xs font-bold text-cv-ink flex items-center justify-center gap-1 mb-3 hover:text-cv-red transition-colors"
                >
                  {expandedPlan === product.id ? 'Hide details' : 'View plan details'}
                  {expandedPlan === product.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
                {expandedPlan === product.id && (
                  <div className="rounded-xl bg-cv-soft p-4 mb-4 space-y-2 text-xs text-cv-body">
                    <div className="flex justify-between"><span>Billing type</span><span className="font-bold text-cv-ink">{product.billingType.charAt(0) + product.billingType.slice(1).toLowerCase()}</span></div>
                    <div className="flex justify-between"><span>Waiting period</span><span className="font-bold text-cv-ink">None</span></div>
                    <div className="flex justify-between"><span>Cancel anytime</span><span className="font-bold text-cv-ink">Yes</span></div>
                    <div className="flex justify-between"><span>Lidia AI included</span><span className="font-bold text-cv-ink">Yes</span></div>
                    <div className="flex justify-between"><span>Health Advocacy</span><span className="font-bold text-cv-ink">{product.features.some(f => f.includes('Advocacy')) ? 'Yes' : 'Where applicable'}</span></div>
                  </div>
                )}

                {purchasedPlan === product.name ? (
                  <div className="cv-btn-secondary justify-center cursor-default" style={{ pointerEvents: 'none' }}>
                    <Check className="h-4 w-4 text-cv-good" />
                    Purchased!
                  </div>
                ) : (
                  <button
                    className={product.popular ? 'cv-btn-red w-full' : 'cv-btn-primary w-full'}
                    onClick={() => handlePurchase(product)}
                  >
                    Request Care
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-cv-cream py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="cv-red-rule" />
              <span className="cv-eyebrow uppercase">What&apos;s Included</span>
            </div>
            <h2 className="cv-h2">Everything your family needs</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Shield, title: 'Included Services', desc: 'Access to essential care services at no extra cost with your membership.' },
              { icon: Sparkles, title: 'Lower Prices on Other Care', desc: 'Members get exclusive reduced rates on care services beyond what\'s included.' },
              { icon: Heart, title: 'Product Specials', desc: 'Special member-only pricing on health and wellness products.' },
              { icon: Check, title: 'Free Samples & Coupons', desc: 'Receive free product samples and valuable coupons as a Careverse member.' },
              { icon: Wallet, title: 'Care Allowance', desc: 'A monthly care allowance you can use toward the services your family needs most.' },
              { icon: Shield, title: 'Health Advocacy', desc: 'Where applicable, get a dedicated health advocate to help navigate your care options.' },
            ].map((benefit) => (
              <div key={benefit.title} className="cv-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cv-soft mb-4">
                  <benefit.icon className="h-5 w-5 text-cv-ink" />
                </div>
                <h3 className="text-lg font-bold text-cv-ink mb-1.5">{benefit.title}</h3>
                <p className="text-sm text-cv-muted leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lidia */}
      <section id="lidia" className="bg-cv-soft py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">Free for everyone</span>
          </div>
          <h2 className="cv-h2 mb-4">Meet Lidia</h2>
          <p className="text-lg text-cv-body leading-relaxed mb-8" style={{ fontSize: 20, lineHeight: 1.62 }}>
            Lidia is free for everyone. Building the world&apos;s largest AI-powered care network. Ask questions, get guidance, and find the care your family needs — no membership required.
          </p>
          <div className="cv-card p-8 max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cv-ink mx-auto mb-4">
              <Heart className="h-7 w-7 text-cv-red" />
            </div>
            <h3 className="text-xl font-bold text-cv-ink mb-2">Lidia AI Care Assistant</h3>
            <p className="text-sm text-cv-muted mb-6">Available 24/7 to help you understand your care options and make informed decisions.</p>
            <button className="cv-btn-primary w-full">Try Lidia free</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cv-night py-12">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CareverseMark size={28} />
                <span className="text-sm font-extrabold text-white">Careverse</span>
              </div>
              <p className="text-sm cv-night-text leading-relaxed">Lidia is free for everyone. Building the world&apos;s largest AI-powered care network.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Plans</p>
              <ul className="space-y-2">
                <li><a href="#packages" className="text-sm cv-night-text hover:text-white transition-colors">Family</a></li>
                <li><a href="#packages" className="text-sm cv-night-text hover:text-white transition-colors">Family Plus</a></li>
                <li><a href="#packages" className="text-sm cv-night-text hover:text-white transition-colors">Care Circle</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Learn</p>
              <ul className="space-y-2">
                <li><a href="#benefits" className="text-sm cv-night-text hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#lidia" className="text-sm cv-night-text hover:text-white transition-colors">Meet Lidia</a></li>
                <li><a href="#" className="text-sm cv-night-text hover:text-white transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Contact</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm cv-night-text"><Mail className="h-3.5 w-3.5" /> hello@careverse.ai</li>
                <li className="flex items-center gap-2 text-sm cv-night-text"><Phone className="h-3.5 w-3.5" /> 1-800-CAREVERSE</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs cv-night-text">© 2026 Careverse. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-xs cv-night-text hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-xs cv-night-text hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs cv-night-text hover:text-white transition-colors">Refund Policy</a>
              </div>
            </div>
            <p className="text-xs cv-night-text mt-4 text-center sm:text-left">
              Careverse memberships are not insurance. Memberships provide access to included services, discounts, and benefits. See full terms for details.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
