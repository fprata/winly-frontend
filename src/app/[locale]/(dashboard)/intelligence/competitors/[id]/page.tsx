import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { CompetitorIntelligenceClient } from '@/components/CompetitorIntelligenceClient';

export const revalidate = 300;

export default async function CompetitorProfilePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const supabase = await createClient();

  let initialProfile = null;

  if (decodedId) {
    const { data } = await supabase
      .from('intel_competitors')
      .select('*')
      .eq('competitor_id', decodedId)
      .single();
    initialProfile = data;
  }

  return (
    <CompetitorIntelligenceClient 
      initialProfile={initialProfile} 
      initialSearchResults={[]}
      initialName={null} 
      fromTender={null} 
    />
  );
}
