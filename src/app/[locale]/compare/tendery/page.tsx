import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Check, X, Zap, Globe, Brain, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Best Tendery Alternative for EU Procurement | Winly',
    description: 'Looking for a Tendery alternative? Winly offers comprehensive TED and BASE coverage, AI document analysis, 150-point matching, and a free tier. Compare Tendery vs Winly.',
    alternates: {
      canonical: `https://winly.me/${locale}/compare/tendery`,
      languages: {
        en: 'https://winly.me/en/compare/tendery',
        pt: 'https://winly.me/pt/compare/tendery',
      },
    },
  }
}

const features = [
  { name: 'TED Coverage', tendery: true, winly: true },
  { name: 'BASE (Portugal) Coverage', tendery: false, winly: true },
  { name: 'AI Document Analysis', tendery: false, winly: true, winlyNote: 'Gemini 2.5 Flash' },
  { name: 'Win Probability Score', tendery: false, winly: true },
  { name: '150-Point Matching Algorithm', tendery: false, winly: true },
  { name: 'Competitor Intelligence', tendery: false, winly: true, tenderyNote: 'Limited', winlyNote: 'Full' },
  { name: 'Buyer DNA Profiles', tendery: false, winly: true },
  { name: 'AI Tender Chatbot', tendery: false, winly: true, winlyNote: 'Enterprise' },
  { name: 'Free Tier', tendery: true, winly: true, tenderyNote: 'Limited', winlyNote: 'Explorer' },
  { name: 'Pricing', tendery: null, winly: null, tenderyNote: 'Contact sales', winlyNote: 'From \u20AC0 (Free)' },
]

const differentiators = [
  {
    icon: <Brain size={24} />,
    color: 'bg-blue-100 text-blue-600',
    title: 'Advanced AI Analysis',
    desc: 'Tendery offers basic tender search. Winly goes further with Gemini 2.5 Flash-powered document analysis that extracts risks, requirements, and scoring criteria from RFP documents automatically.',
  },
  {
    icon: <Globe size={24} />,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'TED + BASE Coverage',
    desc: 'While Tendery focuses primarily on EU-level tenders, Winly combines TED with BASE (the Portuguese national procurement portal) for complete market visibility.',
  },
  {
    icon: <Zap size={24} />,
    color: 'bg-amber-100 text-amber-600',
    title: '150-Point Matching Algorithm',
    desc: 'Our proprietary matching engine analyzes 150 dimensions of every tender against your company profile, delivering a win probability score so you focus on contracts you can actually win.',
  },
  {
    icon: <ShieldCheck size={24} />,
    color: 'bg-purple-100 text-purple-600',
    title: 'Buyer Intelligence & Competitor Tracking',
    desc: 'Winly builds detailed Buyer DNA profiles and tracks competitor activity, giving you strategic insights that Tendery simply does not offer.',
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

export default function CompareTenderyPage() {
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
                Tendery Alternative
              </span>
              ?
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              Tendery is a newer entrant in the procurement space with limited features.
              Teams that need comprehensive AI analysis, deeper data coverage, and competitive
              intelligence are choosing Winly instead.
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
                    <th className="py-4 px-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-center">Tendery</th>
                    <th className="py-4 px-6 text-xs font-black text-zinc-400 uppercase tracking-widest text-center">Winly</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((f, i) => (
                    <tr key={f.name} className={i < features.length - 1 ? 'border-b border-zinc-100' : ''}>
                      <td className="py-4 px-6 text-sm font-medium text-zinc-700">{f.name}</td>
                      <td className="py-4 px-6 text-center">
                        <FeatureCell value={f.tendery} note={f.tenderyNote} />
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
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Why Teams Choose Winly Over Tendery</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Tendery covers basic tender discovery, but Winly delivers the full procurement
                intelligence stack that modern teams need to win.
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
