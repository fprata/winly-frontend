import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { CompetitorIntelligenceClient } from '@/components/CompetitorIntelligenceClient';

export const revalidate = 300;

export default async function CompetitorProfilePage({
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
  let initialWonTenders: any[] = [];

  if (decodedId) {
    const { data: profile } = await supabase
      .from('intel_competitors')
      .select('*')
      .eq('competitor_id', decodedId)
      .single();
    initialProfile = profile;

    if (profile?.name) {
      const { data: tenders } = await supabase
        .from('tenders')
        .select('tender_id, tender_uuid, title, estimated_value, final_contract_value, publication_date, winners_list, procedure_type, buyer_name')
        .eq('is_active', false)
        .contains('winners_list', [{ winner_name: profile.name }])
        .order('publication_date', { ascending: false });
      initialWonTenders = tenders || [];
    }
  }

  return (
    <CompetitorIntelligenceClient
      initialProfile={initialProfile}
      initialSearchResults={[]}
      initialName={null}
      initialWonTenders={initialWonTenders}
      fromTender={fromTender || null}
    />
  );
}
