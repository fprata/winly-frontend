import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { CompetitorIntelligenceClient } from '@/components/CompetitorIntelligenceClient';

export const revalidate = 300;

export default async function CompetitorIntelligencePage({
  searchParams
}: {
  searchParams: Promise<{ name?: string; fromTender?: string }>
}) {
  const { name, fromTender } = await searchParams;
  const supabase = await createClient();

    let initialSearchResults: any[] = [];

    let initialProfile = null;

  

    if (name) {

      const { data: exactMatches } = await supabase

        .from('intel_competitors')

        .select('*')

        .ilike('name', name)

        .limit(1);

  

      if (exactMatches && exactMatches.length > 0) {

        initialProfile = exactMatches[0];

      } else {

        const { data } = await supabase

          .from('intel_competitors')

          .select('name, country, total_wins, competitor_id')

          .ilike('name', `%${name}%`)

          .order('total_wins', { ascending: false })

          .limit(10);

        initialSearchResults = data || [];

      }

    } else {

      // Default List View

      const { data } = await supabase

        .from('intel_competitors')

        .select('name, country, total_wins, competitor_id')

        .order('total_wins', { ascending: false })

        .limit(10);

      initialSearchResults = data || [];

    }

  

    return (

      <CompetitorIntelligenceClient 

        initialProfile={initialProfile} 

        initialSearchResults={initialSearchResults}

        initialName={name || null} 

        fromTender={fromTender || null} 

      />

    );

  }

  