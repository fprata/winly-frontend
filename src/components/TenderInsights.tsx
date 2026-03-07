'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText, Loader2, Sparkles, Clock, ShieldCheck, Scale,
  RefreshCw, AlertTriangle, Zap, CheckCircle2, Target,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from './ui/Button';
import { toast } from './ui/Toast';

const LOCALE_MAP: Record<string, string> = { pt: 'pt-PT', en: 'en-US' };

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

function renderInsightValue(val: any): string {
  if (val === null || val === undefined) return 'Not specified in notice.';
  if (typeof val === 'string') return val;
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'None specified.';
    return val.map(v => (typeof v === 'string' ? v : JSON.stringify(v))).join('\n• ');
  }
  if (typeof val === 'object') {
    return Object.entries(val)
      .filter(([_, v]) => v !== null && v !== undefined && v !== 0)
      .map(([k, v]) => {
        const key = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${key}: ${typeof v === 'string' ? v : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : JSON.stringify(v)}`;
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
  const t = useTranslations('tender');
  const locale = useLocale();
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
        toast("success", "AI Analysis complete!");
      } else {
        toast("error", data.error || "Failed to analyze document");
      }
    } catch {
      toast("error", "An error occurred during analysis");
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
        <h3 className="text-[16px] font-bold text-zinc-900 mb-2">Analysing document…</h3>
        <p className="text-[13px] text-zinc-500 max-w-xs text-center leading-relaxed">
          Extracting strategic bidding intelligence. This usually takes 15–30 seconds.
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
              title="Legacy Analysis"
            />
            <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-line">{insights.executive_summary}</p>
            <button onClick={runAnalysis} className="mt-4 text-[13px] font-medium text-blue-600 hover:underline">
              Rerun Analysis for new format
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
            title="Project Summary"
          />
          <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-line">
            {renderInsightValue(insights.project_summary)}
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
              title="Financials & Scoring"
            />
            <DataGroup
              label="Budget"
              value={`${insights.financials?.base_budget_value ?? '—'} ${insights.financials?.base_budget_currency ?? ''}`.trim() || '—'}
              valueClass="text-[16px] font-extrabold text-blue-600"
            />
            <DataGroup
              label="Price Weight"
              value={insights.evaluation_criteria?.price_weight_percent != null ? `${insights.evaluation_criteria.price_weight_percent}%` : '—'}
            />
            <DataGroup
              label="Quality Weight"
              value={insights.evaluation_criteria?.quality_weight_percent != null ? `${insights.evaluation_criteria.quality_weight_percent}%` : '—'}
            />
          </InsightCard>

          {/* Timeline & Constraints */}
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Clock size={16} /></div>}
              title="Timeline & Constraints"
            />
            <DataGroup
              label="Contract Duration"
              value={insights.proposal_timeline?.contract_duration_months != null ? `${insights.proposal_timeline.contract_duration_months} months` : '—'}
            />
            <DataGroup
              label="Submission Deadline"
              value={insights.proposal_timeline?.submission_deadline_iso || '—'}
            />
            <DataGroup
              label="Demo Required"
              value={insights.proposal_timeline?.is_demo_required ? 'Yes' : 'No'}
            />
          </InsightCard>

          {/* Strategic Intelligence */}
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Zap size={16} /></div>}
              title="Strategic Intelligence"
            />
            {insights.strategic_intelligence?.incumbent_vendor_mentions?.length > 0 && (
              <DataGroup
                label="Incumbents Detected"
                value={insights.strategic_intelligence.incumbent_vendor_mentions.join(', ')}
                valueClass="text-rose-600"
              />
            )}
            {insights.strategic_intelligence?.proprietary_lockin_risks?.length > 0 && (
              <DataGroup
                label="Lock-in Risks"
                value={insights.strategic_intelligence.proprietary_lockin_risks.join(', ')}
              />
            )}
            <DataGroup
              label="Advance Payment"
              value={insights.strategic_intelligence?.advance_payment_allowed ? 'Allowed' : 'Not Allowed'}
            />
            <DataGroup
              label="Price Revision Clause"
              value={insights.strategic_intelligence?.price_revision_clause ? 'Allowed' : 'Not Allowed'}
            />
          </InsightCard>

          {/* Mandatory Certifications */}
          <InsightCard>
            <CardHeader
              icon={<div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShieldCheck size={16} /></div>}
              title="Mandatory Certifications"
            />
            <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-line">
              • {renderInsightValue(insights.mandatory_certifications_and_licenses)}
            </p>
          </InsightCard>
        </div>

        {/* Risk Assessment — full width (mirrors design-preview layout) */}
        {insights.risk_assessment && (
          <InsightCard>
            <CardHeader
              icon={
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  (insights.risk_assessment.overall_risk_score ?? 5) <= 3
                    ? 'bg-emerald-50 text-emerald-600'
                    : (insights.risk_assessment.overall_risk_score ?? 5) <= 6
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-red-50 text-red-600'
                }`}>
                  <AlertTriangle size={16} />
                </div>
              }
              title="Risk Assessment"
            />
            <div className="flex gap-6 items-start">
              <div className="shrink-0 pr-6 border-r border-zinc-200">
                <div
                  className="text-[48px] font-extrabold leading-none"
                  style={{
                    color: (insights.risk_assessment.overall_risk_score ?? 5) <= 3
                      ? '#10b981'
                      : (insights.risk_assessment.overall_risk_score ?? 5) <= 6
                      ? '#f59e0b'
                      : '#dc2626',
                  }}
                >
                  {insights.risk_assessment.overall_risk_score ?? '—'}
                  <span className="text-[18px] font-medium text-zinc-400">/10</span>
                </div>
                <span
                  className="inline-block mt-2 px-3 py-1 rounded text-white text-[13px] font-bold"
                  style={{
                    backgroundColor: (insights.risk_assessment.overall_risk_score ?? 5) <= 3
                      ? '#10b981'
                      : (insights.risk_assessment.overall_risk_score ?? 5) <= 6
                      ? '#f59e0b'
                      : '#dc2626',
                  }}
                >
                  {(insights.risk_assessment.risk_level || 'UNKNOWN').toUpperCase()} RISK
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-zinc-700 mb-3">Key Risk Factors</h4>
                {Array.isArray(insights.risk_assessment.key_risk_factors) && insights.risk_assessment.key_risk_factors.length > 0 ? (
                  <ul className="space-y-2 pl-4 list-disc text-[14px] text-zinc-500 leading-relaxed">
                    {insights.risk_assessment.key_risk_factors.slice(0, 6).map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-zinc-600 leading-relaxed whitespace-pre-line">
                    {renderInsightValue(insights.risk_assessment.key_risk_factors)}
                  </p>
                )}
              </div>
            </div>
          </InsightCard>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <CheckCircle2 size={13} />
            Verified by Winly Multi-Agent AI
          </div>
          <button
            onClick={runAnalysis}
            className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCw size={13} />
            Refresh Analysis
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
      <h3 className="text-[17px] font-bold text-zinc-900 mb-2">Strategic Document Analysis</h3>
      <p className="text-[13px] text-zinc-500 max-w-sm mb-7 leading-relaxed">
        Use the Winly Document Analytics Engine to extract scoring criteria, SLAs, and hidden requirements from the tender PDF.
      </p>
      <Button
        type="button"
        variant="accent"
        size="md"
        onClick={runAnalysis}
        className="px-8"
      >
        <Sparkles size={15} />
        Generate Strategic Insights
      </Button>
      <p className="mt-4 text-[11px] text-zinc-400">Powered by Google Gemini 2.5 Flash</p>
    </div>
  );
}
