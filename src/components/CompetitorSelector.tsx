"use client";

import React from 'react';
import { SearchableSelect } from './SearchableSelect';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';

interface CompetitorSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CompetitorSelector({ value, onChange }: CompetitorSelectorProps) {
  const t = useTranslations('profile');

  const searchCompetitors = async (query: string) => {
    const { data, error } = await supabase
      .from('intel_competitors')
      .select('name, persona_name')
      .textSearch('search_vector', query, { type: 'websearch', config: 'public.simple_unaccent' })
      .limit(10);

    if (error || !data) return [];

    return data.map(comp => ({
      value: comp.name,
      label: comp.name,
      subLabel: comp.persona_name ? `Persona: ${comp.persona_name}` : undefined
    }));
  };

  return (
    <SearchableSelect
      label={t('competitors')}
      value={value}
      onChange={onChange}
      onSearch={searchCompetitors}
      placeholder={t('competitorsPlaceholder')}
      maxSelections={30}
    />
  );
}
