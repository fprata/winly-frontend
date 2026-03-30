import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CheckCircle, Shield, Award, Users, Target, Cpu, Globe, BarChart3, FileText, TrendingUp, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: "About Winly | Democratizing EU Public Procurement Access",
  description: "Learn how Winly is leveling the playing field for SMEs in the €2T+ EU public procurement market. AI-powered intelligence platform combining TED & BASE data.",
}

export default async function AboutPage() {
  const t = await getTranslations('about')

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pb-20">

        {/* Hero */}
        <section className="pt-24 pb-20 px-6 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
              {t('heroTitle2')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{t('heroHighlight2')}</span>
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              {t('heroSubtitle2')}
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 px-6 bg-zinc-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-6">
                {t('problemBadge')}
              </div>
              <h2 className="text-3xl font-black text-zinc-900 mb-6">{t('problemTitle')}</h2>
              <p className="text-zinc-600 text-lg mb-5 leading-relaxed">
                {t('problemDesc1')}
              </p>
              <p className="text-zinc-600 text-lg leading-relaxed">
                {t('problemDesc2')}
              </p>
            </div>
            <div className="space-y-4">
              {[
                { stat: t('ps1Val'), label: t('ps1Label'), color: 'text-blue-600' },
                { stat: t('ps2Val'), label: t('ps2Label'), color: 'text-indigo-600' },
                { stat: t('ps3Val'), label: t('ps3Label'), color: 'text-rose-600' },
                { stat: t('ps4Val'), label: t('ps4Label'), color: 'text-emerald-600' },
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
                {t('solutionBadge')}
              </div>
              <h2 className="text-3xl font-black text-zinc-900 mb-4">{t('solutionTitle')}</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">{t('solutionSubtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Cpu size={24} />, color: 'bg-blue-100 text-blue-600',
                  title: t('s1Title'),
                  desc: t('s1Desc'),
                },
                {
                  icon: <Globe size={24} />, color: 'bg-indigo-100 text-indigo-600',
                  title: t('s2Title'),
                  desc: t('s2Desc'),
                },
                {
                  icon: <BarChart3 size={24} />, color: 'bg-emerald-100 text-emerald-600',
                  title: t('s3Title'),
                  desc: t('s3Desc'),
                },
                {
                  icon: <FileText size={24} />, color: 'bg-rose-100 text-rose-600',
                  title: t('s4Title'),
                  desc: t('s4Desc'),
                },
                {
                  icon: <Users size={24} />, color: 'bg-purple-100 text-purple-600',
                  title: t('s5Title'),
                  desc: t('s5Desc'),
                },
                {
                  icon: <TrendingUp size={24} />, color: 'bg-amber-100 text-amber-600',
                  title: t('s6Title'),
                  desc: t('s6Desc'),
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
              <h2 className="text-3xl font-black text-zinc-900 mb-4">{t('dataTitle')}</h2>
              <p className="text-zinc-500 text-lg">{t('dataSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-zinc-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">TED</div>
                  <div>
                    <h3 className="font-black text-zinc-900">{t('tedName')}</h3>
                    <p className="text-sm text-zinc-500">{t('tedSub')}</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    t('tedB1'),
                    t('tedB2'),
                    t('tedB3'),
                    t('tedB4'),
                    t('tedB5'),
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600"><CheckCircle size={14} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-zinc-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm">BASE</div>
                  <div>
                    <h3 className="font-black text-zinc-900">{t('baseName')}</h3>
                    <p className="text-sm text-zinc-500">{t('baseSub')}</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {[
                    t('baseB1'),
                    t('baseB2'),
                    t('baseB3'),
                    t('baseB4'),
                    t('baseB5'),
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
              <h2 className="text-3xl font-black text-zinc-900 mb-4">{t('valuesTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Target size={28} />, color: 'text-blue-600 bg-blue-50', title: t('v1Title'), desc: t('v1Desc') },
                { icon: <Shield size={28} />, color: 'text-emerald-600 bg-emerald-50', title: t('v2Title'), desc: t('v2Desc') },
                { icon: <Award size={28} />, color: 'text-amber-600 bg-amber-50', title: t('v3Title'), desc: t('v3Desc') },
                { icon: <Zap size={28} />, color: 'text-purple-600 bg-purple-50', title: t('v4Title'), desc: t('v4Desc') },
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
            <h2 className="text-3xl font-black mb-6">{t('teamTitle2')}</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              {t('teamDesc2')}
            </p>
            <p className="text-zinc-400 leading-relaxed">
              {t('teamDesc3')}
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
