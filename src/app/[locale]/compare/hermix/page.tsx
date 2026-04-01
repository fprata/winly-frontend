import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Check, X, Zap, Globe, Brain, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Best Hermix Alternative for EU Procurement | Winly',
    description: 'Looking for a Hermix alternative? Winly offers deeper AI analysis, 150-point matching, BASE coverage, and a free tier. See why procurement teams switch to Winly.',
    alternates: {
      canonical: `https://winly.me/${locale}/compare/hermix`,
      languages: {
        en: 'https://winly.me/en/compare/hermix',
        pt: 'https://winly.me/pt/compare/hermix',
      },
    },
  }
}

const features = [
  { name: 'TED Coverage', hermix: true, winly: true },
  { name: 'BASE (Portugal) Coverage', hermix: false, winly: true, hermixNote: 'Limited' },
  { name: 'AI Document Analysis', hermix: false, winly: true, winlyNote: 'Gemini 2.5 Flash' },
  { name: 'Win Probability Score', hermix: false, winly: true },
  { name: '150-Point Matching Algorithm', hermix: false, winly: true },
  { name: 'Competitor Intelligence', hermix: true, winly: true, hermixNote: 'Limited', winlyNote: 'Full' },
  { name: 'Buyer DNA Profiles', hermix: false, winly: true },
  { name: 'AI Tender Chatbot', hermix: false, winly: true, winlyNote: 'Enterprise' },
  { name: 'Free Tier', hermix: false, winly: true, hermixNote: 'No', winlyNote: 'Explorer' },
  { name: 'Pricing', hermix: null, winly: null, hermixNote: 'From ~\u20AC150/mo', winlyNote: 'From \u20AC0 (Free)' },
]

const differentiators = [
  {
    icon: <Brain size={24} />,
    color: 'bg-blue-100 text-blue-600',
    title: 'AI-First Intelligence',
    desc: 'While Hermix focuses on traditional data aggregation, Winly uses Gemini 2.5 Flash to analyze tender documents, extract risks, and score your win probability automatically.',
  },
  {
    icon: <Globe size={24} />,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Deeper Portuguese Coverage',
    desc: 'Winly is the only platform that combines TED (EU-wide) with BASE (Portuguese national portal) data, giving you complete visibility into the Portuguese procurement market.',
  },
  {
    icon: <Zap size={24} />,
    color: 'bg-amber-100 text-amber-600',
    title: '150-Point Matching Algorithm',
    desc: 'Our proprietary matching engine scores every tender against your company profile across 150 dimensions, so you focus only on contracts you can actually win.',
  },
  {
    icon: <ShieldCheck size={24} />,
    color: 'bg-purple-100 text-purple-600',
    title: 'Free Tier to Get Started',
    desc: 'Unlike Hermix, Winly offers a generous free Explorer plan. Start finding tenders today without a credit card or sales call.',
  },
]

function FeatureCell({ value, note }: { value: boolean | null; note?: string }) {
  if (value === null && note) {
    return <span className="text-sm font-semibold text-zinc-700">{note}</span>
  }
  if (value) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Check size={18} className="text-emerald-600" />
        {note && <span className="text-xs text-zinc-500">{note}</span>}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <X size={18} className="text-zinc-400" />
      {note && <span className="text-xs text-zinc-500">{note}</span>}
    </span>
  )
}

export default function CompareHermixPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pb-20">

        {/* Hero */}
        <section className="pt-24 pb-20 px-6 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
              Comparison
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
              Looking for a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Hermix Alternative
              </span>
              ?
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              Hermix is an established procurement platform with 99 Capterra reviews.
              But teams looking for deeper AI analysis, Portuguese market coverage, and modern
              pricing are switching to Winly.
            </p>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-zinc-900 mb-10 text-center">
              Feature Comparison
            </h2>
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="py-4 px-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Feature</th>
                    <th className="py-4 px-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-center">Hermix</th>
                    <th className="py-4 px-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-center">Winly</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((f, i) => (
                    <tr key={f.name} className={i < features.length - 1 ? 'border-b border-zinc-100' : ''}>
                      <td className="py-4 px-6 text-sm font-medium text-zinc-700">{f.name}</td>
                      <td className="py-4 px-6 text-center">
                        <FeatureCell value={f.hermix} note={f.hermixNote} />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <FeatureCell value={f.winly} note={f.winlyNote} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why Teams Switch */}
        <section className="py-20 px-6 bg-white border-t border-zinc-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Why Teams Switch to Winly</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Hermix covers the basics well, but Winly goes further with AI-powered intelligence
                built for modern procurement teams.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {differentiators.map((d) => (
                <div key={d.title} className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all">
                  <div className={`w-10 h-10 ${d.color} rounded-xl flex items-center justify-center mb-4`}>{d.icon}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{d.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-zinc-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-6">Ready to Try a Smarter Approach?</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              Start with Winly&apos;s free Explorer plan. No credit card required.
              See how AI-powered procurement intelligence helps you find and win more contracts.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg"
            >
              Try Winly Free
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
