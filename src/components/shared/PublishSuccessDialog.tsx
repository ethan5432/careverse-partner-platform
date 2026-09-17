'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, ExternalLink, Copy, Share2, Rocket } from 'lucide-react';

export function PublishSuccessDialog({
  open,
  onOpenChange,
  storeUrl,
  storeName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeUrl: string;
  storeName: string;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(storeUrl).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = storeUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 mb-2">
            <Rocket className="h-6 w-6 text-cv-good" />
          </div>
          <DialogTitle className="text-lg font-bold text-cv-ink">Your store is live!</DialogTitle>
          <DialogDescription className="text-sm text-cv-muted">
            {storeName} is now published and ready to receive customers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cv-good shrink-0" />
            <p className="text-sm font-bold text-cv-good">Store is live</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cv-muted mb-1.5">Store URL</p>
            <div className="flex items-center gap-2">
              <Input value={storeUrl} readOnly className="cv-input text-sm" />
              <button
                onClick={handleCopy}
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border border-cv-line hover:bg-cv-soft transition-colors"
                title="Copy link"
              >
                <Copy className="h-3.5 w-3.5 text-cv-body" />
              </button>
            </div>
            {copied && <p className="text-xs font-bold text-cv-good mt-1">Link copied to clipboard!</p>}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-3"
              onClick={() => router.push('/storefront')}
            >
              <ExternalLink className="h-4 w-4 text-cv-ink" />
              <span className="text-xs font-bold">View Store</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-3"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 text-cv-ink" />
              <span className="text-xs font-bold">Copy Link</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-1 rounded-xl border-cv-line py-3"
              onClick={() => router.push('/partner')}
            >
              <Share2 className="h-4 w-4 text-cv-ink" />
              <span className="text-xs font-bold">Share Store</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
