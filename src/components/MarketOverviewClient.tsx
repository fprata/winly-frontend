"use client";

import React, { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Activity, DollarSign, Building2, Globe, BarChart3, PieChart, ArrowUpRight, Filter } from 'lucide-react';
import { SectorMixChart } from './SectorMixChart';
import { Link, useRouter, usePathname } from '@/navigation';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCpvDescription } from '@/utils/cpv-data';
import { Select } from './ui/Select';
import { StatCard } from './ui/StatCard';
import { Card } from './ui/Card';
import { EmptyState } from './ui/EmptyState';

interface MarketOverviewClientProps {
  initialData: any;
  initialCountries: string[];
  initialSectors: string[];
  selectedCountry: string;
  selectedSector: string;
}

export function MarketOverviewClient({
  initialData,
  initialCountries,
  initialSectors,
  selectedCountry,
  selectedSector,
}: MarketOverviewClientProps) {
  const data = initialData;
  const countries = initialCountries;
  const sectors = initialSectors;

  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = (newCountry: string, newSector: string) => {
    const params = new URLSearchParams();
    if (newCountry !== 'ALL') params.set('country', newCountry);
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

  const rawBuyers = useMemo(() => {
    if (!data) return [];
    return typeof data.top_buyers_json === 'string'
      ? JSON.parse(data.top_buyers_json)
      : data.top_buyers_json;
  }, [data]);

  const countryOptions = [
    { value: 'ALL', label: t('allRegions') },
    ...countries.filter(c => c !== 'ALL').map(c => ({ value: c, label: c })),
  ];

  const sectorOptions = [
    { value: 'ALL', label: t('allSectors') },
    ...sectors.filter(s => s !== 'ALL').map(s => ({ value: s, label: `${s} - ${getCpvDescription(s + '000000', locale)}` })),
  ];

  return (
    <div className="space-y-6">

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Select
          options={countryOptions}
          value={selectedCountry}
          onChange={val => updateFilter(val, selectedSector)}
          icon={<Globe size={16} />}
          className="flex-1"
        />
        <Select
          options={sectorOptions}
          value={selectedSector}
          onChange={val => updateFilter(selectedCountry, val)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              icon={<Globe size={18} />}
              label={t('marketReach')}
              value={selectedCountry === 'ALL' ? t('europe') : selectedCountry}
              subtitle={selectedCountry === 'ALL' ? t('aggregatedMarket') : t('selectedRegion')}
              color="amber"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Sector Chart */}
            <Card className="h-[520px]">
              <h3 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <PieChart size={18} className="text-blue-600" />
                {t('activeMarketBySector')}
              </h3>
              <SectorMixChart sectorStats={sectorStats} />
            </Card>

            {/* Monthly Volume */}
            <Card className="h-[520px] flex flex-col">
              <h3 className="text-base font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <BarChart3 size={18} className="text-amber-600" />
                {t('marketVolumeTrend')}
              </h3>
              <div className="flex-1 w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rawTrends || []}>
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
                    href={`/intelligence/buyers?name=${encodeURIComponent(buyer.buyer_name)}&backUrl=${encodeURIComponent('/dashboard')}`} 
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
        </>
      )}
    </div>
  );
}
