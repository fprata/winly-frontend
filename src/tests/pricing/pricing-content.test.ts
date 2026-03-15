/**
 * Tests that pricing content in i18n files reflects the 3-tier structure:
 * Explorer (free), Pro (€99/mo), Enterprise (€199/mo).
 */

import { describe, it, expect } from 'vitest';
import en from '../../../messages/en.json';
import pt from '../../../messages/pt.json';

type JsonObject = Record<string, unknown>;

function collectKeys(obj: JsonObject, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return collectKeys(value as JsonObject, path);
    }
    return [path];
  });
}

describe('Pricing content — required keys exist', () => {
  const enKeys = collectKeys(en as unknown as JsonObject);
  const ptKeys = collectKeys(pt as unknown as JsonObject);

  const requiredKeys = [
    // Explorer (free) on landing page
    'landing.explorerName',
    'landing.explorerPrice',
    'landing.explorerPriceNote',
    'landing.pricingCtaFree',
    'landing.xf1',
    'landing.xl1',

    // Pro on landing page
    'landing.proName',
    'landing.proPrice',
    'landing.proAnnual',
    'landing.pf1',
    'landing.pf4',   // 5 AI analyses/month
    'landing.pl1',   // Pro limitation: unlimited AI
    'landing.pl2',   // Pro limitation: export

    // Enterprise on landing page
    'landing.entName',
    'landing.entPrice',
    'landing.entAnnual',
    'landing.ef1',
    'landing.ef2',

    // Comparison table
    'landing.cr1x',   // Top 5/day
    'landing.cr6p',   // 5/month (Pro)

    // Profile page
    'profile.upgradeToPro',
    'profile.upgradeToEnterprise',
    'profile.proDesc',
    'profile.enterpriseDesc',

    // Matches
    'matches.upgradeToSeeAll',
    'matches.upgradeToPro',

    // Paywall
    'tenders.paywall.freeLimit',
    'tenders.paywall.proLimit',

    // Insights
    'tenders.insights.freeLimitReached',
    'tenders.insights.proLimitReached',
  ];

  for (const key of requiredKeys) {
    it(`en.json contains "${key}"`, () => expect(enKeys).toContain(key));
    it(`pt.json contains "${key}"`, () => expect(ptKeys).toContain(key));
  }
});

describe('Pricing content — correct values', () => {
  const landing = (en as any).landing;

  it('Explorer price is "Free"', () => expect(landing.explorerPrice).toBe('Free'));
  it('Pro price is "€99"', () => expect(landing.proPrice).toBe('€99'));
  it('Enterprise price is "€199"', () => expect(landing.entPrice).toBe('€199'));

  it('Pro annual mentions €79/mo', () => expect(landing.proAnnual).toContain('€79'));
  it('Enterprise annual mentions €159/mo', () => expect(landing.entAnnual).toContain('€159'));

  it('proName is "Pro"', () => expect(landing.proName).toBe('Pro'));
  it('entName is "Enterprise"', () => expect(landing.entName).toBe('Enterprise'));
  it('explorerName is "Explorer"', () => expect(landing.explorerName).toBe('Explorer'));

  it('Pro features mention 5 AI analyses', () => expect(landing.pf4).toContain('5'));
  it('Explorer features mention top 5 matches', () => expect(landing.xf1).toContain('5'));
  it('Comparison table Pro AI limit is "5/month"', () => expect(landing.cr6p).toContain('5'));
});

describe('Pricing content — PT translations', () => {
  const ptLanding = (pt as any).landing;

  it('PT Explorer price is "Grátis"', () => expect(ptLanding.explorerPrice).toBe('Grátis'));
  it('PT Pro price is "€99"', () => expect(ptLanding.proPrice).toBe('€99'));
  it('PT Enterprise price is "€199"', () => expect(ptLanding.entPrice).toBe('€199'));
  it('PT proName is "Pro"', () => expect(ptLanding.proName).toBe('Pro'));
  it('PT entName is "Enterprise"', () => expect(ptLanding.entName).toBe('Enterprise'));
  it('PT Enterprise annual mentions €159', () => expect(ptLanding.entAnnual).toContain('€159'));
});

describe('Pricing content — tier gating messages', () => {
  const tenders = (en as any).tenders;

  it('free limit message mentions Pro or Enterprise', () => {
    expect(tenders.paywall.freeLimit).toContain('Pro');
  });

  it('pro limit message mentions Enterprise', () => {
    expect(tenders.paywall.proLimit).toContain('Enterprise');
  });

  it('pro limit message mentions 5/month', () => {
    expect(tenders.paywall.proLimit).toContain('5');
  });

  it('free limit reached toast mentions Pro', () => {
    expect(tenders.insights.freeLimitReached).toContain('Pro');
  });

  it('pro limit reached toast mentions Enterprise', () => {
    expect(tenders.insights.proLimitReached).toContain('Enterprise');
  });
});
