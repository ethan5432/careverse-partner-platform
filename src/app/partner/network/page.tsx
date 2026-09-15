'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ArrowLeftRight, TrendingUp, Wallet, Network as NetworkIcon } from 'lucide-react';
import { mockNetworks } from '@/data/mock';
import type { MockNetworkPartner, PartnerType } from '@/data/mock/types';
import { useMockAuth } from '@/hooks/useMockAuth';

const fmtMoney = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const typeLabel: Record<PartnerType, string> = {
  CREATOR: 'Creator',
  BUSINESS: 'Business / Agency',
  NETWORK: 'Network',
};

export default function NetworkPage() {
  const router = useRouter();
  const { user } = useMockAuth();

  // Only visible to NETWORK partners.
  if (user?.partnerType !== 'NETWORK') {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Network"
          title="Network"
          description="Manage your sub-partners and track network performance."
        />
        <Card className="cv-card">
          <CardContent>
            <EmptyState
              icon={NetworkIcon}
              title="Network access required"
              description="The Network dashboard is only available to partners enrolled in a network. Switch your role to Network from the account menu to view this page."
              action={
                <button
                  className="cv-btn-primary cv-btn-sm px-5"
                  onClick={() => router.push('/partner')}
                >
                  Back to overview
                </button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const network = mockNetworks[0];
  const partners: MockNetworkPartner[] = network?.partners ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Network"
        title="Network"
        description="Your sub-partners, conversions, and network earnings at a glance."
      />

      {/* Network overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Partners"
          value={network?.partnerCount ?? 0}
          icon={Users}
          description="Active sub-partners"
        />
        <StatCard
          label="Conversions"
          value={network?.conversions ?? 0}
          icon={ArrowLeftRight}
          trend="+9%"
          trendUp
          description="All time"
        />
        <StatCard
          label="Revenue"
          value={fmtMoney(network?.revenue ?? 0)}
          icon={TrendingUp}
          trend="+14%"
          trendUp
          description="Network total"
        />
        <StatCard
          label="Network Earnings"
          value={fmtMoney(network?.networkEarnings ?? 0)}
          icon={Wallet}
          description="Your share"
        />
      </div>

      {/* Partners table */}
      <Card className="cv-card">
        <CardHeader className="pb-3">
          <div>
            <CardTitle className="text-base font-bold text-cv-ink">
              {network?.name ?? 'Network Partners'}
            </CardTitle>
            <p className="text-xs text-cv-muted mt-0.5">
              {partners.length} sub-partners in this network
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {partners.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No sub-partners yet"
              description="Recruit partners into your network to start earning on their conversions."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Name</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((p) => (
                  <TableRow key={p.id} className="border-cv-line">
                    <TableCell className="font-bold text-cv-ink text-sm">{p.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-cv-soft px-2.5 py-0.5 text-xs font-bold text-cv-body">
                        {typeLabel[p.type]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney(p.revenue)}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.commission)}</TableCell>
                    <TableCell className="text-xs text-cv-muted">{fmtDate(p.joinedDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
