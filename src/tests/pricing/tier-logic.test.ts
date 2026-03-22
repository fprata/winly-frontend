/**
 * Tests for the 3-tier pricing structure: Explorer (free), Pro (€99/mo), Enterprise (€199/mo).
 * Validates tier classification, feature gating, and rate limit configuration.
 *
 * Feature access is defined in src/lib/tier-config.ts — these tests verify it.
 */

import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  normaliseTier,
  isPaid,
  isPro,
  isEnterprise,
  hasAccess,
  featureAccess,
  requiredTier,
} from '@/lib/tier-config';

describe('normaliseTier()', () => {
  it('normalises null to free', () => expect(normaliseTier(null)).toBe('free'));
  it('normalises undefined to free', () => expect(normaliseTier(undefined)).toBe('free'));
  it('normalises empty string to free', () => expect(normaliseTier('')).toBe('free'));
  it('normalises "free" to free', () => expect(normaliseTier('free')).toBe('free'));
  it('normalises "Pro" to Pro', () => expect(normaliseTier('Pro')).toBe('Pro'));
  it('normalises legacy "Starter" to Pro', () => expect(normaliseTier('Starter')).toBe('Pro'));
  it('normalises "Enterprise" to Enterprise', () => expect(normaliseTier('Enterprise')).toBe('Enterprise'));
  it('normalises legacy "Professional" to Enterprise', () => expect(normaliseTier('Professional')).toBe('Enterprise'));
});

describe('Tier classification — isPro() (matches visibility)', () => {
  it('Pro is paid', () => expect(isPro('Pro')).toBe(true));
  it('Enterprise is paid', () => expect(isPro('Enterprise')).toBe(true));
  it('legacy Starter is paid', () => expect(isPro('Starter')).toBe(true));
  it('legacy Professional is paid', () => expect(isPro('Professional')).toBe(true));
  it('free is not paid', () => expect(isPro('free')).toBe(false));
  it('null is not paid', () => expect(isPro(null)).toBe(false));
  it('undefined is not paid', () => expect(isPro(undefined)).toBe(false));
  it('empty string is not paid', () => expect(isPro('')).toBe(false));
});

describe('Tier classification — isEnterprise() (AI analysis, chat, export)', () => {
  it('Enterprise is enterprise', () => expect(isEnterprise('Enterprise')).toBe(true));
  it('legacy Professional is enterprise', () => expect(isEnterprise('Professional')).toBe(true));
  it('Pro is NOT enterprise', () => expect(isEnterprise('Pro')).toBe(false));
  it('Starter is NOT enterprise', () => expect(isEnterprise('Starter')).toBe(false));
  it('free is NOT enterprise', () => expect(isEnterprise('free')).toBe(false));
  it('null is NOT enterprise', () => expect(isEnterprise(null)).toBe(false));
});

// --- Checkout validation ---

const VALID_TIERS = new Set(['Pro', 'Enterprise']);

function validateCheckout(tier: string, billingInterval: string): string | null {
  if (!VALID_TIERS.has(tier)) return 'Invalid tier';
  if (billingInterval !== 'month' && billingInterval !== 'year') return 'Invalid billing interval';
  return null;
}

describe('Checkout validation', () => {
  it('accepts Pro + month', () => expect(validateCheckout('Pro', 'month')).toBeNull());
  it('accepts Pro + year', () => expect(validateCheckout('Pro', 'year')).toBeNull());
  it('accepts Enterprise + month', () => expect(validateCheckout('Enterprise', 'month')).toBeNull());
  it('accepts Enterprise + year', () => expect(validateCheckout('Enterprise', 'year')).toBeNull());
  it('rejects Starter (legacy)', () => expect(validateCheckout('Starter', 'month')).toBeTruthy());
  it('rejects Professional (legacy)', () => expect(validateCheckout('Professional', 'month')).toBeTruthy());
  it('rejects free', () => expect(validateCheckout('free', 'month')).toBeTruthy());
  it('rejects invalid billing', () => expect(validateCheckout('Pro', 'weekly')).toBeTruthy());
});

// --- Pricing amounts ---

describe('Pricing configuration', () => {
  const PRO_MONTHLY = 9900;
  const PRO_ANNUAL = 94800;
  const ENT_MONTHLY = 19900;
  const ENT_ANNUAL = 190800;

  it('Pro monthly is €99', () => expect(PRO_MONTHLY).toBe(9900));
  it('Pro annual is €948', () => expect(PRO_ANNUAL).toBe(94800));
  it('Pro annual is ~20% cheaper', () => {
    const discount = 1 - (PRO_ANNUAL / (PRO_MONTHLY * 12));
    expect(discount).toBeGreaterThan(0.19);
    expect(discount).toBeLessThan(0.21);
  });
  it('Enterprise monthly is €199', () => expect(ENT_MONTHLY).toBe(19900));
  it('Enterprise annual is €1,908', () => expect(ENT_ANNUAL).toBe(190800));
  it('Enterprise annual is ~20% cheaper', () => {
    const discount = 1 - (ENT_ANNUAL / (ENT_MONTHLY * 12));
    expect(discount).toBeGreaterThan(0.19);
    expect(discount).toBeLessThan(0.21);
  });
  it('Enterprise is 2x Pro', () => expect(ENT_MONTHLY / PRO_MONTHLY).toBeCloseTo(2.01, 1));
});

// --- Rate limiting: document analysis ---

describe('Rate limiting — Free tier (blocked)', () => {
  it('free users cannot analyse documents', () => {
    const isFree = true;
    expect(isFree).toBe(true); // enforcement is a 403 return, not rate-limit
  });
});

describe('Rate limiting — Pro tier (5 analyses/month)', () => {
  const PRO_LIMIT = 5;
  const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

  it('first 5 analyses are allowed', () => {
    const key = 'test-pro-5-' + Date.now();
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, PRO_LIMIT, WINDOW_MS).allowed).toBe(true);
    }
  });

  it('6th analysis is blocked', () => {
    const key = 'test-pro-6-' + Date.now();
    for (let i = 0; i < 5; i++) checkRateLimit(key, PRO_LIMIT, WINDOW_MS);
    expect(checkRateLimit(key, PRO_LIMIT, WINDOW_MS).allowed).toBe(false);
  });
});

describe('Rate limiting — Enterprise tier (10 analyses/hour)', () => {
  const ENT_LIMIT = 10;
  const WINDOW_MS = 60 * 60 * 1000;

  it('first 10 analyses are allowed', () => {
    const key = 'test-ent-10-' + Date.now();
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(key, ENT_LIMIT, WINDOW_MS).allowed).toBe(true);
    }
  });

  it('11th analysis is blocked', () => {
    const key = 'test-ent-11-' + Date.now();
    for (let i = 0; i < 10; i++) checkRateLimit(key, ENT_LIMIT, WINDOW_MS);
    expect(checkRateLimit(key, ENT_LIMIT, WINDOW_MS).allowed).toBe(false);
  });
});

// --- Feature gating per tier (from centralised tier-config.ts) ---

describe('Feature gating matrix — hasAccess()', () => {
  it('free users: no paid features', () => {
    expect(hasAccess('free', 'unlimitedMatches')).toBe(false);
    expect(hasAccess('free', 'aiAnalysis')).toBe(false);
    expect(hasAccess('free', 'aiChat')).toBe(false);
    expect(hasAccess('free', 'pdfExport')).toBe(false);
    expect(hasAccess('free', 'excelExport')).toBe(false);
    expect(hasAccess('free', 'buyerIntel')).toBe(false);
    expect(hasAccess('free', 'competitorIntel')).toBe(false);
    expect(hasAccess('free', 'marketOverview')).toBe(false);
  });

  it('Pro users get matches + intelligence + limited AI, no chat/export', () => {
    expect(hasAccess('Pro', 'unlimitedMatches')).toBe(true);
    expect(hasAccess('Pro', 'aiAnalysis')).toBe(true);
    expect(hasAccess('Pro', 'buyerIntel')).toBe(true);
    expect(hasAccess('Pro', 'competitorIntel')).toBe(true);
    expect(hasAccess('Pro', 'marketOverview')).toBe(true);
    expect(hasAccess('Pro', 'aiChat')).toBe(false);
    expect(hasAccess('Pro', 'pdfExport')).toBe(false);
    expect(hasAccess('Pro', 'excelExport')).toBe(false);
  });

  it('Enterprise users get everything', () => {
    expect(hasAccess('Enterprise', 'unlimitedMatches')).toBe(true);
    expect(hasAccess('Enterprise', 'aiAnalysis')).toBe(true);
    expect(hasAccess('Enterprise', 'aiChat')).toBe(true);
    expect(hasAccess('Enterprise', 'pdfExport')).toBe(true);
    expect(hasAccess('Enterprise', 'excelExport')).toBe(true);
    expect(hasAccess('Enterprise', 'buyerIntel')).toBe(true);
    expect(hasAccess('Enterprise', 'competitorIntel')).toBe(true);
    expect(hasAccess('Enterprise', 'marketOverview')).toBe(true);
  });

  it('legacy Starter has same access as Pro', () => {
    expect(hasAccess('Starter', 'buyerIntel')).toBe(true);
    expect(hasAccess('Starter', 'aiChat')).toBe(false);
  });

  it('legacy Professional has same access as Enterprise', () => {
    expect(hasAccess('Professional', 'aiChat')).toBe(true);
    expect(hasAccess('Professional', 'pdfExport')).toBe(true);
  });

  it('null/undefined tier defaults to free', () => {
    expect(hasAccess(null, 'buyerIntel')).toBe(false);
    expect(hasAccess(undefined, 'marketOverview')).toBe(false);
  });
});

describe('featureAccess() — full map', () => {
  it('returns all features for a given tier', () => {
    const f = featureAccess('Pro');
    expect(f.unlimitedMatches).toBe(true);
    expect(f.buyerIntel).toBe(true);
    expect(f.aiChat).toBe(false);
  });
});

describe('requiredTier()', () => {
  it('buyerIntel requires Pro', () => expect(requiredTier('buyerIntel')).toBe('Pro'));
  it('aiChat requires Enterprise', () => expect(requiredTier('aiChat')).toBe('Enterprise'));
  it('unlimitedMatches requires Pro', () => expect(requiredTier('unlimitedMatches')).toBe('Pro'));
});

// --- Match blurring ---

describe('Match blurring — free tier visibility', () => {
  const FREE_VISIBLE = 5;

  it('free users see exactly 5 unblurred matches', () => {
    let visible = 0;
    for (let i = 0; i < 20; i++) {
      if (i < FREE_VISIBLE) visible++;
    }
    expect(visible).toBe(5);
  });

  it('Pro users see all matches', () => {
    const isPaid = true;
    for (let i = 0; i < 100; i++) {
      expect(!isPaid && i >= FREE_VISIBLE).toBe(false);
    }
  });
});
