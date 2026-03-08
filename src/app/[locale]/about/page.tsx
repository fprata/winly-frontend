import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CheckCircle, Shield, Award, Users, Target, Cpu, Globe, BarChart3, FileText, TrendingUp, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Winly AI | Democratizing EU Public Procurement Access",
  description: "Learn how Winly AI is leveling the playing field for SMEs in the €2T+ EU public procurement market. AI-powered intelligence platform combining TED & BASE data.",
}

export default function AboutPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pb-20">

        {/* Hero */}
        <section className="pt-24 pb-20 px-6 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
              Democratizing access to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">public procurement</span>
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              We believe every business — regardless of size — deserves a fair shot at government contracts. Winly AI levels the playing field with enterprise-grade procurement intelligence, built from the ground up for European SMEs.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-6">
                The Problem
              </div>
              <h2 className="text-3xl font-black text-zinc-900 mb-6">Public procurement is opaque — and unfair</h2>
              <p className="text-zinc-600 text-lg mb-5 leading-relaxed">
                The EU public procurement market is worth over <strong>€2 trillion annually</strong>. Yet for most SMEs, it remains impossibly hard to navigate: complex documentation, fragmented data spread across dozens of national portals, and no visibility into what competitors are doing or what buyers actually want.
              </p>
              <p className="text-zinc-600 text-lg leading-relaxed">
                Large firms have dedicated bid management teams, market analysts, and institutional relationships. A 10-person consultancy has a spreadsheet and a prayer. Winly AI was built to close that gap — giving SMEs the same strategic intelligence that was previously only available to enterprise bid teams.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { stat: '€2T+', label: 'EU public procurement market annually', color: 'text-blue-600' },
                { stat: '200k+', label: 'New tender notices published per year across EU portals', color: 'text-indigo-600' },
                { stat: '98%', label: 'Of tenders go unnoticed by most eligible SMEs', color: 'text-rose-600' },
                { stat: '10x', label: 'Win rate improvement for data-driven bidders', color: 'text-emerald-600' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-zinc-200 rounded-xl p-5 flex items-center gap-5">
                  <div className={`text-4xl font-black shrink-0 ${s.color}`}>{s.stat}</div>
                  <p className="text-zinc-600 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Winly Solves It */}
        <section className="py-20 px-6 bg-white border-t border-zinc-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                Our Solution
              </div>
              <h2 className="text-3xl font-black text-zinc-900 mb-4">How Winly works</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">We combine real procurement data with AI to give you intelligence that used to require a whole analyst team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Cpu size={24} />, color: 'bg-blue-100 text-blue-600',
                  title: '150-Point AI Matching',
                  desc: 'Every tender is scored across 6 dimensions — CPV sector match, geographic relevance, capacity fit, semantic keyword alignment, buyer openness, and market opportunity — not just keyword presence.',
                },
                {
                  icon: <Globe size={24} />, color: 'bg-indigo-100 text-indigo-600',
                  title: 'TED + BASE Data',
                  desc: 'We aggregate and normalize tender data from TED (Tenders Electronic Daily, covering 30+ EU countries) and BASE (Portugal\'s public contracts portal). New tenders sync daily.',
                },
                {
                  icon: <BarChart3 size={24} />, color: 'bg-emerald-100 text-emerald-600',
                  title: 'Win Probability Engine',
                  desc: 'We calculate your win probability per tender based on your company\'s historical performance, the buyer\'s award patterns, and the competitive density for that sector and value range.',
                },
                {
                  icon: <FileText size={24} />, color: 'bg-rose-100 text-rose-600',
                  title: 'AI Document Intelligence',
                  desc: 'Using Google Gemini 2.5 Flash, we download and analyze the actual tender procurement package — extracting risk scores, financial criteria, timeline constraints, incumbent alerts, and strategic flags.',
                },
                {
                  icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600',
                  title: 'Buyer & Competitor DNA',
                  desc: 'We profile every public authority and every active competitor: total spend, avg discount, top suppliers, sector focus, behavioral persona — so you walk into every bid knowing exactly who you\'re dealing with.',
                },
                {
                  icon: <TrendingUp size={24} />, color: 'bg-amber-100 text-amber-600',
                  title: 'Price Recommendation Engine',
                  desc: 'We analyze historical award values for the buyer and sector to give you data-driven price recommendations — P25 (aggressive), P50 (median), P75 (high margin) — so you optimize win rate vs. margin.',
                },
              ].map(f => (
                <div key={f.title} className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all">
                  <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-4`}>{f.icon}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="py-20 px-6 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Our data sources</h2>
              <p className="text-zinc-500 text-lg">Real procurement data. No scraped summaries. No stale databases.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-zinc-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">TED</div>
                  <div>
                    <h3 className="font-black text-zinc-900">Tenders Electronic Daily</h3>
                    <p className="text-sm text-zinc-500">Official EU Journal Supplement</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    '30+ European Union member states',
                    'Above-threshold contract notices',
                    'Contract award notices (CANs)',
                    'Prior information notices',
                    'New tenders synced daily at publication',
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600"><CheckCircle size={14} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-zinc-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm">BASE</div>
                  <div>
                    <h3 className="font-black text-zinc-900">Portal BASE</h3>
                    <p className="text-sm text-zinc-500">Portuguese Public Contracts Portal</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'All Portuguese public contract announcements',
                    'Contract award records with final values',
                    'Winner and competitor data per contract',
                    'Buyer spending history going back 10+ years',
                    'Direct award and competitive procedure mix',
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600"><CheckCircle size={14} className="text-emerald-600 mt-0.5 shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6 bg-white border-t border-zinc-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Our values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Target size={28} />, color: 'text-blue-600 bg-blue-50', title: 'Precision', desc: 'Matching opportunities with 98% relevance accuracy. We never surface irrelevant noise — only tenders that genuinely fit your profile.' },
                { icon: <Shield size={28} />, color: 'text-emerald-600 bg-emerald-50', title: 'Transparency', desc: 'Government spending data should be accessible and actionable for everyone — not just large firms with dedicated research teams.' },
                { icon: <Award size={28} />, color: 'text-amber-600 bg-amber-50', title: 'Excellence', desc: 'We help high-quality suppliers win based on merit, not institutional advantage. Better suppliers winning means better public services.' },
                { icon: <Zap size={28} />, color: 'text-purple-600 bg-purple-50', title: 'Speed', desc: 'Bid teams move fast. Winly surfaces insights in seconds — not hours. AI document analysis in 30 seconds, not 3 days of manual review.' },
              ].map(v => (
                <div key={v.title} className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                  <div className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mb-4`}>{v.icon}</div>
                  <h3 className="font-bold text-xl text-zinc-900 mb-2">{v.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-6 bg-zinc-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-6">Built by experts in procurement &amp; AI</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              Our team combines deep expertise in public administration, data engineering, and enterprise AI. We've spent years studying procurement patterns, building ETL pipelines on BigQuery, and developing the multi-agent AI architecture that powers Winly's document intelligence.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              The platform is built on Google Cloud (BigQuery + Cloud Run), uses Google Gemini 2.5 Flash for document analysis, and processes data from TED and BASE through a daily automated pipeline — ensuring you always have up-to-date intelligence.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
