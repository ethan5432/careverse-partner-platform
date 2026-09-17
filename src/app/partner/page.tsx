'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, TrendingUp, Users, MousePointerClick, ExternalLink, Pencil, Store } from 'lucide-react';
import { partnerDashboardStats, partnerPerformanceData, mockConversions, currentPartnerStorefront } from '@/data/mock';
import { useMockAuth } from '@/hooks/useMockAuth';
import { cn } from '@/lib/utils';

type TimeRange = '7D' | '30D' | '90D' | 'ALL';
type Metric = 'revenue' | 'conversions' | 'commission';

export default function PartnerDashboardPage() {
  const router = useRouter();
  const { user } = useMockAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');
  const [metric, setMetric] = useState<Metric>('revenue');

  const recentConversions = mockConversions.filter(c => c.partnerId === 'p-1').slice(0, 5);
  const performanceData = partnerPerformanceData[timeRange];
  const maxValue = Math.max(...performanceData.map(d => d[metric]));

  const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Partner'}`}
        description="Your earnings, storefront performance, and recent conversions at a glance."
      />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Available"
          value={fmtMoney(partnerDashboardStats.available)}
          icon={Wallet}
          description="Ready for payout"
        />
        <StatCard
          label="Pending"
          value={fmtMoney(partnerDashboardStats.pending)}
          icon={TrendingUp}
          description="Awaiting approval"
        />
        <StatCard
          label="Conversions"
          value={partnerDashboardStats.conversions}
          icon={Users}
          trend="+12%"
          trendUp
          description="All time"
        />
        <StatCard
          label="Storefront Visitors"
          value={partnerDashboardStats.visitors.toLocaleString()}
          icon={MousePointerClick}
          trend="+8%"
          trendUp
          description="Last 30 days"
        />
      </div>

      {/* Performance Chart */}
      <Card className="cv-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold text-cv-ink">Performance</CardTitle>
            <p className="text-xs text-cv-muted mt-0.5">Track your revenue, conversions, and commission over time</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Time range tabs */}
            <div className="flex bg-cv-soft rounded-lg p-0.5">
              {(['7D', '30D', '90D', 'ALL'] as TimeRange[]).map((tr) => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={cn(
                    'px-3 py-1 text-xs font-bold rounded-md transition-all',
                    timeRange === tr ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                  )}
                >
                  {tr}
                </button>
              ))}
            </div>
            {/* Metric selector */}
            <div className="flex bg-cv-soft rounded-lg p-0.5">
              {([
                { key: 'revenue' as Metric, label: 'Revenue' },
                { key: 'conversions' as Metric, label: 'Conversions' },
                { key: 'commission' as Metric, label: 'Commission' },
              ]).map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  className={cn(
                    'px-3 py-1 text-xs font-bold rounded-md transition-all',
                    metric === m.key ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Simple bar chart */}
          <div className="flex items-end justify-between gap-2 h-48 pt-4">
            {performanceData.map((d, i) => {
              const value = d[metric];
              const heightPct = (value / maxValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end justify-center relative">
                    <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-cv-ink whitespace-nowrap">
                      {metric === 'conversions' ? value : fmtMoney(value)}
                    </div>
                    <div
                      className="w-full max-w-[60px] rounded-t-lg bg-cv-ink hover:bg-cv-red transition-colors"
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-cv-muted whitespace-nowrap">{d.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Your Storefront */}
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Your Storefront</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cv-soft">
                  <Store className="h-5 w-5 text-cv-ink" />
                </div>
                <div>
                  <p className="font-bold text-cv-ink">{currentPartnerStorefront.name}</p>
                  <p className="text-xs text-cv-muted">{currentPartnerStorefront.url}</p>
                  <div className="mt-1">
                    <StatusBadge status={currentPartnerStorefront.status === 'LIVE' ? 'live' : 'draft'} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <p className="text-xs font-bold uppercase text-cv-muted tracking-wider">Visitors</p>
                <p className="text-lg font-bold text-cv-ink mt-0.5">{currentPartnerStorefront.visitors.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-cv-muted tracking-wider">Conversions</p>
                <p className="text-lg font-bold text-cv-ink mt-0.5">{currentPartnerStorefront.conversions}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-cv-muted tracking-wider">Revenue</p>
                <p className="text-lg font-bold text-cv-ink mt-0.5">{fmtMoney(currentPartnerStorefront.revenue)}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft"
                onClick={() => router.push('/storefront')}
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                View storefront
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-cv-line font-bold text-cv-ink hover:bg-cv-soft"
                onClick={() => router.push('/partner/store')}
              >
                <Pencil className="h-4 w-4 mr-1.5" />
                Edit storefront
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Conversions */}
        <Card className="cv-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Recent Conversions</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-cv-muted" onClick={() => router.push('/partner/conversions')}>
              View all
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {recentConversions.length === 0 ? (
              <p className="text-sm text-cv-muted py-6 text-center">No conversions yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-cv-line">
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                    <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentConversions.map((c) => (
                    <TableRow key={c.id} className="border-cv-line">
                      <TableCell className="font-bold text-cv-ink text-sm">{c.plan}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">${c.commission.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge status={c.status.toLowerCase() as any} />
                      </TableCell>
                      <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
