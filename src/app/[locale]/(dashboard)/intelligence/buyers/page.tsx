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
      // Fallback: populate search results with partial matches
      const { data } = await supabase
        .from('intel_buyers')
        .select('name, country, total_contracts, buyer_company_id')
        .ilike('name', `%${name}%`)
        .order('total_contracts', { ascending: false })
        .limit(10);
      initialSearchResults = data || [];
    }
  } else {
    // Default List View
    const { data } = await supabase
      .from('intel_buyers')
      .select('name, country, total_contracts, buyer_company_id')
      .order('total_contracts', { ascending: false })
      .limit(10);
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
