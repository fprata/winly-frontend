"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown, Check, TrendingDown, Trophy, AlertCircle } from 'lucide-react';
import { getCpvDescription } from '@/utils/cpv-data';
import { Link, usePathname } from '@/navigation';
import { useSearchParams } from 'next/navigation';

interface Tender {
  tender_id: string;
  cpv_code: string;
  estimated_value: number | null;
  final_contract_value: number | null;
  winners_list: any[]; // JSON structure
}

interface BuyerCompetitorAnalysisProps {
  buyerName: string;
  selectedCpvs: string[];
  initialTenders?: Tender[];
}

export function BuyerCompetitorAnalysis({ buyerName, selectedCpvs, initialTenders }: BuyerCompetitorAnalysisProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('intelligence.buyers.analysis');
  const locale = useLocale();
  const [tenders, setTenders] = useState<Tender[]>(initialTenders || []);
  const [loading, setLoading] = useState(!initialTenders);

  useEffect(() => {
    if (initialTenders) {
        setTenders(initialTenders);
        setLoading(false);
        return;
    }

    const fetchTenders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenders')
        .select('tender_id, cpv_code, estimated_value, final_contract_value, winners_list')
        .eq('buyer_name', buyerName)
        .not('final_contract_value', 'is', null);

      if (data) {
        setTenders(data);
      }
      setLoading(false);
    };

    if (buyerName) {
      fetchTenders();
    }
  }, [buyerName, initialTenders]);

  const metrics = useMemo(() => {
    if (!tenders.length) return null;

    // Filter tenders based on parent selection
    const filtered = tenders.filter(t => {
        if (selectedCpvs.length === 0) return true;
        if (!t.cpv_code) return false;
        const division = t.cpv_code.substring(0, 2);
        return selectedCpvs.includes(division);
    });

    const competitors: Record<string, { wins: number; totalValue: number; totalDiscountPct: number; countWithDiscount: number; id?: string }> = {};
    let totalDiscountSum = 0;
    let totalDiscountCount = 0;

    filtered.forEach(tender => {
        let discountPct = null;
        if (tender.estimated_value && tender.final_contract_value && tender.estimated_value > 0) {
            discountPct = ((tender.estimated_value - tender.final_contract_value) / tender.estimated_value) * 100;
            if (discountPct > -100 && discountPct < 100) {
                totalDiscountSum += discountPct;
                totalDiscountCount++;
            }
        }

        const winners = tender.winners_list;
        if (Array.isArray(winners)) {
            winners.forEach((w: any) => {
                const name = w.winner_name || "Unknown";
                if (!competitors[name]) {
                    competitors[name] = { 
                        wins: 0, 
                        totalValue: 0, 
                        totalDiscountPct: 0, 
                        countWithDiscount: 0,
                        id: w.competitor_id // Capture hashed ID if available
                    };
                }
                competitors[name].wins++;
                competitors[name].totalValue += (tender.final_contract_value || 0);
                
                if (discountPct !== null) {
                    competitors[name].totalDiscountPct += discountPct;
                    competitors[name].countWithDiscount++;
                }
            });
        }
    });

    const topCompetitors = Object.entries(competitors)
        .map(([name, stats]) => ({
            name,
            id: stats.id,
            wins: stats.wins,
            totalValue: stats.totalValue,
            avgDiscount: stats.countWithDiscount > 0 ? stats.totalDiscountPct / stats.countWithDiscount : 0
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 10);

    const overallAvgDiscount = totalDiscountCount > 0 ? totalDiscountSum / totalDiscountCount : 0;

    return {
        topCompetitors,
        overallAvgDiscount,
        tenderCount: filtered.length
    };
  }, [tenders, selectedCpvs]);

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">{t('loadingData')}</div>;
  if (!tenders.length) return null;

  return (
    <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-8 mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight text-sm">
            <Trophy size={20} className="text-amber-500" />
            {t('competitorAnalysis')}
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1 ml-7">
                {metrics ? t('basedOnRecent', { count: metrics.tenderCount }) : t('basedOnRecent', { count: 0 })}
            </p>
        </div>
      </div>

      {!metrics || metrics.tenderCount === 0 ? (
        <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Trophy size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">{t('noData')}</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KPI Card */}
        <div className="lg:col-span-1 space-y-4">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <TrendingDown size={14} /> {t('avgDiscount')}
                </p>
                <div className="flex items-baseline gap-2">
                    <p className={`text-4xl font-black tabular-nums ${metrics.overallAvgDiscount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {metrics.overallAvgDiscount.toFixed(1)}%
                    </p>
                    <span className="text-xs font-bold text-slate-400">{t('overall')}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-2 leading-relaxed">
                    {t('discountExplanation')}
                </p>
            </div>
            
            {metrics.overallAvgDiscount > 20 && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                    <AlertCircle size={20} className="text-amber-500 shrink-0" />
                    <p className="text-xs font-bold text-amber-800 leading-tight">
                        {t('highDiscountAlert')}
                    </p>
                </div>
            )}
        </div>

        {/* Competitors List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('competitorName')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('wins')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('revenue')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('avgDisc')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {metrics.topCompetitors.map((comp, i) => {
                        const fromTender = searchParams.get('fromTender');
                        const params = new URLSearchParams();
                        if (fromTender) params.set('fromTender', fromTender);
                        params.set('backUrl', `${pathname}?${searchParams.toString()}`);

                        return (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <Link 
                                    href={`/intelligence/competitors/${encodeURIComponent(comp.id || comp.name)}?${params.toString()}`}
                                    className="text-xs font-bold text-slate-700 truncate max-w-[200px] hover:text-blue-600 hover:underline block" 
                                    title={comp.name}
                                >
                                    {comp.name}
                                </Link>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-black">{comp.wins}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <p className="text-xs font-bold text-slate-600">
                                    {new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(comp.totalValue)}
                                </p>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <p className={`text-xs font-black ${comp.avgDiscount > metrics.overallAvgDiscount ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {comp.avgDiscount.toFixed(1)}%
                                </p>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
      </div>
      )}
    </div>
  );
}