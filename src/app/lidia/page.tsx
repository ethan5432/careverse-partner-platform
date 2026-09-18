'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CareverseMark } from '@/components/shared/CareverseLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Heart, Shield, Sparkles, ArrowRight, Check, MessageCircle, User, Phone, Mail, ChevronDown, ChevronUp, Stethoscope, Wallet, Package, Calendar, Clock, ArrowLeft, Bot, Star } from 'lucide-react';
import { mockMemberships, currentPartnerStorefront, currentPartner } from '@/data/mock';
import { getPackageById, type CareversePackage } from '@/lib/package-catalog';
import type { MockMembership, CustomerAttribution } from '@/data/mock/types';
import { loadCustomerAttribution } from '@/lib/attribution-persistence';
import { cn } from '@/lib/utils';

export default function LidiaPage() {
  return (
    <Suspense fallback={<div className="cv-page min-h-screen flex items-center justify-center"><div className="text-sm text-cv-muted">Loading Lidia...</div></div>}>
      <LidiaContent />
    </Suspense>
  );
}

interface LidiaMessage {
  id: string;
  sender: 'lidia' | 'member';
  text: string;
  chips?: string[];
}

function LidiaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const membershipParam = searchParams.get('membership') || '';

  const [membership, setMembership] = useState<MockMembership | null>(null);
  const [attribution, setAttribution] = useState<CustomerAttribution | null>(null);
  const [input, setInput] = useState('');
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);
  const [messages, setMessages] = useState<LidiaMessage[]>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let found: MockMembership | null = null;

    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('careverse_last_membership');
      if (stored) {
        try { found = JSON.parse(stored) as MockMembership; } catch { found = null; }
      }
    }

    if (!found && membershipParam) {
      found = mockMemberships.find((m) => m.id === membershipParam) || null;
    }

    if (!found) {
      found = mockMemberships[0];
    }

    setMembership(found);

    // Silently load persisted customer attribution — invisible to the customer,
    // but available for future Careverse purchases through Lidia.
    const persistedAttribution = loadCustomerAttribution();
    setAttribution(persistedAttribution);

    if (found) {
      setMessages([
        {
          id: 'm-init',
          sender: 'lidia',
          text: `Hi ${found.customerName.split(' ')[0]}! I'm Lidia, your AI care assistant. Welcome to Careverse! I can see you've enrolled in the ${found.productName} plan. I'm here to help you understand your benefits and find the care your family needs.`,
          chips: ['What did I purchase?', 'Explain my benefits', 'How do I use my benefits?', 'Find care services'],
        },
      ]);
    }
  }, [membershipParam]);

  const product: CareversePackage | null = membership ? (getPackageById(membership.productId) ?? null) : null;
  const fmtMoney = (n: number) => `$${n}/mo`;

  const sendMessage = (text: string) => {
    const userMsg: LidiaMessage = { id: `u-${Date.now()}`, sender: 'member', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = generateLidiaResponse(text, membership, product);
      setTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 1200);
  };

  const generateLidiaResponse = (userText: string, mem: MockMembership | null, prod: CareversePackage | null | undefined): LidiaMessage => {
    if (!mem) return { id: `l-${Date.now()}`, sender: 'lidia', text: 'I need your membership information to help you. Please complete a purchase first.' };

    const lower = userText.toLowerCase();

    if (lower.includes('purchas') || lower.includes('what did i') || lower.includes('what plan') || lower.includes('what package')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `You purchased the ${mem.productName} plan for ${fmtMoney(mem.productPrice)}. Your membership is ${mem.status.toLowerCase()} since ${new Date(mem.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. It includes ${mem.benefits.length} key benefits. You were referred by ${mem.partnerName} from ${mem.storefrontName}.`,
        chips: ['Explain my benefits', 'How do I use my benefits?'],
      };
    }

    if (lower.includes('benefit') || lower.includes('included') || lower.includes('what do i get')) {
      const benefitList = mem.benefitDetails.map((b, i) => `${i + 1}. ${b.title} — ${b.description}`).join('\n');
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `Here are your ${mem.productName} benefits:\n\n${benefitList}\n\nWould you like me to explain how to use any of these?`,
        chips: ['How do I use my care allowance?', 'How do I access included services?', 'Find care services'],
      };
    }

    if (lower.includes('allowance') || lower.includes('care allowance')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `Your care allowance is a monthly benefit you can use toward the services your family needs most. With the ${mem.productName} plan, you get an enhanced monthly allowance that you can spend on eligible care services. The allowance resets each month and doesn't roll over. I can help you find services that qualify — just ask me to find care services!`,
        chips: ['Find care services', 'What other benefits do I have?'],
      };
    }

    if (lower.includes('included service') || lower.includes('access included') || lower.includes('no extra')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `Your included services are available at no additional cost with your ${mem.productName} membership. This covers essential care services that your family can access right away — no waiting period. You can start using them immediately. Would you like me to help you find specific care services near you?`,
        chips: ['Find care services', 'How do I use my benefits?'],
      };
    }

    if (lower.includes('how do i use') || lower.includes('how to use') || lower.includes('start using')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `Great question! Here's how to get started with your ${mem.productName} benefits:\n\n1. Your included services are available immediately — no waiting period\n2. Use your care allowance for out-of-pocket care expenses\n3. Access product specials and free samples through your member portal\n4. ${mem.humanHelpEligible ? 'You have access to health advocacy — a dedicated advocate can help you navigate your care options' : 'You can browse available services in your member portal'}\n\nWould you like me to help you find care services now?`,
        chips: ['Find care services', 'Talk to a human advocate', 'Explain my benefits'],
      };
    }

    if (lower.includes('find') && (lower.includes('care') || lower.includes('service') || lower.includes('doctor'))) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `I can help you find care services! With your ${mem.productName} plan, you have access to a network of care providers. Here's what I can help you find:\n\n• Primary care providers\n• Specialists\n• Urgent care centers\n• Preventive care services\n• Wellness programs\n\nWhat type of care are you looking for?`,
        chips: ['Primary care', 'Specialist', 'Urgent care', 'Wellness programs'],
      };
    }

    if (lower.includes('human') || lower.includes('advocate') || lower.includes('talk to') || lower.includes('help person')) {
      if (mem.humanHelpEligible) {
        return {
          id: `l-${Date.now()}`,
          sender: 'lidia',
          text: `You're eligible for human help! As a ${mem.productName} member, you have access to a dedicated health advocate who can:\n\n• Help you navigate your care options\n• Coordinate appointments\n• Answer questions about your benefits\n• Connect you with specialists\n\nYou can reach a health advocate by calling 1-800-CAREVERSE or emailing support@careverse.ai. They're available Monday through Friday, 8am to 8pm EST.`,
          chips: ['Find care services', 'Explain my benefits'],
        };
      }
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `While your plan doesn't include a dedicated health advocate, I'm here 24/7 to help you with any questions about your benefits and finding care. You can also reach our support team at support@careverse.ai.`,
        chips: ['Find care services', 'Explain my benefits'],
      };
    }

    if (lower.includes('cancel') || lower.includes('refund')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `You can cancel your ${mem.productName} membership anytime — no fees, no penalties. Your benefits remain active until the end of your current billing period. To cancel, you can call 1-800-CAREVERSE or manage it from your member portal. Is there anything specific that's making you want to cancel? I might be able to help!`,
        chips: ['Explain my benefits', 'Find care services'],
      };
    }

    if (lower.includes('primary care')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `With your ${mem.productName} plan, primary care visits are included services — meaning no additional cost to you. I can help you find primary care providers in your area. Would you like me to search for providers near you? You can also filter by language, specialties, and availability.`,
        chips: ['Find care services', 'How do I use my benefits?'],
      };
    }

    if (lower.includes('specialist')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `Specialist visits are covered at lower prices with your ${mem.productName} membership. Your care allowance can be applied toward specialist copays. I can help you find specialists — just let me know what type of specialist you're looking for (e.g., cardiologist, dermatologist, pediatrician).`,
        chips: ['Find care services', 'How do I use my care allowance?'],
      };
    }

    if (lower.includes('urgent')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `Urgent care visits are included with your ${mem.productName} plan. If you have a non-emergency medical need that requires prompt attention, you can visit any urgent care center in the Careverse network at no additional cost. For emergencies, always call 911 or go to the nearest emergency room.`,
        chips: ['Find care services', 'Explain my benefits'],
      };
    }

    if (lower.includes('wellness')) {
      return {
        id: `l-${Date.now()}`,
        sender: 'lidia',
        text: `Your ${mem.productName} plan includes access to wellness programs like preventive screenings, fitness classes, and nutrition counseling. You also get product specials on health and wellness products, plus free samples of premium items. Would you like me to find specific wellness programs for you?`,
        chips: ['Find care services', 'Explain my benefits'],
      };
    }

    return {
      id: `l-${Date.now()}`,
      sender: 'lidia',
      text: `I'm here to help you with your ${mem.productName} membership! I can explain your benefits, help you find care services, tell you how to use your care allowance, or connect you with a human advocate. What would you like to know?`,
      chips: ['What did I purchase?', 'Explain my benefits', 'How do I use my benefits?', 'Find care services'],
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(input.trim());
    }
  };

  if (!membership) {
    return (
      <div className="cv-page min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cv-ink mx-auto mb-4"><Heart className="h-8 w-8 text-cv-red" /></div>
          <h1 className="text-2xl font-bold text-cv-ink mb-2">Lidia is free for everyone</h1>
          <p className="text-sm text-cv-muted mb-6">You don't have an active membership yet, but Lidia is still here to help. Visit a partner storefront to explore Careverse plans.</p>
          <Button className="cv-btn-primary rounded-full" onClick={() => router.push('/storefront')}>Browse Plans</Button>
        </div>
      </div>
    );
  }

  const partnerInitial = membership.storefrontName.charAt(0);

  return (
    <div className="cv-page min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cv-cream/88 backdrop-blur-md border-b border-cv-line">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 lg:px-8 h-[72px]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-ink"><Heart className="h-5 w-5 text-cv-red" /></div>
            <div>
              <span className="text-sm font-extrabold text-cv-ink">Lidia</span>
              <p className="text-[10px] text-cv-muted">AI Care Assistant</p>
            </div>
            <div className="h-5 w-px bg-cv-line mx-1" />
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-cv-good"><Check className="h-2.5 w-2.5" /> Member</span>
          </div>
          <button onClick={() => router.push('/storefront')} className="flex items-center gap-1.5 text-sm font-bold text-cv-body hover:text-cv-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Storefront</span>
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-5 lg:px-8 py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Chat experience */}
          <div className="flex flex-col">
            {/* Welcome banner */}
            <div className="cv-card p-6 mb-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cv-ink shrink-0"><Bot className="h-6 w-6 text-cv-red" /></div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-cv-ink mb-1">Welcome, {membership.customerName.split(' ')[0]}!</h1>
                  <p className="text-sm text-cv-muted">I'm Lidia, your personal AI care assistant. I can see your <span className="font-bold text-cv-ink">{membership.productName}</span> membership is active. Ask me anything about your benefits or how to find care.</p>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <Card className="cv-card flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 min-h-[400px] max-h-[600px]">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn('flex gap-3', msg.sender === 'member' && 'flex-row-reverse')}>
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg shrink-0', msg.sender === 'lidia' ? 'bg-cv-ink' : 'bg-cv-soft')}>
                      {msg.sender === 'lidia' ? <Heart className="h-4 w-4 text-cv-red" /> : <User className="h-4 w-4 text-cv-ink" />}
                    </div>
                    <div className={cn('max-w-[80%]', msg.sender === 'member' && 'items-end')}>
                      <div className={cn('rounded-2xl px-4 py-3', msg.sender === 'lidia' ? 'bg-cv-soft text-cv-body' : 'bg-cv-ink text-white')}>
                        <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                      </div>
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.chips.map((chip) => (
                            <button key={chip} onClick={() => sendMessage(chip)} className="inline-flex items-center gap-1 rounded-full border border-cv-line bg-white px-3 py-1.5 text-xs font-bold text-cv-ink hover:bg-cv-soft transition-colors">
                              {chip}
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cv-ink shrink-0"><Heart className="h-4 w-4 text-cv-red" /></div>
                    <div className="rounded-2xl bg-cv-soft px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-cv-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-cv-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-cv-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-cv-line p-3 lg:p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Lidia anything about your benefits..."
                    className="flex-1 rounded-full border border-cv-line bg-white px-4 py-2.5 text-sm text-cv-ink placeholder:text-cv-muted focus:outline-none focus:ring-2 focus:ring-cv-ink/20"
                  />
                  <button
                    onClick={() => input.trim() && sendMessage(input.trim())}
                    disabled={!input.trim()}
                    className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-colors shrink-0', input.trim() ? 'bg-cv-ink text-white hover:bg-cv-ink/90' : 'bg-cv-soft text-cv-muted cursor-not-allowed')}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Membership context sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Membership card */}
            <Card className="cv-card border-cv-ink">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-soft"><Shield className="h-5 w-5 text-cv-ink" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-cv-ink">Your Membership</p>
                    <p className="text-[10px] text-cv-muted">ID: {membership.id}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-cv-good"><Check className="h-2.5 w-2.5" /> {membership.status}</span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-cv-muted flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Customer</span>
                    <span className="font-bold text-cv-ink">{membership.customerName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-cv-muted flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Plan</span>
                    <span className="font-bold text-cv-ink">{membership.productName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-cv-muted flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" /> Price</span>
                    <span className="font-bold text-cv-ink">{fmtMoney(membership.productPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-cv-muted flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Started</span>
                    <span className="font-bold text-cv-ink">{new Date(membership.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-cv-muted flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Renews</span>
                    <span className="font-bold text-cv-ink">{new Date(membership.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits card */}
            <Card className="cv-card">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-3">Your Benefits</p>
                <div className="space-y-2">
                  {membership.benefitDetails.map((benefit, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setExpandedBenefit(expandedBenefit === benefit.title ? null : benefit.title)}
                        className="w-full flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-cv-soft transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 shrink-0"><Check className="h-3 w-3 text-cv-good" /></div>
                          <span className="text-xs font-bold text-cv-ink truncate">{benefit.title}</span>
                        </div>
                        {expandedBenefit === benefit.title ? <ChevronUp className="h-3.5 w-3.5 text-cv-muted shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-cv-muted shrink-0" />}
                      </button>
                      {expandedBenefit === benefit.title && (
                        <p className="text-xs text-cv-muted leading-relaxed pl-9 pr-2 pb-2">{benefit.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Human help */}
            {membership.humanHelpEligible && (
              <Card className="cv-card bg-cv-soft">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cv-ink"><MessageCircle className="h-4 w-4 text-cv-red" /></div>
                    <div>
                      <p className="text-sm font-bold text-cv-ink">Human Help Available</p>
                      <p className="text-[10px] text-cv-muted">You have a dedicated health advocate</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-cv-ink"><Phone className="h-3.5 w-3.5 text-cv-muted" /> 1-800-CAREVERSE</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-cv-ink"><Mail className="h-3.5 w-3.5 text-cv-muted" /> support@careverse.ai</div>
                    <div className="flex items-center gap-2 text-xs text-cv-muted"><Clock className="h-3.5 w-3.5" /> Mon–Fri, 8am–8pm EST</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Referred by */}
            <Card className="cv-card">
              <CardContent className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-3">Referred By</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cv-ink text-white text-sm font-extrabold">{partnerInitial}</div>
                  <div>
                    <p className="text-sm font-bold text-cv-ink">{membership.storefrontName}</p>
                    <p className="text-[10px] text-cv-muted">Verified Careverse Partner</p>
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
