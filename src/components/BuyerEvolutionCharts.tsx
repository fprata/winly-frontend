"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getCpvDescription } from '@/utils/cpv-data';
import { TrendingUp, PieChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TrendProps {
  competitorTrends: any[];
  sectorTrends: any[];
}

export function BuyerEvolutionCharts({ competitorTrends, sectorTrends }: TrendProps) {
  const [activeTab, setActiveTab] = useState<'competitors' | 'sectors'>('competitors');
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('intelligence.buyers.trends');
  const locale = useLocale();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatValue = (val: number) => {
    if (val >= 1000000) return `€${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `€${(val / 1000).toFixed(0)}k`;
    return `€${val}`;
  };

  // 1. Determine Key Keys (Top N Entities overall to assign colors)
  // We want consistent colors across years.
  const sourceData = activeTab === 'competitors' ? competitorTrends : sectorTrends;
  const valueKey = activeTab === 'competitors' ? 'revenue' : 'total_spend';
  const labelKey = activeTab === 'competitors' ? 'winner_name' : 'cpv_division';
  
  // Aggregate totals to find top entities globally
  const globalTotals: Record<string, number> = {};
  sourceData.forEach(d => {
    const key = d[labelKey];
    globalTotals[key] = (globalTotals[key] || 0) + (d[valueKey] || 0);
  });
  
  const topEntities = Object.entries(globalTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7) // Top 7 get specific colors
    .map(e => e[0]);

  // 2. Transform Data for Recharts
  // Group by Year
  const years = Array.from(new Set(sourceData.map(d => d.year))).sort((a, b) => a - b);
  
  const chartData = years.map(year => {
    const yearItems = sourceData.filter(d => d.year === year);
    const row: any = { year: year.toString() };
    
    let othersValue = 0;
    yearItems.forEach(item => {
      const key = item[labelKey];
      const val = item[valueKey] || 0;
      if (topEntities.includes(key)) {
        row[key] = val;
      } else {
        othersValue += val;
      }
    });
    
    if (othersValue > 0) {
      row['Others'] = othersValue;
    }
    return row;
  });

  // Colors
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];
  
  const getLabel = (key: string) => {
    if (key === 'Others') return 'Others';
    if (activeTab === 'sectors') return getCpvDescription(key, locale);
    return key;
  };

  if (!sourceData || sourceData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm overflow-hidden flex flex-col h-full items-center justify-center p-8">
        <TrendingUp size={48} className="text-zinc-200 mb-4" />
        <p className="text-zinc-400 font-bold text-sm italic">
          {t('noTrendHistory', { defaultValue: 'No strategic trend history available.' })}
        </p>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm overflow-hidden flex flex-col h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm overflow-hidden flex flex-col h-full">
        {/* Header & Tabs */}
        <div className="px-8 pt-8 pb-4 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight text-sm flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Strategic Evolution
            </h3>
            
            <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('competitors')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'competitors' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                >
                    <TrendingUp size={14} />
                    Market Share
                </button>
                <button
                    onClick={() => setActiveTab('sectors')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'sectors' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                >
                    <PieChart size={14} />
                    Sector Mix
                </button>
            </div>
        </div>

        {/* Chart Area */}
        <div className="p-6 flex-1 min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                dy={10}
              />
              <YAxis 
                tickFormatter={formatValue} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                labelStyle={{fontWeight: 900, color: '#1e293b', marginBottom: '4px'}}
                formatter={(value: any, name: any) => [formatValue(Number(value) || 0), getLabel(String(name))]}
              />
              <Legend wrapperStyle={{paddingTop: '20px', fontSize: '11px', fontWeight: 600}} />
              
              {topEntities.map((entity, index) => (
                <Bar 
                  key={entity} 
                  dataKey={entity} 
                  name={getLabel(entity)} 
                  stackId="a" 
                  fill={colors[index % colors.length]} 
                  barSize={40}
                />
              ))}
              <Bar 
                dataKey="Others" 
                name="Others" 
                stackId="a" 
                fill="#e2e8f0" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}