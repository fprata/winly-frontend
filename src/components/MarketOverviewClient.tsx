"use client";

import React, { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Activity, DollarSign, Building2, BarChart3, PieChart, ArrowUpRight, Filter, Layers, Trophy, TrendingUp, Users, Target } from 'lucide-react';
import { SectorMixChart } from './SectorMixChart';
import { Link, useRouter, usePathname } from '@/navigation';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCpvDescription } from '@/utils/cpv-data';
import { Select } from './ui/Select';
import { StatCard } from './ui/StatCard';
import { Card } from './ui/Card';
import { EmptyState } from './ui/EmptyState';

type TimespanOption = '3' | '6' | '12';

interface MarketHealthData {
  avgBidders: number;
  directAwardPct: number;
  avgDiscount: number;
  totalBuyers: number;
}

interface MarketOverviewClientProps {
  initialData: any;
  initialSectors: string[];
  selectedSector: string;
  topCompetitors: any[];
  marketHealth: MarketHealthData | null;
}

export function MarketOverviewClient({
  initialData,
  initialSectors,
  selectedSector,
  topCompetitors,
  marketHealth,
}: MarketOverviewClientProps) {
  const data = initialData;
  const sectors = initialSectors;

  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [timespan, setTimespan] = useState<TimespanOption>('6');

  const updateFilter = (newSector: string) => {
    const params = new URLSearchParams();
    if (newSector !== 'ALL') params.set('sector', newSector);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const formatValue = (val: number) => {
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB').format(val || 0);
  };

  const sectorStats = useMemo(() => {
    if (!data) return [];
    const rawSectors = typeof data.sector_stats_json === 'string'
      ? JSON.parse(data.sector_stats_json)
      : data.sector_stats_json;

    return (rawSectors || []).map((s: any) => ({
      cpv_division: s.division,
      total_spend: s.value,
      total_contracts: s.count,
      avg_bidder_count: 0
    }));
  }, [data]);

  const rawTrends = useMemo(() => {
    if (!data) return [];
    return typeof data.monthly_trends_json === 'string'
      ? JSON.parse(data.monthly_trends_json)
      : data.monthly_trends_json;
  }, [data]);

  const filteredTrends = useMemo(() => {
    if (!rawTrends || rawTrends.length === 0) return [];
    const months = parseInt(timespan);
    return rawTrends.slice(-months);
  }, [rawTrends, timespan]);

  const rawBuyers = useMemo(() => {
    if (!data) return [];
    return typeof data.top_buyers_json === 'string'
      ? JSON.parse(data.top_buyers_json)
      : data.top_buyers_json;
  }, [data]);

  const activeSectorCount = useMemo(() => {
    return sectorStats.length;
  }, [sectorStats]);

  const sectorOptions = [
    { value: 'ALL', label: t('allSectors') },
    ...sectors.filter(s => s !== 'ALL').map(s => ({ value: s, label: `${s} - ${getCpvDescription(s + '000000', locale)}` })),
  ];

  const timespanOptions: { value: TimespanOption; label: string }[] = [
    { value: '3', label: t('months3') },
    { value: '6', label: t('months6') },
    { value: '12', label: t('months12') },
  ];

  const timespanLabel = timespanOptions.find(o => o.value === timespan)?.label || '';

  return (
    <div className="space-y-6">

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Timespan Button Group */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-zinc-500 mr-1">{t('timespan')}</span>
          <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5">
            {timespanOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimespan(option.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timespan === option.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <Select
          options={sectorOptions}
          value={selectedSector}
          onChange={val => updateFilter(val)}
          icon={<Filter size={16} />}
          className="flex-1"
        />
      </div>

      {!data ? (
        <EmptyState
          icon={<Activity size={36} />}
          title={t('noDataAvailable')}
        />
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={<Activity size={18} />}
              label={t('stats.activeMatches')}
              value={formatNumber(data.total_active)}
              subtitle={t('activeTenders')}
              color="blue"
            />
            <StatCard
              icon={<DollarSign size={18} />}
              label={t('stats.pipelineValue')}
              value={formatValue(data.total_value)}
              subtitle={t('totalMarketOpportunity')}
              color="indigo"
            />
            <StatCard
              icon={<Target size={18} />}
              label={t('avgContractValue')}
              value={data.total_active > 0 ? formatValue(data.total_value / data.total_active) : '—'}
              subtitle={t('avgTicketSize')}
              color="green"
            />
            <StatCard
              icon={<Layers size={18} />}
              label={t('activeSectors')}
              value={formatNumber(activeSectorCount)}
              subtitle={t('sectorsCovered')}
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Sector Chart */}
            <Card className="h-[520px] flex flex-col">
              <h3 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2 shrink-0">
                <PieChart size={18} className="text-blue-600" />
                {t('activeMarketBySector')}
              </h3>
              <div className="flex-1 min-h-0">
                <SectorMixChart sectorStats={sectorStats} />
              </div>
            </Card>

            {/* Monthly Volume */}
            <Card className="h-[520px] flex flex-col">
              <h3 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <BarChart3 size={18} className="text-amber-600" />
                {t('marketVolumeTrendDynamic', { period: timespanLabel })}
              </h3>
              <div className="flex-1 w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredTrends}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fontWeight: 500, fill: '#9ca3af' }}
                      dy={8}
                    />
                    <Tooltip
                      cursor={{ fill: '#f3f4f6', radius: 4 }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)', fontSize: '13px' }}
                      formatter={(value: any) => [formatValue(value), t('totalVolume')]}
                    />
                    <Bar
                      dataKey="value"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                      barSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Top Buyers */}
          <Card>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" />
                {t('topActiveBuyers')}
              </h3>
              <Link href="/intelligence/buyers" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                {tCommon('viewAll')} <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-1 styled-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(rawBuyers || []).map((buyer: any, i: number) => (
                  <Link
                    key={i}
                    href={`/intelligence/buyers?name=${encodeURIComponent(buyer.buyer_name)}`}
                    className="p-4 bg-zinc-50 rounded-lg border border-transparent hover:border-zinc-200 hover:bg-white transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-zinc-800 text-sm line-clamp-1 pr-3 group-hover:text-blue-700 transition-colors">{buyer.buyer_name}</div>
                      <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{t('volume')}</p>
                        <p className="text-sm font-bold text-zinc-900">{formatValue(buyer.value)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{tCommon('active')}</p>
                        <p className="text-sm font-bold text-zinc-900">{buyer.count}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
          {/* Market Health */}
          {marketHealth && (
            <Card>
              <h3 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-600" />
                {t('marketHealth')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="text-center p-4 bg-zinc-50 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{t('avgBidders')}</p>
                  <p className="text-2xl font-extrabold text-zinc-900">{marketHealth.avgBidders.toFixed(1)}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{t('perTender')}</p>
                </div>
                <div className="text-center p-4 bg-zinc-50 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{t('directAwardRate')}</p>
                  <p className="text-2xl font-extrabold text-amber-600">{marketHealth.directAwardPct.toFixed(1)}%</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{t('noCompetition')}</p>
                </div>
                <div className="text-center p-4 bg-zinc-50 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{t('avgDiscount')}</p>
                  <p className="text-2xl font-extrabold text-emerald-600">{marketHealth.avgDiscount.toFixed(1)}%</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{t('belowEstimate')}</p>
                </div>
                <div className="text-center p-4 bg-zinc-50 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">{t('activeBuyers')}</p>
                  <p className="text-2xl font-extrabold text-blue-600">{formatNumber(marketHealth.totalBuyers)}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{t('uniqueEntities')}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Top Competitors */}
          {topCompetitors && topCompetitors.length > 0 && (
            <Card>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Trophy size={18} className="text-amber-500" />
                  {t('topCompetitors')}
                </h3>
                <Link href="/intelligence/competitors" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  {tCommon('viewAll')} <ArrowUpRight size={13} />
                </Link>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-1 styled-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {topCompetitors.map((comp: any, i: number) => (
                    <Link
                      key={i}
                      href={`/intelligence/competitors?name=${encodeURIComponent(comp.name)}`}
                      className="p-4 bg-zinc-50 rounded-lg border border-transparent hover:border-zinc-200 hover:bg-white transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-zinc-800 text-sm line-clamp-1 pr-3 group-hover:text-blue-700 transition-colors">{comp.name}</div>
                        <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{t('revenue')}</p>
                          <p className="text-sm font-bold text-zinc-900">{formatValue(comp.total_revenue)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{t('winRate')}</p>
                          <p className="text-sm font-bold text-zinc-900">{comp.win_rate_pct}%</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
