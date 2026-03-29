'use client';

import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Feature } from '@/lib/tier-config';
import { hasAccess, requiredTier } from '@/lib/tier-config';

interface FeatureGateProps {
  tier: string | null | undefined;
  feature: Feature;
  children: React.ReactNode;
}

/**
 * Wraps any content with a tier paywall.
 * If the user's tier has access → renders children.
 * Otherwise → renders an upgrade prompt.
 */
export function FeatureGate({ tier, feature, children }: FeatureGateProps) {
  const t = useTranslations('featureGate');

  if (hasAccess(tier, feature)) {
    return <>{children}</>;
  }

  const target = requiredTier(feature);

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: target }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // handled silently
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
          <Lock size={22} />
        </div>
        <h3 className="text-[17px] font-bold text-zinc-900 mb-2">
          {t('title')}
        </h3>
        <p className="text-[13px] text-zinc-500 max-w-sm mb-7 leading-relaxed">
          {t('description', { tier: target })}
        </p>
        <button
          onClick={handleUpgrade}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-all"
        >
          {t('cta', { tier: target })}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
