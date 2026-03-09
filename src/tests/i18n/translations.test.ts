/**
 * Ensures every key present in en.json also exists in pt.json.
 * Missing Portuguese translations would silently fall back to the key string
 * in production, degrading the user experience for PT users.
 */

import { describe, it, expect } from 'vitest';
import en from '../../../messages/en.json';
import pt from '../../../messages/pt.json';

type JsonObject = Record<string, unknown>;

/**
 * Recursively collect all dot-notation key paths from a nested object.
 * e.g. { a: { b: 'x' } } → ['a.b']
 */
function collectKeys(obj: JsonObject, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return collectKeys(value as JsonObject, path);
    }
    return [path];
  });
}

/**
 * Resolve a dot-notation path against a nested object.
 * Returns undefined if any segment is missing.
 */
function resolvePath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((curr, segment) => {
    if (curr !== null && typeof curr === 'object') {
      return (curr as JsonObject)[segment];
    }
    return undefined;
  }, obj);
}

describe('Translation parity — en.json → pt.json', () => {
  const enKeys = collectKeys(en as unknown as JsonObject);

  it('pt.json contains all keys present in en.json', () => {
    const missing = enKeys.filter(key => resolvePath(pt, key) === undefined);

    if (missing.length > 0) {
      // Print a helpful diff for the developer
      console.error(
        `\nMissing ${missing.length} key(s) in pt.json:\n` +
          missing.map(k => `  - ${k}`).join('\n')
      );
    }

    expect(missing).toHaveLength(0);
  });

  it('no key in pt.json has an empty string value (untranslated placeholder)', () => {
    const ptKeys = collectKeys(pt as unknown as JsonObject);
    const empty = ptKeys.filter(key => resolvePath(pt, key) === '');

    if (empty.length > 0) {
      console.error(
        `\nEmpty value for ${empty.length} key(s) in pt.json:\n` +
          empty.map(k => `  - ${k}`).join('\n')
      );
    }

    expect(empty).toHaveLength(0);
  });
});

describe('Translation parity — pt.json → en.json (no orphan PT keys)', () => {
  const ptKeys = collectKeys(pt as unknown as JsonObject);

  it('every key in pt.json also exists in en.json', () => {
    const orphan = ptKeys.filter(key => resolvePath(en, key) === undefined);

    if (orphan.length > 0) {
      console.warn(
        `\n${orphan.length} key(s) in pt.json have no en.json counterpart (cleanup needed):\n` +
          orphan.map(k => `  - ${k}`).join('\n')
      );
    }

    // This is a warning, not a hard failure — orphan PT keys won't break the UI
    // but indicate stale translations that should be pruned.
    expect(orphan).toHaveLength(0);
  });
});
