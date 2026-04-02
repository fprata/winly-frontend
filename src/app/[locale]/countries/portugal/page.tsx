import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Building2, Search, BarChart3, Users, FileText, Globe, ShieldCheck, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Public Procurement Software for Portugal | BASE.gov.pt Intelligence',
    description: 'Find and win Portuguese public tenders with Winly. Complete BASE.gov.pt coverage, CPV matching, buyer intelligence, and AI-powered analysis for procurement software portugal and BASE portugal tenders.',
    keywords: ['procurement software portugal', 'BASE portugal tenders', 'concursos publicos portugal', 'BASE.gov.pt', 'portuguese public contracts'],
    alternates: {
      canonical: `https://winly.me/${locale}/countries/portugal`,
      languages: {
        en: 'https://winly.me/en/countries/portugal',
        pt: 'https://winly.me/pt/countries/portugal',
      },
    },
  }
}

const stats = [
  { value: '\u20AC18.4B', label: 'Market Size (2024)', detail: 'Record year for Portuguese procurement' },
  { value: '222,670', label: 'Contracts Published', detail: 'Annual contracts on BASE.gov.pt' },
  { value: '90%', label: 'E-Procurement', detail: 'Digital submission rate' },
  { value: '30,000+', label: 'Contracting Entities', detail: 'Active public buyers' },
]

const features = [
  {
    icon: <Globe size={24} />,
    color: 'bg-emerald-100 text-emerald-600',
    title: 'Complete BASE.gov.pt Coverage',
    desc: 'Winly is the only platform that fully ingests and indexes Portugal\'s national procurement portal. Every Ajuste Direto, Concurso Publico, and framework agreement — searchable and enriched with AI.',
  },
  {
    icon: <FileText size={24} />,
    color: 'bg-blue-100 text-blue-600',
    title: 'Portuguese Language Support',
    desc: 'Our AI understands Portuguese tender documents natively. Extract requirements, risks, and key dates from cadernos de encargos and programas de procedimento automatically.',
  },
  {
    icon: <Search size={24} />,
    color: 'bg-amber-100 text-amber-600',
    title: 'CPV Code Matching',
    desc: 'Our 150-point matching algorithm maps your company profile against CPV codes, contract values, and buyer history to surface the Portuguese tenders you are most likely to win.',
  },
  {
    icon: <Users size={24} />,
    color: 'bg-purple-100 text-purple-600',
    title: 'Buyer Intelligence for Portuguese Entities',
    desc: 'Deep profiles on every Portuguese contracting authority — from Camaras Municipais to central government ministries. Understand their spending patterns, preferred suppliers, and award history.',
  },
]

const procedures = [
  {
    name: 'Ajuste Direto',
    description: 'Direct award for contracts below EU thresholds. The most common procedure type in Portugal, covering roughly 75% of all contracts by volume.',
    threshold: 'Up to \u20AC75,000 (goods/services) or \u20AC150,000 (works)',
  },
  {
    name: 'Concurso Publico',
    description: 'Open public tender, mandatory above certain thresholds. Published on BASE.gov.pt and, for above-EU-threshold contracts, on TED.',
    threshold: 'No minimum value',
  },
  {
    name: 'Concurso Limitado por Previa Qualificacao',
    description: 'Restricted procedure with pre-qualification stage. Used for complex contracts requiring vetted suppliers.',
    threshold: 'No minimum value',
  },
  {
    name: 'Procedimento de Negociacao',
    description: 'Negotiated procedure allowing dialogue with shortlisted candidates. Used when technical specifications cannot be precisely defined upfront.',
    threshold: 'Varies by contract type',
  },
]

const sectors = [
  {
    icon: <Building2 size={20} />,
    name: 'Construction & Public Works',
    detail: '25% growth in 2024. Major infrastructure projects across PRR (Recovery and Resilience Plan) driving demand.',
  },
  {
    icon: <ShieldCheck size={20} />,
    name: 'Healthcare & Social Services',
    detail: '15-20% of total spend. Hospital equipment, pharmaceutical procurement, and SNS (National Health Service) contracts.',
  },
  {
    icon: <TrendingUp size={20} />,
    name: 'Local Government',
    detail: '25% of all procurement. 308 municipalities (Camaras Municipais) and parish councils with diverse contracting needs.',
  },
  {
    icon: <BarChart3 size={20} />,
    name: 'IT & Digital Transformation',
    detail: 'Fast-growing segment driven by public sector digitalization, cybersecurity, and cloud migration initiatives.',
  },
]

export default function PortugalCountryPage() {
  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pb-20">

        {/* Hero */}
        <section className="pt-24 pb-20 px-6 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
              Portugal
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
              Win More{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
                Portuguese Public Contracts
              </span>
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              Winly is the only procurement intelligence platform with complete BASE.gov.pt coverage.
              Monitor every Portuguese public tender, analyze documents with AI, and get matched
              to the contracts you can win.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-zinc-900 mb-4 text-center">
              Portugal&apos;s Procurement Market at a Glance
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto text-center mb-12">
              Portugal hit a record &euro;18.4 billion in public procurement spending in 2024,
              driven by EU recovery funds and infrastructure modernization.
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
              <h2 className="text-3xl font-black text-zinc-900 mb-4">How Winly Helps You Win in Portugal</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Purpose-built for the Portuguese procurement market with deep BASE.gov.pt integration
                and AI-powered intelligence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f) => (
                <div key={f.title} className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-emerald-400 hover:shadow-sm transition-all">
                  <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-4`}>{f.icon}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Procedure Types */}
        <section className="py-20 px-6 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Portuguese Procurement Procedures</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Understanding Portugal&apos;s Codigo dos Contratos Publicos (CCP) procedure types is key
                to finding the right opportunities.
              </p>
            </div>
            <div className="space-y-4">
              {procedures.map((proc) => (
                <div key={proc.name} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-zinc-900">{proc.name}</h3>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">{proc.threshold}</span>
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed">{proc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Sectors */}
        <section className="py-20 px-6 bg-white border-t border-zinc-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-zinc-900 mb-4">Key Sectors in Portuguese Procurement</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                These sectors represent the largest spending categories and fastest-growing opportunities
                in Portugal&apos;s public procurement market.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectors.map((sector) => (
                <div key={sector.name} className="p-6 bg-zinc-50 border border-zinc-200 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
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
            <h2 className="text-3xl font-black mb-6">Start Finding Portuguese Tenders — Free</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              Join Winly&apos;s free Explorer plan and get instant access to BASE.gov.pt intelligence.
              No credit card required. Start winning Portuguese public contracts today.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors text-lg"
            >
              Start Free — Find Portuguese Tenders
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
