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
import { getTranslations } from 'next-intl/server'

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

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const t = await getTranslations('landing')

  const FAQS = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
    { q: t('faq5q'), a: t('faq5a') },
    { q: t('faq6q'), a: t('faq6a') },
  ]

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
                {t('heroBadge')}
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
                {t('heroLine1')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{t('heroLine2')}</span><br />
                {t('heroLine3')}
              </h1>
              <p className="text-xl text-zinc-500 mb-8 leading-relaxed">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/login" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
                  {t('heroCta')} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link href="#product" className="px-8 py-4 bg-white text-zinc-700 font-bold rounded-xl text-lg border border-zinc-200 hover:bg-zinc-50 transition-all flex items-center justify-center">
                  {t('heroCtaSecondary')}
                </Link>
              </div>
              <p className="text-sm text-zinc-400 font-medium">{t('heroTrust')}</p>
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
              [t('stat1Val'), t('stat1Label')],
              [t('stat2Val'), t('stat2Label')],
              [t('stat3Val'), t('stat3Label')],
              [t('stat4Val'), t('stat4Label')],
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
              <Sparkles size={12} /> {t('showcaseBadge')}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">
              {t('showcaseTitle')}
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              {t('showcaseSubtitle')}
            </p>
          </div>

          {/* Screenshot row 1: Tender Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                <Lock size={10} /> {t('proTag')}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4">
                {t('screen1Title')}
              </h3>
              <p className="text-zinc-500 text-lg mb-6 leading-relaxed">
                {t('screen1Desc')}
              </p>
              <ul className="space-y-3">
                {[
                  t('screen1b1'),
                  t('screen1b2'),
                  t('screen1b3'),
                  t('screen1b4'),
                  t('screen1b5'),
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
                <Lock size={10} /> {t('proTag')}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4">
                {t('screen2Title')}
              </h3>
              <p className="text-zinc-500 text-lg mb-6 leading-relaxed">
                {t('screen2Desc')}
              </p>
              <ul className="space-y-3">
                {[
                  t('screen2b1'),
                  t('screen2b2'),
                  t('screen2b3'),
                  t('screen2b4'),
                  t('screen2b5'),
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
              <Lock size={10} /> {t('proEntTag')}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-zinc-900 mb-4">
              {t('intelTitle')}
            </h3>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              {t('intelSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-zinc-900 mb-1">{t('intelBuyerTitle')}</h4>
                <p className="text-zinc-500 text-sm">{t('intelBuyerDesc')}</p>
              </div>
              <BuyerIntelMockup />
            </div>
            <div>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-zinc-900 mb-1">{t('intelCompTitle')}</h4>
                <p className="text-zinc-500 text-sm">{t('intelCompDesc')}</p>
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
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">{t('featuresTitle')}</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Cpu size={22} />, color: 'bg-blue-100 text-blue-600',
                title: t('f1Title'),
                tag: t('tagAllPlans'),
                tagColor: 'bg-zinc-100 text-zinc-600',
                desc: t('f1Desc'),
              },
              {
                icon: <Globe size={22} />, color: 'bg-indigo-100 text-indigo-600',
                title: t('f2Title'),
                tag: t('tagAllPlans'),
                tagColor: 'bg-zinc-100 text-zinc-600',
                desc: t('f2Desc'),
              },
              {
                icon: <BarChart3 size={22} />, color: 'bg-emerald-100 text-emerald-600',
                title: t('f3Title'),
                tag: t('tagPro'),
                tagColor: 'bg-blue-100 text-blue-700',
                desc: t('f3Desc'),
              },
              {
                icon: <Search size={22} />, color: 'bg-amber-100 text-amber-600',
                title: t('f4Title'),
                tag: t('tagPro'),
                tagColor: 'bg-blue-100 text-blue-700',
                desc: t('f4Desc'),
              },
              {
                icon: <DollarSign size={22} />, color: 'bg-purple-100 text-purple-600',
                title: t('f5Title'),
                tag: t('tagPro'),
                tagColor: 'bg-blue-100 text-blue-700',
                desc: t('f5Desc'),
              },
              {
                icon: <FileText size={22} />, color: 'bg-rose-100 text-rose-600',
                title: t('f6Title'),
                tag: t('tagPro'),
                tagColor: 'bg-blue-100 text-blue-700',
                desc: t('f6Desc'),
              },
              {
                icon: <Building2 size={22} />, color: 'bg-blue-100 text-blue-600',
                title: t('f7Title'),
                tag: t('tagPro'),
                tagColor: 'bg-blue-100 text-blue-700',
                desc: t('f7Desc'),
              },
              {
                icon: <ShieldCheck size={22} />, color: 'bg-emerald-100 text-emerald-600',
                title: t('f8Title'),
                tag: t('tagPro'),
                tagColor: 'bg-blue-100 text-blue-700',
                desc: t('f8Desc'),
              },
              {
                icon: <Zap size={22} />, color: 'bg-amber-100 text-amber-600',
                title: t('f9Title'),
                tag: t('tagPro'),
                tagColor: 'bg-blue-100 text-blue-700',
                desc: t('f9Desc'),
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
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">{t('howTitle')}</h2>
            <p className="text-zinc-500 text-lg">{t('howSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Users size={28} />,
                color: 'bg-blue-600',
                title: t('step1Title'),
                desc: t('step1Desc'),
              },
              {
                step: '02',
                icon: <Cpu size={28} />,
                color: 'bg-indigo-600',
                title: t('step2Title'),
                desc: t('step2Desc'),
              },
              {
                step: '03',
                icon: <TrendingUp size={28} />,
                color: 'bg-emerald-600',
                title: t('step3Title'),
                desc: t('step3Desc'),
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
                <Users size={12} /> {t('personasBadge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {t('personasTitle')}<br />
                <span className="text-blue-500">{t('personasHighlight')}</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                {t('personasDesc1')}
              </p>
              <p className="text-zinc-400 mb-10 leading-relaxed">
                {t('personasDesc2')}
              </p>
              <Link href="/personas" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 group">
                {t('personasCta')} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: <Users size={28} />, color: 'text-purple-400', title: t('personasCard1Title'), desc: t('personasCard1Desc') },
                { icon: <Search size={28} />, color: 'text-emerald-400', title: t('personasCard2Title'), desc: t('personasCard2Desc') },
                { icon: <Target size={28} />, color: 'text-amber-400', title: t('personasCard3Title'), desc: t('personasCard3Desc'), wide: true },
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
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">{t('pricingTitle')}</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">{t('pricingSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">

            {/* Starter */}
            <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">{t('starterName')}</h3>
                <p className="text-zinc-500 text-sm">{t('starterDesc')}</p>
              </div>
              <div className="text-4xl font-black text-zinc-900 mb-2">{t('starterPrice')}<span className="text-base font-medium text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-400 mb-8">{t('starterAnnual')}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  t('sf1'),
                  t('sf2'),
                  t('sf3'),
                  t('sf4'),
                  t('sf5'),
                  t('sf6'),
                ].map(f => <li key={f} className="flex items-start gap-3 text-zinc-700 text-sm"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>)}
                {[
                  t('sl1'),
                  t('sl2'),
                  t('sl3'),
                  t('sl4'),
                ].map(f => <li key={f} className="flex items-start gap-3 text-zinc-400 text-sm"><Lock size={14} className="mt-0.5 shrink-0" /> {f}</li>)}
              </ul>
              <Link href="/login" className="block w-full py-3.5 px-4 bg-zinc-100 text-zinc-700 font-bold text-center rounded-xl hover:bg-zinc-200 transition-all text-sm">
                {t('pricingCtaTrial')}
              </Link>
            </div>

            {/* Professional */}
            <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 relative transform md:-translate-y-4 shadow-2xl flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">{t('pricingMostPopular')}</span>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{t('proName')}</h3>
                <p className="text-zinc-400 text-sm">{t('proDesc')}</p>
              </div>
              <div className="text-5xl font-black text-white mb-2">{t('proPrice')}<span className="text-base font-medium text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-500 mb-8">{t('proAnnual')}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  t('pf1'),
                  t('pf2'),
                  t('pf3'),
                  t('pf4'),
                  t('pf5'),
                  t('pf6'),
                  t('pf7'),
                  t('pf8'),
                  t('pf9'),
                  t('pf10'),
                  t('pf11'),
                  t('pf12'),
                  t('pf13'),
                ].map(f => <li key={f} className="flex items-start gap-3 text-white text-sm"><Check size={16} className="text-blue-400 mt-0.5 shrink-0" /> {f}</li>)}
              </ul>
              <Link href="/login" className="block w-full py-3.5 px-4 bg-blue-600 text-white font-bold text-center rounded-xl hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-900/30">
                {t('pricingCtaTrial')}
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 mb-1">{t('entName')}</h3>
                <p className="text-zinc-500 text-sm">{t('entDesc')}</p>
              </div>
              <div className="text-4xl font-black text-zinc-900 mb-2">{t('entPrice')}<span className="text-base font-medium text-zinc-400">/mo</span></div>
              <p className="text-sm text-zinc-400 mb-8">{t('entAnnual')}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  t('ef1'),
                  t('ef2'),
                  t('ef3'),
                  t('ef4'),
                  t('ef5'),
                  t('ef6'),
                  t('ef7'),
                  t('ef8'),
                  t('ef9'),
                  t('ef10'),
                  t('ef11'),
                ].map(f => <li key={f} className="flex items-start gap-3 text-zinc-700 text-sm"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>)}
              </ul>
              <Link href="/contact" className="block w-full py-3.5 px-4 bg-zinc-100 text-zinc-700 font-bold text-center rounded-xl hover:bg-zinc-200 transition-all text-sm">
                {t('pricingCtaSales')}
              </Link>
            </div>
          </div>

          {/* Feature comparison table */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-black text-zinc-900 text-center mb-8">{t('compareTitle')}</h3>
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-zinc-50 border-b border-zinc-200">
                <div className="p-4 text-sm font-bold text-zinc-500">{t('compareFeatureCol')}</div>
                {[t('starterName'), t('proName'), t('entName')].map(p => (
                  <div key={p} className={`p-4 text-center text-sm font-bold ${p === t('proName') ? 'text-blue-600' : 'text-zinc-900'}`}>{p}</div>
                ))}
              </div>
              {/* Rows */}
              {[
                [t('cr1'), t('cr1s'), t('crUnlimited'), t('crUnlimited')],
                [t('cr2'), t('crYes'), t('crYes'), t('crYes')],
                [t('cr3'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr4'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr5'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr6'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr7'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr8'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr9'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr10'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr11'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr12'), t('crNo'), t('crYes'), t('crYes')],
                [t('cr13'), t('cr13s'), t('cr13p'), t('cr13e')],
                [t('cr14'), t('crNo'), t('crNo'), t('crYes')],
                [t('cr15'), t('crNo'), t('crNo'), t('crYes')],
                [t('cr16'), t('crNo'), t('crNo'), t('crYes')],
              ].map(([feat, starter, pro, ent], i) => (
                <div key={feat} className={`grid grid-cols-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}>
                  <div className="p-4 text-sm text-zinc-700 font-medium">{feat}</div>
                  {[starter, pro, ent].map((v, j) => (
                    <div key={j} className={`p-4 text-center text-sm font-semibold ${v === t('crYes') ? 'text-emerald-600' : v === t('crNo') ? 'text-zinc-300' : j === 1 ? 'text-blue-600' : 'text-zinc-700'}`}>{v}</div>
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
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 mb-4">{t('faqTitle')}</h2>
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
            {t('ctaTitle')}
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="px-10 py-4 bg-white text-blue-600 font-black rounded-xl text-lg hover:bg-blue-50 transition-all shadow-2xl flex items-center gap-2 group">
              {t('ctaPrimary')} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/contact" className="px-10 py-4 bg-transparent text-white font-bold rounded-xl text-lg border-2 border-white/40 hover:border-white/80 transition-all flex items-center gap-2">
              {t('ctaSecondaryBtn')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
}
