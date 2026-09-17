'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image as ImageIcon,
  FileText,
  Video,
  Layers,
  Megaphone,
  Gift,
  Presentation,
  Users,
  Download,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { mockResources } from '@/data/mock';
import type { MockResource, ResourcePackage } from '@/data/mock/types';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  palette: Layers,
  'file-text': FileText,
  info: FileText,
  'book-open': Layers,
  video: Video,
  image: ImageIcon,
  file: FileText,
  layers: Layers,
  megaphone: Megaphone,
  gift: Gift,
  presentation: Presentation,
  users: Users,
};

const tabs: { value: ResourcePackage; label: string; description: string }[] = [
  { value: 'CREATOR', label: 'Creator', description: 'Brand kits, templates, and onboarding for creators.' },
  { value: 'BUSINESS', label: 'Business / Agency', description: 'Playbooks, email packs, and decks for business teams.' },
];

function ResourceCard({ resource }: { resource: MockResource }) {
  const Icon = iconMap[resource.icon] ?? Layers;
  const isDownload = resource.type === 'download';
  const ActionIcon = isDownload ? Download : ExternalLink;

  return (
    <Card className="cv-card flex flex-col">
      <CardContent className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cv-soft">
            <Icon className="h-5 w-5 text-cv-ink" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-cv-ink leading-tight">{resource.title}</h3>
            <p className="text-xs text-cv-muted mt-1 leading-relaxed">{resource.description}</p>
          </div>
        </div>

        <div className="mt-auto pt-1">
          <Button
            variant="outline"
            className={cn('w-full rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft')}
            onClick={() => {
              if (resource.url && resource.url !== '#') {
                window.open(resource.url, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <ActionIcon className="h-4 w-4 mr-1.5" />
            {isDownload ? 'Download' : 'View'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResourcesPage() {
  const { user } = useMockAuth();
  // Default the active tab to the partner's own package when it maps cleanly.
  const defaultTab: ResourcePackage =
    user?.partnerType === 'BUSINESS' ? 'BUSINESS' : 'CREATOR';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resources"
        title="Resources"
        description="Download marketing assets, templates, and guides tailored to your partner type."
      />

      <Tabs defaultValue={defaultTab}>
        <TabsList className="bg-cv-soft h-auto p-1 rounded-xl flex flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="rounded-lg px-4 py-1.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => {
          const items = mockResources.filter((r) => r.category === t.value);
          return (
            <TabsContent key={t.value} value={t.value} className="mt-6">
              <p className="text-sm text-cv-muted mb-4">{t.description}</p>
              {items.length === 0 ? (
                <Card className="cv-card">
                  <CardContent>
                    <EmptyState
                      icon={Layers}
                      title="No resources available"
                      description="New resources for this package are on the way. Check back soon."
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => (
                    <ResourceCard key={r.id} resource={r} />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
