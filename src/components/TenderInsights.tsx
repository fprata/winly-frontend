'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText, Loader2, Sparkles, Clock, ShieldCheck, Scale,
  RefreshCw, Zap, CheckCircle2, Layers, UserCheck, FileCheck, AlertTriangle,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from './ui/Button';
import { toast } from './ui/Toast';

const LOCALE_MAP: Record<string, string> = { pt: 'pt-PT', en: 'en-US' };

function formatCurrency(value: any, currency: any, locale: string): string {
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
  if (isNaN(num)) return '—';
  const cur = typeof currency === 'string' && currency.length === 3 ? currency : 'EUR';
  try {
    return new Intl.NumberFormat(LOCALE_MAP[locale] || 'en-US', {
      style: 'currency', currency: cur, maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${num.toLocaleString(LOCALE_MAP[locale] || 'en-US')} ${cur}`;
  }
}

function formatIsoDate(iso: any, locale: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat(LOCALE_MAP[locale] || 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(d);
}

function resolveLocalizedInsights(insights: any, locale: string): any {
  const localeKey = LOCALE_MAP[locale] || 'en-US';
  if (insights?.['pt-PT'] || insights?.['en-US']) {
    return insights[localeKey] || insights['en-US'] || insights['pt-PT'];
  }
  return insights;
}

interface TenderInsightsProps {
  tenderId: string;
  initialInsights?: any;
  derivedDocLink?: string | null;
  onInsightsGenerated?: (insights: any) => void;
}

function renderInsightValue(val: any, notSpecified = 'Not specified in notice.', noneSpecified = 'None specified.', yes = 'Yes', no = 'No'): string {
  if (val === null || val === undefined) return notSpecified;
  if (typeof val === 'string') return val;
  if (typeof val === 'boolean') return val ? yes : no;
  if (Array.isArray(val)) {
    if (val.length === 0) return noneSpecified;
    return val.map(v => (typeof v === 'string' ? v : JSON.stringify(v))).join('\n• ');
  }
  if (typeof val === 'object') {
    return Object.entries(val)
      .filter(([_, v]) => v !== null && v !== undefined && v !== 0)
      .map(([k, v]) => {
        const key = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${key}: ${typeof v === 'string' ? v : typeof v === 'boolean' ? (v ? yes : no) : JSON.stringify(v)}`;
      })
      .join('\n');
  }
  return String(val);
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-zinc-200">
      {icon}
      <h3 className="text-[15px] font-bold text-zinc-900">{title}</h3>
    </div>
  );
}

function DataGroup({ label, value, valueClass }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-zinc-400 mb-1">{label}</span>
      <span className={`font-semibold text-zinc-900 leading-snug text-[14px] ${valueClass || ''}`}>{value}</span>
    </div>
  );
}

function InsightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-zinc-200 shadow-sm p-6 ${className || ''}`}>
      {children}
    </div>
  );
}

export function TenderInsights({ tenderId, initialInsights, derivedDocLink, onInsightsGenerated }: TenderInsightsProps) {
  const t = useTranslations('tenders');
  const locale = useLocale();
  const fmtCurrency = (val: any, cur: any) => formatCurrency(val, cur, locale);
  const fmtDate = (iso: any) => formatIsoDate(iso, locale);
  const [rawInsights, setRawInsights] = useState<any>(initialInsights);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const insights = useMemo(() => resolveLocalizedInsights(rawInsights, locale), [rawInsights, locale]);
  const categoryDetected = rawInsights?.tender_category_detected;

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId, documentUrl: derivedDocLink }),
      });
      const data = await response.json();
      if (data.success) {
        setRawInsights(data.insights);
        onInsightsGenerated?.(data.insights);
        toast("success", t('insights.analysisComplete'));
      } else if (data.code === 'FREE_LIMIT') {
        toast("error", t('insights.freeLimitReached'));
      } else {
        toast("error", data.error || t('insights.analysisError'));
      }
    } catch {
      toast("error", t('insights.analysisException'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <InsightCard className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-6">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1.5 -right-1.5 animate-pulse" />
        </div>
        <h3 className="text-[16px] font-bold text-zinc-900 mb-2">{t('insights.analysing')}</h3>
        <p className="text-[13px] text-zinc-500 max-w-xs text-center leading-relaxed">
          {t('insights.analysingDesc')}
        </p>
      </InsightCard>
    );
  }

  if (rawInsights) {
    // Legacy schema fallback
    if (insights?.executive_summary && !insights?.project_summary) {
      return (
        <div className="space-y-4">
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={16} /></div>}
              title={t('insights.legacyAnalysis')}
            />
            <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-line">{insights.executive_summary}</p>
            <button onClick={runAnalysis} className="mt-4 text-[13px] font-medium text-blue-600 hover:underline">
              {t('insights.rerunAnalysis')}
            </button>
          </InsightCard>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Project Summary — full width */}
        <InsightCard>
          <CardHeader
            icon={<div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><FileText size={16} /></div>}
            title={t('insights.projectSummary')}
          />
          <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-line">
            {renderInsightValue(insights.project_summary, t('insights.notSpecified'), t('insights.noneSpecified'), t('insights.yes'), t('insights.no'))}
          </p>
          {categoryDetected && (
            <span className="mt-3 inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded border border-blue-100">
              {categoryDetected}
            </span>
          )}
        </InsightCard>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Financials & Scoring */}
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Scale size={16} /></div>}
              title={t('insights.financialsScoring')}
            />
            <DataGroup
              label={t('insights.budget')}
              value={insights.financials?.base_budget_value != null
                ? fmtCurrency(insights.financials.base_budget_value, insights.financials.base_budget_currency)
                : '—'}
              valueClass="text-[16px] font-extrabold text-blue-600"
            />
            <DataGroup
              label={t('insights.priceWeight')}
              value={insights.evaluation_criteria?.price_weight_percent != null ? `${insights.evaluation_criteria.price_weight_percent}%` : '—'}
            />
            <DataGroup
              label={t('insights.qualityWeight')}
              value={insights.evaluation_criteria?.quality_weight_percent != null ? `${insights.evaluation_criteria.quality_weight_percent}%` : '—'}
            />
          </InsightCard>

          {/* Timeline & Constraints */}
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Clock size={16} /></div>}
              title={t('insights.timelineConstraints')}
            />
            <DataGroup
              label={t('insights.contractDuration')}
              value={insights.proposal_timeline?.contract_duration_months != null ? `${insights.proposal_timeline.contract_duration_months} ${t('insights.months')}` : '—'}
            />
            <DataGroup
              label={t('submissionDeadline')}
              value={fmtDate(insights.proposal_timeline?.submission_deadline_iso)}
            />
            <DataGroup
              label={t('insights.demoRequired')}
              value={insights.proposal_timeline?.is_demo_required ? t('insights.yes') : t('insights.no')}
            />
          </InsightCard>

          {/* Strategic Intelligence */}
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Zap size={16} /></div>}
              title={t('insights.strategicIntelligence')}
            />
            {insights.strategic_intelligence?.incumbent_vendor_mentions?.length > 0 && (
              <DataGroup
                label={t('insights.incumbentsDetected')}
                value={insights.strategic_intelligence.incumbent_vendor_mentions.join(', ')}
                valueClass="text-rose-600"
              />
            )}
            {insights.strategic_intelligence?.proprietary_lockin_risks?.length > 0 && (
              <DataGroup
                label={t('insights.lockinRisks')}
                value={insights.strategic_intelligence.proprietary_lockin_risks.join(', ')}
              />
            )}
            <DataGroup
              label={t('insights.advancePayment')}
              value={insights.strategic_intelligence?.advance_payment_allowed ? t('insights.allowed') : t('insights.notAllowed')}
            />
            <DataGroup
              label={t('insights.priceRevisionClause')}
              value={insights.strategic_intelligence?.price_revision_clause ? t('insights.allowed') : t('insights.notAllowed')}
            />
          </InsightCard>

          {/* Mandatory Certifications */}
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShieldCheck size={16} /></div>}
              title={t('insights.mandatoryCertifications')}
            />
            <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-line">
              • {renderInsightValue(insights.mandatory_certifications_and_licenses, t('insights.notSpecified'), t('insights.noneSpecified'), t('insights.yes'), t('insights.no'))}
            </p>
          </InsightCard>

          {/* Eligibility & Qualification */}
          {insights.eligibility_requirements && (
            (() => {
              const elig = insights.eligibility_requirements;
              const hasData = elig.minimum_annual_turnover || (elig.years_of_experience && elig.years_of_experience > 0) || (elig.minimum_similar_projects && elig.minimum_similar_projects > 0) || (elig.minimum_team_size && elig.minimum_team_size > 0) || elig.financial_standing || (elig.other_requirements && elig.other_requirements.length > 0);
              if (!hasData) return null;
              return (
                <InsightCard>
                  <CardHeader
                    icon={<div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center"><UserCheck size={16} /></div>}
                    title={t('insights.eligibility')}
                  />
                  {elig.minimum_annual_turnover && (
                    <DataGroup label={t('insights.minTurnover')} value={elig.minimum_annual_turnover} />
                  )}
                  {elig.years_of_experience > 0 && (
                    <DataGroup label={t('insights.yearsExperience')} value={`${elig.years_of_experience} ${t('insights.years')}`} />
                  )}
                  {elig.minimum_similar_projects > 0 && (
                    <DataGroup label={t('insights.similarProjects')} value={elig.minimum_similar_projects} />
                  )}
                  {elig.minimum_team_size > 0 && (
                    <DataGroup label={t('insights.minTeamSize')} value={elig.minimum_team_size} />
                  )}
                  {elig.financial_standing && (
                    <DataGroup label={t('insights.financialStanding')} value={elig.financial_standing} />
                  )}
                  {elig.other_requirements?.length > 0 && (
                    <DataGroup label={t('insights.otherRequirements')} value={elig.other_requirements.join(', ')} />
                  )}
                </InsightCard>
              );
            })()
          )}

          {/* Subcontracting & Submission */}
          {(() => {
            const sub = insights.subcontracting_rules || {};
            const hasSub = (sub.max_subcontracting_percent && sub.max_subcontracting_percent > 0) || sub.subcontracting_restrictions || insights.submission_platform || insights.abnormally_low_price_threshold;
            if (!hasSub) return null;
            return (
              <InsightCard>
                <CardHeader
                  icon={<div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center"><FileCheck size={16} /></div>}
                  title={t('insights.subcontractingSubmission')}
                />
                {sub.max_subcontracting_percent > 0 && (
                  <DataGroup label={t('insights.maxSubcontracting')} value={`${sub.max_subcontracting_percent}%`} />
                )}
                {sub.subcontracting_restrictions && (
                  <DataGroup label={t('insights.subcontractingRestrictions')} value={sub.subcontracting_restrictions} />
                )}
                {insights.submission_platform && (
                  <DataGroup label={t('insights.submissionPlatform')} value={insights.submission_platform} />
                )}
                {insights.abnormally_low_price_threshold && (
                  <DataGroup label={t('insights.abnormallyLowThreshold')} value={insights.abnormally_low_price_threshold} />
                )}
              </InsightCard>
            );
          })()}

          {/* Contract Penalties */}
          {insights.contract_penalties?.length > 0 && (
            <InsightCard>
              <CardHeader
                icon={<div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><AlertTriangle size={16} /></div>}
                title={t('insights.contractPenalties')}
              />
              <ul className="space-y-2">
                {insights.contract_penalties.map((penalty: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-zinc-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    {penalty}
                  </li>
                ))}
              </ul>
            </InsightCard>
          )}
        </div>

        {/* Lots — full width, outside the 2-col grid */}
        {insights.lots?.length > 0 && (
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Layers size={16} /></div>}
              title={`${t('insights.lots')} (${insights.lots.length})`}
            />
            <div className="space-y-4">
              {insights.lots.map((lot: any, i: number) => (
                <div key={i} className="rounded-lg border border-zinc-200 p-4">
                  <h4 className="text-[14px] font-bold text-blue-600 mb-2">
                    {lot.lot_number}{lot.lot_title ? ` — ${lot.lot_title}` : ''}
                  </h4>
                  {lot.lot_description && (
                    <p className="text-[13px] text-zinc-600 mb-3 leading-relaxed">{lot.lot_description}</p>
                  )}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
                    {lot.lot_budget_value > 0 && (
                      <span className="text-zinc-500">
                        <span className="font-semibold text-zinc-700">{t('insights.budget')}:</span>{' '}
                        {fmtCurrency(lot.lot_budget_value, lot.lot_budget_currency)}
                      </span>
                    )}
                    {lot.lot_cpv_code && (
                      <span className="text-zinc-500">
                        <span className="font-semibold text-zinc-700">CPV:</span> {lot.lot_cpv_code}
                      </span>
                    )}
                    {lot.lot_evaluation_criteria?.price_weight_percent > 0 && (
                      <span className="text-zinc-500">
                        <span className="font-semibold text-zinc-700">{t('insights.priceWeight')}:</span> {lot.lot_evaluation_criteria.price_weight_percent}%
                      </span>
                    )}
                    {lot.lot_evaluation_criteria?.quality_weight_percent > 0 && (
                      <span className="text-zinc-500">
                        <span className="font-semibold text-zinc-700">{t('insights.qualityWeight')}:</span> {lot.lot_evaluation_criteria.quality_weight_percent}%
                      </span>
                    )}
                    {lot.lot_submission_deadline_iso && (
                      <span className="text-zinc-500">
                        <span className="font-semibold text-zinc-700">{t('submissionDeadline')}:</span> {fmtDate(lot.lot_submission_deadline_iso)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </InsightCard>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <CheckCircle2 size={13} />
            {t('insights.verifiedBy')}
          </div>
          <button
            onClick={runAnalysis}
            className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCw size={13} />
            {t('insights.refreshAnalysis')}
          </button>
        </div>
      </div>
    );
  }

  // Empty state — no insights yet
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-10 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
        <Sparkles size={22} />
      </div>
      <h3 className="text-[17px] font-bold text-zinc-900 mb-2">{t('insights.emptyTitle')}</h3>
      <p className="text-[13px] text-zinc-500 max-w-sm mb-7 leading-relaxed">
        {t('insights.emptyDesc')}
      </p>
      <Button
        type="button"
        variant="accent"
        size="md"
        onClick={runAnalysis}
        className="px-8"
      >
        <Sparkles size={15} />
        {t('insights.generate')}
      </Button>
      <p className="mt-4 text-[11px] text-zinc-400">{t('insights.poweredBy')}</p>
    </div>
  );
}
