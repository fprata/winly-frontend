import React from 'react'
import { Link } from '@/navigation'
import { Check, Lock, ChevronDown, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'Pricing | EU Procurement Intelligence Plans',
    description:
      'Compare Winly procurement software pricing plans. Free Explorer tier, Pro for active bidders, and Enterprise for teams. AI-powered tender matching, document analysis, and competitor intelligence.',
    alternates: {
      canonical: `https://winly.me/${locale}/pricing`,
      languages: { en: 'https://winly.me/en/pricing', pt: 'https://winly.me/pt/pricing' },
    },
    openGraph: {
      title: 'Pricing | EU Procurement Intelligence Plans',
      description:
        'Compare Winly procurement software pricing plans. Free Explorer, Pro, and Enterprise tiers for EU public tender intelligence.',
    },
  }
}

export default async function PricingPage() {
  const t = await getTranslations('landing')

  const pricingFaq = [
    { q: t('faq6q'), a: t('faq6a') },
  ]

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main>
        {/* ─── Hero ──────────────────────────────────────────────────────── */}
        <section className="pt-24 pb-16 px-6 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-4 leading-tight">
              {t('pricingTitle')}
            </h1>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
              {t('pricingSubtitle')}
            </p>
          </div>
        </section>

        {/* ─── Pricing Cards ─────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

              {/* Explorer (Free) */}
              <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">{t('explorerName')}</h3>
                  <p className="text-zinc-500 text-sm">{t('explorerPricingDesc')}</p>
                </div>
                <div className="text-4xl font-black text-zinc-900 mb-2">{t('explorerPrice')}</div>
                <p className="text-sm text-zinc-400 mb-8">{t('explorerPriceNote')}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[t('xf1'), t('xf2'), t('xf3'), t('xf4'), t('xf5'), t('xf6')].map(f =>
                    <li key={f} className="flex items-start gap-3 text-zinc-700 text-sm"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>
                  )}
                  {[t('xl1'), t('xl2'), t('xl3')].map(f =>
                    <li key={f} className="flex items-start gap-3 text-zinc-400 text-sm"><Lock size={14} className="mt-0.5 shrink-0" /> {f}</li>
                  )}
                </ul>
                <Link href="/login" className="block w-full py-3.5 px-4 bg-zinc-100 text-zinc-700 font-bold text-center rounded-xl hover:bg-zinc-200 transition-all text-sm">
                  {t('pricingCtaFree')}
                </Link>
              </div>

              {/* Pro */}
              <div className="p-8 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">{t('proName')}</h3>
                  <p className="text-zinc-500 text-sm">{t('proDesc')}</p>
                </div>
                <div className="text-4xl font-black text-zinc-900 mb-2">{t('proPrice')}<span className="text-base font-medium text-zinc-400">/mo</span></div>
                <p className="text-sm text-zinc-400 mb-8">{t('proAnnual')}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[t('pf1'), t('pf2'), t('pf3'), t('pf4'), t('pf5'), t('pf6'), t('pf7')].map(f =>
                    <li key={f} className="flex items-start gap-3 text-zinc-700 text-sm"><Check size={16} className="text-blue-600 mt-0.5 shrink-0" /> {f}</li>
                  )}
                  {[t('pl1'), t('pl2')].map(f =>
                    <li key={f} className="flex items-start gap-3 text-zinc-400 text-sm"><Lock size={14} className="mt-0.5 shrink-0" /> {f}</li>
                  )}
                </ul>
                <Link href="/login" className="block w-full py-3.5 px-4 bg-zinc-100 text-zinc-700 font-bold text-center rounded-xl hover:bg-zinc-200 transition-all text-sm">
                  {t('pricingCtaTrial')}
                </Link>
              </div>

              {/* Enterprise */}
              <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 relative transform md:-translate-y-4 shadow-2xl flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">{t('pricingMostPopular')}</span>
                </div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{t('entName')}</h3>
                  <p className="text-zinc-400 text-sm">{t('entDesc')}</p>
                </div>
                <div className="text-5xl font-black text-white mb-2">{t('entPrice')}<span className="text-base font-medium text-zinc-400">/mo</span></div>
                <p className="text-sm text-zinc-500 mb-8">{t('entAnnual')}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {[t('ef1'), t('ef2'), t('ef3'), t('ef4'), t('ef5'), t('ef6'), t('ef7'), t('ef8'), t('ef9')].map(f =>
                    <li key={f} className="flex items-start gap-3 text-white text-sm"><Check size={16} className="text-blue-400 mt-0.5 shrink-0" /> {f}</li>
                  )}
                </ul>
                <Link href="/login" className="block w-full py-3.5 px-4 bg-blue-600 text-white font-bold text-center rounded-xl hover:bg-blue-500 transition-all text-sm shadow-lg shadow-blue-900/30">
                  {t('pricingCtaTrial')}
                </Link>
              </div>
            </div>

            {/* ─── Feature Comparison Table ───────────────────────────────── */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-black text-zinc-900 text-center mb-8">{t('compareTitle')}</h3>
              <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-4 bg-zinc-50 border-b border-zinc-200">
                  <div className="p-4 text-sm font-bold text-zinc-500">{t('compareFeatureCol')}</div>
                  <div className="p-4 text-center text-sm font-bold text-zinc-900">{t('explorerName')}</div>
                  <div className="p-4 text-center text-sm font-bold text-zinc-900">{t('proName')}</div>
                  <div className="p-4 text-center text-sm font-bold text-blue-600">{t('entName')}</div>
                </div>
                {/* Rows */}
                {[
                  [t('cr1'), t('cr1x'), t('crUnlimited'), t('crUnlimited')],
                  [t('cr2'), t('crYes'), t('crYes'), t('crYes')],
                  [t('cr3'), t('crYes'), t('crYes'), t('crYes')],
                  [t('cr4'), t('crYes'), t('crYes'), t('crYes')],
                  [t('cr10'), t('crYes'), t('crYes'), t('crYes')],
                  [t('cr11'), t('crYes'), t('crYes'), t('crYes')],
                  [t('cr12'), t('crYes'), t('crYes'), t('crYes')],
                  [t('cr6'), t('crNo'), t('cr6p'), t('crUnlimited')],
                  [t('cr7'), t('crNo'), t('crYes'), t('crYes')],
                  [t('cr8'), t('crNo'), t('crNo'), t('crYes')],
                  [t('cr9'), t('crNo'), t('crNo'), t('crYes')],
                ].map(([feat, explorer, pro, ent], i) => (
                  <div key={feat} className={`grid grid-cols-4 border-b border-zinc-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}>
                    <div className="p-4 text-sm text-zinc-700 font-medium">{feat}</div>
                    {[explorer, pro, ent].map((v, j) => (
                      <div key={j} className={`p-4 text-center text-sm font-semibold ${v === t('crYes') || v === t('crUnlimited') ? 'text-emerald-600' : v === t('crNo') ? 'text-zinc-300' : j === 2 ? 'text-blue-600' : 'text-zinc-700'}`}>{v}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ────────────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-zinc-900">Frequently asked questions</h2>
            </div>
            <div className="space-y-4">
              {pricingFaq.map((faq, i) => (
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

        {/* ─── Final CTA ─────────────────────────────────────────────────── */}
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
      </main>

      <Footer />
    </div>
  )
}
