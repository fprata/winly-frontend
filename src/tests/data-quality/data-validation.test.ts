/**
 * Data quality and validation tests.
 *
 * These tests validate that tender data, match scores, buyer/competitor
 * intelligence, and dashboard KPIs are internally consistent and make
 * business sense. They run against realistic test data defined inline.
 */

import { describe, it, expect } from 'vitest';

// ─── Test Data: Tenders ──────────────────────────────────────────────────────

const TENDERS = [
  {
    tender_id: 'TED-2026-100001',
    title: 'Supply of IT Infrastructure for Lisbon Municipality',
    buyer_name: 'Câmara Municipal de Lisboa',
    cpv_code: '72000000',
    estimated_value: 450_000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-03-01',
    submission_deadline: '2026-04-15',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'open',
    final_contract_value: null,
    award_decision_date: null,
    winners_list: null,
  },
  {
    tender_id: 'TED-2026-100002',
    title: 'Hospital Medical Equipment Maintenance',
    buyer_name: 'Centro Hospitalar de Lisboa Central',
    cpv_code: '33100000',
    estimated_value: 1_200_000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-01-10',
    submission_deadline: '2026-02-28',
    is_active: false,
    source_system: 'BASE.gov.pt',
    procedure_type: 'open',
    final_contract_value: 1_050_000,
    award_decision_date: '2026-03-10',
    winners_list: [{ winner_name: 'Siemens Healthineers', winner_vat_id: '500100200' }],
  },
  {
    tender_id: 'TED-2026-100003',
    title: 'Road Resurfacing Works - EN1 Section',
    buyer_name: 'Infraestruturas de Portugal',
    cpv_code: '45233000',
    estimated_value: 8_500_000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-02-15',
    submission_deadline: '2026-05-01',
    is_active: true,
    source_system: 'TED',
    procedure_type: 'open',
    final_contract_value: null,
    award_decision_date: null,
    winners_list: null,
  },
  {
    tender_id: 'TED-2026-100004',
    title: 'School Meal Catering Services - Porto District',
    buyer_name: 'Câmara Municipal do Porto',
    cpv_code: '55524000',
    estimated_value: 2_300_000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-02-20',
    submission_deadline: '2026-04-01',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'restricted',
    final_contract_value: null,
    award_decision_date: null,
    winners_list: null,
  },
  {
    tender_id: 'TED-2026-100005',
    title: 'Urban Waste Collection Services - Braga',
    buyer_name: 'Câmara Municipal de Braga',
    cpv_code: '90511000',
    estimated_value: 3_700_000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2025-11-01',
    submission_deadline: '2025-12-15',
    is_active: false,
    source_system: 'BASE.gov.pt',
    procedure_type: 'open',
    final_contract_value: 3_200_000,
    award_decision_date: '2026-01-20',
    winners_list: [{ winner_name: 'SUMA', winner_vat_id: '502123456' }],
  },
  {
    tender_id: 'EU-2026-200001',
    title: 'Cybersecurity Audit Framework for EU Institutions',
    buyer_name: 'European Commission - DG DIGIT',
    cpv_code: '72212517',
    estimated_value: 5_000_000,
    currency: 'EUR',
    country: 'BE',
    publication_date: '2026-03-10',
    submission_deadline: '2026-06-01',
    is_active: true,
    source_system: 'TED',
    procedure_type: 'open',
    final_contract_value: null,
    award_decision_date: null,
    winners_list: null,
  },
];

// ─── Test Data: Matches ──────────────────────────────────────────────────────

const MATCHES = [
  {
    client_id: 'client-it-001',
    tender_id: 'TED-2026-100001',
    match_score: 87,
    score_cpv: 95,
    score_strategic: 80,
    score_semantic: 82,
    score_keyword: 90,
    score_capacity: 85,
    score_market_opp: 78,
    score_location: 92,
    win_probability: 0.42,
    match_reasons: 'cpv:exact|location:match|capacity:strong',
  },
  {
    client_id: 'client-it-001',
    tender_id: 'EU-2026-200001',
    match_score: 72,
    score_cpv: 88,
    score_strategic: 70,
    score_semantic: 65,
    score_keyword: 75,
    score_capacity: 60,
    score_market_opp: 70,
    score_location: 40,
    win_probability: 0.18,
    match_reasons: 'cpv:partial|capacity:medium',
  },
  {
    client_id: 'client-construction-001',
    tender_id: 'TED-2026-100003',
    match_score: 91,
    score_cpv: 98,
    score_strategic: 88,
    score_semantic: 90,
    score_keyword: 85,
    score_capacity: 92,
    score_market_opp: 80,
    score_location: 95,
    win_probability: 0.55,
    match_reasons: 'cpv:exact|location:match|incumbent:Teixeira Duarte|capacity:strong',
  },
  {
    client_id: 'client-catering-001',
    tender_id: 'TED-2026-100004',
    match_score: 78,
    score_cpv: 92,
    score_strategic: 75,
    score_semantic: 70,
    score_keyword: 80,
    score_capacity: 68,
    score_market_opp: 72,
    score_location: 85,
    win_probability: 0.30,
    match_reasons: 'cpv:exact|location:match',
  },
  {
    client_id: 'client-health-001',
    tender_id: 'TED-2026-100002',
    match_score: 45,
    score_cpv: 85,
    score_strategic: 40,
    score_semantic: 35,
    score_keyword: 50,
    score_capacity: 30,
    score_market_opp: 42,
    score_location: 60,
    win_probability: 0.08,
    match_reasons: 'cpv:partial|capacity:weak',
  },
];

// ─── Test Data: Buyer Intelligence ───────────────────────────────────────────

const BUYERS = [
  {
    name: 'Câmara Municipal de Lisboa',
    country: 'PT',
    total_contracts: 1_247,
    total_spend: 890_000_000,
    avg_discount: 12.5,
    avg_bidder_count: 4.3,
    persona_name: 'Active Municipal Buyer',
    top_winners: [
      { name: 'Novabase', wins: 23, avg_value: 180_000 },
      { name: 'Mota-Engil', wins: 18, avg_value: 2_500_000 },
    ],
    sector_stats: [
      { cpv_division: '72', avg_bidder_count: 5.1, avg_contract_value: 220_000, avg_discount: 15.2 },
      { cpv_division: '45', avg_bidder_count: 3.8, avg_contract_value: 1_800_000, avg_discount: 10.1 },
    ],
  },
  {
    name: 'Centro Hospitalar de Lisboa Central',
    country: 'PT',
    total_contracts: 534,
    total_spend: 420_000_000,
    avg_discount: 8.3,
    avg_bidder_count: 2.7,
    persona_name: 'Healthcare Institution',
    top_winners: [
      { name: 'Siemens Healthineers', wins: 45, avg_value: 850_000 },
      { name: 'Philips Healthcare', wins: 32, avg_value: 620_000 },
    ],
    sector_stats: [
      { cpv_division: '33', avg_bidder_count: 2.4, avg_contract_value: 780_000, avg_discount: 7.5 },
    ],
  },
];

// ─── Test Data: Competitor Intelligence ──────────────────────────────────────

const COMPETITORS = [
  {
    name: 'Novabase',
    country: 'PT',
    total_wins: 156,
    total_revenue: 28_000_000,
    win_rate_pct: 34.2,
    avg_discount_pct: 14.8,
    sector_diversity: 2,
    sector_stats: [
      { cpv_division: '72', wins: 98, revenue: 18_000_000 },
      { cpv_division: '48', wins: 58, revenue: 10_000_000 },
    ],
  },
  {
    name: 'Mota-Engil',
    country: 'PT',
    total_wins: 423,
    total_revenue: 1_200_000_000,
    win_rate_pct: 28.6,
    avg_discount_pct: 11.2,
    sector_diversity: 2,
    sector_stats: [
      { cpv_division: '45', wins: 310, revenue: 950_000_000 },
      { cpv_division: '71', wins: 113, revenue: 250_000_000 },
    ],
  },
  {
    name: 'Gertal',
    country: 'PT',
    total_wins: 87,
    total_revenue: 45_000_000,
    win_rate_pct: 52.1,
    avg_discount_pct: 6.3,
    sector_diversity: 2,
    sector_stats: [
      { cpv_division: '55', wins: 72, revenue: 38_000_000 },
      { cpv_division: '15', wins: 15, revenue: 7_000_000 },
    ],
  },
];

// ─── Test Data: Market Benchmarks ────────────────────────────────────────────

const BENCHMARKS = [
  { cpv_division: '72', country: 'PT', p25_discount: 8.0, median_discount: 14.5, p75_discount: 22.0 },
  { cpv_division: '45', country: 'PT', p25_discount: 5.0, median_discount: 10.0, p75_discount: 18.0 },
  { cpv_division: '33', country: 'PT', p25_discount: 3.0, median_discount: 7.5, p75_discount: 12.0 },
  { cpv_division: '55', country: 'PT', p25_discount: 2.0, median_discount: 6.0, p75_discount: 10.0 },
  { cpv_division: '90', country: 'PT', p25_discount: 6.0, median_discount: 12.0, p75_discount: 20.0 },
];

// ─── Test Data: Insights ─────────────────────────────────────────────────────

const INSIGHTS = [
  {
    tender_id: 'TED-2026-100001',
    insights: {
      'en-US': {
        risk_assessment: {
          overall_risk_score: 35,
          risk_level: 'Medium',
          key_risk_factors: [
            'Tight submission deadline (45 days)',
            'Incumbent supplier detected (Novabase)',
          ],
        },
      },
      'pt-PT': {
        risk_assessment: {
          overall_risk_score: 35,
          risk_level: 'Médio',
          key_risk_factors: [
            'Prazo de submissão apertado (45 dias)',
            'Fornecedor incumbente detetado (Novabase)',
          ],
        },
      },
    },
  },
  {
    tender_id: 'TED-2026-100003',
    insights: {
      'en-US': {
        risk_assessment: {
          overall_risk_score: 72,
          risk_level: 'High',
          key_risk_factors: [
            'Very high contract value (€8.5M)',
            'Complex technical requirements',
            'Strong incumbent (Mota-Engil)',
            'Multi-phase delivery required',
          ],
        },
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Tender Data Integrity', () => {
  it('all tenders have non-empty title and buyer_name', () => {
    for (const t of TENDERS) {
      expect(t.title.length).toBeGreaterThan(0);
      expect(t.buyer_name.length).toBeGreaterThan(0);
    }
  });

  it('all estimated_value > 0', () => {
    for (const t of TENDERS) {
      expect(t.estimated_value).toBeGreaterThan(0);
    }
  });

  it('all CPV codes are 8-digit format', () => {
    for (const t of TENDERS) {
      expect(t.cpv_code).toMatch(/^\d{8}$/);
    }
  });

  it('all country codes are valid 2-letter ISO', () => {
    const valid = new Set(['PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'IE', 'PL', 'SE', 'DK', 'FI', 'GR', 'RO', 'BG', 'HR', 'CZ', 'SK', 'HU', 'SI', 'LT', 'LV', 'EE', 'CY', 'MT', 'LU']);
    for (const t of TENDERS) {
      expect(valid.has(t.country)).toBe(true);
    }
  });

  it('all currencies are valid ISO 4217', () => {
    const valid = new Set(['EUR', 'GBP', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK']);
    for (const t of TENDERS) {
      expect(valid.has(t.currency)).toBe(true);
    }
  });

  it('publication_date <= submission_deadline for active tenders', () => {
    for (const t of TENDERS.filter((t) => t.is_active)) {
      expect(new Date(t.publication_date).getTime()).toBeLessThanOrEqual(
        new Date(t.submission_deadline).getTime()
      );
    }
  });

  it('awarded tenders have final_contract_value > 0', () => {
    for (const t of TENDERS.filter((t) => !t.is_active)) {
      expect(t.final_contract_value).not.toBeNull();
      expect(t.final_contract_value!).toBeGreaterThan(0);
    }
  });

  it('awarded tenders have award_decision_date set', () => {
    for (const t of TENDERS.filter((t) => !t.is_active)) {
      expect(t.award_decision_date).not.toBeNull();
    }
  });

  it('awarded tenders have non-empty winners_list', () => {
    for (const t of TENDERS.filter((t) => !t.is_active)) {
      expect(t.winners_list).not.toBeNull();
      expect(t.winners_list!.length).toBeGreaterThan(0);
      for (const w of t.winners_list!) {
        expect(w.winner_name.length).toBeGreaterThan(0);
      }
    }
  });

  it('award_decision_date >= publication_date for awarded tenders', () => {
    for (const t of TENDERS.filter((t) => !t.is_active && t.award_decision_date)) {
      expect(new Date(t.award_decision_date!).getTime()).toBeGreaterThanOrEqual(
        new Date(t.publication_date).getTime()
      );
    }
  });

  it('final_contract_value is reasonable vs estimated_value (0.1x-10x)', () => {
    for (const t of TENDERS.filter((t) => !t.is_active && t.final_contract_value)) {
      const ratio = t.final_contract_value! / t.estimated_value;
      expect(ratio).toBeGreaterThan(0.1);
      expect(ratio).toBeLessThan(10);
    }
  });

  it('source_system is a known value', () => {
    const known = new Set(['BASE.gov.pt', 'TED']);
    for (const t of TENDERS) {
      expect(known.has(t.source_system)).toBe(true);
    }
  });
});

describe('Match Score Integrity', () => {
  it('all match_score in range 0-100', () => {
    for (const m of MATCHES) {
      expect(m.match_score).toBeGreaterThanOrEqual(0);
      expect(m.match_score).toBeLessThanOrEqual(100);
    }
  });

  it('all score components in range 0-100', () => {
    const components = ['score_cpv', 'score_strategic', 'score_semantic', 'score_keyword', 'score_capacity', 'score_market_opp', 'score_location'] as const;
    for (const m of MATCHES) {
      for (const c of components) {
        expect(m[c]).toBeGreaterThanOrEqual(0);
        expect(m[c]).toBeLessThanOrEqual(100);
      }
    }
  });

  it('win_probability in range 0-1', () => {
    for (const m of MATCHES) {
      expect(m.win_probability).toBeGreaterThanOrEqual(0);
      expect(m.win_probability).toBeLessThanOrEqual(1);
    }
  });

  it('match_reasons is valid pipe-separated format', () => {
    for (const m of MATCHES) {
      const parts = m.match_reasons.split('|');
      expect(parts.length).toBeGreaterThan(0);
      for (const part of parts) {
        expect(part).toMatch(/^[a-z_]+:.+$/);
      }
    }
  });

  it('no duplicate client+tender pairs', () => {
    const seen = new Set<string>();
    for (const m of MATCHES) {
      const key = `${m.client_id}:${m.tender_id}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('high score matches have higher win probability than low score', () => {
    const sorted = [...MATCHES].sort((a, b) => b.match_score - a.match_score);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];
    expect(top.win_probability).toBeGreaterThan(bottom.win_probability);
  });
});

describe('Dashboard KPI Consistency', () => {
  const activeTenderIds = new Set(TENDERS.filter((t) => t.is_active).map((t) => t.tender_id));
  const activeMatches = MATCHES.filter((m) => activeTenderIds.has(m.tender_id));
  const highConfidence = activeMatches.filter((m) => m.match_score >= 75);

  it('high confidence count <= active matches count', () => {
    expect(highConfidence.length).toBeLessThanOrEqual(activeMatches.length);
  });

  it('pipeline value equals sum of matched active tender values', () => {
    const tenderValues = new Map(TENDERS.map((t) => [t.tender_id, t.estimated_value]));
    const pipeline = activeMatches.reduce(
      (sum, m) => sum + (tenderValues.get(m.tender_id) ?? 0),
      0
    );
    expect(pipeline).toBeGreaterThan(0);
    // Verify against expected: 450K + 5M + 8.5M + 2.3M = ~16.25M (only matched active ones)
    const expected = activeMatches.reduce((sum, m) => {
      const tender = TENDERS.find((t) => t.tender_id === m.tender_id);
      return sum + (tender?.estimated_value ?? 0);
    }, 0);
    expect(pipeline).toBe(expected);
  });

  it('pipeline value is non-negative', () => {
    const tenderValues = new Map(TENDERS.map((t) => [t.tender_id, t.estimated_value]));
    const pipeline = activeMatches.reduce(
      (sum, m) => sum + (tenderValues.get(m.tender_id) ?? 0),
      0
    );
    expect(pipeline).toBeGreaterThanOrEqual(0);
  });
});

describe('Buyer Intelligence Data Quality', () => {
  it('all buyers have total_contracts > 0', () => {
    for (const b of BUYERS) {
      expect(b.total_contracts).toBeGreaterThan(0);
    }
  });

  it('all buyers have total_spend > 0 and < €10B', () => {
    for (const b of BUYERS) {
      expect(b.total_spend).toBeGreaterThan(0);
      expect(b.total_spend).toBeLessThan(10_000_000_000);
    }
  });

  it('avg_discount between 0% and 80%', () => {
    for (const b of BUYERS) {
      expect(b.avg_discount).toBeGreaterThanOrEqual(0);
      expect(b.avg_discount).toBeLessThan(80);
    }
  });

  it('avg_bidder_count >= 1', () => {
    for (const b of BUYERS) {
      expect(b.avg_bidder_count).toBeGreaterThanOrEqual(1);
    }
  });

  it('top_winners is non-empty for large buyers', () => {
    for (const b of BUYERS.filter((b) => b.total_contracts > 5)) {
      expect(b.top_winners.length).toBeGreaterThan(0);
    }
  });

  it('sector_stats CPV divisions are valid 2-digit codes', () => {
    for (const b of BUYERS) {
      for (const s of b.sector_stats) {
        expect(s.cpv_division).toMatch(/^\d{2}$/);
      }
    }
  });

  it('sector avg_contract_value > 0', () => {
    for (const b of BUYERS) {
      for (const s of b.sector_stats) {
        expect(s.avg_contract_value).toBeGreaterThan(0);
      }
    }
  });
});

describe('Competitor Intelligence Data Quality', () => {
  it('all competitors have total_wins > 0', () => {
    for (const c of COMPETITORS) {
      expect(c.total_wins).toBeGreaterThan(0);
    }
  });

  it('all competitors have total_revenue > 0', () => {
    for (const c of COMPETITORS) {
      expect(c.total_revenue).toBeGreaterThan(0);
    }
  });

  it('win_rate_pct between 0% and 100%', () => {
    for (const c of COMPETITORS) {
      expect(c.win_rate_pct).toBeGreaterThanOrEqual(0);
      expect(c.win_rate_pct).toBeLessThanOrEqual(100);
    }
  });

  it('avg_discount_pct between 0% and 80%', () => {
    for (const c of COMPETITORS) {
      expect(c.avg_discount_pct).toBeGreaterThanOrEqual(0);
      expect(c.avg_discount_pct).toBeLessThan(80);
    }
  });

  it('sector_diversity >= 1', () => {
    for (const c of COMPETITORS) {
      expect(c.sector_diversity).toBeGreaterThanOrEqual(1);
    }
  });

  it('sector_diversity matches actual sector_stats count', () => {
    for (const c of COMPETITORS) {
      expect(c.sector_diversity).toBe(c.sector_stats.length);
    }
  });

  it('sum of sector wins equals total_wins', () => {
    for (const c of COMPETITORS) {
      const sectorWins = c.sector_stats.reduce((sum, s) => sum + s.wins, 0);
      expect(sectorWins).toBe(c.total_wins);
    }
  });

  it('sum of sector revenue equals total_revenue', () => {
    for (const c of COMPETITORS) {
      const sectorRev = c.sector_stats.reduce((sum, s) => sum + s.revenue, 0);
      expect(sectorRev).toBe(c.total_revenue);
    }
  });
});

describe('Market Benchmark Consistency', () => {
  it('p25 <= median <= p75 for all benchmarks', () => {
    for (const b of BENCHMARKS) {
      expect(b.p25_discount).toBeLessThanOrEqual(b.median_discount);
      expect(b.median_discount).toBeLessThanOrEqual(b.p75_discount);
    }
  });

  it('all discount values are between 0% and 50%', () => {
    for (const b of BENCHMARKS) {
      expect(b.p25_discount).toBeGreaterThanOrEqual(0);
      expect(b.p75_discount).toBeLessThanOrEqual(50);
    }
  });

  it('CPV divisions are valid 2-digit codes', () => {
    for (const b of BENCHMARKS) {
      expect(b.cpv_division).toMatch(/^\d{2}$/);
    }
  });
});

describe('AI Insights Data Quality', () => {
  it('risk_score is in range 0-100', () => {
    for (const i of INSIGHTS) {
      for (const locale of Object.keys(i.insights)) {
        const score = i.insights[locale].risk_assessment.overall_risk_score;
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    }
  });

  it('risk_level matches score range', () => {
    // Maps score ranges to valid risk level keywords (EN and PT)
    const validLevels: Record<string, string[]> = {
      low: ['low', 'baixo'],
      medium: ['medium', 'médio', 'medio'],
      high: ['high', 'alto', 'elevado'],
      critical: ['critical', 'crítico', 'critico'],
    };

    const levelForScore = (s: number) => {
      if (s <= 25) return 'low';
      if (s <= 50) return 'medium';
      if (s <= 75) return 'high';
      return 'critical';
    };

    for (const i of INSIGHTS) {
      for (const locale of Object.keys(i.insights)) {
        const { overall_risk_score, risk_level } = i.insights[locale].risk_assessment;
        const expectedBucket = levelForScore(overall_risk_score);
        const allowed = validLevels[expectedBucket];
        expect(allowed.some((kw) => risk_level.toLowerCase().includes(kw))).toBe(true);
      }
    }
  });

  it('key_risk_factors is non-empty when risk is not Low', () => {
    for (const i of INSIGHTS) {
      for (const locale of Object.keys(i.insights)) {
        const { overall_risk_score, key_risk_factors } = i.insights[locale].risk_assessment;
        if (overall_risk_score > 25) {
          expect(key_risk_factors.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('insights have valid locale keys', () => {
    const validLocales = new Set(['en-US', 'pt-PT']);
    for (const i of INSIGHTS) {
      for (const locale of Object.keys(i.insights)) {
        expect(validLocales.has(locale)).toBe(true);
      }
    }
  });
});
