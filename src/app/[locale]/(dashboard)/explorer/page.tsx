import React, { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const ExplorerClient = dynamic(
  () => import('@/components/ExplorerClient').then(mod => ({ default: mod.ExplorerClient })),
  { ssr: true }
);

export const revalidate = 30;

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

  // Parallelize auth + profile lookup
  const [{ user }, db] = await Promise.all([
    getServerUser(supabase),
    getDataClient(supabase),
  ]);
  if (!user) redirect('/login');

  // Fetch profile and tenders in parallel
  const COLUMNS = 'tender_id, tender_uuid, title, buyer_name, estimated_value, final_contract_value, currency, publication_date, submission_deadline, country, cpv_code, is_active';

  let supabaseQuery = db
    .from('tenders')
    .select(COLUMNS, { count: 'estimated' });

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
    supabaseQuery = supabaseQuery.order('publication_date', { ascending: false });
  }

  const [profileResult, tendersResult] = await Promise.all([
    db.from('clients').select('id').eq('email', user.email).single(),
    supabaseQuery.range(page * pageSize, (page + 1) * pageSize - 1),
  ]);

  if (tendersResult.error) {
    console.error("Initial Explorer fetch failed:", tendersResult.error);
  }

  return (
    <ExplorerClient
      initialTenders={tendersResult.data || []}
      initialTotal={tendersResult.count || 0}
      clientId={profileResult.data?.id || null}
    />
  );
}
