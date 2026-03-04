"use client";

import React from 'react';
import { SearchableSelect } from './SearchableSelect';
import { CPV_CODES } from '@/utils/cpv-data';
import Fuse from 'fuse.js';
import { useTranslations } from 'next-intl';

interface CPVSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CPVSelector({ value, onChange }: CPVSelectorProps) {
  const t = useTranslations('profile');
  
  const searchCPV = async (query: string) => {
    const fuse = new Fuse(CPV_CODES, {
      keys: ['value', 'label'],
      threshold: 0.3
    });
    
    return fuse.search(query).map(res => ({
      value: res.item.value,
      label: `${res.item.value} - ${res.item.label}`
    })).slice(0, 10);
  };

  return (
    <SearchableSelect
      label={t('cpvCodes')}
      value={value}
      onChange={onChange}
      onSearch={searchCPV}
      placeholder={t('cpvPlaceholder')}
    />
  );
}
