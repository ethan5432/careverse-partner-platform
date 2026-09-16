'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge, Avatar } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Users, Store, ArrowLeftRight, TrendingUp, CircleAlert as AlertCircle, Clock } from 'lucide-react';
import {
  adminDashboardStats, adminPerformanceByRange, mockPartners, mockStorefronts,
  mockAdminActivity, mockNeedsAttention,
} from '@/data/mock';
import type { AdminTimeRange, AdminMetric } from '@/data/mock/types';
import { cn } from '@/lib/utils';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const activityIconColor: Record<string, string> = {
  APPLICATION: 'text-cv-muted',
  APPROVAL: 'text-cv-good',
  STOREFRONT_PUBLISHED: 'text-cv-good',
  CONVERSION: 'text-cv-ink',
  COMMISSION: 'text-cv-good',
  PAYOUT: 'text-cv-good',
};

const attentionSeverityStyles: Record<string, string> = {
  info: 'border-l-blue-400 bg-blue-50/40',
  warning: 'border-l-amber-400 bg-amber-50/40',
  error: 'border-l-red-400 bg-red-50/40',
};

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<AdminTimeRange>('30D');
  const [metric, setMetric] = useState<AdminMetric>('revenue');

  const performanceData = adminPerformanceByRange[timeRange];
  const maxValue = Math.max(...performanceData.map(d => d[metric]));

  const topPartners = useMemo(
    () => [...mockPartners].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    []
  );

  const storefrontPerformance = useMemo(
    () => [...mockStorefronts].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    []
  );

  const partnerMap = useMemo(() => {
    const m = new Map<string, { name: string; avatarColor: string }>();
    mockPartners.forEach((p) => m.set(p.id, { name: p.name, avatarColor: p.avatarColor }));
    return m;
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Admin Overview"
        description="Platform-wide revenue, conversions, and partner activity at a glance."
      />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={fmtMoney(adminDashboardStats.totalRevenue)} icon={DollarSign} trend="+18%" trendUp description="All time" />
        <StatCard label="Conversions" value={adminDashboardStats.totalConversions} icon={ArrowLeftRight} trend="+12%" trendUp description="All time" />
        <StatCard label="Commissions" value={fmtMoney(adminDashboardStats.totalCommissions)} icon={TrendingUp} trend="+15%" trendUp description="All time" />
        <StatCard label="Active Partners" value={adminDashboardStats.activePartners} icon={Users} description={`${adminDashboardStats.pendingPartners} pending`} />
      </div>

      {/* Performance Chart */}
      <Card className="cv-card">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-base font-bold text-cv-ink">Platform Performance</CardTitle>
            <p className="text-xs text-cv-muted mt-0.5">Track revenue, conversions, and commission over time</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-cv-soft rounded-lg p-0.5">
              {(['7D', '30D', '90D', 'ALL'] as AdminTimeRange[]).map((tr) => (
                <button
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={cn(
                    'px-3 py-1 text-xs font-bold rounded-md transition-all',
                    timeRange === tr ? 'bg-white text-cv-ink shadow-sm' : 'text-cv-muted hover:text-cv-ink'
                  )}
                >
                  {tr === '7D' ? '7 days' : tr === '30D' ? '30 days' : tr === '90D' ? '90 days' : 'All time'}
                </button>
              ))}
            </div>
            <div className="flex bg-cv-soft rounded-lg p-0.5">
              {([
                { key: 'revenue' as AdminMetric, label: 'Revenue' },
                { key: 'conversions' as AdminMetric, label: 'Conversions' },
                { key: 'commission' as AdminMetric, label: 'Commission' },
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
                    <div className="w-full max-w-[60px] rounded-t-lg bg-cv-ink hover:bg-cv-red transition-colors" style={{ height: `${Math.max(heightPct, 4)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-cv-muted whitespace-nowrap">{d.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Partner Performance + Storefront Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Partner Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPartners.map((p) => (
                  <TableRow key={p.id} className="border-cv-line">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.name} color={p.avatarColor} size={28} />
                        <p className="text-sm font-bold text-cv-ink">{p.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-cv-body">{p.type}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{fmtMoney(p.commission)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="cv-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Storefront Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Visitors</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conv.</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storefrontPerformance.map((s) => {
                  const partner = partnerMap.get(s.partnerId);
                  return (
                    <TableRow key={s.id} className="border-cv-line">
                      <TableCell className="text-sm font-bold text-cv-ink">{s.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={partner?.name || '?'} color={partner?.avatarColor} size={24} />
                          <span className="text-xs text-cv-body">{partner?.name || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{s.visitors.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{s.conversions}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(s.revenue)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Needs Attention + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Needs Attention */}
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-cv-red" />
              <CardTitle className="text-base font-bold text-cv-ink">Needs Attention</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {mockNeedsAttention.length === 0 ? (
              <p className="text-sm text-cv-muted py-6 text-center">Everything is in good standing</p>
            ) : (
              <div className="space-y-2.5">
                {mockNeedsAttention.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border-l-4 p-3',
                      attentionSeverityStyles[item.severity]
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-cv-ink">{item.title}</p>
                      <p className="text-xs text-cv-muted mt-0.5">{item.description}</p>
                    </div>
                    <span className="text-xs font-bold text-cv-muted shrink-0">{item.partnerName}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cv-ink" />
              <CardTitle className="text-base font-bold text-cv-ink">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {mockAdminActivity.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-cv-line last:border-0">
                  <div className={cn('flex h-2 w-2 rounded-full shrink-0', activityIconColor[a.type]?.replace('text-', 'bg-') || 'bg-cv-muted')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-cv-ink">{a.description}</p>
                    <p className="text-xs text-cv-muted">
                      {a.partnerName}
                      {a.amount !== undefined && ` · ${fmtMoney(a.amount)}`}
                    </p>
                  </div>
                  <span className="text-xs text-cv-muted shrink-0">{fmtDate(a.date)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
