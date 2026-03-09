/**
 * Unit tests for notification preferences validation rules.
 * These mirror the logic in /api/notifications/preferences PATCH.
 */

import { describe, it, expect } from 'vitest';

// Re-implement the validation logic as a pure function so it can be unit-tested
// without instantiating Next.js machinery.
const VALID_THRESHOLDS = new Set([50, 60, 70, 80]);

interface NotificationPrefsPayload {
  email_digest_enabled: unknown;
  min_score_threshold: unknown;
}

function validateNotificationPrefs(body: NotificationPrefsPayload): string | null {
  if (typeof body.email_digest_enabled !== 'boolean') {
    return 'email_digest_enabled must be boolean';
  }
  if (!VALID_THRESHOLDS.has(Number(body.min_score_threshold))) {
    return 'min_score_threshold must be one of 50, 60, 70, 80';
  }
  return null;
}

describe('Notification preferences validation', () => {
  describe('email_digest_enabled', () => {
    it('accepts true', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 60 })).toBeNull();
    });

    it('accepts false', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: false, min_score_threshold: 60 })).toBeNull();
    });

    it('rejects string "true"', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: 'true', min_score_threshold: 60 })).toBeTruthy();
    });

    it('rejects number 1', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: 1, min_score_threshold: 60 })).toBeTruthy();
    });

    it('rejects null', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: null, min_score_threshold: 60 })).toBeTruthy();
    });

    it('rejects undefined', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: undefined, min_score_threshold: 60 })).toBeTruthy();
    });
  });

  describe('min_score_threshold', () => {
    it('accepts 50', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 50 })).toBeNull();
    });

    it('accepts 60', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 60 })).toBeNull();
    });

    it('accepts 70', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 70 })).toBeNull();
    });

    it('accepts 80', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 80 })).toBeNull();
    });

    it('accepts numeric strings that coerce to valid values (e.g. "70")', () => {
      // The route does Number(min_score_threshold), so "70" → 70 is valid
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: '70' })).toBeNull();
    });

    it('rejects 55 (not in allowed set)', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 55 })).toBeTruthy();
    });

    it('rejects 0', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 0 })).toBeTruthy();
    });

    it('rejects 100', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 100 })).toBeTruthy();
    });

    it('rejects negative numbers', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: -60 })).toBeTruthy();
    });

    it('rejects null', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: null })).toBeTruthy();
    });

    it('rejects arbitrary strings', () => {
      expect(validateNotificationPrefs({ email_digest_enabled: true, min_score_threshold: 'high' })).toBeTruthy();
    });
  });
});
