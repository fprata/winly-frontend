"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';

interface YearlyStat {
  year: number;
  total_revenue: number;
  market_share_pct: number;
  win_rate_pct: number;
  avg_tender_size: number;
  total_wins: number;
}

interface CompetitorEvolutionChartsProps {
  yearlyStats: YearlyStat[];
}

export function CompetitorEvolutionCharts({ yearlyStats }: CompetitorEvolutionChartsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('intelligence.competitors');
  const locale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!yearlyStats || !Array.isArray(yearlyStats) || yearlyStats.length === 0) {
    return <div className="p-8 text-center text-slate-400 italic">{t('noTrendHistory')}</div>;
  }

  // Process data for Recharts
  const data = [...yearlyStats]
    .sort((a, b) => Number(a.year) - Number(b.year))
    .map(d => ({
      ...d,
      year: d.year.toString(),
      total_revenue: Number(d.total_revenue) || 0,
      market_share_pct: Number(d.market_share_pct) || 0,
      win_rate_pct: Number(d.win_rate_pct) || 0,
      avg_tender_size: Number(d.avg_tender_size) || 0
    }));

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `€${(val / 1000).toFixed(0)}k`;
    return `€${val}`;
  };

  const formatPct = (val: number) => `${val.toFixed(1)}%`;

  if (!isMounted) {
    return (
      <div className="space-y-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 h-[400px] flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Revenue & Market Share */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 h-[400px] flex flex-col">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ml-2">
                {t('salesAndMarketShare')}
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tickFormatter={formatCurrency} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tickFormatter={formatPct} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#f97316', fontSize: 10, fontWeight: 700}} 
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{fontWeight: 900, color: '#1e293b', marginBottom: '4px'}}
                    formatter={(value: any, name: any) => [
                      name === 'Revenue' ? formatCurrency(Number(value)) : formatPct(Number(value)),
                      name
                    ]}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 600}} />
                  <Bar yAxisId="left" dataKey="total_revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="market_share_pct" name="Market Share" stroke="#f97316" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* 2. Win Efficiency */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 h-[400px] flex flex-col">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ml-2">
                {t('winEfficiency')}
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    dy={10}
                  />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tickFormatter={(val) => `${val}%`} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#10b981', fontSize: 10, fontWeight: 700}}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tickFormatter={formatCurrency} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{fontWeight: 900, color: '#1e293b', marginBottom: '4px'}}
                    formatter={(value: any, name: any) => [
                      name === 'Avg Size' ? formatCurrency(Number(value)) : `${Number(value).toFixed(1)}%`,
                      name
                    ]}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '12px', fontWeight: 600}} />
                  <Area yAxisId="left" type="monotone" dataKey="win_rate_pct" name="Win Rate" fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={3} />
                  <Bar yAxisId="right" dataKey="avg_tender_size" name="Avg Size" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
        </div>

      </div>
    </div>
  );
}