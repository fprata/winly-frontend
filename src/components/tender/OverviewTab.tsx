'use client';

import React, { useState } from 'react';
import {
  FileText,
  Target,
  Building2,
  BarChart3,
  Link2,
  Download,
  Sparkles,
  ListChecks,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  FileDown,
  HelpCircle,
  Lock,
  Loader2,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { toast } from '../ui/Toast';
import type { UserTier } from './types';

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
    procedure_type?: string | null;
    submission_deadline?: string | null;
    publication_date?: string | null;
    source_system?: string | null;
    tender_id?: string | null;
  };
  match: any | null;
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
  riskScore?: number | null;
  riskLevel?: string | null;
  riskFactors?: any;
  userTier?: UserTier;
}

function DataGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{label}</span>
      <div className="font-semibold text-zinc-900 leading-snug">{children}</div>
    </div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-zinc-200">
      {icon}
      <h3 className="text-[15px] font-bold text-zinc-900">{title}</h3>
    </div>
  );
}

function IconBox({ color, children }: { color: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber'; children: React.ReactNode }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[color]}`}>
      {children}
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5 last:mb-0">
      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider w-[90px] shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }} />
      </div>
      <span className="text-[13px] font-bold text-zinc-900 w-7 text-right tabular-nums">{Math.round(value)}</span>
    </div>
  );
}

const DESCRIPTION_CHAR_LIMIT = 600;

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
  riskScore,
  riskLevel,
  riskFactors,
  userTier,
}: OverviewTabProps) {
  const t = useTranslations('tenders');
  const locale = useLocale();
  const [descExpanded, setDescExpanded] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingQuestions, setExportingQuestions] = useState(false);

  const isPro = userTier === 'Professional' || userTier === 'Enterprise';

  const formatValue = (val: number, curr: string = 'EUR') => {
    if (!val) return t('valueNotSpecified');
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'currency', currency: curr || 'EUR', maximumFractionDigits: 0,
    }).format(val);
  };

  const daysLeft = tender.submission_deadline
    ? Math.ceil((new Date(tender.submission_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const description = tender.description || t('noDescription');
  const isLongDesc = description.length > DESCRIPTION_CHAR_LIMIT;
  const displayDesc = isLongDesc && !descExpanded ? description.slice(0, DESCRIPTION_CHAR_LIMIT) + '...' : description;

  const riskColor = riskScore == null ? '' : riskScore <= 3 ? '#10b981' : riskScore <= 6 ? '#f59e0b' : '#dc2626';
  const riskBg = riskScore == null ? '' : riskScore <= 3 ? 'bg-emerald-500' : riskScore <= 6 ? 'bg-amber-500' : 'bg-rose-600';
  const riskLabel = riskScore == null ? '' : riskScore <= 3 ? 'LOW RISK' : riskScore <= 6 ? 'MEDIUM RISK' : 'HIGH RISK';

  const handleExportPdf = async () => {
    if (!isPro) return;
    setExportingPdf(true);
    try {
      const res = await fetch('/api/export/insights-pdf', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `tender-insights-${tenderId}.pdf`; a.click();
      URL.revokeObjectURL(url);
      toast('success', t('export.downloadReady'));
    } catch { toast('error', t('export.exportError')); }
    finally { setExportingPdf(false); }
  };

  const handleExportQuestions = async () => {
    if (!isPro) return;
    setExportingQuestions(true);
    try {
      const res = await fetch('/api/export/questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `tender-questions-${tenderId}.json`; a.click();
      URL.revokeObjectURL(url);
      toast('success', t('export.downloadReady'));
    } catch { toast('error', t('export.exportError')); }
    finally { setExportingQuestions(false); }
  };

  return (
    <div className="space-y-4">

      {/* Row 1: Key Details + Match Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Key Details */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <CardHeader icon={<IconBox color="blue"><FileText size={16} /></IconBox>} title={t('keyDetails')} />
          <DataGroup label={t('authority')}>
            <Link
              href={`/intelligence/buyers?name=${encodeURIComponent(tender.buyer_name)}&fromTender=${tenderId}&backUrl=${encodeURIComponent('/tenders/' + tenderId)}`}
              className="text-blue-600 hover:underline font-semibold"
            >
              {tender.buyer_name}
            </Link>
          </DataGroup>
          {tender.procedure_type && (
            <DataGroup label={t('procedureType')}>{tender.procedure_type}</DataGroup>
          )}
          <DataGroup label={t('financials')}>
            <span className="text-[20px] font-extrabold text-blue-600">{formatValue(tender.estimated_value, tender.currency)}</span>
          </DataGroup>
          {tender.submission_deadline && (
            <DataGroup label={t('submissionDeadline')}>
              <span style={{ color: daysLeft !== null && daysLeft <= 14 ? '#b45309' : undefined, fontWeight: daysLeft !== null && daysLeft <= 14 ? 700 : undefined }}>
                {new Date(tender.submission_deadline).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                {daysLeft !== null && daysLeft > 0 && ` (${daysLeft}d)`}
              </span>
            </DataGroup>
          )}
          {tender.publication_date && (
            <DataGroup label={t('publicationDate')}>
              {new Date(tender.publication_date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB')}
            </DataGroup>
          )}
          {tender.source_system && (
            <DataGroup label={t('source')}>{tender.source_system}{tender.tender_id ? ` — ${tender.tender_id}` : ''}</DataGroup>
          )}
        </div>

        {/* Match Analysis */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <CardHeader icon={<IconBox color="indigo"><Target size={16} /></IconBox>} title={t('matchAnalysis')} />

          {match?.match_score != null ? (
            <>
              <div className="flex gap-6 mb-5">
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{t('overallScore')}</span>
                  <span className="text-[20px] font-extrabold text-blue-600">{Math.round(match.match_score)} / 100</span>
                </div>
                {match.win_probability > 0 && (
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{t('winProbability')}</span>
                    <span className="text-[20px] font-extrabold text-emerald-600">{Math.round(match.win_probability)}%</span>
                  </div>
                )}
              </div>
              <div>
                {match.score_cpv > 0 && <ScoreBar label="CPV" value={match.score_cpv} color="#8b5cf6" />}
                {match.score_location > 0 && <ScoreBar label={t('location')} value={match.score_location} color="#f59e0b" />}
                {match.score_capacity > 0 && <ScoreBar label={t('capacity')} value={match.score_capacity} color="#0ea5e9" />}
                {match.score_keyword > 0 && <ScoreBar label={t('keyword')} value={match.score_keyword} color="#10b981" />}
                {match.score_market_opp > 0 && <ScoreBar label={t('marketOpp')} value={match.score_market_opp} color="#a1a1aa" />}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target size={32} className="text-zinc-200 mb-3" />
              <p className="text-sm text-zinc-400 font-medium">{t('noMatchData')}</p>
              <p className="text-xs text-zinc-300 mt-1">{t('noMatchDataDesc')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Project Scope */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <CardHeader icon={<IconBox color="blue"><FileText size={16} /></IconBox>} title={t('projectScope')} />
        <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-wrap">{displayDesc}</p>
        {isLongDesc && (
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            {descExpanded ? t('readLess') : t('readMore')}
          </button>
        )}
      </div>

      {/* Row 3: Buyer Profile + Pricing Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Buyer Profile */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <CardHeader icon={<IconBox color="blue"><Building2 size={16} /></IconBox>} title={t('buyerProfile')} />
          <DataGroup label={t('authority')}>{tender.buyer_name}</DataGroup>
          <div className="flex gap-5 mt-3">
            {buyerIntel?.total_contracts > 0 && (
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{t('totalContracts')}</span>
                <span className="text-[20px] font-extrabold text-zinc-900">{buyerIntel.total_contracts}</span>
              </div>
            )}
            {refinedAvgDiscount > 0 && (
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{t('avgDiscount')}</span>
                <span className="text-[20px] font-extrabold text-emerald-600">{refinedAvgDiscount.toFixed(1)}%</span>
              </div>
            )}
            {refinedBidderCount > 0 && (
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{t('avgBidders')}</span>
                <span className="text-[20px] font-extrabold text-zinc-900">{refinedBidderCount.toFixed(1)}</span>
              </div>
            )}
          </div>
          {relevantCompetitors.length > 0 && (
            <div className="mt-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">{t('expectedCompetitors')}</span>
              <div className="space-y-2">
                {relevantCompetitors.slice(0, 3).map((c: any, i: number) => (
                  <Link key={i} href={`/intelligence/competitors?name=${encodeURIComponent(c.winner_name)}&backUrl=${encodeURIComponent('/tenders/' + tenderId)}`}
                    className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-blue-300 hover:bg-white transition-all group text-sm"
                  >
                    <span className="font-medium text-zinc-700 group-hover:text-blue-600 transition-colors truncate">{c.winner_name}</span>
                    <span className="text-xs text-zinc-400 shrink-0 ml-2">{c.wins} {t('wins')}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4">
            <Link
              href={`/intelligence/buyers?name=${encodeURIComponent(tender.buyer_name)}&fromTender=${tenderId}&backUrl=${encodeURIComponent('/tenders/' + tenderId)}`}
              className="text-[13px] text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              {t('viewFullBuyerProfile')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Pricing Benchmark */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <CardHeader icon={<IconBox color="emerald"><BarChart3 size={16} /></IconBox>} title={t('pricingBenchmark')} />
          <DataGroup label={t('targetBidRecommended')}>
            <span className="text-[20px] font-extrabold text-blue-600">{formatValue(targetBid)}</span>
          </DataGroup>
          {benchmarks && (
            <DataGroup label={t('historicalRange')}>
              <div className="flex gap-4 mt-1">
                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase block">LOW</span>
                  <span className="text-base font-bold">{formatValue(tender.estimated_value * (1 + (benchmarks.p25_discount_rate || -0.2)))}</span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase block">MEDIAN</span>
                  <span className="text-base font-bold">{formatValue(tender.estimated_value * (1 + (benchmarks.median_discount_rate || -0.1)))}</span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 font-semibold uppercase block">HIGH</span>
                  <span className="text-base font-bold">{formatValue(tender.estimated_value)}</span>
                </div>
              </div>
            </DataGroup>
          )}
          <DataGroup label={t('incumbentDetected')}>
            {incumbent ? (
              <span className="flex items-center gap-2">
                {incumbent}
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 text-xs font-medium">{t('activeIncumbent')}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                <ShieldCheck size={14} /> {t('openField')}
              </span>
            )}
          </DataGroup>
        </div>
      </div>

      {/* Row 4: Risk Assessment */}
      {riskScore != null && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <CardHeader
            icon={<div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600"><ShieldCheck size={16} /></div>}
            title={t('riskAssessment')}
          />
          <div className="flex gap-6 items-start">
            <div className="shrink-0 border-r border-zinc-200 pr-6">
              <div className="text-[48px] font-extrabold leading-none mb-2" style={{ color: riskColor }}>
                {riskScore}<span className="text-[18px] text-zinc-400 font-medium">/10</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded text-white text-[13px] font-bold ${riskBg}`}>
                {riskLevel?.toUpperCase() || riskLabel}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-zinc-700 mb-3">{t('keyRiskFactors')}</h4>
              {Array.isArray(riskFactors) && riskFactors.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1.5">
                  {riskFactors.map((f: string, i: number) => (
                    <li key={i} className="text-sm text-zinc-500 leading-snug">{f}</li>
                  ))}
                </ul>
              ) : typeof riskFactors === 'string' ? (
                <p className="text-sm text-zinc-500">{riskFactors}</p>
              ) : (
                <p className="text-sm text-zinc-400 italic">{t('noRiskFactors')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Row 5: Actions */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <CardHeader icon={<IconBox color="blue"><Download size={16} /></IconBox>} title={t('actions')} />
        <div className="flex flex-wrap gap-3">
          {/* Analyze Documents → goes to Insights tab */}
          <Link
            href={`/tenders/${tenderId}?tab=insights`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Sparkles size={16} /> {t('analyzeDocuments')}
          </Link>

          {/* Export PDF */}
          <button
            onClick={handleExportPdf}
            disabled={!isPro || exportingPdf}
            className={`inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold transition-colors ${
              isPro ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {exportingPdf ? <Loader2 size={16} className="animate-spin" /> : isPro ? <FileDown size={16} /> : <Lock size={16} />}
            {exportingPdf ? t('export.exporting') : t('export.pdf')}
          </button>

          {/* Export Questions */}
          <button
            onClick={handleExportQuestions}
            disabled={!isPro || exportingQuestions}
            className={`inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold border transition-colors ${
              isPro ? 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50' : 'border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {exportingQuestions ? <Loader2 size={16} className="animate-spin" /> : isPro ? <ListChecks size={16} /> : <Lock size={16} />}
            {exportingQuestions ? t('export.exporting') : t('export.questions')}
          </button>
        </div>
      </div>

      {/* Row 6: Related Tenders */}
      {relatedTenders.length > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <CardHeader icon={<IconBox color="blue"><Link2 size={16} /></IconBox>} title={t('relatedOpportunities')} />
          <div className="flex flex-col gap-3">
            {relatedTenders.map((rt: any) => (
              <Link
                key={rt.tender_id}
                href={`/tenders/${rt.tender_uuid}?backUrl=${encodeURIComponent('/tenders/' + tenderId)}`}
                className="flex items-center justify-between p-3 px-4 bg-zinc-50 rounded-lg border border-zinc-200 hover:border-blue-300 hover:bg-white transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{rt.title}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {rt.country} · {formatValue(rt.estimated_value, rt.currency)} · {rt.is_active ? t('active') : t('awarded')}
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium shrink-0 ml-4">
                  {rt.similarity ? `${Math.round(rt.similarity * 100)}% ${t('similar')}` : t('related')}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
