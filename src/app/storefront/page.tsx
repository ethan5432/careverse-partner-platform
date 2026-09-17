'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Check, Heart, Shield, Sparkles, ArrowRight, X, Wallet, Star, Clock, Users, Phone, Mail, ChevronDown, ChevronUp, Play, Target, Package as PackageIcon, Instagram, Youtube, Facebook, Linkedin, Twitter } from 'lucide-react';
import { mockProducts, currentPartnerStorefront } from '@/data/mock';
import { loadStorefrontConfig, getVideoObjectURL, StorefrontConfig, StoreBranding, SocialLink } from '@/lib/store-persistence';
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
  const heroImage = config?.heroImage || '';
  const branding = config?.branding;
  const brandMode = config?.brandMode || 'co-branded';
  const showProfile = config?.showProfile ?? true;
  const showVerifiedBadge = config?.showVerifiedBadge ?? true;
  const showPoweredByFooter = config?.showPoweredByFooter ?? true;
  const showCareverseInHeader = config?.showCareverseInHeader ?? true;
  const showCareverseInFooter = config?.showCareverseInFooter ?? true;
  const socialLinks = (config?.socialLinks || []).filter(s => s.visible && s.url).sort((a, b) => a.order - b.order);

  const socialIconMap: Record<string, typeof Instagram> = {
    instagram: Instagram,
    tiktok: Play,
    youtube: Youtube,
    facebook: Facebook,
    linkedin: Linkedin,
    x: Twitter,
  };

  const isWhiteLabel = brandMode === 'white-label';
  const isCareverseBranded = brandMode === 'careverse-branded';

  const brandingCssVars: React.CSSProperties = branding ? {
    ['--ink' as string]: branding.primaryColor,
    ['--body' as string]: branding.mutedTextColor,
    ['--muted' as string]: branding.mutedTextColor,
    ['--cream' as string]: branding.backgroundColor,
    ['--soft' as string]: branding.backgroundColor,
    ['--white' as string]: branding.surfaceColor,
    ['--line' as string]: branding.borderColor,
    ['--red' as string]: branding.secondaryColor,
    ['--red-deep' as string]: branding.secondaryColor,
    ['--night' as string]: branding.primaryColor,
    ['--night-text' as string]: branding.mutedTextColor,
    ['--good' as string]: branding.accentColor,
  } : {};

  const headingStyle: React.CSSProperties = branding ? {
    fontFamily: branding.headingFont,
    fontWeight: branding.headingWeight,
  } : {};

  const bodyStyle: React.CSSProperties = branding ? {
    fontFamily: branding.bodyFont,
    fontWeight: branding.bodyWeight,
  } : {};

  const buttonStyle: React.CSSProperties = branding ? {
    fontWeight: branding.buttonWeight,
  } : {};

  const selectedProducts = selectedPackages
    .map(name => mockProducts.find(p => p.name === name))
    .filter((p): p is typeof mockProducts[0] => Boolean(p));

  const visibleSections = sections.filter(s => s.visible);

  const renderCreatorVideo = (sectionId: string) => {
    const section = visibleSections.find(s => s.id === sectionId);
    if (!section) return null;
    const sectionBlocks = contentBlocks.filter(b => b.sectionId === sectionId).sort((a, b) => a.order - b.order);
    if (sectionBlocks.length === 0) return null;
    const cols = section.columns || 1;
    const gridClass = cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1';

    return (
      <section key={sectionId} style={{ backgroundColor: 'var(--soft)' }}>
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
          {sectionBlocks[0].title && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
                <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>Video</span>
              </div>
              <h2 className="cv-h2" style={headingStyle}>{sectionBlocks[0].title}</h2>
            </div>
          )}
          <div className={cn('grid gap-4', gridClass)}>
            {sectionBlocks.map((block) => (
              <div key={block.id}>
                {block.source === 'EMBED' && block.url ? (
                  <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: 'var(--line)' }}>
                    <iframe
                      src={block.url}
                      className="w-full aspect-video"
                      title={block.title || 'Video content'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : block.source === 'UPLOAD' && videoUrls[block.id] ? (
                  <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: 'var(--line)' }}>
                    <video src={videoUrls[block.id]} controls className="w-full aspect-video" />
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed aspect-video flex items-center justify-center" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--soft)' }}>
                    <Play className="h-10 w-10" style={{ color: 'var(--muted)' }} />
                  </div>
                )}
                {block.caption && <p className="text-sm text-center mt-3 max-w-2xl mx-auto" style={{ color: 'var(--muted)', ...bodyStyle }}>{block.caption}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderHero = () => (
    <section style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
              <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>Care Benefits</span>
            </div>
            <h1 className="cv-h1 mb-6" style={headingStyle}>
              {heroHeadline.split(' ').slice(0, -1).join(' ')} <span style={{ color: 'var(--red)' }}>{heroHeadline.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl mb-6" style={{ color: 'var(--body)', fontSize: 20, lineHeight: 1.62, ...bodyStyle }}>
              {heroSupportingCopy}
            </p>
            {heroImage && <img src={heroImage} alt="Hero" className="rounded-2xl mb-6 max-h-80 w-full object-cover" />}
            <div className="flex flex-wrap items-center gap-4">
              <button className="cv-btn-primary px-8 flex items-center gap-2" style={{ ...buttonStyle, color: branding?.buttonTextColor }} onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
                See packages
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="cv-btn-secondary px-8" style={buttonStyle} onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                See how it works
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {['No waiting periods', 'Cancel anytime', 'Lidia included free'].map((chip) => (
                <div key={chip} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5" style={{ backgroundColor: 'var(--white)', borderColor: 'var(--line)' }}>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(11,155,107,0.1)' }}>
                    <Check className="h-3 w-3" style={{ color: 'var(--good)' }} />
                  </div>
                  <span className="text-xs font-extrabold" style={{ color: 'var(--ink)' }}>{chip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile card — only when showProfile is enabled and not white-label */}
          {showProfile && !isWhiteLabel && (
            <div className="cv-card p-6 max-w-xs w-full hidden lg:block">
              <div className="flex flex-col items-center text-center">
                {logo ? (
                  <img src={logo} alt={sf.name} className="h-20 w-20 object-contain mb-4" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-white text-3xl font-extrabold mb-4" style={{ backgroundColor: 'var(--ink)' }}>
                    {partnerInitial}
                  </div>
                )}
                <p className="text-lg font-extrabold" style={{ color: 'var(--ink)', ...headingStyle }}>{sf.name}</p>
                {brandPresentation && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{brandPresentation}</p>}
                {showVerifiedBadge && <p className="text-xs mt-1" style={{ color: 'var(--good)' }}>Careverse Verified</p>}
                <div className="flex items-center gap-1 mt-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4" style={{ fill: 'var(--red)', color: 'var(--red)' }} />)}
                  <span className="text-xs font-bold ml-1" style={{ color: 'var(--ink)' }}>5.0</span>
                </div>
                <div className="w-full mt-5 pt-5 border-t space-y-2" style={{ borderColor: 'var(--line)' }}>
                  {showVerifiedBadge && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--body)' }}>
                      <Shield className="h-3.5 w-3.5" style={{ color: 'var(--good)' }} />
                      <span>Careverse Verified</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--body)' }}>
                    <Users className="h-3.5 w-3.5" style={{ color: 'var(--muted)' }} />
                    <span>{currentPartnerStorefront.visitors.toLocaleString()} families helped</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--body)' }}>
                    <Clock className="h-3.5 w-3.5" style={{ color: 'var(--muted)' }} />
                    <span>Available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderPackages = () => (
    <section id="packages" style={{ backgroundColor: 'var(--soft)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
            <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>Plans</span>
          </div>
          <h2 className="cv-h2" style={headingStyle}>Choose your package</h2>
          <p className="mt-3 text-lg" style={{ color: 'var(--body)', ...bodyStyle }}>Every plan includes Lidia, free for everyone.</p>
        </div>

        <div className={cn('grid gap-6', selectedProducts.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : selectedProducts.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3')}>
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className={cn(
                'cv-card p-8 flex flex-col relative',
                product.popular && 'ring-2'
              )}
              style={product.popular ? { '--tw-ring-color': 'var(--ink)' } as React.CSSProperties : undefined}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-extrabold px-4 py-1 rounded-full" style={{ backgroundColor: 'var(--ink)' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 className="cv-h3 mb-2" style={headingStyle}>{product.name}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{product.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: 'var(--ink)' }}>{fmtMoney(product.price)}</span>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: 'var(--body)', ...bodyStyle }}>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(11,155,107,0.1)' }}>
                      <Check className="h-3 w-3" style={{ color: 'var(--good)' }} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setExpandedPlan(expandedPlan === product.id ? null : product.id)}
                className="text-xs font-bold flex items-center justify-center gap-1 mb-3 transition-colors"
                style={{ color: 'var(--ink)' }}
              >
                {expandedPlan === product.id ? 'Hide details' : 'View plan details'}
                {expandedPlan === product.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {expandedPlan === product.id && (
                <div className="rounded-xl p-4 mb-4 space-y-2 text-xs" style={{ backgroundColor: 'var(--soft)', color: 'var(--body)' }}>
                  <div className="flex justify-between"><span>Billing type</span><span className="font-bold" style={{ color: 'var(--ink)' }}>{product.billingType.charAt(0) + product.billingType.slice(1).toLowerCase()}</span></div>
                  <div className="flex justify-between"><span>Waiting period</span><span className="font-bold" style={{ color: 'var(--ink)' }}>None</span></div>
                  <div className="flex justify-between"><span>Cancel anytime</span><span className="font-bold" style={{ color: 'var(--ink)' }}>Yes</span></div>
                  <div className="flex justify-between"><span>Lidia AI included</span><span className="font-bold" style={{ color: 'var(--ink)' }}>Yes</span></div>
                  <div className="flex justify-between"><span>Health Advocacy</span><span className="font-bold" style={{ color: 'var(--ink)' }}>{product.features.some(f => f.includes('Advocacy')) ? 'Yes' : 'Where applicable'}</span></div>
                </div>
              )}

              {purchasedPlan === product.name ? (
                <div className="cv-btn-secondary justify-center cursor-default" style={{ pointerEvents: 'none' }}>
                  <Check className="h-4 w-4" style={{ color: 'var(--good)' }} />
                  Purchased!
                </div>
              ) : (
                <button
                  className={product.popular ? 'cv-btn-red w-full' : 'cv-btn-primary w-full'}
                  style={buttonStyle}
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
    <section id="benefits" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
            <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>What&apos;s Included</span>
          </div>
          <h2 className="cv-h2" style={headingStyle}>Everything your family needs</h2>
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
              <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: 'var(--soft)' }}>
                <benefit.icon className="h-5 w-5" style={{ color: 'var(--ink)' }} />
              </div>
              <h3 className="text-lg font-bold mb-1.5" style={{ color: 'var(--ink)', ...headingStyle }}>{benefit.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', ...bodyStyle }}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section id="about" style={{ backgroundColor: 'var(--soft)' }}>
      <div className="max-w-4xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
            <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>About</span>
          </div>
          <h2 className="cv-h2" style={headingStyle}>About {sf.name}</h2>
        </div>
        <div className="cv-card p-8">
          {showProfile && !isWhiteLabel && (
            <div className="flex items-center gap-4 mb-6">
              {partnerPhoto ? (
                <img src={partnerPhoto} alt={sf.name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full text-white text-xl font-extrabold" style={{ backgroundColor: 'var(--ink)' }}>
                  {partnerInitial}
                </div>
              )}
              <div>
                <p className="text-lg font-bold" style={{ color: 'var(--ink)', ...headingStyle }}>{sf.name}</p>
                {showVerifiedBadge && <p className="text-sm" style={{ color: 'var(--good)' }}>Careverse Verified</p>}
              </div>
            </div>
          )}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--body)', ...bodyStyle }}>{aboutContent}</p>
        </div>
      </div>
    </section>
  );

  const renderFooter = () => (
    <footer style={{ backgroundColor: 'var(--night)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {!isWhiteLabel && showCareverseInFooter && <CareverseMark size={28} />}
              <span className="text-sm font-extrabold text-white">{sf.name}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--night-text)' }}>Lidia is free for everyone. Building the world&apos;s largest AI-powered care network.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Plans</p>
            <ul className="space-y-2">
              {selectedProducts.map(p => (
                <li key={p.id}><a href="#packages" className="text-sm hover:text-white transition-colors" style={{ color: 'var(--night-text)' }}>{p.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Learn</p>
            <ul className="space-y-2">
              <li><a href="#benefits" className="text-sm hover:text-white transition-colors" style={{ color: 'var(--night-text)' }}>Benefits</a></li>
              <li><a href="#lidia" className="text-sm hover:text-white transition-colors" style={{ color: 'var(--night-text)' }}>Meet Lidia</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white mb-3">Contact</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--night-text)' }}><Mail className="h-3.5 w-3.5" /> hello@careverse.ai</li>
              <li className="flex items-center gap-2 text-sm" style={{ color: 'var(--night-text)' }}><Phone className="h-3.5 w-3.5" /> 1-800-CAREVERSE</li>
            </ul>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-4">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.platform];
                  if (!Icon) return null;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                      style={{ color: 'var(--night-text)' }}
                      title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: 'var(--night-text)' }}>© 2026 {sf.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'var(--night-text)' }}>Terms of Service</a>
              <a href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'var(--night-text)' }}>Privacy Policy</a>
              <a href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'var(--night-text)' }}>Refund Policy</a>
            </div>
          </div>
          <p className="text-xs mt-4 text-center sm:text-left" style={{ color: 'var(--night-text)' }}>
            Careverse memberships are not insurance. Memberships provide access to included services, discounts, and benefits. See full terms for details.
          </p>
          {!isWhiteLabel && showPoweredByFooter && (
            <p className="text-xs mt-4 text-center" style={{ color: 'var(--night-text)' }}>
              Powered by Careverse
            </p>
          )}
        </div>
      </div>
    </footer>
  );

  // Build dynamic section order
  const renderedSections: React.ReactNode[] = [];

  if (visibleSections.length === 0) {
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
        case 'footer':
          // Footer is rendered at the end, after Lidia
          break;
      }
    }
  }

  return (
    <div className="cv-page min-h-screen" style={brandingCssVars}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ backgroundColor: branding ? `${branding.backgroundColor}e0` : 'rgba(246,243,238,0.88)', borderColor: 'var(--line)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 lg:px-8 h-[72px]">
          <div className="flex items-center gap-3">
            {!isWhiteLabel && showCareverseInHeader && <CareverseMark size={32} />}
            {!isWhiteLabel && showCareverseInHeader && <div className="h-6 w-px" style={{ backgroundColor: 'var(--line)' }} />}
            <div className="flex items-center gap-2.5">
              {logo ? (
                <img src={logo} alt={sf.name} className="h-8 w-8 object-contain" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl text-white text-sm font-extrabold" style={{ backgroundColor: 'var(--ink)' }}>
                  {partnerInitial}
                </div>
              )}
              <div>
                <p className="text-sm font-extrabold" style={{ color: 'var(--ink)', ...headingStyle }}>{sf.name}</p>
                {!isWhiteLabel && <p className="text-[10px]" style={{ color: 'var(--muted)' }}>Careverse Partner</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#packages" className="hidden sm:block text-sm font-bold hover:text-cv-ink transition-colors" style={{ color: 'var(--body)' }}>Packages</a>
            <a href="#benefits" className="hidden sm:block text-sm font-bold hover:text-cv-ink transition-colors" style={{ color: 'var(--body)' }}>Benefits</a>
            <a href="#lidia" className="hidden sm:block text-sm font-bold hover:text-cv-ink transition-colors" style={{ color: 'var(--body)' }}>Lidia</a>
            <button className="cv-btn-primary cv-btn-sm px-5" style={{ ...buttonStyle, color: branding?.buttonTextColor }}>{ctaText}</button>
          </div>
        </div>
      </header>

      {/* Dynamic sections */}
      {renderedSections}

      {/* Lidia — always rendered after dynamic sections */}
      <section id="lidia" style={{ backgroundColor: 'var(--soft)' }}>
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-16 lg:py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div style={{ width: 24, height: 3, backgroundColor: 'var(--red)', borderRadius: 2 }} />
            <span className="cv-eyebrow uppercase" style={{ color: 'var(--muted)' }}>Free for everyone</span>
          </div>
          <h2 className="cv-h2 mb-4" style={headingStyle}>Meet Lidia</h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--body)', fontSize: 20, lineHeight: 1.62, ...bodyStyle }}>
            Lidia is free for everyone. Building the world&apos;s largest AI-powered care network. Ask questions, get guidance, and find the care your family needs — no membership required.
          </p>
          <div className="cv-card p-8 max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4" style={{ backgroundColor: 'var(--ink)' }}>
              <Heart className="h-7 w-7" style={{ color: 'var(--red)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ink)', ...headingStyle }}>Lidia AI Care Assistant</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)', ...bodyStyle }}>Available 24/7 to help you understand your care options and make informed decisions.</p>
            <button className="cv-btn-primary w-full" style={{ ...buttonStyle, color: branding?.buttonTextColor }} onClick={() => router.push('/lidia')}>Try Lidia free</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      {renderFooter()}
    </div>
  );
}
