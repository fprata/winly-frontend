'use client';

import React from 'react';
import { AlertTriangle, Shield, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface RiskScoreHeroProps {
  score: number;
  level?: string;
  factors?: string[] | string;
}

function getRiskConfig(score: number) {
  if (score <= 3) return { color: 'emerald', strokeColor: '#10b981', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', textColor: 'text-emerald-700', icon: Shield };
  if (score <= 6) return { color: 'amber', strokeColor: '#f59e0b', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', textColor: 'text-amber-700', icon: ShieldAlert };
  return { color: 'rose', strokeColor: '#f43f5e', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', textColor: 'text-rose-700', icon: AlertTriangle };
}

export function RiskScoreHero({ score, level, factors }: RiskScoreHeroProps) {
  const t = useTranslations('tenders');
  const config = getRiskConfig(score);
  const Icon = config.icon;

  // Semi-circular gauge: arc from 180 to 0 degrees
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 10) * circumference;
  const dashOffset = circumference - progress;

  const riskLabel = score <= 3 ? t('risk.low') : score <= 6 ? t('risk.medium') : t('risk.high');

  const factorsList = Array.isArray(factors)
    ? factors
    : typeof factors === 'string'
      ? factors.split('\n').filter(Boolean)
      : [];

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-2xl p-8 shadow-sm`}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Gauge */}
        <div className="flex flex-col items-center">
          <svg width="200" height="120" viewBox="0 0 200 120">
            {/* Background arc */}
            <path
              d="M 10 110 A 80 80 0 0 1 190 110"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 110 A 80 80 0 0 1 190 110"
              fill="none"
              stroke={config.strokeColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-out"
            />
            {/* Score text */}
            <text x="100" y="95" textAnchor="middle" className="fill-current" style={{ fontSize: '36px', fontWeight: 900 }}>
              <tspan className={config.textColor}>{score}</tspan>
              <tspan style={{ fontSize: '16px', fontWeight: 700 }} className="fill-slate-400">/10</tspan>
            </text>
          </svg>
          <div className={`flex items-center gap-2 ${config.textColor} font-black text-sm uppercase tracking-widest mt-2`}>
            <Icon size={16} />
            {riskLabel}
          </div>
        </div>

        {/* Risk Factors */}
        {factorsList.length > 0 && (
          <div className="flex-1">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{t('risk.keyFactors')}</h4>
            <ul className="space-y-2">
              {factorsList.slice(0, 5).map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0`} style={{ backgroundColor: config.strokeColor }} />
                  {typeof factor === 'string' ? factor : JSON.stringify(factor)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
