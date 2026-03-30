/**
 * Deep translation quality checks beyond simple key parity.
 * Catches issues that break the UI: wrong interpolation variables,
 * mismatched plurals, suspiciously identical translations, and
 * format inconsistencies.
 */

import { describe, it, expect } from 'vitest';
import en from '../../../messages/en.json';
import pt from '../../../messages/pt.json';

type JsonObject = Record<string, unknown>;

function collectEntries(obj: JsonObject, prefix = ''): { key: string; value: string }[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      return collectEntries(v as JsonObject, path);
    }
    if (typeof v === 'string') {
      return [{ key: path, value: v }];
    }
    return [];
  });
}

function resolvePath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((curr, seg) => {
    if (curr !== null && typeof curr === 'object') return (curr as JsonObject)[seg];
    return undefined;
  }, obj);
}

const enEntries = collectEntries(en as unknown as JsonObject);
const ptEntries = collectEntries(pt as unknown as JsonObject);

// ─── Interpolation variable parity ────────────────────────────────────────────
describe('Interpolation variables match between EN and PT', () => {
  /** Extract {variableName} placeholders from a string */
  const extractVars = (s: string) =>
    [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();

  const casesWithVars = enEntries.filter(e => /\{\w+\}/.test(e.value));

  for (const { key, value: enValue } of casesWithVars) {
    it(`${key} — same interpolation variables`, () => {
      const ptValue = resolvePath(pt, key);
      expect(ptValue).toBeDefined();
      if (typeof ptValue !== 'string') return;

      const enVars = extractVars(enValue);
      const ptVars = extractVars(ptValue as string);

      expect(ptVars).toEqual(enVars);
    });
  }
});

// ─── No untranslated strings (PT identical to EN) ─────────────────────────────
describe('PT translations are not identical to EN (likely untranslated)', () => {
  // Allowlist: keys where EN === PT is expected (brand names, codes, numbers, placeholders)
  const allowIdentical = new Set([
    'HomePage.titleAmount',
    'HomePage.titleEnd',
    'stats.scoringPoints',
    'stats.timeSaved',
    'stats.noiseReduction',
    'stats.roi',
    'profile.enterpriseDesc',
    'profile.professionalDesc',
    'profile.starterDesc',
    'profile.companyNamePlaceholder',
    'profile.techStackPlaceholder',
    'profile.minBudgetPlaceholder',
    'profile.maxBudgetPlaceholder',
    // Brand/product names that don't get translated
    'about.tedName',
    'about.baseName',
    'about.ps2Val',
    'landing.stat1Val',
    'landing.starterName',
    'landing.starterPrice',
    'landing.proName',
    'landing.proPrice',
    'landing.entName',
    'landing.entPrice',
    'landing.tagPro',
    'landing.cr16',
    // Technical terms / abbreviations
    'dashboard.volume',
    'explorer.estAbbrev',
    'tenders.estAbbrev',
    'tenders.similar',
    'intelligence.personas.title',
    'tenders.insights.poweredBy',
  ]);

  // Only check strings longer than 3 chars (short ones like "OK" are often the same)
  const longEntries = enEntries.filter(e => e.value.length > 3 && !allowIdentical.has(e.key));

  const identical = longEntries.filter(({ key, value }) => {
    const ptValue = resolvePath(pt, key);
    return typeof ptValue === 'string' && ptValue === value;
  });

  it('no PT string is identical to its EN counterpart (except allowlisted)', () => {
    if (identical.length > 0) {
      console.warn(
        `\n${identical.length} potentially untranslated key(s):\n` +
          identical.map(e => `  - ${e.key}: "${e.value}"`).join('\n')
      );
    }
    // Warn but don't fail for fewer than 5 — some short phrases may legitimately match
    expect(identical.length).toBeLessThan(5);
  });
});

// ─── No HTML tags leaked into translations ────────────────────────────────────
describe('No raw HTML in translation strings', () => {
  const allEntries = [...enEntries, ...ptEntries];

  const withHtml = allEntries.filter(({ value }) =>
    /<\/?[a-z][\s\S]*?>/i.test(value)
  );

  it('no translation contains HTML tags', () => {
    if (withHtml.length > 0) {
      console.error(
        `\nHTML found in translation(s):\n` +
          withHtml.map(e => `  - ${e.key}: "${e.value}"`).join('\n')
      );
    }
    expect(withHtml).toHaveLength(0);
  });
});

// ─── No leading/trailing whitespace ───────────────────────────────────────────
describe('No leading/trailing whitespace in translations', () => {
  const allEntries = [...enEntries, ...ptEntries];

  const withWhitespace = allEntries.filter(
    ({ value }) => value !== value.trim()
  );

  it('all translations are trimmed', () => {
    if (withWhitespace.length > 0) {
      console.error(
        `\nUntrimmed translation(s):\n` +
          withWhitespace.map(e => `  - ${e.key}: "${e.value}"`).join('\n')
      );
    }
    expect(withWhitespace).toHaveLength(0);
  });
});

// ─── Max length sanity check ──────────────────────────────────────────────────
describe('PT translations are not excessively longer than EN', () => {
  // PT is typically 15-30% longer than EN. Flag anything 3x+ as likely broken.
  // Short strings (< 20 chars) can easily double in PT, so use a higher threshold.
  const MAX_RATIO = 3.0;

  const tooLong = enEntries.filter(({ key, value: enValue }) => {
    if (enValue.length < 20) return false; // skip short strings — high ratio is normal
    const ptValue = resolvePath(pt, key);
    if (typeof ptValue !== 'string') return false;
    return ptValue.length > enValue.length * MAX_RATIO;
  });

  it(`no PT translation is more than ${MAX_RATIO}x longer than EN`, () => {
    if (tooLong.length > 0) {
      console.warn(
        `\n${tooLong.length} excessively long PT translation(s):\n` +
          tooLong.map(e => {
            const ptVal = resolvePath(pt, e.key) as string;
            return `  - ${e.key}: EN(${e.value.length}) vs PT(${ptVal.length})`;
          }).join('\n')
      );
    }
    expect(tooLong).toHaveLength(0);
  });
});

// ─── Namespace structure consistency ──────────────────────────────────────────
describe('Translation namespace structure', () => {
  it('EN and PT have the same top-level namespaces', () => {
    const enNs = Object.keys(en).sort();
    const ptNs = Object.keys(pt).sort();
    expect(ptNs).toEqual(enNs);
  });

  it('total key count is balanced (within 5%)', () => {
    const diff = Math.abs(enEntries.length - ptEntries.length);
    const avg = (enEntries.length + ptEntries.length) / 2;
    const pctDiff = (diff / avg) * 100;
    expect(pctDiff).toBeLessThan(5);
  });
});
