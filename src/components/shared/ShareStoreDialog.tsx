'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Copy, Check, ExternalLink, Share2, Mail, MessageSquare, Download,
  Instagram, Youtube, Facebook, Linkedin, Twitter, QrCode, Loader as Loader2,
  type LucideIcon,
} from 'lucide-react';

interface ShareStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeUrl: string;
  storeName: string;
  isPublished: boolean;
}

const socialShareOptions: { label: string; icon: LucideIcon; color: string; getUrl: (url: string, text: string) => string }[] = [
  { label: 'X', icon: Twitter, color: '#000000', getUrl: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { label: 'Facebook', icon: Facebook, color: '#1877F2', getUrl: (u, _t) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { label: 'LinkedIn', icon: Linkedin, color: '#0A66C2', getUrl: (u, t) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}&summary=${encodeURIComponent(t)}` },
];

const platformIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  x: Twitter,
};

export function ShareStoreDialog({ open, onOpenChange, storeUrl, storeName, isPublished }: ShareStoreDialogProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [copyText, setCopyText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const fullUrl = typeof window !== 'undefined' && storeUrl && !storeUrl.startsWith('http')
    ? `${window.location.origin}${storeUrl.startsWith('/') ? '' : '/'}${storeUrl}`
    : storeUrl;

  useEffect(() => {
    if (open) {
      setCopyText(`Check out ${storeName} — quality care for your family. ${fullUrl}`);
    }
  }, [open, storeName, fullUrl]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullUrl]);

  const handleCopyText = useCallback(() => {
    try {
      navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [copyText]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName,
          text: copyText,
          url: fullUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  }, [storeName, copyText, fullUrl, handleCopyLink]);

  const handleEmailShare = useCallback(() => {
    const subject = `Check out ${storeName}`;
    const body = copyText;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  }, [storeName, copyText]);

  const handleTextShare = useCallback(() => {
    window.open(`sms:?body=${encodeURIComponent(copyText)}`, '_blank');
  }, [copyText]);

  // Generate QR code using a canvas-based approach with a public API
  useEffect(() => {
    if (open && !qrDataUrl && !qrLoading) {
      setQrLoading(true);
      // Use QR Server API for QR code generation
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 300, 300);
          setQrDataUrl(canvas.toDataURL('image/png'));
        }
        setQrLoading(false);
      };
      img.onerror = () => {
        // Fallback: just use the URL directly
        setQrDataUrl(qrUrl);
        setQrLoading(false);
      };
      img.src = qrUrl;
    }
  }, [open, qrDataUrl, qrLoading, fullUrl]);

  const handleDownloadQR = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${storeName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [qrDataUrl, storeName]);

  const handleSocialShare = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-cv-ink">
            <Share2 className="h-5 w-5" />
            Share your store
          </DialogTitle>
          <DialogDescription className="text-sm text-cv-muted">
            Share your store link with your audience to start earning commission.
          </DialogDescription>
        </DialogHeader>

        {!isPublished && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-sm font-bold text-amber-700">
              Your store is not published yet. Share it now, but visitors will see a coming soon page until you publish.
            </p>
          </div>
        )}

        {/* Store link with copy */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-cv-muted tracking-wider">Your store link</label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={fullUrl}
              className="cv-input text-sm font-bold"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              className={cn('rounded-full border-cv-line font-bold shrink-0', copied && 'border-cv-good text-cv-good')}
              onClick={handleCopyLink}
            >
              {copied ? <><Check className="h-4 w-4 mr-1" /> Copied</> : <><Copy className="h-4 w-4 mr-1" /> Copy</>}
            </Button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-3"
            onClick={() => window.open(fullUrl, '_blank')}
          >
            <ExternalLink className="h-5 w-5 text-cv-ink" />
            <span className="text-[10px] font-bold uppercase text-cv-muted">Open</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-3"
            onClick={handleNativeShare}
          >
            <Share2 className="h-5 w-5 text-cv-ink" />
            <span className="text-[10px] font-bold uppercase text-cv-muted">Share</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-3"
            onClick={handleCopyLink}
          >
            {copied ? <Check className="h-5 w-5 text-cv-good" /> : <Copy className="h-5 w-5 text-cv-ink" />}
            <span className="text-[10px] font-bold uppercase text-cv-muted">Copy</span>
          </Button>
        </div>

        {/* Suggested copy */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-cv-muted tracking-wider">Suggested message</label>
          <textarea
            ref={textareaRef}
            value={copyText}
            onChange={(e) => setCopyText(e.target.value)}
            rows={3}
            className="cv-input w-full resize-none py-3 px-4 text-sm"
            placeholder="Write your share message..."
          />
          <Button
            variant="outline"
            className="rounded-full border-cv-line font-bold text-xs"
            onClick={handleCopyText}
          >
            {copied ? <><Check className="h-3.5 w-3.5 mr-1" /> Copied message</> : <><Copy className="h-3.5 w-3.5 mr-1" /> Copy message</>}
          </Button>
        </div>

        {/* QR Code */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-cv-muted tracking-wider">QR code</label>
          <div className="flex items-center gap-4">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-cv-line bg-white shrink-0">
              {qrLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-cv-muted" />
              ) : qrDataUrl ? (
                <img src={qrDataUrl} alt="QR code" className="h-full w-full object-contain rounded-lg" />
              ) : (
                <QrCode className="h-8 w-8 text-cv-muted" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs text-cv-muted">Scan this QR code to visit your store. Download it for print materials, business cards, or flyers.</p>
              <Button
                variant="outline"
                className="rounded-full border-cv-line font-bold text-xs"
                onClick={handleDownloadQR}
                disabled={!qrDataUrl}
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Download QR code
              </Button>
            </div>
          </div>
        </div>

        {/* Social sharing */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-cv-muted tracking-wider">Share to social</label>
          <div className="flex gap-2">
            {socialShareOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleSocialShare(opt.getUrl(fullUrl, copyText))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cv-line hover:bg-cv-soft transition-colors"
                title={`Share to ${opt.label}`}
              >
                <opt.icon className="h-4 w-4" style={{ color: opt.color }} />
              </button>
            ))}
          </div>
        </div>

        {/* Email & text */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="rounded-full border-cv-line font-bold"
            onClick={handleEmailShare}
          >
            <Mail className="h-4 w-4 mr-1.5" />
            Email
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-cv-line font-bold"
            onClick={handleTextShare}
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
