'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, ArrowLeftRight, Percent, Users, Store, Download, Calendar, TrendingUp, Network, Wallet, Check, Clock, X } from 'lucide-react';
import { adminPerformanceData, mockPartners, mockStorefronts, mockConversions, mockCommissions, mockPayouts, mockNetworks, mockReportSummaries } from '@/data/mock';
import { cn } from '@/lib/utils';

type TimeRange = '7D' | '30D' | '90D' | 'ALL';
type ReportTab = 'partners' | 'storefronts' | 'conversions' | 'revenue' | 'commissions' | 'payouts' | 'networks';

const fmtMoney = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const tabConfig: { value: ReportTab; label: string }[] = [
  { value: 'partners', label: 'Partners' },
  { value: 'storefronts', label: 'Storefronts' },
  { value: 'conversions', label: 'Conversions' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'commissions', label: 'Commissions' },
  { value: 'payouts', label: 'Payouts' },
  { value: 'networks', label: 'Networks' },
];

export default function AdminReportsPage() {
  const [range, setRange] = useState<TimeRange>('30D');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const chartData = adminPerformanceData;
  const maxValue = Math.max(...chartData.map((d) => d.revenue));

  const topPartners = [...mockPartners].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topStorefronts = [...mockStorefronts].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const s = mockReportSummaries;

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

      {/* Global summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Revenue" value={fmtMoney(s.revenue.total)} icon={DollarSign} trend={`+${s.revenue.monthlyGrowth}%`} trendUp />
        <StatCard label="Conversions" value={s.conversions.total} icon={ArrowLeftRight} trend="+12%" trendUp />
        <StatCard label="Commissions" value={fmtMoney(s.commissions.total)} icon={Percent} trend="+15%" trendUp />
        <StatCard label="Partners" value={s.partners.total} icon={Users} description={`${s.partners.active} active`} />
        <StatCard label="Storefronts" value={s.storefronts.total} icon={Store} description={`${s.storefronts.live} live`} />
      </div>

      {/* Revenue chart */}
      <Card className="cv-card">
        <CardHeader className="pb-4">
          <div>
            <CardTitle className="text-base font-bold text-cv-ink">Revenue Over Time</CardTitle>
            <p className="text-xs text-cv-muted mt-0.5">Monthly platform revenue ({range})</p>
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

      {/* Detailed report tabs */}
      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList className="bg-cv-soft rounded-2xl p-1.5 h-auto flex flex-wrap gap-1">
          {tabConfig.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="rounded-xl px-3.5 py-2 data-[state=active]:bg-white data-[state=active]:text-cv-ink data-[state=active]:shadow-sm text-cv-muted font-bold text-sm">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Partners report */}
        <TabsContent value="partners" className="mt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Partners" value={s.partners.total} icon={Users} />
            <StatCard label="Active" value={s.partners.active} icon={Check} description="Currently active" />
            <StatCard label="Pending" value={s.partners.pending} icon={Clock} description="Awaiting approval" />
            <StatCard label="Suspended" value={s.partners.suspended} icon={X} description="Suspended accounts" />
          </div>
          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Partner Breakdown</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-cv-soft p-3 text-center"><p className="text-xs font-bold uppercase text-cv-muted">Creators</p><p className="text-2xl font-bold text-cv-ink mt-1">{s.partners.creators}</p></div>
                <div className="rounded-xl bg-cv-soft p-3 text-center"><p className="text-xs font-bold uppercase text-cv-muted">Businesses</p><p className="text-2xl font-bold text-cv-ink mt-1">{s.partners.businesses}</p></div>
                <div className="rounded-xl bg-cv-soft p-3 text-center"><p className="text-xs font-bold uppercase text-cv-muted">Networks</p><p className="text-2xl font-bold text-cv-ink mt-1">{s.partners.networks}</p></div>
              </div>
              <Table>
                <TableHeader><TableRow className="border-cv-line"><TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Type</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead></TableRow></TableHeader>
                <TableBody>
                  {topPartners.map((p) => (
                    <TableRow key={p.id} className="border-cv-line">
                      <TableCell className="text-sm font-bold text-cv-ink">{p.name}</TableCell>
                      <TableCell className="text-sm text-cv-body">{p.type.charAt(0) + p.type.slice(1).toLowerCase()}</TableCell>
                      <TableCell><StatusBadge status={p.status.toLowerCase() as 'active' | 'pending' | 'suspended'} /></TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{p.conversions}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storefronts report */}
        <TabsContent value="storefronts" className="mt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Storefronts" value={s.storefronts.total} icon={Store} />
            <StatCard label="Live" value={s.storefronts.live} icon={Check} description="Published" />
            <StatCard label="Draft" value={s.storefronts.draft} icon={Clock} description="Not published" />
            <StatCard label="Total Visitors" value={s.storefronts.totalVisitors.toLocaleString()} icon={Users} description="All storefronts" />
          </div>
          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Top Storefronts by Revenue</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader><TableRow className="border-cv-line"><TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Visitors</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead></TableRow></TableHeader>
                <TableBody>
                  {topStorefronts.map((st) => (
                    <TableRow key={st.id} className="border-cv-line">
                      <TableCell className="text-sm font-bold text-cv-ink">{st.name}</TableCell>
                      <TableCell><StatusBadge status={st.status === 'LIVE' ? 'active' : 'draft'} label={st.status === 'LIVE' ? 'Live' : 'Draft'} /></TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{st.visitors.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{st.conversions}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(st.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversions report */}
        <TabsContent value="conversions" className="mt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Conversions" value={s.conversions.total} icon={ArrowLeftRight} trend="+12%" trendUp />
            <StatCard label="Approved" value={s.conversions.approved} icon={Check} description="Approved conversions" />
            <StatCard label="Pending" value={s.conversions.pending} icon={Clock} description="Awaiting review" />
            <StatCard label="Avg Value" value={fmtMoney(s.conversions.avgValue)} icon={DollarSign} description="Per conversion" />
          </div>
          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Recent Conversions</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader><TableRow className="border-cv-line"><TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockConversions.slice(0, 8).map((c) => (
                    <TableRow key={c.id} className="border-cv-line">
                      <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                      <TableCell className="text-sm font-bold text-cv-ink">{c.partnerName}</TableCell>
                      <TableCell className="text-sm text-cv-body">{c.plan}</TableCell>
                      <TableCell><StatusBadge status={c.status === 'APPROVED' ? 'active' : c.status === 'PENDING' ? 'pending' : 'suspended'} label={c.status.charAt(0) + c.status.slice(1).toLowerCase()} /></TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.saleAmount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue report */}
        <TabsContent value="revenue" className="mt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Revenue" value={fmtMoney(s.revenue.total)} icon={DollarSign} trend={`+${s.revenue.monthlyGrowth}%`} trendUp />
            <StatCard label="Avg / Storefront" value={fmtMoney(s.revenue.avgPerStorefront)} icon={Store} description="Live storefronts" />
            <StatCard label="Top Plan" value={s.revenue.topPlan} icon={TrendingUp} description="By conversion count" />
            <StatCard label="Monthly Growth" value={`+${s.revenue.monthlyGrowth}%`} icon={TrendingUp} trendUp description="Month over month" />
          </div>
          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Revenue by Storefront</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader><TableRow className="border-cv-line"><TableHead className="text-xs font-bold uppercase text-cv-muted">Storefront</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead></TableRow></TableHeader>
                <TableBody>
                  {topStorefronts.map((st) => {
                    const partner = mockPartners.find((p) => p.id === st.partnerId);
                    return (
                      <TableRow key={st.id} className="border-cv-line">
                        <TableCell className="text-sm font-bold text-cv-ink">{st.name}</TableCell>
                        <TableCell className="text-sm text-cv-body">{partner?.name ?? '—'}</TableCell>
                        <TableCell className="text-right text-sm text-cv-body">{st.conversions}</TableCell>
                        <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(st.revenue)}</TableCell>
                        <TableCell className="text-right text-sm text-cv-body">{fmtMoney(st.commission)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions report */}
        <TabsContent value="commissions" className="mt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Commissions" value={fmtMoney(s.commissions.total)} icon={Percent} trend="+15%" trendUp />
            <StatCard label="Approved" value={fmtMoney(s.commissions.approved)} icon={Check} description="Approved amount" />
            <StatCard label="Pending" value={fmtMoney(s.commissions.pending)} icon={Clock} description="Awaiting approval" />
            <StatCard label="Avg Rate" value={`${s.commissions.avgRate}%`} icon={Percent} description="Across all partners" />
          </div>
          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Commission History</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader><TableRow className="border-cv-line"><TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Plan</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Commission</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockCommissions.slice(0, 8).map((c) => (
                    <TableRow key={c.id} className="border-cv-line">
                      <TableCell className="text-xs text-cv-muted">{fmtDate(c.date)}</TableCell>
                      <TableCell className="text-sm font-bold text-cv-ink">{c.partnerName}</TableCell>
                      <TableCell className="text-sm text-cv-body">{c.plan}</TableCell>
                      <TableCell><StatusBadge status={c.status === 'APPROVED' ? 'active' : c.status === 'PENDING' ? 'pending' : 'suspended'} label={c.status.charAt(0) + c.status.slice(1).toLowerCase()} /></TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(c.commission)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts report */}
        <TabsContent value="payouts" className="mt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Payouts" value={fmtMoney(s.payouts.total)} icon={Wallet} />
            <StatCard label="Paid" value={fmtMoney(s.payouts.paid)} icon={Check} description="Completed payouts" />
            <StatCard label="Pending" value={fmtMoney(s.payouts.pending)} icon={Clock} description="Awaiting processing" />
            <StatCard label="Payout Count" value={s.payouts.count} icon={Wallet} description="Total transactions" />
          </div>
          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Payout History</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader><TableRow className="border-cv-line"><TableHead className="text-xs font-bold uppercase text-cv-muted">Date</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Partner</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Method</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockPayouts.map((p) => (
                    <TableRow key={p.id} className="border-cv-line">
                      <TableCell className="text-xs text-cv-muted">{fmtDate(p.date)}</TableCell>
                      <TableCell className="text-sm font-bold text-cv-ink">{p.partnerName}</TableCell>
                      <TableCell className="text-sm text-cv-body">{p.method.charAt(0) + p.method.slice(1).toLowerCase()}</TableCell>
                      <TableCell><StatusBadge status={p.status === 'PAID' ? 'active' : 'pending'} label={p.status.charAt(0) + p.status.slice(1).toLowerCase()} /></TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(p.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Networks report */}
        <TabsContent value="networks" className="mt-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Networks" value={s.networks.total} icon={Network} />
            <StatCard label="Network Partners" value={s.networks.totalPartners} icon={Users} description="Active sub-partners" />
            <StatCard label="Network Revenue" value={fmtMoney(s.networks.totalRevenue)} icon={DollarSign} trend="+18%" trendUp />
            <StatCard label="Network Earnings" value={fmtMoney(s.networks.totalEarnings)} icon={TrendingUp} description="Network share" />
          </div>
          <Card className="cv-card">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold text-cv-ink">Network Performance</CardTitle></CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader><TableRow className="border-cv-line"><TableHead className="text-xs font-bold uppercase text-cv-muted">Network</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Owner</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted">Status</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Partners</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Conversions</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Revenue</TableHead><TableHead className="text-xs font-bold uppercase text-cv-muted text-right">Earnings</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockNetworks.map((n) => (
                    <TableRow key={n.id} className="border-cv-line">
                      <TableCell className="text-sm font-bold text-cv-ink">{n.name}</TableCell>
                      <TableCell className="text-sm text-cv-body">{n.ownerName}</TableCell>
                      <TableCell><StatusBadge status={n.status.toLowerCase() as 'active' | 'pending' | 'suspended'} /></TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{n.activePartnerCount}</TableCell>
                      <TableCell className="text-right text-sm text-cv-body">{n.conversions}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-ink">{fmtMoney(n.revenue)}</TableCell>
                      <TableCell className="text-right text-sm font-bold text-cv-good">{fmtMoney(n.networkEarnings)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
