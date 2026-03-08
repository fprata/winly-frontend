import React from 'react';
import { Link } from '@/navigation'
import {
  ArrowRight, Check, Cpu, Globe, BarChart3, Users, Search, FileText,
  Target, TrendingUp, DollarSign, Building2, ShieldCheck, Sparkles,
  Zap, Lock, ChevronDown, Clock, MapPin, Star, AlertTriangle
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Winly AI | Win EU Public Procurement Contracts with AI Intelligence",
  description: "The only platform combining TED & BASE data with a 150-point AI scoring system. Win probability, competitor intelligence, price recommendations, and AI document analysis for EU public tenders.",
  openGraph: {
    title: "Winly AI | Win More EU Public Procurement Contracts",
    description: "AI-powered tender matching with 150-point scoring. Win probability, competitor intelligence, and AI document analysis for TED & BASE tenders.",
  },
}

// ─── Product UI Mockup Primitives ────────────────────────────────────────────

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-zinc-200/80 bg-white">
      <div className="bg-zinc-800 px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 bg-zinc-700 rounded text-[11px] text-zinc-400 px-3 py-1 text-center truncate">{url}</div>
      </div>
      {children}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#3b82f6' : score >= 60 ? '#f59e0b' : '#dc2626';
  return (
    <div className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center font-black text-lg shrink-0"
      style={{ borderColor: color, color }}>
      {score}
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-zinc-700 w-6 text-right">{value}</span>
    </div>
  );
}

// ─── Mockup 1: My Matches Dashboard ─────────────────────────────────────────

function MatchesMockup() {
  const matches = [
    { score: 94, title: 'IT Services & Digital Transformation Platform', buyer: 'Câmara Municipal de Lisboa', value: '€450,000', days: 8, cpv: '72000000' },
    { score: 82, title: 'Software Maintenance & Support Services', buyer: 'INEM – Instituto Nacional Emergência', value: '€230,000', days: 15, cpv: '72267000' },
    { score: 71, title: 'Cloud Infrastructure Migration Services', buyer: 'Autoridade Tributária e Aduaneira', value: '€890,000', days: 22, cpv: '72610000' },
  ];
  return (
    <BrowserFrame url="app.winly.ai/matches">
      <div className="bg-zinc-50 p-4">
        {/* Header stats */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-black text-zinc-900">My Tender Matches</h2>
            <p className="text-[10px] text-zinc-400">AI-matched procurement opportunities</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Active', value: '17' },
              { label: 'Closing Soon', value: '5' },
              { label: 'Pipeline', value: '€3.2M' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-sm font-black text-zinc-900">{s.value}</div>
                <div className="text-[9px] text-zinc-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Search bar */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-[11px] text-zinc-400 flex items-center gap-2">
            <Search size={11} className="text-zinc-300" /> Search by title, buyer, keywords…
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-[11px] text-zinc-500 font-medium">Filters</div>
        </div>
        {/* Match cards */}
        <div className="space-y-2">
          {matches.map((m, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex">
              <div className={`flex flex-col items-center justify-center px-4 py-3 border-r border-zinc-100 ${i === 0 ? 'bg-blue-50' : 'bg-zinc-50'}`}>
                <ScoreRing score={m.score} />
                <span className="text-[9px] text-zinc-400 mt-1 font-medium">MATCH</span>
              </div>
              <div className="flex-1 px-3 py-2.5">
                <p className="text-[12px] font-bold text-zinc-900 leading-snug line-clamp-1">{m.title}</p>
                <div className="flex items-center gap-1 mt-0.5 mb-1.5">
                  <Building2 size={9} className="text-zinc-400 shrink-0" />
                  <span className="text-[10px] text-zinc-500 truncate">{m.buyer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 rounded px-1.5 py-0.5">
                    <DollarSign size={8} /> {m.value}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 rounded px-1.5 py-0.5">
                    <Clock size={8} /> {m.days}d left
                  </span>
                  <span className="text-[10px] text-zinc-400 bg-zinc-100 rounded px-1.5 py-0.5">CPV {m.cpv}</span>
                </div>
              </div>
              <div className="flex items-center pr-3">
                <div className="text-[10px] font-bold text-blue-600 border border-blue-200 rounded-lg px-2 py-1 hover:bg-blue-50 cursor-pointer">View →</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-zinc-400 mt-3">Showing 3 of 17 active matches · Sorted by score</p>
      </div>
    </BrowserFrame>
  );
}

// ─── Mockup 2: Tender Intelligence (Pro) ────────────────────────────────────

function TenderIntelMockup() {
  return (
    <BrowserFrame url="app.winly.ai/tenders/6648-2025">
      <div className="bg-zinc-50 p-4">
        {/* Tender header */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
            </span>
            <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 font-bold">94% match</span>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 rounded px-2 py-0.5">Portal BASE</span>
          </div>
          <h2 className="text-sm font-black text-zinc-900 leading-snug">IT Services &amp; Digital Transformation Platform</h2>
          <p className="text-[10px] text-zinc-400 mt-0.5">Câmara Municipal de Lisboa · €450,000 · Deadline: 18 Mar 2026</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Match Analysis */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100">
              <div className="w-6 h-6 bg-indigo-50 rounded-lg flex items-center justify-center"><Target size={12} className="text-indigo-600" /></div>
              <span className="text-[11px] font-bold text-zinc-900">Match Analysis</span>
            </div>
            <div className="flex gap-4 mb-3">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wide text-zinc-400">Score</span>
                <span className="text-lg font-black text-blue-600">94 <span className="text-xs text-zinc-400 font-medium">/ 100</span></span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wide text-zinc-400">Win Prob.</span>
                <span className="text-lg font-black text-emerald-600">67%</span>
              </div>
            </div>
            <ScoreBar label="CPV" value={90} color="#8b5cf6" />
            <ScoreBar label="Location" value={100} color="#f59e0b" />
            <ScoreBar label="Capacity" value={85} color="#0ea5e9" />
            <ScoreBar label="Keyword" value={72} color="#10b981" />
          </div>

          {/* Pricing + Competitors */}
          <div className="space-y-2">
            <div className="bg-white border border-zinc-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-zinc-100">
                <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center"><BarChart3 size={12} className="text-emerald-600" /></div>
                <span className="text-[11px] font-bold text-zinc-900">Price Recommendation</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wide">Target Bid</span>
                <div className="text-base font-black text-blue-600">€387,000</div>
                <span className="text-[10px] text-zinc-500">14% below estimate · P50 strategy</span>
              </div>
              <div className="mt-2 flex gap-2">
                {[['Low', '€340k'], ['Mid', '€387k'], ['High', '€430k']].map(([l, v]) => (
                  <div key={l} className="flex-1 text-center bg-zinc-50 rounded p-1">
                    <div className="text-[9px] text-zinc-400 uppercase">{l}</div>
                    <div className="text-[10px] font-bold text-zinc-700">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-zinc-100">
                <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center"><Building2 size={12} className="text-blue-600" /></div>
                <span className="text-[11px] font-bold text-zinc-900">Buyer Profile</span>
              </div>
              <div className="flex gap-3 mb-2">
                {[['Avg Disc.', '18%', 'text-emerald-600'], ['Avg Bidders', '4.2', 'text-zinc-900']].map(([l, v, c]) => (
                  <div key={l}>
                    <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-wide">{l}</div>
                    <div className={`text-sm font-black ${c}`}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-wide mb-1">Incumbent</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck size={10} /> Open competitive field
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

// ─── Mockup 3: AI Document Insights (Pro) ────────────────────────────────────

function AIInsightsMockup() {
  return (
    <BrowserFrame url="app.winly.ai/tenders/6648-2025?tab=insights">
      <div className="bg-zinc-50 p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 border border-blue-100 rounded-lg">
          <Sparkles size={14} className="text-blue-600" />
          <div>
            <p className="text-[11px] font-bold text-blue-800">AI Analysis Complete</p>
            <p className="text-[9px] text-blue-500">Powered by Google Gemini 2.5 Flash · 47 pages analyzed</p>
          </div>
        </div>

        {/* Risk score hero */}
        <div className="bg-white border border-zinc-200 rounded-xl p-3 mb-2">
          <div className="flex items-center gap-4">
            <div className="shrink-0 border-r border-zinc-100 pr-4">
              <div className="text-4xl font-black text-amber-500 leading-none">4<span className="text-base text-zinc-400 font-medium">/10</span></div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold">MEDIUM RISK</span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-zinc-700 mb-1.5">Key Risk Factors</p>
              {[
                'Short clarification window — 5 working days only',
                'Proprietary Oracle DB dependency detected in specs',
                'Q4 deadline pressure — potential timeline risk',
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 mb-1">
                  <AlertTriangle size={9} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-[10px] text-zinc-500">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Financials */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3">
            <p className="text-[10px] font-bold text-zinc-900 mb-2 pb-1.5 border-b border-zinc-100">Financials &amp; Evaluation</p>
            {[
              ['Budget', '€450,000'],
              ['Price Weight', '35%'],
              ['Quality Weight', '65%'],
              ['Guarantee', '5%'],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between mb-1">
                <span className="text-[10px] text-zinc-400">{l}</span>
                <span className="text-[10px] font-bold text-zinc-800">{v}</span>
              </div>
            ))}
          </div>

          {/* Strategic */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3">
            <p className="text-[10px] font-bold text-zinc-900 mb-2 pb-1.5 border-b border-zinc-100">Strategic Intelligence</p>
            {[
              ['Incumbent', 'None detected'],
              ['Lock-in Risk', 'Oracle (medium)'],
              ['Advance Pay', 'Not allowed'],
              ['Duration', '12 months'],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between mb-1">
                <span className="text-[10px] text-zinc-400">{l}</span>
                <span className="text-[10px] font-bold text-zinc-800">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex gap-2">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 rounded-lg text-[11px] font-bold text-white cursor-pointer">
            <FileText size={11} /> Export PDF Report
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white border border-zinc-200 rounded-lg text-[11px] font-bold text-zinc-700 cursor-pointer">
            Export Questions
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

// ─── Mockup 4: Buyer Intelligence ────────────────────────────────────────────

function BuyerIntelMockup() {
  return (
    <BrowserFrame url="app.winly.ai/intelligence/buyers">
      <div className="bg-zinc-50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">CML</div>
          <div>
            <p className="text-sm font-black text-zinc-900">Câmara Municipal de Lisboa</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 flex items-center gap-1"><MapPin size={8} /> Portugal</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 rounded px-1.5">Verified Authority</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            ['Total Contracts', '847', 'text-zinc-900'],
            ['Total Spend', '€142M', 'text-blue-600'],
            ['Avg. Award', '€168k', 'text-zinc-700'],
            ['Avg. Bidders', '4.1', 'text-emerald-600'],
          ].map(([l, v, c]) => (
            <div key={l} className="bg-white border border-zinc-200 rounded-lg p-2 text-center">
              <div className={`text-base font-black ${c}`}>{v}</div>
              <div className="text-[9px] text-zinc-400 uppercase tracking-wide leading-tight mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 mb-2">
          <p className="text-[10px] font-bold text-zinc-900 mb-2">Top Winning Suppliers (Last 24 Months)</p>
          {[
            ['Accenture Portugal', '34 wins', '€12.4M'],
            ['Novabase', '28 wins', '€8.9M'],
            ['Indra Sistemas', '19 wins', '€6.2M'],
          ].map(([name, wins, rev]) => (
            <div key={name} className="flex items-center justify-between py-1.5 border-b border-zinc-50 last:border-0">
              <span className="text-[10px] font-semibold text-zinc-700">{name}</span>
              <div className="flex gap-2">
                <span className="text-[10px] text-zinc-400">{wins}</span>
                <span className="text-[10px] font-bold text-blue-600">{rev}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <Star size={11} className="text-blue-500" />
          <p className="text-[10px] text-blue-700 font-medium">Persona: <strong>The Open Innovator</strong> — high vendor diversity, no dominant incumbent</p>
        </div>
      </div>
    </BrowserFrame>
  );
}

// ─── Mockup 5: Competitor Intelligence ───────────────────────────────────────

function CompetitorMockup() {
  return (
    <BrowserFrame url="app.winly.ai/intelligence/competitors">
      <div className="bg-zinc-50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white font-black text-xs">NB</div>
          <div>
            <p className="text-sm font-black text-zinc-900">Novabase, S.A.</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 flex items-center gap-1"><MapPin size={8} /> Portugal</span>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-50 rounded px-1.5">Active Competitor</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            ['Total Wins', '312', 'text-zinc-900'],
            ['Win Rate', '68%', 'text-emerald-600'],
            ['Avg. Discount', '14%', 'text-blue-600'],
            ['Est. Revenue', '€48M', 'text-zinc-700'],
          ].map(([l, v, c]) => (
            <div key={l} className="bg-white border border-zinc-200 rounded-lg p-2 text-center">
              <div className={`text-base font-black ${c}`}>{v}</div>
              <div className="text-[9px] text-zinc-400 uppercase tracking-wide leading-tight mt-0.5">{l}</div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-3 mb-2">
          <p className="text-[10px] font-bold text-zinc-900 mb-2">Sector Specialization</p>
          {[
            ['IT Services', '45%'],
            ['Digital Transformation', '28%'],
            ['Cloud & Infrastructure', '19%'],
          ].map(([sec, pct]) => (
            <div key={sec} className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-zinc-500 w-32 shrink-0">{sec}</span>
              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: pct }} />
              </div>
              <span className="text-[10px] font-bold text-zinc-700">{pct}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
          <AlertTriangle size={11} className="text-rose-500" />
          <p className="text-[10px] text-rose-700 font-medium">Persona: <strong>The National Dominator</strong> — high threat, bids nationally across all sectors</p>
        </div>
      </div>
    </BrowserFrame>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How does the 150-point scoring algorithm work?',
    a: 'Each tender is scored across six dimensions: CPV sector match (how closely your services align with the procurement category), geographic relevance (your region vs. the buyer\'s location), capacity fit (whether your budget range matches the contract value), keyword semantic match (AI analysis of your service description against tender requirements), buyer openness (historical tendency to award to new vendors), and market opportunity (competition level and strategic timing). The sum is normalized to a 0–100 match score.',
  },
  {
    q: 'What data sources does Winly use?',
    a: 'Winly aggregates from TED (Tenders Electronic Daily) — the official EU procurement journal covering 30+ European countries — and BASE (Portuguese Public Contracts Portal), which publishes all Portuguese public contracts. New tenders are synchronized daily and processed through our AI pipeline within hours of publication.',
  },
  {
    q: 'What is included in the AI Document Analysis?',
    a: 'The AI Document Analysis (Pro/Enterprise) downloads the actual tender documents, extracts and organizes all key information using Google Gemini 2.5 Flash, and produces a structured report covering: project summary, budget and evaluation criteria (price vs. quality weights), submission timeline, mandatory certifications, strategic intelligence (incumbent vendors, lock-in risks, advance payment clauses), and a 0–10 risk assessment. You can also export the report as a branded PDF or generate strategic clarification questions.',
  },
  {
    q: 'How accurate is the win probability?',
    a: 'Win probability is calculated from your historical performance (if available via VAT ID), the buyer\'s award patterns for your sector (how often they switch suppliers, their average discount), the competition density (average number of bidders), and your match score. It is a data-driven estimate — not a guarantee — based on patterns observed across 100,000+ past awards. Use it as a prioritization signal, not an absolute prediction.',
  },
  {
    q: 'Can I use Winly for TED (EU-wide) tenders, or only Portuguese ones?',
    a: 'Both. Winly covers TED tenders from across the EU (30+ countries) and BASE tenders from Portugal. Your matching engine can be configured for any geography via your company profile — set your target regions, CPV codes, and budget range to receive relevant matches regardless of country.',
  },
  {
    q: 'Is there a free trial and what does it include?',
    a: 'Yes — all plans start with a 14-day free trial, no credit card required. During the trial you have full access to the plan features you selected. The free/explorer tier (no subscription) gives you access to the Tender Explorer search tool and basic match cards without scores or intelligence features.',
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Winly AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    { '@type': 'Offer', price: '149', priceCurrency: 'EUR', name: 'Starter Plan' },
    { '@type': 'Offer', price: '399', priceCurrency: 'EUR', name: 'Professional Plan' },
    { '@type': 'Offer', price: '999', priceCurrency: 'EUR', name: 'Enterprise Plan' },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '127' },
  description: 'AI-powered procurement intelligence platform for EU public tenders.',
}

export default function LandingPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900 overflow-x-hidden">
      <Navbar />

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[800px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                V3 AI Matching Engine Live
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
                Win more.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Bid smarter.</span><br />
                Know your market.
              </h1>
              <p className="text-xl text-zinc-500 mb-8 leading-relaxed">
                The only intelligence platform combining TED &amp; BASE data with a <strong className="text-zinc-700">150-point AI scoring system</strong>. Predict win probabilities, analyze competitors, and extract strategic intelligence from tender documents — automatically.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/login" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
                  Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link href="#product" className="px-8 py-4 bg-white text-zinc-700 font-bold rounded-xl text-lg border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center justify-center">
                  See how it works
                </Link>
              </div>
              <p className="text-sm text-zinc-400 font-medium">No credit card required · 14-day free trial · Cancel anytime</p>
            </div>

            {/* Hero mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl -z-10" />
              <MatchesMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─────────────────────────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              ['150+', 'AI Scoring Points'],
              ['12,000+', 'Tenders Tracked Daily'],
              ['98%', 'Noise Reduction'],
              ['€2T+', 'EU Market Coverage'],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-zinc-900 mb-1">{val}</div>
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Product Showcase ──────────────────────────────────────────────── */}
      <section id="product" className="py-24 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={12} /> Pro Intelligence Features
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">
              Everything your bid team needs, in one platform
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              From finding the right tenders to understanding exactly how to win them — see what Professional subscribers get.
            </p>
          </div>

          {/* Screenshot row 1: Tender Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Lock size={10} /> Professional Plan
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4">
                150-point score breakdown &amp; win probability
              </h3>
              <p className="text-zinc-500 text-lg mb-6 leading-relaxed">
                Every tender in your matches list gets a detailed intelligence report. See exactly <em>why</em> you scored 94 points — CPV alignment, geographic relevance, capacity fit, semantic keyword match — and your calculated win probability against this specific buyer.
              </p>
              <ul className="space-y-3">
                {[
                  'Score broken down across 6 dimensions (not just a single number)',
                  'Win probability calculated from buyer history + your profile',
                  'Price recommendation with P25 / P50 / P75 historical ranges',
                  'Incumbent detection — know if you\'re challenging a sitting supplier',
                  'Expected competitors ranked by historical wins with this buyer',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={18} className="text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <TenderIntelMockup />
            </div>
          </div>

          {/* Screenshot row 2: AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="lg:order-2">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider">
                <Lock size={10} /> Professional Plan
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4">
                AI document intelligence — in 30 seconds
              </h3>
              <p className="text-zinc-500 text-lg mb-6 leading-relaxed">
                Click "Analyze Documents" on any active tender and Winly downloads the procurement package, extracts every relevant detail using Gemini 2.5 Flash, and presents a structured intelligence report — so you never miss a hidden requirement or risk clause again.
              </p>
              <ul className="space-y-3">
                {[
                  'Risk score (0–10) with key risk factors extracted from the actual document',
                  'Financials: exact budget, price vs. quality weighting, required guarantees',
                  'Timeline: submission deadline, clarification windows, contract duration',
                  'Strategic flags: incumbent vendors, proprietary lock-ins, advance payment rules',
                  'Export as branded PDF or generate strategic clarification questions',
                ].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={18} className="text-purple-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-600">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:order-1">
              <AIInsightsMockup />
            </div>
          </div>

          {/* Screenshot row 3 & 4: Intelligence side by side */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Lock size={10} /> Professional &amp; Enterprise Plans
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4">
              Deep buyer &amp; competitor intelligence
            </h3>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              Before you bid, know exactly who you're bidding to and who you're bidding against. Winly profiles every public authority and every active competitor in the market.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-zinc-900 mb-1">Buyer DNA Profiles</h4>
                <p className="text-zinc-500 text-sm">See total spend, avg bidders, top winning suppliers, and behavioral persona classification for any public authority.</p>
              </div>
              <BuyerIntelMockup />
            </div>
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-zinc-900 mb-1">Competitor Intelligence</h4>
                <p className="text-zinc-500 text-sm">Track any competitor's win rate, sector specialization, average discount, and threat level — with persona classification.</p>
              </div>
              <CompetitorMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">Built for serious bid teams</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              Most platforms just send keyword alerts. Winly gives you the strategic intelligence to actually win.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Cpu size={22} />, color: 'bg-blue-100 text-blue-600',
                title: 'V3 AI Matching Engine',
                tag: 'All Plans',
                tagColor: 'bg-zinc-100 text-zinc-600',
                desc: 'Our 150-point algorithm scores tenders across geographic feasibility, buyer openness, CPV alignment, semantic keyword matching, and historical performance — not just keyword presence.',
              },
              {
                icon: <Globe size={22} />, color: 'bg-indigo-100 text-indigo-600',
                title: 'TED + BASE Integration',
                tag: 'All Plans',
                tagColor: 'bg-zinc-100 text-zinc-600',
                desc: 'Complete coverage of TED (30+ EU countries) and BASE (Portugal). New tenders are synced daily and scored against your profile within hours of publication.',
              },
              {
                icon: <BarChart3 size={22} />, color: 'bg-emerald-100 text-emerald-600',
                title: 'Win Probability Score',
                tag: 'Professional',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Don\'t bid blindly. See your calculated win probability based on this buyer\'s award history, your sector fit, and the competition density for similar tenders.',
              },
              {
                icon: <Search size={22} />, color: 'bg-amber-100 text-amber-600',
                title: 'Competitor Intelligence',
                tag: 'Professional',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Identify incumbents and their pricing patterns. Track national dominators, niche specialists, and rising stars before they show up in the award results against you.',
              },
              {
                icon: <DollarSign size={22} />, color: 'bg-purple-100 text-purple-600',
                title: 'Price Recommendation Engine',
                tag: 'Professional',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Maximize margins without losing bids. Get data-driven price bands (P25 / P50 / P75) derived from actual historical award values for this buyer and sector.',
              },
              {
                icon: <FileText size={22} />, color: 'bg-rose-100 text-rose-600',
                title: 'AI Document Analysis',
                tag: 'Professional',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Automatically download and analyze the tender procurement package. Extract risk scores, financial criteria, timeline constraints, and strategic flags in under 30 seconds.',
              },
              {
                icon: <Building2 size={22} />, color: 'bg-blue-100 text-blue-600',
                title: 'Buyer DNA Profiles',
                tag: 'Professional',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Every public authority profiled: total spend, avg bidders, avg discount, direct award rate, top suppliers, and behavioral persona (Open Innovator, Loyalist, Aggressive Discounter…).',
              },
              {
                icon: <ShieldCheck size={22} />, color: 'bg-emerald-100 text-emerald-600',
                title: 'Risk Assessment',
                tag: 'Professional',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Each AI analysis includes a 0–10 risk score and extracted key risk factors: proprietary lock-ins, tight clarification windows, aggressive SLAs, and incumbent strength signals.',
              },
              {
                icon: <Zap size={22} />, color: 'bg-amber-100 text-amber-600',
                title: 'Tender Chatbot Assistant',
                tag: 'Professional',
                tagColor: 'bg-blue-100 text-blue-700',
                desc: 'Ask questions about any analyzed tender in natural language. "What are the main risks?", "Who are the likely competitors?", "What price should I bid?" — grounded in the actual document.',
              },
            ].map(f => (
              <div key={f.title} className="p-7 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-px transition-all duration-200 group flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {f.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${f.tagColor}`}>{f.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">Up and running in 5 minutes</h2>
            <p className="text-zinc-500 text-lg">No integration required. No data export. Works with your existing workflow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Users size={28} />,
                color: 'bg-blue-600',
                title: 'Set up your bidding profile',
                desc: 'Enter your services, CPV codes, target budget range, and geographic focus. Optionally enter your VAT ID to auto-import historical win data and calibrate your win probability model.',
              },
              {
                step: '02',
                icon: <Cpu size={28} />,
                color: 'bg-indigo-600',
                title: 'Get AI-scored matches daily',
                desc: 'The V3 engine scores every new tender on TED and BASE against your profile using 150 data points. You receive only relevant matches — not keyword noise — sorted by match score.',
              },
              {
                step: '03',
                icon: <TrendingUp size={28} />,
                color: 'bg-emerald-600',
                title: 'Win with strategic intelligence',
                desc: 'For each opportunity: analyze the buyer\'s history, check competitor threats, get a price recommendation, and run AI document analysis on the procurement package — all in one tab.',
              },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {s.icon}
                </div>
                <div className="absolute top-2 right-0 text-6xl font-black text-zinc-100 -z-10">{s.step}</div>
                <h3 className="text-xl font-black text-zinc-900 mb-3">{s.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Strategic Intelligence / Personas ───────────────────────────── */}
      <section className="py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Users size={12} /> Market Personas Live
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Know your market<br />
                <span className="text-blue-500">before you bid</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                Winly AI fingerprints the behavioral DNA of every buyer and competitor in the EU procurement market — classifying them into strategic personas so you can predict their next move.
              </p>
              <p className="text-zinc-400 mb-10 leading-relaxed">
                Is this buyer a <strong className="text-white">Loyalist</strong> (top supplier wins 60%+ of contracts)? Or an <strong className="text-white">Open Innovator</strong> (actively diversifying)? Is that competitor a <strong className="text-white">National Dominator</strong> or a vulnerable <strong className="text-white">Local King</strong>? Knowing this changes your strategy entirely.
              </p>
              <Link href="/personas" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 group">
                Explore Market Personas <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: <Users size={28} />, color: 'text-purple-400', title: 'Buyer Archetypes', desc: '5 buyer personas classified by spending habit, openness to new vendors, and price sensitivity — from The Loyalist to The Open Innovator.' },
                { icon: <Search size={28} />, color: 'text-emerald-400', title: 'Competitor Archetypes', desc: '4 competitor personas classified by win volume, market reach, and sector specialization — from The National Dominator to The Rising Star.' },
                { icon: <Target size={28} />, color: 'text-amber-400', title: 'Ghost Bidding Prediction', desc: 'Our engine predicts which specific competitors are likely to bid on a tender before they even submit, based on behavioral patterns.', wide: true },
              ].map(c => (
                <div key={c.title} className={`p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors ${(c as any).wide ? 'sm:col-span-2' : ''}`}>
                  <div className={`${c.color} mb-4`}>{c.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-zinc-400">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">Transparent pricing</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">Choose the plan that fits your ambition. All plans include a 14-day free trial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">

            {/* Starter */}
            <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">Starter</h3>
                <p className="text-zinc-500 text-sm">For freelancers &amp; micro-businesses starting with public procurement.</p>
              </div>
              <div className="text-4xl font-black text-zinc-900 mb-2">€149<span className="text-base font-medium text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-400 mb-8">or €124/mo billed annually</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Up to 50 AI-matched tenders / month',
                  'Basic V3 match score (overall only)',
                  'Tender Explorer full-text search',
                  'Daily email digest of new matches',
                  'PT & ES market coverage',
                  '1 user seat',
                ].map(f => <li key={f} className="flex items-start gap-3 text-zinc-700 text-sm"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>)}
                {[
                  'Score breakdown & win probability',
                  'AI Document Analysis',
                  'Price recommendations',
                  'Buyer & competitor profiles',
                ].map(f => <li key={f} className="flex items-start gap-3 text-zinc-400 text-sm"><Lock size={14} className="mt-0.5 shrink-0" /> {f}</li>)}
              </ul>
              <Link href="/login" className="block w-full py-3.5 px-4 bg-zinc-100 text-zinc-700 font-bold text-center rounded-xl hover:bg-zinc-200 transition-all text-sm">
                Start Free Trial
              </Link>
            </div>

            {/* Professional */}
            <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 relative transform md:-translate-y-4 shadow-2xl flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">Most Popular</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Professional</h3>
                <p className="text-zinc-400 text-sm">For SMEs who need a competitive edge and full strategic intelligence.</p>
              </div>
              <div className="text-5xl font-black text-white mb-2">€399<span className="text-base font-medium text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-500 mb-8">or €329/mo billed annually</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Unlimited AI-matched tenders',
                  'Full 150-point score breakdown',
                  'Win probability per tender',
                  'Price recommendation engine (P25/P50/P75)',
                  'AI document analysis (Gemini 2.5 Flash)',
                  'Risk assessment — 0–10 score + key factors',
                  'Tender chatbot assistant',
                  'Export: PDF report + strategic questions',
                  'Buyer DNA profiles (all authorities)',
                  'Competitor intelligence (all companies)',
                  'Market overview & sector trends',
                  'TED + BASE full EU coverage',
                  '5 user seats',
                ].map(f => <li key={f} className="flex items-start gap-3 text-white text-sm"><Check size={16} className="text-blue-400 mt-0.5 shrink-0" /> {f}</li>)}
              </ul>
              <Link href="/login" className="block w-full py-3.5 px-4 bg-blue-600 text-white font-bold text-center rounded-xl hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-900/30">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">Enterprise</h3>
                <p className="text-zinc-500 text-sm">For consortiums, bid management teams, and mid-size firms with high pipeline volume.</p>
              </div>
              <div className="text-4xl font-black text-zinc-900 mb-2">€999<span className="text-base font-medium text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-400 mb-8">or €829/mo billed annually</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Professional',
                  'Bid/No-Bid Assistant (AI-powered)',
                  'Team collaboration tools',
                  'Pipeline CRM & bid tracking',
                  'API access & webhook integrations',
                  'Priority document analysis queue',
                  'Unlimited user seats',
                  'Custom CPV & market configurations',
                  'Dedicated account manager',
                  'White-label options',
                  'Custom data exports',
                ].map(f => <li key={f} className="flex items-start gap-3 text-zinc-700 text-sm"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>)}
              </ul>
              <Link href="/contact" className="block w-full py-3.5 px-4 bg-zinc-100 text-zinc-700 font-bold text-center rounded-xl hover:bg-zinc-200 transition-all text-sm">
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Feature comparison table */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-black text-zinc-900 text-center mb-8">Full feature comparison</h3>
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-zinc-50 border-b border-zinc-200">
                <div className="p-4 text-sm font-bold text-zinc-500">Feature</div>
                {['Starter', 'Professional', 'Enterprise'].map(p => (
                  <div key={p} className={`p-4 text-center text-sm font-bold ${p === 'Professional' ? 'text-blue-600' : 'text-zinc-900'}`}>{p}</div>
                ))}
              </div>
              {/* Rows */}
              {[
                ['Tender matching', '50/mo', 'Unlimited', 'Unlimited'],
                ['Match score (overall)', '✓', '✓', '✓'],
                ['Score breakdown (6 factors)', '—', '✓', '✓'],
                ['Win probability', '—', '✓', '✓'],
                ['Price recommendation', '—', '✓', '✓'],
                ['AI document analysis', '—', '✓', '✓'],
                ['Risk assessment', '—', '✓', '✓'],
                ['Tender chatbot', '—', '✓', '✓'],
                ['Export PDF / Questions', '—', '✓', '✓'],
                ['Buyer DNA profiles', '—', '✓', '✓'],
                ['Competitor intelligence', '—', '✓', '✓'],
                ['Market overview', '—', '✓', '✓'],
                ['User seats', '1', '5', 'Unlimited'],
                ['API access', '—', '—', '✓'],
                ['Pipeline CRM', '—', '—', '✓'],
                ['White-label', '—', '—', '✓'],
              ].map(([feat, starter, pro, ent], i) => (
                <div key={feat} className={`grid grid-cols-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}>
                  <div className="p-4 text-sm text-zinc-700 font-medium">{feat}</div>
                  {[starter, pro, ent].map((v, j) => (
                    <div key={j} className={`p-4 text-center text-sm font-semibold ${v === '✓' ? 'text-emerald-600' : v === '—' ? 'text-zinc-300' : j === 1 ? 'text-blue-600' : 'text-zinc-700'}`}>{v}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white border border-zinc-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                  {faq.q}
                  <ChevronDown size={18} className="text-zinc-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-zinc-500 leading-relaxed text-sm border-t border-zinc-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-700 opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to win your next<br />public contract?
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join bid teams across Europe who use Winly to find better opportunities, understand their competition, and bid with confidence. First 14 days free — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="px-10 py-4 bg-white text-blue-600 font-black rounded-xl text-lg hover:bg-blue-50 transition-all shadow-2xl flex items-center gap-2 group">
              Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/contact" className="px-10 py-4 bg-transparent text-white font-bold rounded-xl text-lg border-2 border-white/40 hover:border-white/80 transition-all flex items-center gap-2">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}
