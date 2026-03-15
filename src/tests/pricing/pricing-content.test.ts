/**
 * Tests that pricing content in i18n files reflects the new 2-tier structure
 * and that no references to removed tiers (Starter/Enterprise) remain.
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

function collectValues(obj: JsonObject, prefix = ''): Array<{ key: string; value: string }> {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return collectValues(value as JsonObject, path);
    }
    if (typeof value === 'string') {
      return [{ key: path, value }];
    }
    return [];
  });
}

describe('Pricing content — removed tier references', () => {
  const enValues = collectValues(en as unknown as JsonObject);
  const ptValues = collectValues(pt as unknown as JsonObject);

  // These are i18n key NAMES that should no longer exist (not values)
  const removedKeyPatterns = [
    'landing.starterName',
    'landing.starterPrice',
    'landing.starterAnnual',
    'landing.starterDesc',
    'landing.entName',
    'landing.entPrice',
    'landing.entAnnual',
    'landing.entDesc',
    'landing.ef1',
    'landing.ef2',
    'landing.ef3',
    'landing.cr13',   // User seats row (removed from comparison)
    'landing.cr14',   // API access row
    'landing.cr15',   // Pipeline CRM row
    'landing.cr16',   // White-label row
    'landing.cr1s',   // "50/mo" (old Starter match limit)
    'landing.pricingCtaSales',
  ];

  const enKeys = collectKeys(en as unknown as JsonObject);

  for (const pattern of removedKeyPatterns) {
    it(`en.json should not contain key "${pattern}"`, () => {
      expect(enKeys).not.toContain(pattern);
    });
  }
});

describe('Pricing content — required new keys exist', () => {
  const enKeys = collectKeys(en as unknown as JsonObject);
  const ptKeys = collectKeys(pt as unknown as JsonObject);

  const requiredKeys = [
    // Explorer (free tier) on landing page
    'landing.explorerName',
    'landing.explorerPrice',
    'landing.explorerPriceNote',
    'landing.pricingCtaFree',
    'landing.xf1',  // Explorer feature 1
    'landing.xf7',  // Explorer feature 7 (2 AI analyses)
    'landing.xl1',  // Explorer limitation 1

    // Pro tier on landing page
    'landing.proName',
    'landing.proPrice',
    'landing.proAnnual',
    'landing.pf1',   // Pro feature 1

    // Comparison table
    'landing.cr1x',  // "Top 5/day" (Explorer match limit)
    'landing.cr6x',  // "2/month" (Explorer AI limit)

    // Profile page
    'profile.upgradeToPro',
    'profile.upgradeToProAnnual',
    'profile.proDesc',

    // Matches page
    'matches.upgradeToSeeAll',
    'matches.upgradeMatchesDesc',
    'matches.upgradeToPro',

    // Insights paywall
    'tenders.paywall.freeLimit',

    // Insights free limit toast
    'tenders.insights.freeLimitReached',
  ];

  for (const key of requiredKeys) {
    it(`en.json contains "${key}"`, () => {
      expect(enKeys).toContain(key);
    });

    it(`pt.json contains "${key}"`, () => {
      expect(ptKeys).toContain(key);
    });
  }
});

describe('Pricing content — correct values', () => {
  const landing = (en as any).landing;

  it('Explorer price is "Free"', () => {
    expect(landing.explorerPrice).toBe('Free');
  });

  it('Pro price is "€99"', () => {
    expect(landing.proPrice).toBe('€99');
  });

  it('Pro annual mentions €79/mo', () => {
    expect(landing.proAnnual).toContain('€79');
  });

  it('Pro annual mentions €948/yr', () => {
    expect(landing.proAnnual).toContain('948');
  });

  it('proName is "Pro" (not "Professional")', () => {
    expect(landing.proName).toBe('Pro');
  });

  it('explorerName is "Explorer"', () => {
    expect(landing.explorerName).toBe('Explorer');
  });

  it('Explorer features mention 2 AI analyses', () => {
    expect(landing.xf7).toContain('2');
  });

  it('Explorer features mention top 5 matches', () => {
    expect(landing.xf1).toContain('5');
  });

  it('Comparison table Explorer match limit is "Top 5/day"', () => {
    expect(landing.cr1x).toContain('5');
  });

  it('Comparison table Explorer AI limit is "2/month"', () => {
    expect(landing.cr6x).toContain('2');
  });
});

describe('Pricing content — PT translations match structure', () => {
  const ptLanding = (pt as any).landing;

  it('PT Explorer price is "Grátis"', () => {
    expect(ptLanding.explorerPrice).toBe('Grátis');
  });

  it('PT Pro price is "€99"', () => {
    expect(ptLanding.proPrice).toBe('€99');
  });

  it('PT Pro annual mentions €79', () => {
    expect(ptLanding.proAnnual).toContain('€79');
  });

  it('PT proName is "Pro"', () => {
    expect(ptLanding.proName).toBe('Pro');
  });
});
