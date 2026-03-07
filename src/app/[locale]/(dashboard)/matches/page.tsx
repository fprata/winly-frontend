import React from 'react';
import { createClient } from '@/utils/supabase/server';
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('clients')
    .select('id')
    .eq('email', user.email)
    .single();

  if (!profile) redirect('/onboarding');

  // Fetch matches from tender_matches table
  const { data: matches, error } = await supabase
    .from('tender_matches')
    .select(`
      match_score,
      match_reasons,
      tender_id,
      tenders (*)
    `)
    .eq('client_id', profile.id)
    .order('match_score', { ascending: false})
    .limit(100); // Pagination: initial load of 100 matches

  if (error) {
    console.error("Fetch matches error:", error);
  }

  return <MatchesClient initialMatches={matches || []} clientId={profile.id} />;
}
