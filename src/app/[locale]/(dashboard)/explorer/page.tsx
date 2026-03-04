import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { ExplorerClient } from '@/components/ExplorerClient';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const country = params.country || "All";
  const page = parseInt(params.page || "0");
  const pageSize = 15;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user.email)
    .single();

  let supabaseQuery = supabase
    .from('tenders')
    .select('*, tender_matches(match_score)', { count: 'estimated' });

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,buyer_name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (country !== "All") {
    supabaseQuery = supabaseQuery.eq('country', country);
  }

  const { data, count, error } = await supabaseQuery
    .order('publication_date', { ascending: false })
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