import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import { BuyerIntelligenceClient } from '@/components/BuyerIntelligenceClient';
import { FeatureGate } from '@/components/FeatureGate';
import { hasAccess } from '@/lib/tier-config';

export const revalidate = 300;

export default async function BuyerProfilePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fromTender?: string }>;
}) {
  const { id } = await params;
  const { fromTender } = await searchParams;
  const decodedId = decodeURIComponent(id);
  const supabase = await createClient();
  const { user } = await getServerUser(supabase);
  const db = await getDataClient(supabase);

  const { data: clientProfile } = await db
    .from('clients')
    .select('tier')
    .eq('email', user?.email)
    .single();

  const tier = clientProfile?.tier || 'free';

  if (!hasAccess(tier, 'buyerIntel')) {
    return (
      <FeatureGate tier={tier} feature="buyerIntel">
        <div />
      </FeatureGate>
    );
  }

  let initialProfile = null;

  if (decodedId) {
    const { data: rows, error } = await db
      .from('intel_buyers')
      .select('*')
      .eq('buyer_company_id', decodedId)
      .order('total_contracts', { ascending: false })
      .limit(5);
    if (error) console.error('[BuyerProfile] Lookup failed:', decodedId, error.message);
    // Prefer the row with populated top_winners (handles stale duplicates)
    initialProfile = rows?.find((r: any) => Array.isArray(r.top_winners) && r.top_winners.length > 0) || rows?.[0] || null;
  }

  return (
    <BuyerIntelligenceClient
      initialProfile={initialProfile}
      initialSearchResults={[]}
      initialName={null}
      fromTender={fromTender || null}
    />
  );
}
