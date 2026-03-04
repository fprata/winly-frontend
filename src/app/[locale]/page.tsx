import { Link } from '@/navigation'
import { ArrowRight, Check, ShieldCheck, Zap, Globe, Cpu, BarChart3, Users, Lock, Search, Briefcase, FileText } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: "AI-Powered Procurement Intelligence for EU Tenders",
  description: "Win more public procurement contracts with Winly AI. 150-point AI matching algorithm analyzes TED & BASE tenders. Get win probabilities, competitor intelligence, and price recommendations. 14-day free trial.",
  openGraph: {
    title: "Winly AI | Win More EU Public Procurement Contracts",
    description: "AI-powered tender matching with 150-point scoring. TED & BASE integration, win probability calculator, and competitive intelligence.",
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Winly AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      price: '149',
      priceCurrency: 'EUR',
      name: 'Starter Plan',
      description: 'Up to 50 matches per month, basic search algorithms',
    },
    {
      '@type': 'Offer',
      price: '399',
      priceCurrency: 'EUR',
      name: 'Professional Plan',
      description: 'Unlimited matches, full V3 AI algorithm, real-time updates',
    },
    {
      '@type': 'Offer',
      price: '999',
      priceCurrency: 'EUR',
      name: 'Enterprise Plan',
      description: 'Everything in Pro plus team collaboration, CRM, and API access',
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
  },
  description: 'AI-powered procurement intelligence platform that matches businesses with relevant TED and BASE public procurement tenders using a 150-point scoring algorithm.',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Winly AI',
  url: 'https://winly.vercel.app',
  logo: 'https://winly.vercel.app/logo.png',
  description: 'Procurement intelligence platform for EU public tenders',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Sales',
    email: 'hello@winly.ai',
  },
}

export default async function LandingPage() {
  const t = await getTranslations('HomePage');
  const tStats = await getTranslations('stats');
  const tFeatures = await getTranslations('features');
  const tPricing = await getTranslations('pricing');
  const tCommon = await getTranslations('common');

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            {t('badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
            {t('title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t('titleAmount')}</span> <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t('titleHighlight')}</span> {t('titleEnd')}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group">
              {t('cta')} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-bold rounded-xl text-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center">
              {t('ctaSecondary')}
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400 font-medium">{t('trust')}</p>
        </div>
      </section>

      {/* Strategic Value Stats */}
      <section className="py-10 bg-white border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">{tStats('scoringPoints')}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{tStats('scoringPointsLabel')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">{tStats('timeSaved')}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{tStats('timeSavedLabel')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">{tStats('noiseReduction')}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{tStats('noiseReductionLabel')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">{tStats('roi')}</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{tStats('roiLabel')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{tFeatures('title')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              {tFeatures('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tFeatures('aiMatching.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {tFeatures('aiMatching.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tFeatures('multiSource.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {tFeatures('multiSource.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tFeatures('winProbability.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {tFeatures('winProbability.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tFeatures('competitor.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {tFeatures('competitor.description')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tFeatures('pricing.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {tFeatures('pricing.description')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText size={26} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{tFeatures('documents.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {tFeatures('documents.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Intelligence Section */}
      <section className="py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Users size={12} />
                {tFeatures('strategic.badge')}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {tFeatures('strategic.title')} <br/>
                <span className="text-blue-500">{tFeatures('strategic.highlight')}</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-xl">
                {tFeatures('strategic.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/personas" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 group">
                  {tFeatures('strategic.cta')} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
                <Users className="text-purple-400 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">{tFeatures('strategic.fingerprinting.title')}</h3>
                <p className="text-sm text-gray-400">{tFeatures('strategic.fingerprinting.desc')}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
                <Search className="text-emerald-400 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">{tFeatures('strategic.discovery.title')}</h3>
                <p className="text-sm text-gray-400">{tFeatures('strategic.discovery.desc')}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors sm:col-span-2">
                <Zap className="text-amber-400 mb-4" size={32} />
                <h3 className="text-lg font-bold mb-2">{tFeatures('strategic.prediction.title')}</h3>
                <p className="text-sm text-gray-400">{tFeatures('strategic.prediction.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{tPricing('title')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">{tPricing('subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {/* Starter Tier */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 relative flex flex-col">
               <h3 className="text-xl font-bold text-gray-900 mb-2">{tPricing('starter')}</h3>
               <p className="text-gray-500 text-sm mb-6">{tPricing('starterDesc')}</p>
               <div className="text-4xl font-black text-gray-900 mb-6">{tPricing('starterPrice')}<span className="text-base font-medium text-gray-400">/mo</span></div>
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('starterFeature1')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('starterFeature2')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('starterFeature3')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('starterFeature4')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('starterFeature5')}</li>
               </ul>
               <Link href="/login" className="block w-full py-4 px-4 bg-gray-100 text-gray-700 font-bold text-center rounded-xl hover:bg-gray-200 transition-all">{tCommon('startTrial')}</Link>
            </div>

            {/* Professional Tier */}
             <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 relative transform md:-translate-y-4 shadow-2xl flex flex-col">
               <div className="absolute top-0 right-0 p-4">
                 <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-blue-900/50">{tPricing('popular')}</span>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">{tPricing('professional')}</h3>
               <p className="text-gray-400 text-sm mb-6">{tPricing('professionalDesc')}</p>
               <div className="text-5xl font-black text-white mb-6">{tPricing('professionalPrice')}<span className="text-base font-medium text-gray-50">/mo</span></div>
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-white font-medium"><Check size={18} className="text-blue-400" /> {tPricing('professionalFeature1')}</li>
                 <li className="flex items-center gap-3 text-white font-medium"><Check size={18} className="text-blue-400" /> {tPricing('professionalFeature2')}</li>
                 <li className="flex items-center gap-3 text-white font-medium"><Check size={18} className="text-blue-400" /> {tPricing('professionalFeature3')}</li>
                 <li className="flex items-center gap-3 text-white font-medium"><Check size={18} className="text-blue-400" /> {tPricing('professionalFeature4')}</li>
                 <li className="flex items-center gap-3 text-white font-medium"><Check size={18} className="text-blue-400" /> {tPricing('professionalFeature5')}</li>
                 <li className="flex items-center gap-3 text-white font-medium"><Check size={18} className="text-blue-400" /> {tPricing('professionalFeature6')}</li>
                 <li className="flex items-center gap-3 text-white font-medium"><Check size={18} className="text-blue-400" /> {tPricing('professionalFeature7')}</li>
               </ul>
               <Link href="/login" className="block w-full py-4 px-4 bg-blue-600 text-white font-bold text-center rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">{tCommon('startTrial')}</Link>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-3xl bg-white border border-gray-200 relative flex flex-col">
               <h3 className="text-xl font-bold text-gray-900 mb-2">{tPricing('enterprise')}</h3>
               <p className="text-gray-500 text-sm mb-6">{tPricing('enterpriseDesc')}</p>
               <div className="text-4xl font-black text-gray-900 mb-6">{tPricing('enterprisePrice')}<span className="text-base font-medium text-gray-400">/mo</span></div>
               <ul className="space-y-4 mb-8 flex-1">
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('enterpriseFeature1')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('enterpriseFeature2')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('enterpriseFeature3')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('enterpriseFeature4')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('enterpriseFeature5')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('enterpriseFeature6')}</li>
                 <li className="flex items-center gap-3 text-gray-700 font-medium"><Check size={18} className="text-blue-600" /> {tPricing('enterpriseFeature7')}</li>
               </ul>
               <Link href="/login" className="block w-full py-4 px-4 bg-gray-100 text-gray-700 font-bold text-center rounded-xl hover:bg-gray-200 transition-all">{tCommon('contactSales')}</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
    </div>
  )
}
