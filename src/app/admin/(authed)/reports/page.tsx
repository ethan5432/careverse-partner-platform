'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, ArrowLeftRight, Percent, Users, Store, Download, Calendar, TrendingUp } from 'lucide-react';
import { adminPerformanceData, adminDashboardStats, mockPartners, mockStorefronts } from '@/data/mock';
import { cn } from '@/lib/utils';

type TimeRange = '7D' | '30D' | '90D' | 'ALL';

export default function AdminReportsPage() {
  const [range, setRange] = useState<TimeRange>('30D');
  const [exported, setExported] = useState(false);

  const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  // Chart data (use adminPerformanceData as base; in a real app this would filter by range)
  const chartData = adminPerformanceData;
  const maxValue = Math.max(...chartData.map((d) => d.revenue));

  const topPartners = [...mockPartners].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topStorefronts = [...mockStorefronts].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Platform Reports"
        description="Revenue, conversions, commissions, and partner performance across the Careverse platform."
        actions={
          <>
            <Select value={range} onValueChange={(v) => setRange(v as TimeRange)}>
              <SelectTrigger className="cv-input h-11 w-[150px] rounded-full font-bold text-cv-ink">
                <Calendar className="h-4 w-4 text-cv-muted mr-1.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7D">Last 7 days</SelectItem>
                <SelectItem value="30D">Last 30 days</SelectItem>
                <SelectItem value="90D">Last 90 days</SelectItem>
                <SelectItem value="ALL">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="cv-btn-primary cv-btn-sm rounded-full">
              <Download className="h-4 w-4" /> {exported ? 'Exporting…' : 'Export'}
            </Button>
          </>
        }
      />

      {exported && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm font-bold text-cv-good flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> Report exported successfully — check your downloads.
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Revenue" value={fmtMoney(adminDashboardStats.totalRevenue)} icon={DollarSign} trend="+18%" trendUp />
        <StatCard label="Conversions" value={adminDashboardStats.totalConversions} icon={ArrowLeftRight} trend="+12%" trendUp />
        <StatCard label="Commissions" value={fmtMoney(adminDashboardStats.totalCommissions)} icon={Percent} trend="+15%" trendUp />
        <StatCard label="Partners" value={mockPartners.length} icon={Users} description={`${adminDashboardStats.activePartners} active`} />
        <StatCard label="Storefronts" value={adminDashboardStats.totalStorefronts} icon={Store} description={`${adminDashboardStats.liveStorefronts} live`} />
      </div>

      {/* Revenue chart */}
      <Card className="cv-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-cv-ink">Revenue Over Time</CardTitle>
              <p className="text-xs text-cv-muted mt-0.5">Monthly platform revenue ({range})</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end justify-between gap-2 h-56 pt-4">
            {chartData.map((d, i) => {
              const heightPct = (d.revenue / maxValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end justify-center relative">
                    <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-cv-ink whitespace-nowrap">
                      {fmtMoney(d.revenue)}
                    </div>
                    <div className="w-full max-w-[56px] rounded-t-lg bg-cv-ink hover:bg-cv-red transition-colors" style={{ height: `${Math.max(heightPct, 4)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-cv-muted">{d.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top partners & storefronts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Top Partners by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPartners.map((p) => (
                  <TableRow key={p.id} className="border-cv-line">
                    <TableCell className="text-sm font-bold text-cv-ink">{p.name}</TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="cv-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Top Storefronts by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-cv-line">
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                  <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStorefronts.map((s) => (
                  <TableRow key={s.id} className="border-cv-line">
                    <TableCell className="text-sm font-bold text-cv-ink">{s.name}</TableCell>
                    <TableCell>
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
                        s.status === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200')}>
                        <span className={cn('h-1.5 w-1.5 rounded-full', s.status === 'LIVE' ? 'bg-emerald-500' : 'bg-gray-400')} />
                        {s.status === 'LIVE' ? 'Live' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(s.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
