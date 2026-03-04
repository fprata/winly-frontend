import React from 'react';
import { TrendingUp, PieChart, Info, Activity } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

const MarketOverviewClient = dynamic(
  () => import('@/components/MarketOverviewClient').then(mod => ({ default: mod.MarketOverviewClient })),
  {
    loading: () => <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>
  }
);

export default async function MarketIntelligencePage() {
  const t = await getTranslations('intelligence');

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <TrendingUp className="text-blue-600" size={32} />
          {t('market.title')}
        </h1>
        <p className="text-slate-500 mt-2 font-medium">{t('market.subtitle')}</p>
      </div>

      <MarketOverviewClient />
    </div>
  );
}
