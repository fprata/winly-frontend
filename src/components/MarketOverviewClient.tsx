"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { Activity, DollarSign, Building2, Globe, BarChart3, PieChart, ArrowUpRight, Filter } from 'lucide-react';
import { SectorMixChart } from './SectorMixChart';
import { Link } from '@/navigation';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCpvDescription } from '@/utils/cpv-data';
import { Select } from './ui/Select';
import { StatCard } from './ui/StatCard';
import { Card } from './ui/Card';
import { EmptyState } from './ui/EmptyState';

export function MarketOverviewClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchFilters() {
      const { data: rows, error } = await supabase
        .from('market_overview')
        .select('country, cpv_division')
        .limit(1000); // Pagination: limit filter options

      if (error) {
        console.error("Error fetching filters:", error);
        // Non-critical, can continue without filters or with empty filters
      } else if (rows) {
        const uniqueCountries = Array.from(new Set(rows.map(r => r.country))).sort();
        const uniqueSectors = Array.from(new Set(rows.map(r => r.cpv_division))).sort();
        setCountries(uniqueCountries);
        setSectors(uniqueSectors);
      }
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true);
      setError(null);
      const { data: stats, error } = await supabase
        .from('market_overview')
        .select('*')
        .eq('country', selectedCountry)
        .eq('cpv_division', selectedSector)
        .limit(1)
        .single();

      if (error) {
         if (error.code !== 'PGRST116') { // PGRST116 is "Results contain 0 rows" which is fine (no data)
            console.error("Error fetching market data:", error);
            setError(t('errorLoadingData'));
         }
         setData(null);
      } else if (stats) {
        setData(stats);
      } else {
        setData(null);
      }
      setLoading(false);
    }
    fetchMarketData();
  }, [selectedCountry, selectedSector, t]);

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

  const countryOptions = countries.map(c => ({
    value: c,
    label: c === 'ALL' ? t('allRegions') : c
  }));

  const sectorOptions = sectors.map(s => ({
    value: s,
    label: s === 'ALL' ? t('allSectors') : `${s} - ${getCpvDescription(s + '000000', locale)}`
  }));

  if (!isMounted) return null;

  return (
    <div className="space-y-6">

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Select
          options={countryOptions}
          value={selectedCountry}
          onChange={setSelectedCountry}
          icon={<Globe size={16} />}
          className="flex-1"
        />
        <Select
          options={sectorOptions}
          value={selectedSector}
          onChange={setSelectedSector}
          icon={<Filter size={16} />}
          className="flex-1"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-zinc-100 rounded-xl" />)}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-xl bg-red-50 border border-red-100">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-red-700 underline hover:text-red-800"
          >
            {tCommon('tryAgain') || 'Try again'}
          </button>
        </div>
      ) : !data ? (
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
              <div className="flex-1 w-full min-h-0">
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
