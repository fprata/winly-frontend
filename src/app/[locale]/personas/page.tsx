import React from 'react';
import { 
  Users, 
  Building2, 
  Trophy, 
  Target, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Globe, 
  Lock, 
  Award
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PersonaCarousel } from '@/components/PersonaCarousel';

export default async function PersonasPage() {
  const t = await getTranslations('intelligence.personas');

  const buyerPersonas = [
    {
      id: 'open-innovator',
      name: t('types.openInnovator.name'),
      icon: <Globe size={32} className="text-blue-500" />,
      color: 'bg-blue-50 border-blue-100',
      textColor: 'text-blue-900',
      description: t('types.openInnovator.desc'),
      metrics: [
        { label: 'Vendor Diversity', value: 'High (>90%)' },
        { label: 'Incumbent Share', value: 'Low (<20%)' },
        { label: 'Strategy', value: 'High Opportunity' }
      ]
    },
    {
      id: 'loyalist',
      name: t('types.loyalist.name'),
      icon: <ShieldCheck size={32} className="text-indigo-500" />,
      color: 'bg-indigo-50 border-indigo-100',
      textColor: 'text-indigo-900',
      description: t('types.loyalist.desc'),
      metrics: [
        { label: 'Vendor Diversity', value: 'Low' },
        { label: 'Incumbent Share', value: 'High (>50%)' },
        { label: 'Strategy', value: 'Hard to Penetrate' }
      ]
    },
    {
      id: 'price-hawk',
      name: t('types.priceHawk.name'),
      icon: <Zap size={32} className="text-rose-500" />,
      color: 'bg-rose-50 border-rose-100',
      textColor: 'text-rose-900',
      description: t('types.priceHawk.desc'),
      metrics: [
        { label: 'Avg Discount', value: '> 40%' },
        { label: 'Contract Volume', value: 'High' },
        { label: 'Strategy', value: 'Price War' }
      ]
    },
    {
      id: 'high-value-hawk',
      name: t('types.highValueHawk.name'),
      icon: <Award size={32} className="text-amber-500" />,
      color: 'bg-amber-50 border-amber-100',
      textColor: 'text-amber-900',
      description: t('types.highValueHawk.desc'),
      metrics: [
        { label: 'Avg Value', value: '> €200k' },
        { label: 'Avg Discount', value: '> 30%' },
        { label: 'Strategy', value: 'Scale Efficiency' }
      ]
    },
    {
      id: 'consistent-standard',
      name: t('types.consistentStandard.name'),
      icon: <Building2 size={32} className="text-zinc-500" />,
      color: 'bg-zinc-50 border-zinc-100',
      textColor: 'text-zinc-900',
      description: t('types.consistentStandard.desc'),
      metrics: [
        { label: 'Avg Discount', value: '~10%' },
        { label: 'Diversity', value: 'Balanced' },
        { label: 'Strategy', value: 'Reliable Target' }
      ]
    }
  ];

  const competitorPersonas = [
    {
      id: 'national-dominator',
      name: t('types.nationalDominator.name'),
      icon: <Trophy size={32} className="text-purple-500" />,
      color: 'bg-purple-50 border-purple-100',
      textColor: 'text-purple-900',
      description: t('types.nationalDominator.desc'),
      metrics: [
        { label: 'Total Wins', value: '> 50' },
        { label: 'Geo Reach', value: 'National' },
        { label: 'Threat Level', value: 'Critical' }
      ]
    },
    {
      id: 'niche-specialist',
      name: t('types.nicheSpecialist.name'),
      icon: <Target size={32} className="text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-100',
      textColor: 'text-emerald-900',
      description: t('types.nicheSpecialist.desc'),
      metrics: [
        { label: 'Avg Value', value: '> €100k' },
        { label: 'Sector Focus', value: 'High' },
        { label: 'Threat Level', value: 'High (In Niche)' }
      ]
    },
    {
      id: 'local-king',
      name: t('types.localKing.name'),
      icon: <Lock size={32} className="text-cyan-500" />,
      color: 'bg-cyan-50 border-cyan-100',
      textColor: 'text-cyan-900',
      description: t('types.localKing.desc'),
      metrics: [
        { label: 'Client Dependency', value: '> 80%' },
        { label: 'Avg Value', value: 'Low' },
        { label: 'Threat Level', value: 'High (Locally)' }
      ]
    },
    {
      id: 'rising-star',
      name: t('types.risingStar.name'),
      icon: <TrendingUp size={32} className="text-orange-500" />,
      color: 'bg-orange-50 border-orange-100',
      textColor: 'text-orange-900',
      description: t('types.risingStar.desc'),
      metrics: [
        { label: 'Total Wins', value: '10 - 50' },
        { label: 'Diversity', value: 'Growing' },
        { label: 'Threat Level', value: 'Moderate' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-black text-zinc-900 mb-6 tracking-tight">{t('title')}</h1>
            <p className="text-xl text-zinc-600 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-24">
            {/* Buyers Section */}
            <section>
              <div className="flex items-center gap-4 mb-10 justify-center md:justify-start px-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Building2 size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-zinc-900">{t('buyersTitle')}</h2>
                  <p className="text-zinc-500 font-medium">{t('buyersSubtitle')}</p>
                </div>
              </div>
              
              <div className="-mx-4 md:mx-0">
                <PersonaCarousel personas={buyerPersonas} />
              </div>
            </section>

            {/* Competitors Section */}
            <section>
              <div className="flex items-center gap-4 mb-10 justify-center md:justify-start px-4">
                <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                  <Users size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-zinc-900">{t('competitorsTitle')}</h2>
                  <p className="text-zinc-500 font-medium">{t('competitorsSubtitle')}</p>
                </div>
              </div>
              
              <div className="-mx-4 md:mx-0">
                <PersonaCarousel personas={competitorPersonas} />
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
