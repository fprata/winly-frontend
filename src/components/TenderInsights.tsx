'use client';

import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle2, Sparkles, Clock, ShieldCheck, Scale, RefreshCw, AlertTriangle, Zap, Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { toast } from './ui/Toast';

interface TenderInsightsProps {
  tenderId: string;
  initialInsights?: any;
  derivedDocLink?: string | null;
}

// Safely render any insight value (string, object, or array) as readable text
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
      .filter(([_, v]) => v !== null && v !== undefined && v !== 0 && v !== 0.0)
      .map(([k, v]) => {
        const readableKey = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${readableKey}: ${typeof v === 'string' ? v : (typeof v === 'boolean' ? (v ? 'Yes' : 'No') : JSON.stringify(v))}`;
      })
      .join('\n');
  }
  return String(val);
}

export function TenderInsights({ tenderId, initialInsights, derivedDocLink }: TenderInsightsProps) {
  const t = useTranslations('tender');
  const [insights, setInsights] = useState<any>(initialInsights);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        setInsights(data.insights);
        toast("success", "AI Analysis complete!");
      } else {
        toast("error", data.error || "Failed to analyze document");
      }
    } catch (error) {
      toast("error", "An error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-blue-200 bg-blue-50/20">
        <div className="relative mb-6">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">AI is Reading Document...</h3>
        <p className="text-sm text-gray-500 max-w-xs text-center mt-3 font-medium">
          Extracting strategic bidding intelligence via the Winly Document Analytics microservice. This usually takes 15-30 seconds.
        </p>
      </Card>
    );
  }

  if (insights) {
    // If it's the old schema, fallback to old display (for backwards compatibility)
    if (insights.executive_summary && !insights.project_summary) {
       return (
        <div className="space-y-6 animate-in fade-in duration-700">
           <Card className="border-l-4 border-l-blue-600 bg-white/80 shadow-sm p-4">
             <h4 className="font-black text-xs uppercase tracking-widest text-blue-700 mb-2">Legacy Analysis</h4>
             <p className="text-sm text-slate-700 whitespace-pre-line">{insights.executive_summary}</p>
             <button onClick={runAnalysis} className="mt-4 text-xs font-bold text-blue-600 underline">Rerun Analysis for New Structured Format</button>
           </Card>
        </div>
       );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Executive Summary & Scope */}
          <Card className="border-l-4 border-l-blue-600 bg-white/80 shadow-sm md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-blue-700 border-b border-blue-50 pb-2">
              <FileText size={20} />
              <h4 className="font-black text-xs uppercase tracking-widest">Project Summary</h4>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">{renderInsightValue(insights.project_summary)}</p>
            {insights.tender_category_detected && (
               <div className="mt-3 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">
                 Category: {insights.tender_category_detected}
               </div>
            )}
          </Card>

          {/* Strategic Intelligence */}
          <Card className="border-l-4 border-l-teal-500 bg-teal-50/20 shadow-sm md:col-span-2">
            <div className="flex items-center gap-2 mb-3 text-teal-700">
              <Zap size={20} />
              <h4 className="font-black text-xs uppercase tracking-widest text-teal-800">Strategic Intelligence</h4>
            </div>
            <div className="bg-white/60 p-4 rounded-xl border border-teal-100 text-slate-800 text-sm font-semibold leading-relaxed shadow-inner">
              <ul className="list-disc pl-4 space-y-1">
                {insights.strategic_intelligence?.incumbent_vendor_mentions?.length > 0 && (
                  <li><span className="font-black">Incumbents Mentioned:</span> {insights.strategic_intelligence.incumbent_vendor_mentions.join(', ')}</li>
                )}
                {insights.strategic_intelligence?.proprietary_lockin_risks?.length > 0 && (
                  <li><span className="font-black">Lock-in Risks:</span> {insights.strategic_intelligence.proprietary_lockin_risks.join(', ')}</li>
                )}
                <li><span className="font-black">Advance Payment:</span> {insights.strategic_intelligence?.advance_payment_allowed ? 'Allowed' : 'Not Allowed'}</li>
                <li><span className="font-black">Price Revision:</span> {insights.strategic_intelligence?.price_revision_clause ? 'Allowed' : 'Not Allowed'}</li>
              </ul>
            </div>
          </Card>

          {/* Financials & Evaluation */}
          <Card className="border-l-4 border-l-violet-500 bg-white/80 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-violet-700">
              <Scale size={18} />
              <h4 className="font-black text-[10px] uppercase tracking-widest">Financials & Scoring</h4>
            </div>
            <p className="text-sm text-slate-700 font-medium whitespace-pre-line">
              <span className="font-black">Budget:</span> {insights.financials?.base_budget_value} {insights.financials?.base_budget_currency}
              <br/>
              <span className="font-black">Price Weight:</span> {insights.evaluation_criteria?.price_weight_percent}%
              <br/>
              <span className="font-black">Quality Weight:</span> {insights.evaluation_criteria?.quality_weight_percent}%
            </p>
          </Card>

          {/* Must-Have Qualifications */}
          <Card className="border-l-4 border-l-emerald-500 bg-white/80 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-emerald-700">
              <ShieldCheck size={18} />
              <h4 className="font-black text-[10px] uppercase tracking-widest">Mandatory Certifications</h4>
            </div>
            <p className="text-sm text-slate-700 font-medium whitespace-pre-line">
              • {renderInsightValue(insights.mandatory_certifications_and_licenses)}
            </p>
          </Card>

          {/* Operational Constraints */}
          <Card className="border-l-4 border-l-sky-500 bg-white/80 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-sky-700">
              <Clock size={18} />
              <h4 className="font-black text-[10px] uppercase tracking-widest">Timeline & Constraints</h4>
            </div>
            <p className="text-sm text-slate-700 font-medium whitespace-pre-line">
              <span className="font-black">Contract Duration:</span> {insights.proposal_timeline?.contract_duration_months} months
              <br/>
              <span className="font-black">Submission Deadline:</span> {insights.proposal_timeline?.submission_deadline_iso || 'Not Specified'}
              <br/>
              <span className="font-black">Demo Required:</span> {insights.proposal_timeline?.is_demo_required ? 'Yes' : 'No'}
            </p>
          </Card>

          {/* Critical Risks */}
          <Card className="border-l-4 border-l-rose-600 bg-rose-50/40 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-rose-700 font-black">
              <AlertTriangle size={18} />
              <h4 className="font-black text-[10px] uppercase tracking-widest">Risk Assessment ({insights.risk_assessment?.risk_level})</h4>
            </div>
            <div className="text-sm text-rose-900 font-bold whitespace-pre-line">
              <span className="block mb-1">Score: {insights.risk_assessment?.overall_risk_score}/10</span>
              • {renderInsightValue(insights.risk_assessment?.key_risk_factors)}
            </div>
          </Card>
        </div>
        
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 size={12} />
            VERIFIED BY WINLY MULTI-AGENT AI
          </div>
          <button 
            onClick={runAnalysis}
            className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase"
          >
            <RefreshCw size={10} />
            Refresh Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-3xl bg-blue-600 shadow-xl shadow-blue-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Sparkles className="text-white" size={28} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Strategic Document Analysis</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-8 font-medium">
        Use the Winly Document Analytics Engine to instantly read the tender PDF and extract scoring criteria, SLAs, and hidden requirements.
      </p>
      <Button 
        type="button" 
        variant="accent"
        size="lg"
        onClick={runAnalysis}
        className="px-10 py-6 rounded-2xl shadow-lg shadow-teal-200 font-black tracking-widest text-xs transition-all hover:scale-105 active:scale-95"
      >
        GENERATE STRATEGIC INSIGHTS
      </Button>
      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by Google Gemini 2.5 Flash</p>
    </Card>
  );
}
