'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Check, Heart, Shield, Sparkles, ArrowRight, X, Wallet, Star, Clock, Users, Phone, Mail, ChevronDown, ChevronUp, Play, Target, Package as PackageIcon } from 'lucide-react';
import { mockProducts, currentPartnerStorefront } from '@/data/mock';
import { loadStorefrontConfig, getVideoObjectURL, StorefrontConfig } from '@/lib/store-persistence';
import { cn } from '@/lib/utils';

export default function StorefrontPage() {
  const router = useRouter();
  const [purchasedPlan, setPurchasedPlan] = useState<string | null>(null);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [config, setConfig] = useState<StorefrontConfig | null>(null);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const loaded = loadStorefrontConfig();
    setConfig(loaded);

    const loadVideos = async () => {
      const urls: Record<string, string> = {};
      for (const block of loaded.creatorContent) {
        if (block.source === 'UPLOAD' && block.videoId) {
          const url = await getVideoObjectURL(block.videoId);
          if (url) urls[block.id] = url;
        }
      }
      setVideoUrls(urls);
    };
    loadVideos();
  }, []);

  const handlePurchase = (product: typeof mockProducts[0]) => {
    router.push(`/checkout?product=${product.id}`);
  };

  const fmtMoney = (n: number) => `$${n}/mo`;

  // Use config values if available, fall back to mock storefront
  const sf = config || currentPartnerStorefront;
  const partnerInitial = sf.name.charAt(0);
  const heroHeadline = config?.heroHeadline || 'Quality care for your family';
  const heroSupportingCopy = config?.heroSupportingCopy || sf.introCopy;
  const ctaText = config?.ctaText || 'Request Care';
  const aboutContent = config?.aboutContent || '';
  const brandPresentation = config?.brandPresentation || '';
  const selectedPackages = config?.selectedPackages || currentPartnerStorefront.packages;
  const sections = config?.sections || [];
  const contentBlocks = config?.creatorContent || [];
  const logo = config?.logo || '';
  const partnerPhoto = config?.partnerPhoto || '';

  // Products for the selected packages
  const selectedProducts = selectedPackages
    .map(name => mockProducts.find(p => p.name === name))
    .filter((p): p is typeof mockProducts[0] => Boolean(p));

  // Render sections in order
  const visibleSections = sections.filter(s => s.visible);

  const renderCreatorVideo = (sectionId: string) => {
    const section = visibleSections.find(s => s.id === sectionId);
    if (!section) return null;
    const sectionBlocks = contentBlocks.filter(b => b.sectionId === sectionId).sort((a, b) => a.order - b.order);
    if (sectionBlocks.length === 0) return null;
    const cols = section.columns || 1;
    const gridClass = cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1';

    return (
      <section key={sectionId} className="bg-cv-soft py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          {sectionBlocks[0].title && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="cv-red-rule" />
                <span className="cv-eyebrow uppercase">Video</span>
              </div>
              <h2 className="cv-h2">{sectionBlocks[0].title}</h2>
            </div>
          )}
          <div className={cn('grid gap-4', gridClass)}>
            {sectionBlocks.map((block) => (
              <div key={block.id}>
                {block.source === 'EMBED' && block.url ? (
                  <div className="rounded-2xl overflow-hidden border border-cv-line shadow-sm">
                    <iframe
                      src={block.url}
                      className="w-full aspect-video"
                      title={block.title || 'Video content'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : block.source === 'UPLOAD' && videoUrls[block.id] ? (
                  <div className="rounded-2xl overflow-hidden border border-cv-line shadow-sm">
                    <video src={videoUrls[block.id]} controls className="w-full aspect-video" />
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-cv-line aspect-video flex items-center justify-center bg-cv-soft">
                    <Play className="h-10 w-10 text-cv-muted" />
                  </div>
                )}
                {block.caption && <p className="text-sm text-cv-muted text-center mt-3 max-w-2xl mx-auto">{block.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderHero = () => (
    <section className="bg-cv-cream">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="cv-red-rule" />
              <span className="cv-eyebrow uppercase">Care Benefits</span>
            </div>
            <h1 className="cv-h1 mb-6">
              {heroHeadline.split(' ').slice(0, -1).join(' ')} <span className="cv-red">{heroHeadline.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-lg text-cv-body leading-relaxed max-w-xl mb-6" style={{ fontSize: 20, lineHeight: 1.62 }}>
              {heroSupportingCopy}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="cv-btn-primary px-8 flex items-center gap-2" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
                See packages
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="cv-btn-secondary px-8" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                See how it works
              </button>
            </div>
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

          <div className="cv-card p-6 max-w-xs w-full hidden lg:block">
            <div className="flex flex-col items-center text-center">
              {logo ? (
                <img src={logo} alt={sf.name} className="h-20 w-20 object-contain mb-4" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cv-ink text-white text-3xl font-extrabold mb-4">
                  {partnerInitial}
                </div>
              )}
              <p className="text-lg font-extrabold text-cv-ink">{sf.name}</p>
              {brandPresentation && <p className="text-xs text-cv-muted mt-1">{brandPresentation}</p>}
              <p className="text-xs text-cv-muted mt-1">Verified Careverse Partner</p>
              <div className="flex items-center gap-1 mt-3">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-cv-red text-cv-red" />)}
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
  );

  const renderPackages = () => (
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

        <div className={cn('grid gap-6', selectedProducts.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : selectedProducts.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3')}>
          {selectedProducts.map((product) => (
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
                  {ctaText}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderBenefits = () => (
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
  );

  const renderAbout = () => (
    <section id="about" className="bg-cv-soft py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="cv-red-rule" />
            <span className="cv-eyebrow uppercase">About</span>
          </div>
          <h2 className="cv-h2">About {sf.name}</h2>
        </div>
        <div className="cv-card p-8">
          <div className="flex items-center gap-4 mb-6">
            {partnerPhoto ? (
              <img src={partnerPhoto} alt={sf.name} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cv-ink text-white text-xl font-extrabold">
                {partnerInitial}
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-cv-ink">{sf.name}</p>
              <p className="text-sm text-cv-muted">Verified Careverse Partner</p>
            </div>
          </div>
          <p className="text-sm text-cv-body leading-relaxed">{aboutContent}</p>
        </div>
      </div>
    </section>
  );

  // Build dynamic section order
  const renderedSections: React.ReactNode[] = [];

  if (visibleSections.length === 0) {
    // Fallback to default order if no sections configured
    renderedSections.push(renderHero());
    if (contentBlocks.length > 0) {
      const sectionIds = [...new Set(contentBlocks.map(b => b.sectionId))];
      sectionIds.forEach((sid) => {
        renderedSections.push(renderCreatorVideo(sid));
      });
    }
    renderedSections.push(renderPackages());
    renderedSections.push(renderBenefits());
    if (aboutContent) renderedSections.push(renderAbout());
  } else {
    for (const section of visibleSections) {
      switch (section.type) {
        case 'hero':
          renderedSections.push(renderHero());
          break;
        case 'creatorVideo':
          renderedSections.push(renderCreatorVideo(section.id));
          break;
        case 'packages':
          renderedSections.push(renderPackages());
          break;
        case 'benefits':
          renderedSections.push(renderBenefits());
          break;
        case 'about':
          if (aboutContent) renderedSections.push(renderAbout());
          break;
      }
    }
  }

  return (
    <div className="cv-page min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 lg:px-8 h-[72px]">
          <div className="flex items-center gap-3">
            <CareverseMark size={32} />
            <div className="h-6 w-px bg-cv-line" />
            <div className="flex items-center gap-2.5">
              {logo ? (
                <img src={logo} alt={sf.name} className="h-8 w-8 object-contain" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cv-ink text-white text-sm font-extrabold">
                  {partnerInitial}
                </div>
              )}
              <div>
                <p className="text-sm font-extrabold text-cv-ink">{sf.name}</p>
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
            <button className="cv-btn-primary cv-btn-sm px-5">{ctaText}</button>
          </div>
        </div>
      </header>

      {/* Dynamic sections */}
      {renderedSections}

      {/* Lidia — always rendered after dynamic sections */}
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
            <button className="cv-btn-primary w-full" onClick={() => router.push('/lidia')}>Try Lidia free</button>
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
                {selectedProducts.map(p => (
                  <li key={p.id}><a href="#packages" className="text-sm cv-night-text hover:text-white transition-colors">{p.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Learn</p>
              <ul className="space-y-2">
                <li><a href="#benefits" className="text-sm cv-night-text hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#lidia" className="text-sm cv-night-text hover:text-white transition-colors">Meet Lidia</a></li>
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
