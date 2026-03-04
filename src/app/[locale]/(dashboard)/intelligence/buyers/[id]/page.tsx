import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { BuyerIntelligenceClient } from '@/components/BuyerIntelligenceClient';

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

  let initialProfile = null;

  if (decodedId) {
    const { data } = await supabase
      .from('intel_buyers')
      .select('*')
      .eq('buyer_company_id', decodedId)
      .single();
    initialProfile = data;
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
