import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { getDataClient } from '@/utils/dev-auth';
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
  const db = await getDataClient(supabase);

  let initialProfile = null;
  let initialWonTenders: any[] = [];

  if (decodedId) {
    const { data: profile } = await db
      .from('intel_competitors')
      .select('*')
      .eq('competitor_id', decodedId)
      .single();
    initialProfile = profile;

    if (profile) {
      const { data: tenders } = await db
        .from('tenders')
        .select('tender_id, tender_uuid, title, estimated_value, final_contract_value, publication_date, winners_list, procedure_type, buyer_name')
        .eq('is_active', false)
        .filter('winners_list', 'cs', `[{"competitor_id":"${decodedId}"}]`)
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
