'use client';

import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Users, Store, ArrowLeftRight, TrendingUp, CircleAlert as AlertCircle } from 'lucide-react';
import { adminDashboardStats, adminPerformanceData, mockPartners, mockConversions } from '@/data/mock';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const maxValue = Math.max(...adminPerformanceData.map(d => d.revenue));
  const topPartners = [...mockPartners].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const needsAttention = mockPartners.filter(p => p.status === 'PENDING' || p.status === 'INCOMPLETE' || p.status === 'SUSPENDED');
  const recentActivity = mockConversions.slice(0, 6);

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
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold text-cv-ink">Platform Performance</CardTitle>
          <p className="text-xs text-cv-muted mt-0.5">Revenue and conversions over time</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end justify-between gap-2 h-48 pt-4">
            {adminPerformanceData.map((d, i) => {
              const heightPct = (d.revenue / maxValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex-1 flex items-end justify-center relative">
                    <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-cv-ink whitespace-nowrap">
                      {fmtMoney(d.revenue)}
                    </div>
                    <div className="w-full max-w-[60px] rounded-t-lg bg-cv-ink hover:bg-cv-red transition-colors" style={{ height: `${Math.max(heightPct, 4)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-cv-muted">{d.date}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Partner Performance */}
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-cv-ink">Partner Performance</CardTitle>
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
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={p.name} color={p.avatarColor} size={28} />
                        <div>
                          <p className="text-sm font-bold text-cv-ink">{p.name}</p>
                          <p className="text-[10px] text-cv-muted">{p.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card className="cv-card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-cv-red" />
              <CardTitle className="text-base font-bold text-cv-ink">Needs Attention</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {needsAttention.length === 0 ? (
              <p className="text-sm text-cv-muted py-6 text-center">All partners are in good standing</p>
            ) : (
              <div className="space-y-3">
                {needsAttention.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-cv-soft">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} color={p.avatarColor} size={32} />
                      <div>
                        <p className="text-sm font-bold text-cv-ink">{p.name}</p>
                        <p className="text-xs text-cv-muted">{p.email}</p>
                      </div>
                    </div>
                    <StatusBadge status={p.status.toLowerCase() as any} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="cv-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-cv-ink">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-cv-line">
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Sale</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead>
                <TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((c) => (
                <TableRow key={c.id} className="border-cv-line">
                  <TableCell className="font-bold text-cv-ink text-sm">{c.plan}</TableCell>
                  <TableCell className="text-sm text-cv-body">{c.partnerName}</TableCell>
                  <TableCell className="text-right text-sm text-cv-body">${c.saleAmount}</TableCell>
                  <TableCell><StatusBadge status={c.status.toLowerCase() as any} /></TableCell>
                  <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
