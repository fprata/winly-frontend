import React from 'react';
import { TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { getDataClient } from '@/utils/dev-auth';
import { MarketOverviewClient } from '@/components/MarketOverviewClient';

export default async function MarketIntelligencePage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; sector?: string }>;
}) {
  const t = await getTranslations('intelligence');
  const { country = 'ALL', sector = 'ALL' } = await searchParams;

  const supabase = await createClient();
  const db = await getDataClient(supabase);

  // Fetch filter options
  const { data: filterRows } = await db
    .from('market_overview')
    .select('country, cpv_division')
    .limit(1000);

  const uniqueCountries: string[] = filterRows
    ? Array.from(new Set(filterRows.map((r: any) => r.country))).sort() as string[]
    : [];
  const uniqueSectors: string[] = filterRows
    ? Array.from(new Set(filterRows.map((r: any) => r.cpv_division))).sort() as string[]
    : [];

  // Fetch selected data row
  const { data: statsData } = await db
    .from('market_overview')
    .select('*')
    .eq('country', country)
    .eq('cpv_division', sector)
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-zinc-900 flex items-center gap-3 tracking-tight">
          <TrendingUp className="text-blue-600" size={32} />
          {t('market.title')}
        </h1>
        <p className="text-zinc-500 mt-2 font-medium">{t('market.subtitle')}</p>
      </div>

      <MarketOverviewClient
        initialData={statsData}
        initialCountries={uniqueCountries}
        initialSectors={uniqueSectors}
        selectedCountry={country}
        selectedSector={sector}
      />
    </div>
  );
}
