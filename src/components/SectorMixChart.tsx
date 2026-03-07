"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getCpvDescription } from '@/utils/cpv-data';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorStat {
  cpv_division: string;
  total_revenue?: number; // Competitor
  total_spend?: number;   // Buyer
  total_wins?: number;    // Competitor
  total_contracts?: number; // Buyer
  win_rate_pct?: number;  // Competitor
  avg_bidder_count?: number; // Buyer
}

interface SectorMixChartProps {
  sectorStats: SectorStat[];
}

export function SectorMixChart({ sectorStats }: SectorMixChartProps) {
  const t = useTranslations('intelligence.competitors');
  const locale = useLocale();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = sectorStats
    .slice(0, 15) // Top 15 now
    .map(s => ({
      name: getCpvDescription(s.cpv_division, locale),
      value: s.total_revenue || s.total_spend || 0,
      count: s.total_wins || s.total_contracts || 0,
      secondaryMetric: s.win_rate_pct || s.avg_bidder_count || 0,
      isBuyer: s.total_spend !== undefined
    }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  const formatValue = (val: number) => {
    if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `€${(val / 1000).toFixed(0)}k`;
    return `€${val}`;
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[220px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
        <div className="h-[220px] shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={5}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        itemStyle={{fontSize: '12px', fontWeight: 600, color: '#1e293b'}}
                        formatter={(value: number | string | Array<number | string> | undefined, name: number | string | undefined, props: any) => [
                            <div key={String(name)} className="flex flex-col gap-1">
                                <span>{formatValue(Number(value) || 0)}</span>
                                <span className="text-[10px] text-zinc-500">
                                    {props.payload.count} {props.payload.isBuyer ? t('contracts') : t('wins')} • {
                                        props.payload.isBuyer 
                                            ? `${props.payload.secondaryMetric.toFixed(1)} ${t('bidders')}` 
                                            : `${props.payload.secondaryMetric.toFixed(1)}% ${t('winRate')}`
                                    }
                                </span>
                            </div>, 
                            name
                        ]}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>

        {/* Legend List - Flexible and Scrollable */}
        <div className="mt-6 flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
            <div className="space-y-3 pb-2">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-xs font-bold text-zinc-700 truncate" title={entry.name}>
                                {entry.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[10px] font-bold text-zinc-400">{entry.count} {entry.isBuyer ? t('awards') : t('wins')}</span>
                            {entry.isBuyer ? (
                                <span className="text-[10px] font-black w-12 text-right text-blue-600">
                                    {entry.secondaryMetric.toFixed(1)} avg
                                </span>
                            ) : (
                                <span className={`text-[10px] font-black w-12 text-right ${entry.secondaryMetric > 50 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                    {entry.secondaryMetric.toFixed(1)}%
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}