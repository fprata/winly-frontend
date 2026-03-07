'use client';

import React from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/Button';
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
  const isPro = tier === 'Professional' || tier === 'Enterprise';

  if (isPro) {
    return (
      <TenderInsights
        tenderId={tenderId}
        initialInsights={initialInsights}
        derivedDocLink={derivedDocLink}
        onInsightsGenerated={onInsightsGenerated}
      />
    );
  }

  // Free tier with partial insights — blurred preview
  const projectSummary =
    initialInsights?.['pt-PT']?.project_summary ||
    initialInsights?.['en-US']?.project_summary ||
    initialInsights?.project_summary;

  if (projectSummary) {
    return (
      <div className="space-y-4">
        {/* Truncated preview */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-200">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h3 className="text-[15px] font-bold text-zinc-900">{t('paywall.previewLabel')}</h3>
          </div>
          <p className="text-[14px] text-zinc-600 leading-relaxed mb-5">
            {projectSummary.substring(0, 200)}…
          </p>
          {/* Blurred placeholder rows */}
          <div className="relative">
            <div className="blur-[4px] select-none pointer-events-none opacity-50 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-zinc-100 rounded-xl" />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] font-medium text-zinc-500 bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm">
                {t('paywall.blurredPreview')}
              </span>
            </div>
          </div>
        </div>
        <UpgradeCTA />
      </div>
    );
  }

  // Free tier, no insights at all
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-10 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-400 flex items-center justify-center mb-5">
          <Lock size={22} />
        </div>
        <h3 className="text-[17px] font-bold text-zinc-900 mb-2">{t('paywall.generateLocked')}</h3>
        <p className="text-[13px] text-zinc-500 max-w-sm mb-7 leading-relaxed">{t('paywall.upgradeDesc')}</p>
        <Button
          type="button"
          variant="ghost"
          size="md"
          disabled
          className="px-8 opacity-40 cursor-not-allowed"
        >
          <Lock size={15} />
          {t('paywall.generateLocked')}
        </Button>
      </div>
      <UpgradeCTA />
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
        body: JSON.stringify({ tier: 'Professional' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
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
