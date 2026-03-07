import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import { ExplorerClient } from '@/components/ExplorerClient';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    country?: string;
    cpv?: string;
    minValue?: string;
    maxValue?: string;
    status?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const country = params.country || "All";
  const cpv = params.cpv || "All";
  const minValue = params.minValue ? parseFloat(params.minValue) : null;
  const maxValue = params.maxValue ? parseFloat(params.maxValue) : null;
  const status = params.status || "All";
  const sort = params.sort || "newest";
  const page = parseInt(params.page || "0");
  const pageSize = 15;

  const supabase = await createClient();

  const { user } = await getServerUser(supabase);
  if (!user) redirect('/login');

  const db = await getDataClient(supabase);

  const { data: profile } = await db
    .from('clients')
    .select('id')
    .eq('email', user.email)
    .single();

  let supabaseQuery = db
    .from('tenders')
    .select('*, tender_matches(match_score)', { count: 'estimated' });

  if (query) {
    supabaseQuery = supabaseQuery.textSearch('search_vector', query, { type: 'websearch', config: 'public.portuguese_unaccent' });
  }

  if (country !== "All") {
    supabaseQuery = supabaseQuery.eq('country', country);
  }

  if (cpv !== "All") {
    supabaseQuery = supabaseQuery.ilike('cpv_code', `${cpv}%`);
  }

  if (minValue !== null) {
    supabaseQuery = supabaseQuery.gte('estimated_value', minValue);
  }

  if (maxValue !== null) {
    supabaseQuery = supabaseQuery.lte('estimated_value', maxValue);
  }

  if (status === "active") {
    supabaseQuery = supabaseQuery.eq('is_active', true);
  } else if (status === "inactive") {
    supabaseQuery = supabaseQuery.eq('is_active', false);
  } else if (status === "awarded") {
    supabaseQuery = supabaseQuery.not('final_contract_value', 'is', null);
  }

  // Sort
  if (sort === "valueDesc") {
    supabaseQuery = supabaseQuery.order('estimated_value', { ascending: false, nullsFirst: false });
  } else if (sort === "valueAsc") {
    supabaseQuery = supabaseQuery.order('estimated_value', { ascending: true, nullsFirst: false });
  } else {
    // Default: newest first
    supabaseQuery = supabaseQuery.order('publication_date', { ascending: false });
  }

  const { data, count, error } = await supabaseQuery
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (error) {
    console.error("Initial Explorer fetch failed:", error);
  }

  return (
    <ExplorerClient
      initialTenders={data || []}
      initialTotal={count || 0}
      clientId={profile?.id || null}
    />
  );
}
