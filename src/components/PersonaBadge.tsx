"use client";

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PersonaBadgeProps {
  personaName: string;
}

export function PersonaBadge({ personaName }: PersonaBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('intelligence.personas.types');

  // Map the persona_name from DB/Cluster logic to the translation keys
  const getPersonaKey = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('open innovator')) return 'openInnovator';
    if (n.includes('loyalist') || n.includes('relationship')) return 'loyalist';
    if (n.includes('price hawk') || n.includes('aggressive discounter') || n.includes('discounter')) return 'priceHawk';
    if (n.includes('high-value hawk')) return 'highValueHawk';
    if (n.includes('consistent standard')) return 'consistentStandard';
    
    // Competitors
    if (n.includes('national dominator')) return 'nationalDominator';
    if (n.includes('niche specialist')) return 'nicheSpecialist';
    if (n.includes('local king')) return 'localKing';
    if (n.includes('rising star')) return 'risingStar';
    
    return null;
  };

  const key = getPersonaKey(personaName);
  
  if (!key) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-zinc-900 text-white">
        {personaName}
      </span>
    );
  }

  return (
    <div className="relative inline-block group">
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-zinc-900 text-white">
          {t(`${key}.name` as any)}
        </span>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
        >
          <Info size={10} />
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 top-full mt-2 w-64 bg-zinc-900 text-white p-4 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{t(`${key}.name` as any)}</p>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={12} />
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {t(`${key}.desc` as any)}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10">
              <a 
                href="/personas" 
                className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                View Full Guide
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}