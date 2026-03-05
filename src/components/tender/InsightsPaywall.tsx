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

  // Pro/Enterprise users get full access
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

  // Free tier with existing insights - show blurred preview
  const projectSummary = initialInsights?.['pt-PT']?.project_summary || initialInsights?.['en-US']?.project_summary || initialInsights?.project_summary;
  if (projectSummary) {
    const truncatedSummary = projectSummary.substring(0, 200) + '...';

    return (
      <div className="space-y-6">
        {/* Truncated preview */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('paywall.previewLabel')}</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium mb-4">{truncatedSummary}</p>

          {/* Blurred content overlay */}
          <div className="relative">
            <div className="blur-[4px] select-none pointer-events-none opacity-60">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-100 rounded-2xl"></div>
                <div className="h-24 bg-slate-100 rounded-2xl"></div>
                <div className="h-24 bg-slate-100 rounded-2xl"></div>
                <div className="h-24 bg-slate-100 rounded-2xl"></div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs font-bold text-slate-500 bg-white/80 px-4 py-2 rounded-xl border border-slate-200">{t('paywall.blurredPreview')}</p>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <UpgradeCTA />
      </div>
    );
  }

  // Free tier with no insights - disabled generate + upgrade
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-300 shadow-xl shadow-slate-200 flex items-center justify-center mb-6">
          <Lock className="text-white" size={28} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">{t('paywall.generateLocked')}</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-8 font-medium">
          {t('paywall.upgradeDesc')}
        </p>
        <Button
          type="button"
          variant="accent"
          size="lg"
          disabled
          className="px-10 py-6 rounded-2xl shadow-lg font-black tracking-widest text-xs opacity-50 cursor-not-allowed"
        >
          <Lock size={14} />
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
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // handled silently
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white flex items-center justify-between">
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight mb-1">{t('paywall.upgradeTitle')}</h3>
        <p className="text-sm text-blue-100 font-medium">{t('paywall.upgradeDesc')}</p>
      </div>
      <button
        onClick={handleUpgrade}
        className="px-6 py-3 bg-white text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2 flex-shrink-0"
      >
        {t('paywall.upgradeCta')}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
