import React from 'react';
import { TrendingUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { getDataClient } from '@/utils/dev-auth';
import { MarketOverviewClient } from '@/components/MarketOverviewClient';

export const revalidate = 60;

export default async function MarketIntelligencePage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const [t, { sector = 'ALL' }] = await Promise.all([
    getTranslations('intelligence'),
    searchParams,
  ]);

  const supabase = await createClient();
  const db = await getDataClient(supabase);

  // Parallelize all 4 queries
  const [filterResult, statsResult, competitorsResult, buyerMetricsResult] = await Promise.all([
    db.from('market_overview').select('cpv_division').limit(1000),
    db.from('market_overview').select('*').eq('cpv_division', sector).limit(1).maybeSingle(),
    db.from('intel_competitors')
      .select('name, competitor_id, total_wins, total_revenue, win_rate_pct, sector_diversity, direct_award_pct')
      .eq('country', 'PT')
      .order('total_revenue', { ascending: false })
      .limit(20),
    db.from('intel_buyers')
      .select('avg_bidder_count, direct_award_pct, avg_discount, total_contracts')
      .eq('country', 'PT')
      .gt('total_contracts', 10)
      .limit(200),
  ]);

  const uniqueSectors: string[] = filterResult.data
    ? Array.from(new Set(filterResult.data.map((r: any) => r.cpv_division))).filter((s): s is string => s !== 'ALL').sort() as string[]
    : [];

  const buyerMetrics = buyerMetricsResult.data;
  const marketHealth = (() => {
    if (!buyerMetrics || buyerMetrics.length === 0) return null;
    const valid = buyerMetrics.filter((b: any) => b.avg_bidder_count > 0);
    const totalContracts = buyerMetrics.reduce((s: number, b: any) => s + (b.total_contracts || 0), 0);
    const weightedBidders = valid.reduce((s: number, b: any) => s + (b.avg_bidder_count * b.total_contracts), 0);
    const weightedDirectAward = buyerMetrics.reduce((s: number, b: any) => s + (b.direct_award_pct * b.total_contracts), 0);
    const weightedDiscount = buyerMetrics.filter((b: any) => b.avg_discount > 0)
      .reduce((s: number, b: any) => s + (b.avg_discount * b.total_contracts), 0);
    const discountContracts = buyerMetrics.filter((b: any) => b.avg_discount > 0)
      .reduce((s: number, b: any) => s + (b.total_contracts || 0), 0);

    return {
      avgBidders: valid.length > 0 ? weightedBidders / valid.reduce((s: number, b: any) => s + b.total_contracts, 0) : 0,
      directAwardPct: totalContracts > 0 ? weightedDirectAward / totalContracts : 0,
      avgDiscount: discountContracts > 0 ? weightedDiscount / discountContracts : 0,
      totalBuyers: buyerMetrics.length,
    };
  })();

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
        initialData={statsResult.data}
        initialSectors={uniqueSectors}
        selectedSector={sector}
        topCompetitors={competitorsResult.data || []}
        marketHealth={marketHealth}
      />
    </div>
  );
}
