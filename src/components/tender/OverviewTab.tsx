'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Brain,
  Target,
  DollarSign,
  Globe,
  Zap,
  FileText,
  ShieldCheck,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { MatchDetails, ClientProfile } from './types';

interface OverviewTabProps {
  tenderId: string;
  tender: {
    title: string;
    buyer_name: string;
    estimated_value: number;
    currency: string;
    country: string;
    description: string;
    cpv_code: string | null;
  };
  match: MatchDetails | null;
  buyerIntel: any;
  relevantCompetitors: any[];
  sectorStats: any;
  refinedAvgDiscount: number;
  refinedBidderCount: number;
  refinedVal: number;
  benchmarks: any;
  targetBid: number;
  discountPct: number;
  incumbent: string | null;
  relatedTenders: any[];
}

const DESCRIPTION_CHAR_LIMIT = 500;

function ProjectScope({ description }: { description: string }) {
  const t = useTranslations('tenders');
  const [expanded, setExpanded] = useState(false);
  const text = description || t('noDescription');
  const isLong = text.length > DESCRIPTION_CHAR_LIMIT;
  const displayText = isLong && !expanded ? text.slice(0, DESCRIPTION_CHAR_LIMIT) + '...' : text;

  return (
    <section className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <FileText size={24} className="text-blue-600" />
        {t('projectScope')}
      </h3>
      <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
        {displayText}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {expanded ? t('readLess') : t('readMore')}
        </button>
      )}
    </section>
  );
}

export function OverviewTab({
  tenderId,
  tender,
  match,
  buyerIntel,
  relevantCompetitors,
  sectorStats,
  refinedAvgDiscount,
  refinedBidderCount,
  refinedVal,
  benchmarks,
  targetBid,
  discountPct,
  incumbent,
  relatedTenders,
}: OverviewTabProps) {
  const t = useTranslations('tenders');
  const tMatches = useTranslations('matches');
  const locale = useLocale();

  const formatValue = (val: number, curr: string = 'EUR') => {
    if (!val) return t('valueNotSpecified');
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'currency',
      currency: curr || 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Strategic Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Win Probability & Match Card */}
        <div className="flex flex-col h-full">
          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-5"><Brain size={120} /></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold">{t('predictiveIntelligence')}</h3>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">{t('mlModel')}</div>
              </div>

              {match?.match_score != null ? (
                <>
                  <div className="grid grid-cols-1 gap-8 mb-10">
                    <div className="text-center group">
                      <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center relative mx-auto mb-3 transition-transform group-hover:scale-105">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                          <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * match.match_score) / 100} className="text-blue-500 transition-all duration-1000" strokeLinecap="round" />
                        </svg>
                        <span className="text-4xl font-black">{Math.round(match.match_score)}%</span>
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('companyFit')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8 border-t border-slate-800 pt-8">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase">{t('sectorExpertise')}</span>
                      <span className="text-purple-400">+{match.score_cpv || t('pending')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase">{t('strategicAlignment')}</span>
                      <span className="text-blue-400">+{match.score_strategic || t('pending')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase">{t('aiSemanticMatch')}</span>
                      <span className="text-indigo-400">+{match.score_semantic || t('pending')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase">{t('capacityFit')}</span>
                      <span className="text-emerald-400">+{match.score_capacity || t('pending')}</span>
                    </div>
                  </div>

                  <div className="flex-1"></div>

                  <div className="pt-6 border-t border-slate-800">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">{t('fitAnalysis')}</p>
                    <ul className="space-y-3">
                      {match.match_reasons?.split('|').filter((r: string) => r.trim()).map((reason: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-slate-300 leading-tight">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          {reason.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center mb-4">
                    <Brain size={32} className="text-slate-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 mb-2">{t('noMatchData')}</p>
                  <p className="text-xs text-slate-500 max-w-[240px]">{t('noMatchDataDesc')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Competition & Market Card */}
        <div className="flex flex-col h-full">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Target size={20} className="text-rose-600" />
              {t('competitiveLandscape')}
            </h3>

            <div className="space-y-6 flex-1 flex flex-col">
              {/* Incumbent Alert */}
              {incumbent ? (
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                  <div className="flex items-center gap-2 text-rose-700 font-black text-[10px] uppercase tracking-widest mb-2">
                    <AlertCircle size={14} />
                    {t('incumbentDetected')}
                  </div>
                  <p className="text-sm font-bold text-rose-900 mb-1">{incumbent}</p>
                  <p className="text-xs text-rose-600 italic">{t('renewalNotice')}</p>
                </div>
              ) : (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest mb-2">
                    <ShieldCheck size={14} />
                    {t('openField')}
                  </div>
                  <p className="text-xs text-emerald-600">{t('noIncumbent')}</p>
                </div>
              )}

              {/* Predicted Competitors */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('expectedCompetitors')}</p>
                  {relevantCompetitors !== buyerIntel?.top_winners && (
                    <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{tMatches('categories.sectorExpertise')}</span>
                  )}
                </div>
                <div className="space-y-3">
                  {relevantCompetitors?.slice(0, 3).length > 0 ? (
                    relevantCompetitors.slice(0, 3).map((w: any, i: number) => (
                      <Link key={i} href={`/intelligence/competitors?name=${encodeURIComponent(w.winner_name)}&backUrl=${encodeURIComponent('/tenders/' + tenderId)}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                            {w.winner_name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors block leading-tight">{w.winner_name}</span>
                            {w.avg_discount > 0 && (
                              <span className="text-[9px] font-medium text-slate-400">{t('avgDiscountLabel')}: <span className="text-emerald-600 font-bold">{w.avg_discount.toFixed(1)}%</span></span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 block leading-none">{w.wins} {t('wins')}</span>
                          <span className="text-[9px] font-bold text-emerald-600 uppercase">{t('topRival')}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">{t('noCompetitorData')}</p>
                  )}
                </div>
              </div>

              <div className="flex-1"></div>

              {/* Buyer DNA */}
              <div className="pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-none">{t('avgDiscount')}</p>
                      {sectorStats && <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{tMatches('categories.sectorExpertise')}</span>}
                    </div>
                    <p className={`text-xl font-black ${refinedAvgDiscount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {refinedAvgDiscount ? `${refinedAvgDiscount.toFixed(1)}%` : '—'}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{t('buyerPriceSensitivity')}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-none">{t('marketDensity')}</p>
                      {sectorStats && <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase">{tMatches('categories.sectorExpertise')}</span>}
                    </div>
                    <p className="text-xl font-black text-slate-800">{typeof refinedBidderCount === 'number' && refinedBidderCount !== 0 ? refinedBidderCount.toFixed(1) : '—'}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{t('avgBidders')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Analysis Section */}
      <section className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Target size={24} className="text-emerald-600" />
            {t('priceEngine')}
          </h3>
          <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            {t('estimateBased')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-slate-600 mb-6 font-medium leading-relaxed">
              {t('priceAnalysisDesc')}
            </p>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-3">
                  <span>{t('competitiveP25')}</span>
                  <span>{t('marketMedianP50')}</span>
                  <span>{t('highMarginP75')}</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full relative">
                  <div className="absolute inset-y-0 left-[25%] right-[25%] bg-emerald-500/20 border-x-2 border-emerald-500/40"></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 shadow-xl z-10 transition-all duration-1000"
                    style={{ left: '50%' }}
                  ></div>
                </div>
                <div className="flex justify-between mt-3 tabular-nums font-bold text-xs text-slate-500 uppercase tracking-widest">
                  <span>{formatValue((tender.estimated_value || 0) * (benchmarks ? (1 + benchmarks.p25_discount_rate) : 0.7))}</span>
                  <span className="text-blue-600 font-black">{t('targetBid')}</span>
                  <span>{formatValue((tender.estimated_value || 0) * (benchmarks ? (1 + benchmarks.p75_discount_rate) : 1.2))}</span>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                  <TrendingDown size={20} />
                </div>
                <div>
                  <p className="font-bold text-blue-900 mb-1">{t('recStrategy')}</p>
                  <p className="text-sm text-blue-700">
                    {t('recStrategyDesc', {
                      value: formatValue(targetBid),
                      discount: discountPct,
                      country: tender.country,
                    })}
                    {buyerIntel?.avg_discount < 0 && (
                      <span className="block mt-2 italic opacity-80">{t('buyerDiscountNote', { discount: Math.abs(Math.round(buyerIntel.avg_discount)) })}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('marketContext')}</p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{t('avgBuyerValue')}</p>
                <p className="text-lg font-black text-slate-800">{formatValue(refinedVal)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{t('buyerAvgVariation')}</p>
                <p className={`text-lg font-black ${refinedAvgDiscount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {refinedAvgDiscount ? `${refinedAvgDiscount.toFixed(1)}%` : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Scope */}
      <ProjectScope description={tender.description} />

      {/* Related Opportunities */}
      {relatedTenders.length > 0 && (
        <section className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
            <Brain size={20} className="text-blue-600" />
            {t('relatedOpportunities')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTenders.map((rt: any) => (
              <Link key={rt.tender_id} href={`/tenders/${rt.tender_uuid}?backUrl=${encodeURIComponent('/tenders/' + tenderId)}`} className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all flex flex-col h-full">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{rt.buyer_name}</p>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-3 mb-4 flex-1">{rt.title}</h4>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tabular-nums">{formatValue(rt.estimated_value, rt.currency)}</span>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
