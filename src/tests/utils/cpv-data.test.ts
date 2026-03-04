import { describe, it, expect } from 'vitest';
import { getCpvDescription } from '@/utils/cpv-data';

describe('getCpvDescription', () => {
  it('returns description for valid CPV division in EN', () => {
    expect(getCpvDescription('45000000', 'en')).toBe('Construction work');
  });

  it('returns description for valid CPV division in PT', () => {
    expect(getCpvDescription('45000000', 'pt')).toBe('Construção');
  });

  it('returns parent category with suffix for sub-codes', () => {
    expect(getCpvDescription('45200000', 'en')).toBe('Construction work (Category)');
    expect(getCpvDescription('45200000', 'pt')).toBe('Construção (Categoria)');
  });

  it('returns fallback for unknown prefix', () => {
    expect(getCpvDescription('99999999', 'en')).toBe('Specialized Sector (99999999)');
    expect(getCpvDescription('99999999', 'pt')).toBe('Setor Especializado (99999999)');
  });

  it('handles null or undefined', () => {
    expect(getCpvDescription(null)).toBe('N/A');
    expect(getCpvDescription(undefined)).toBe('N/A');
  });
});
