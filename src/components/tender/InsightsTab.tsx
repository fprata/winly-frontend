'use client';

import React, { useState, useCallback } from 'react';
import { RiskScoreHero } from './RiskScoreHero';
import { InsightsPaywall } from './InsightsPaywall';
import { ExportActions } from './ExportActions';
import type { UserTier } from './types';

interface InsightsTabProps {
  tenderId: string;
  initialInsights: any;
  derivedDocLink: string | null;
  tier: UserTier;
  onRiskScoreUpdate?: (score: number, level: string) => void;
}

export function InsightsTab({ tenderId, initialInsights, derivedDocLink, tier, onRiskScoreUpdate }: InsightsTabProps) {
  const [currentInsights, setCurrentInsights] = useState(initialInsights);

  const handleInsightsGenerated = useCallback((insights: any) => {
    setCurrentInsights(insights);
    if (insights?.risk_assessment?.overall_risk_score != null) {
      onRiskScoreUpdate?.(
        insights.risk_assessment.overall_risk_score,
        insights.risk_assessment.risk_level || 'unknown'
      );
    }
  }, [onRiskScoreUpdate]);

  const riskScore = currentInsights?.risk_assessment?.overall_risk_score;
  const riskLevel = currentInsights?.risk_assessment?.risk_level;
  const riskFactors = currentInsights?.risk_assessment?.key_risk_factors;

  const isPro = tier === 'Professional' || tier === 'Enterprise';

  return (
    <div className="space-y-8">
      {/* Risk Score Hero */}
      {riskScore != null && (
        <RiskScoreHero score={riskScore} level={riskLevel} factors={riskFactors} />
      )}

      {/* Insights Content or Paywall */}
      <InsightsPaywall
        tenderId={tenderId}
        initialInsights={currentInsights}
        derivedDocLink={derivedDocLink}
        tier={tier}
        onInsightsGenerated={handleInsightsGenerated}
      />

      {/* Export Actions (below insights content, only for pro users with insights) */}
      {currentInsights && isPro && (
        <ExportActions tenderId={tenderId} tier={tier} />
      )}
    </div>
  );
}
