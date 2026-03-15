import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { getServerUser, getDataClient } from '@/utils/dev-auth';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

const MatchesClient = dynamic(
  () => import('@/components/MatchesClient').then(mod => ({ default: mod.MatchesClient })),
  {
    loading: () => <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }
);

export async function generateMetadata() {
  const t = await getTranslations('matches');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function MatchesPage() {
  const supabase = await createClient();

  const { user } = await getServerUser(supabase);
  if (!user) redirect('/login');

  const db = await getDataClient(supabase);

  const { data: profile } = await db
    .from('clients')
    .select('id, tier')
    .eq('email', user.email)
    .single();

  if (!profile) redirect('/onboarding');

  // Fetch total count + initial matches
  const [{ count: totalCount }, { data: matches, error }] = await Promise.all([
    db
      .from('tender_matches')
      .select('*, tenders!inner(is_active)', { count: 'exact', head: true })
      .eq('client_id', profile.id)
      .eq('tenders.is_active', true),
    db
      .from('tender_matches')
      .select(`
        match_score,
        match_reasons,
        score_cpv,
        score_location,
        score_capacity,
        score_keyword,
        score_market_opp,
        win_probability,
        tender_id,
        tender_uuid,
        tenders!inner (*)
      `)
      .eq('client_id', profile.id)
      .eq('tenders.is_active', true)
      .order('match_score', { ascending: false })
      .limit(200),
  ]);

  if (error) {
    console.error("Fetch matches error:", error);
  }

  return (
    <MatchesClient
      initialMatches={matches || []}
      clientId={profile.id}
      totalCount={totalCount || undefined}
      tier={profile?.tier || 'free'}
    />
  );
}
