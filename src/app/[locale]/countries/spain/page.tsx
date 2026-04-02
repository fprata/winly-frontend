import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Building2, Search, BarChart3, Users, Globe, ShieldCheck, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Public Procurement Software for Spain | EU Tender Intelligence',
    description: 'Compete for Spanish public contracts with Winly. TED coverage for above-threshold Spanish tenders, CPV matching, competitor analysis, and AI-powered procurement intelligence for licitaciones publicas espana.',
    keywords: ['procurement software spain', 'licitaciones publicas espana', 'spanish public tenders', 'TED spain', 'contratacion publica espana'],
    alternates: {
      canonical: `https://winly.me/${locale}/countries/spain`,
      languages: {
        en: 'https://winly.me/en/countries/spain',
        pt: 'https://winly.me/pt/countries/spain',
      },
    },
  }
}

const stats = [
  { value: 'Top 5', label: 'EU Procurement Market', detail: 'One of the largest public procurement markets in Europe' },
  { value: '\u20AC200B+', label: 'Annual Public Spend', detail: 'Total government expenditure across all levels' },
  { value: '17', label: 'Autonomous Communities', detail: 'Regional governments with independent procurement' },
  { value: '8,000+', label: 'Municipalities', detail: 'Local contracting authorities across Spain' },
]

const features = [
  {
    icon: <Globe size={24} />,
    color: 'bg-blue-100 text-blue-600',
    title: 'TED Coverage for Spanish Tenders',
    desc: 'Winly monitors the EU\'s Tenders Electronic Daily (TED) for all above-threshold Spanish public contracts. Get instant alerts when new Spanish opportunities are published at EU level.',
  },
  {
    icon: <Search size={24} />,
    color: 'bg-amber-100 text-amber-600',
    title: 'CPV Code Matching',
    desc: 'Our 150-point matching algorithm maps your capabilities against Spanish tender requirements using CPV codes, contract values, and geographic preferences to surface your best opportunities.',
  },
  {
    icon: <Users size={24} />,
    color: 'bg-purple-100 text-purple-600',
    title: 'Competitor Analysis',
    desc: 'Understand who is winning Spanish public contracts in your sector. Track competitor activity, average bid values, and win rates across Spanish contracting authorities.',
  },
  {
    icon: <BarChart3 size={24} />,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'AI-Powered Document Analysis',
    desc: 'Our Gemini 2.5 Flash AI analyzes Spanish tender documents, extracting requirements, evaluation criteria, risks, and key deadlines — even from complex pliegos de condiciones.',
  },
]

const procedures = [
  {
    name: 'Procedimiento Abierto',
    description: 'Open procedure — the most common type for above-threshold contracts. Any interested economic operator may submit a tender. Published on PLACSP and TED.',
    note: 'Most common for EU-level contracts',
  },
  {
    name: 'Procedimiento Restringido',
    description: 'Restricted procedure with a pre-selection phase. The contracting authority selects candidates who are then invited to submit tenders.',
    note: 'Used for complex or high-value contracts',
  },
  {
    name: 'Procedimiento Negociado',
    description: 'Negotiated procedure allowing the contracting authority to negotiate terms directly with selected candidates. Available under specific conditions defined by the Ley de Contratos del Sector Publico.',
    note: 'Requires specific justification',
  },
  {
    name: 'Dialogo Competitivo',
    description: 'Competitive dialogue for particularly complex contracts where the contracting authority cannot define the technical means or legal/financial structure in advance.',
    note: 'For complex projects (PPP, infrastructure)',
  },
  {
    name: 'Contrato Menor',
    description: 'Simplified procedure for low-value contracts below \u20AC15,000 (services) or \u20AC40,000 (works). These are typically not published on TED but appear on PLACSP.',
    note: 'Below EU thresholds',
  },
]

const sectors = [
  {
    icon: <Building2 size={20} />,
    name: 'Infrastructure & Construction',
    detail: 'Major investments in transport, renewable energy, and urban development. Spain\'s PRR (Plan de Recuperacion) drives billions in public works.',
  },
  {
    icon: <ShieldCheck size={20} />,
    name: 'Healthcare',
    detail: 'Spain\'s 17 autonomous communities manage their own health systems, creating diverse procurement opportunities across the country.',
  },
  {
    icon: <TrendingUp size={20} />,
    name: 'Digital Transformation',
    detail: 'Spain Digital 2026 agenda allocates significant funds for public sector digitalization, AI, cybersecurity, and 5G deployment.',
  },
  {
    icon: <Clock size={20} />,
    name: 'Defense & Security',
    detail: 'Growing defense budget with NATO commitments driving procurement in technology, equipment, and services.',
  },
]

export default function SpainCountryPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pb-20">

        {/* Hero */}
        <section className="pt-24 pb-20 px-6 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-6">
              Spain
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
              Compete for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Spanish Public Contracts
              </span>
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              Winly monitors EU-level Spanish public tenders through TED, giving you early access
              to above-threshold opportunities across one of Europe&apos;s largest procurement markets.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-zinc-900 mb-4 text-center">
              Spain&apos;s Procurement Landscape
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto text-center mb-12">
              Spain is one of the top 5 EU procurement markets, with a highly decentralized system
              spanning central government, autonomous communities, and thousands of municipalities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 text-center">
                  <div className="text-3xl font-black text-zinc-900 mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{stat.label}</div>
                  <p className="text-zinc-500 text-sm">{stat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Winly Helps */}
        <section className="py-20 px-6 bg-white border-t border-zinc-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">How Winly Helps You Win in Spain</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                AI-powered procurement intelligence for the Spanish market, with TED coverage
                and smart matching to find your best opportunities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f) => (
                <div key={f.title} className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-red-400 hover:shadow-sm transition-all">
                  <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-4`}>{f.icon}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spanish Procurement System */}
        <section className="py-20 px-6 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Spanish Procurement System</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Spain&apos;s public procurement is governed by the Ley 9/2017 de Contratos del Sector Publico
                and managed through the Plataforma de Contratacion del Sector Publico (PLACSP).
              </p>
            </div>
            <div className="space-y-4">
              {procedures.map((proc) => (
                <div key={proc.name} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-zinc-900">{proc.name}</h3>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">{proc.note}</span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{proc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TED Coverage Note */}
        <section className="py-16 px-6 bg-blue-50 border-t border-blue-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Current Coverage: TED (Above-Threshold Contracts)</h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-3">
                  Winly currently covers Spanish public tenders published on the EU&apos;s Tenders Electronic Daily (TED).
                  This includes all above-threshold contracts that Spanish contracting authorities are required to publish at EU level.
                </p>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  <span className="font-semibold">Coming soon:</span> Direct integration with Spain&apos;s national portal,
                  the Plataforma de Contratacion del Sector Publico (PLACSP), to cover below-threshold
                  opportunities and provide complete visibility into the Spanish procurement market.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Sectors */}
        <section className="py-20 px-6 bg-white border-t border-zinc-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Key Sectors in Spanish Procurement</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Spain&apos;s recovery plan and digital agenda are driving significant procurement
                opportunities across these priority sectors.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectors.map((sector) => (
                <div key={sector.name} className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                    {sector.icon}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{sector.name}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{sector.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-zinc-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-6">Start Finding Spanish Tenders — Free</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              Join Winly&apos;s free Explorer plan and get instant access to Spanish procurement intelligence
              via TED. No credit card required. Start competing for Spanish public contracts today.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-lg"
            >
              Start Free — Find Spanish Tenders
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
