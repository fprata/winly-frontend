'use client';

import React from 'react';
import { Shield, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RiskScoreHeroProps {
  score: number;
  level?: string;
  factors?: string[] | string;
}

function getRiskConfig(score: number) {
  if (score <= 3) return {
    strokeColor: '#10b981',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badgeBg: '#10b981',
    scoreColor: '#10b981',
    icon: Shield,
    labelKey: 'riskLow' as const,
  };
  if (score <= 6) return {
    strokeColor: '#f59e0b',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    badgeBg: '#f59e0b',
    scoreColor: '#f59e0b',
    icon: ShieldAlert,
    labelKey: 'riskMedium' as const,
  };
  return {
    strokeColor: '#dc2626',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    badgeBg: '#dc2626',
    scoreColor: '#dc2626',
    icon: AlertTriangle,
    labelKey: 'riskHigh' as const,
  };
}

export function RiskScoreHero({ score, level, factors }: RiskScoreHeroProps) {
  const t = useTranslations('tenders');
  const config = getRiskConfig(score);
  const Icon = config.icon;

  const factorsList = Array.isArray(factors)
    ? factors
    : typeof factors === 'string'
      ? factors.split('\n').filter(Boolean)
      : [];

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 mb-4">
      {/* Card Header */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-zinc-200">
        <div className={`w-8 h-8 rounded-lg ${config.iconBg} ${config.iconColor} flex items-center justify-center shrink-0`}>
          <Icon size={16} />
        </div>
        <h3 className="text-[15px] font-bold text-zinc-900">{t('risk.title') || 'Risk Assessment'}</h3>
      </div>

      <div className="flex gap-6 items-start">
        {/* Score */}
        <div className="shrink-0 pr-6 border-r border-zinc-200">
          <div className="text-[48px] font-extrabold leading-none" style={{ color: config.scoreColor }}>
            {score}
            <span className="text-[18px] font-medium text-zinc-400">/10</span>
          </div>
          <span
            className="inline-block mt-2 px-3 py-1 rounded text-white text-[13px] font-bold"
            style={{ backgroundColor: config.badgeBg }}
          >
            {t(config.labelKey)}
          </span>
        </div>

        {/* Factors */}
        <div className="flex-1">
          <h4 className="text-[14px] font-bold text-zinc-700 mb-3">{t('risk.keyFactors') || 'Key Risk Factors'}</h4>
          {factorsList.length > 0 ? (
            <ul className="space-y-2 pl-4 list-disc text-[14px] text-zinc-500 leading-relaxed">
              {factorsList.slice(0, 6).map((factor, i) => (
                <li key={i}>{typeof factor === 'string' ? factor : JSON.stringify(factor)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-zinc-400">{t('noRiskFactors')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
