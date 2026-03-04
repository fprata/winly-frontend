import { describe, it, expect } from 'vitest';
import { validateNIF } from '../app/api/lookup/company/route';

describe('VAT ID (NIF) Validation', () => {
  it('should validate correct corporate NIFs', () => {
    // Verified valid Portuguese NIFs
    expect(validateNIF('500697256')).toBe(true); // EDP
    expect(validateNIF('501442600')).toBe(true); // Valid example
  });

  it('should reject NIFs with incorrect length', () => {
    expect(validateNIF('50069725')).toBe(false);
    expect(validateNIF('5006972560')).toBe(false);
  });

  it('should reject NIFs with invalid start digits', () => {
    expect(validateNIF('000697256')).toBe(false);
  });

  it('should reject NIFs with invalid checksums', () => {
    // 500697256 is valid, so 500697257 should be invalid
    expect(validateNIF('500697257')).toBe(false);
    // 501442600 is valid, so 501442601 should be invalid
    expect(validateNIF('501442601')).toBe(false);
  });

  it('should reject non-numeric NIFs', () => {
    expect(validateNIF('50069725A')).toBe(false);
    expect(validateNIF('ABCDEFGHI')).toBe(false);
  });
});
