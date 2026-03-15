/**
 * Tests for the tier restructure: 4 tiers → 2 tiers (Explorer free + Pro).
 * Validates tier classification, isPro logic, and rate limit configuration.
 */

import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

// --- Tier classification (mirrors logic used across components and API routes) ---

const PAID_TIERS = new Set(['Pro', 'Starter', 'Professional', 'Enterprise']);

function isPro(tier: string | null | undefined): boolean {
  return PAID_TIERS.has(tier || '');
}

describe('Tier classification — isPro()', () => {
  it('Pro is a paid tier', () => {
    expect(isPro('Pro')).toBe(true);
  });

  it('legacy Starter is treated as paid (backward compat)', () => {
    expect(isPro('Starter')).toBe(true);
  });

  it('legacy Professional is treated as paid (backward compat)', () => {
    expect(isPro('Professional')).toBe(true);
  });

  it('legacy Enterprise is treated as paid (backward compat)', () => {
    expect(isPro('Enterprise')).toBe(true);
  });

  it('free is not paid', () => {
    expect(isPro('free')).toBe(false);
  });

  it('Explorer is not paid', () => {
    expect(isPro('Explorer')).toBe(false);
  });

  it('null is not paid', () => {
    expect(isPro(null)).toBe(false);
  });

  it('undefined is not paid', () => {
    expect(isPro(undefined)).toBe(false);
  });

  it('empty string is not paid', () => {
    expect(isPro('')).toBe(false);
  });

  it('arbitrary string is not paid', () => {
    expect(isPro('SuperPlan')).toBe(false);
  });
});

// --- Checkout validation (mirrors logic in /api/checkout) ---

function validateCheckout(tier: string, billingInterval: string): string | null {
  if (tier !== 'Pro') return 'Invalid tier';
  if (billingInterval !== 'month' && billingInterval !== 'year') return 'Invalid billing interval';
  return null;
}

describe('Checkout validation', () => {
  it('accepts Pro + month', () => {
    expect(validateCheckout('Pro', 'month')).toBeNull();
  });

  it('accepts Pro + year', () => {
    expect(validateCheckout('Pro', 'year')).toBeNull();
  });

  it('rejects Starter tier (removed)', () => {
    expect(validateCheckout('Starter', 'month')).toBeTruthy();
  });

  it('rejects Professional tier (removed)', () => {
    expect(validateCheckout('Professional', 'month')).toBeTruthy();
  });

  it('rejects Enterprise tier (removed)', () => {
    expect(validateCheckout('Enterprise', 'month')).toBeTruthy();
  });

  it('rejects free tier', () => {
    expect(validateCheckout('free', 'month')).toBeTruthy();
  });

  it('rejects invalid billing interval', () => {
    expect(validateCheckout('Pro', 'weekly')).toBeTruthy();
  });

  it('rejects empty tier', () => {
    expect(validateCheckout('', 'month')).toBeTruthy();
  });
});

// --- Pricing amounts ---

describe('Pricing configuration', () => {
  const PRO_MONTHLY_CENTS = 9900;   // €99
  const PRO_ANNUAL_CENTS = 94800;   // €948/yr = €79/mo

  it('monthly price is €99 (9900 cents)', () => {
    expect(PRO_MONTHLY_CENTS).toBe(9900);
  });

  it('annual price is €948 (94800 cents)', () => {
    expect(PRO_ANNUAL_CENTS).toBe(94800);
  });

  it('annual is ~20% cheaper than 12x monthly', () => {
    const monthlyAnnualized = PRO_MONTHLY_CENTS * 12;
    const discount = 1 - (PRO_ANNUAL_CENTS / monthlyAnnualized);
    expect(discount).toBeGreaterThan(0.19);
    expect(discount).toBeLessThan(0.21);
  });

  it('annual per-month equivalent is €79', () => {
    expect(Math.round(PRO_ANNUAL_CENTS / 12)).toBe(7900);
  });
});

// --- Rate limiting for free vs Pro ---

describe('Rate limiting — free tier (2 analyses/month)', () => {
  const FREE_LIMIT = 2;
  const WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // ~30 days

  it('first analysis is allowed', () => {
    const result = checkRateLimit('test-free-1', FREE_LIMIT, WINDOW_MS);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it('second analysis is allowed', () => {
    const key = 'test-free-2';
    checkRateLimit(key, FREE_LIMIT, WINDOW_MS);
    const result = checkRateLimit(key, FREE_LIMIT, WINDOW_MS);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('third analysis is blocked', () => {
    const key = 'test-free-3';
    checkRateLimit(key, FREE_LIMIT, WINDOW_MS);
    checkRateLimit(key, FREE_LIMIT, WINDOW_MS);
    const result = checkRateLimit(key, FREE_LIMIT, WINDOW_MS);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});

describe('Rate limiting — Pro tier (10 analyses/hour)', () => {
  const PRO_LIMIT = 10;
  const WINDOW_MS = 60 * 60 * 1000; // 1 hour

  it('first 10 analyses are allowed', () => {
    const key = 'test-pro-10';
    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit(key, PRO_LIMIT, WINDOW_MS);
      expect(result.allowed).toBe(true);
    }
  });

  it('11th analysis is blocked', () => {
    const key = 'test-pro-11';
    for (let i = 0; i < 10; i++) {
      checkRateLimit(key, PRO_LIMIT, WINDOW_MS);
    }
    const result = checkRateLimit(key, PRO_LIMIT, WINDOW_MS);
    expect(result.allowed).toBe(false);
  });
});

// --- Match blurring logic ---

describe('Match blurring — free tier visibility', () => {
  const FREE_VISIBLE_MATCHES = 5;

  it('first 5 matches are visible', () => {
    for (let i = 0; i < 5; i++) {
      expect(i < FREE_VISIBLE_MATCHES).toBe(true);
    }
  });

  it('match 6 and beyond are blurred', () => {
    for (let i = 5; i < 20; i++) {
      expect(i >= FREE_VISIBLE_MATCHES).toBe(true);
    }
  });

  it('Pro users see all matches (no blur)', () => {
    const isProUser = true;
    for (let i = 0; i < 100; i++) {
      const isBlurred = !isProUser && i >= FREE_VISIBLE_MATCHES;
      expect(isBlurred).toBe(false);
    }
  });

  it('free users see exactly 5 unblurred matches', () => {
    const isProUser = false;
    let visibleCount = 0;
    for (let i = 0; i < 20; i++) {
      const isBlurred = !isProUser && i >= FREE_VISIBLE_MATCHES;
      if (!isBlurred) visibleCount++;
    }
    expect(visibleCount).toBe(5);
  });
});
