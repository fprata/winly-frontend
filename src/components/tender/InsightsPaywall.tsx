'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TenderInsights } from '../TenderInsights';
import type { UserTier } from './types';

interface InsightsPaywallProps {
  tenderId: string;
  initialInsights: any;
  derivedDocLink: string | null;
  tier: UserTier;
  onInsightsGenerated?: (insights: any) => void;
}

export function InsightsPaywall({ tenderId, initialInsights, derivedDocLink, tier, onInsightsGenerated }: InsightsPaywallProps) {
  const t = useTranslations('tenders');
  const isPro = tier === 'Pro' || tier === 'Professional' || tier === 'Enterprise';

  // Both free and Pro users can access TenderInsights.
  // Free users are limited to 2 analyses/month (enforced server-side).
  // The TenderInsights component handles the 403 "FREE_LIMIT" error from the API.
  return (
    <div className="space-y-4">
      <TenderInsights
        tenderId={tenderId}
        initialInsights={initialInsights}
        derivedDocLink={derivedDocLink}
        onInsightsGenerated={onInsightsGenerated}
      />
      {!isPro && !initialInsights && (
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
          <Sparkles size={14} className="text-blue-600 shrink-0" />
          <p className="text-[12px] text-blue-700 font-medium flex-1">
            {t('paywall.freeLimit')}
          </p>
        </div>
      )}
      {!isPro && <UpgradeCTA />}
    </div>
  );
}

function UpgradeCTA() {
  const t = useTranslations('tenders');

  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'Pro' }),
      });
      const data = await res.json();
      if (data.url && /^https:\/\/(checkout\.)?stripe\.com\//.test(data.url)) {
        window.location.href = data.url;
      }
    } catch {
      // handled silently
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex items-center justify-between gap-6">
      <div>
        <h3 className="text-[15px] font-bold text-zinc-900 mb-1">{t('paywall.upgradeTitle')}</h3>
        <p className="text-[13px] text-zinc-500">{t('paywall.upgradeDesc')}</p>
      </div>
      <button
        onClick={handleUpgrade}
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-all"
      >
        {t('paywall.upgradeCta')}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
