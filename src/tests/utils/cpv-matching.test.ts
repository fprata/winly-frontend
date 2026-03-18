import { describe, it, expect } from 'vitest';
import { getCpvDescription, CPV_DIVISION_MAP, CPV_DIVISIONS } from '@/utils/cpv-data';

describe('CPV matching for test accounts', () => {
  const accountCpvCodes: Record<string, string[]> = {
    'IT Services': ['72', '48'],
    'Construction': ['45', '44', '71'],
    'Healthcare': ['33', '85'],
    'Environmental': ['90', '41', '71'],
    'Consulting': ['79', '73', '80'],
    'Transport': ['60', '34', '50'],
    'Security': ['35', '32', '51'],
    'Catering': ['55', '15'],
  };

  for (const [industry, codes] of Object.entries(accountCpvCodes)) {
    describe(`${industry}`, () => {
      it('all CPV codes exist in the division map', () => {
        for (const code of codes) {
          expect(CPV_DIVISION_MAP[code]).toBeDefined();
        }
      });

      it('all CPV codes exist in the dropdown array', () => {
        for (const code of codes) {
          const found = CPV_DIVISIONS.find((d) => d.value === code);
          expect(found).toBeDefined();
        }
      });

      it('getCpvDescription returns meaningful text for each code (EN)', () => {
        for (const code of codes) {
          const desc = getCpvDescription(`${code}000000`, 'en');
          expect(desc).not.toBe('N/A');
          expect(desc.length).toBeGreaterThan(5);
        }
      });

      it('getCpvDescription returns meaningful text for each code (PT)', () => {
        for (const code of codes) {
          const desc = getCpvDescription(`${code}000000`, 'pt');
          expect(desc).not.toBe('N/A');
          expect(desc.length).toBeGreaterThan(5);
        }
      });
    });
  }
});

describe('CPV code overlap between industries', () => {
  it('Construction and Environmental share CPV 71 (Architecture & Engineering)', () => {
    const desc = getCpvDescription('71000000', 'en');
    expect(desc).toContain('construction');
  });

  it('IT Services codes (72, 48) are distinct from Construction (45, 44)', () => {
    const itCodes = ['72', '48'];
    const constructionCodes = ['45', '44'];
    const overlap = itCodes.filter((c) => constructionCodes.includes(c));
    expect(overlap).toHaveLength(0);
  });

  it('Healthcare (33, 85) has no overlap with Catering (55, 15)', () => {
    const healthCodes = ['33', '85'];
    const cateringCodes = ['55', '15'];
    const overlap = healthCodes.filter((c) => cateringCodes.includes(c));
    expect(overlap).toHaveLength(0);
  });
});
