import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { BuyerIntelligenceClient } from '@/components/BuyerIntelligenceClient';

export const revalidate = 300;

export default async function BuyerIntelligencePage({
  searchParams
}: {
  searchParams: Promise<{ name?: string; fromTender?: string }>
}) {
  const { name, fromTender } = await searchParams;
  const supabase = await createClient();

  let initialSearchResults: any[] = [];
  let initialProfile = null;

  if (name) {
    // Try to find exact match for direct profile view
    const { data: exactMatches } = await supabase
      .from('intel_buyers')
      .select('*')
      .ilike('name', name)
      .limit(1);

    if (exactMatches && exactMatches.length > 0) {
      initialProfile = exactMatches[0];
    } else {
      // Fallback: populate search results with full-text search
      const { data } = await supabase
        .from('intel_buyers')
        .select('name, country, total_contracts, buyer_company_id, total_spend, avg_discount, avg_bidder_count')
        .textSearch('search_vector', name, { type: 'websearch', config: 'public.simple_unaccent' })
        .order('total_contracts', { ascending: false })
        .limit(10);
      initialSearchResults = data || [];
    }
  } else {
    // Default List View — fetch rich data for result cards
    const { data } = await supabase
      .from('intel_buyers')
      .select('name, country, total_contracts, buyer_company_id, total_spend, avg_discount, avg_bidder_count')
      .order('total_contracts', { ascending: false })
      .limit(20);
    initialSearchResults = data || [];
  }

  return (
    <BuyerIntelligenceClient
      initialProfile={initialProfile}
      initialSearchResults={initialSearchResults}
      initialName={name || null}
      fromTender={fromTender || null}
    />
  );
}
