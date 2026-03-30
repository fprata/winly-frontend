/**
 * Seed script for test tenders, matches, buyer/competitor intelligence,
 * and market benchmarks. Designed to work alongside seed-test-accounts.ts.
 *
 * Usage:
 *   npx tsx e2e/fixtures/seed-test-data.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * The script is idempotent — it upserts on conflict.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Tenders ─────────────────────────────────────────────────────────────────

const TENDERS = [
  // IT / Software tenders
  {
    tender_id: 'TEST-PT-2026-001',
    title: 'Supply and Implementation of IT Infrastructure for Municipal Services',
    description: 'Supply, installation, and configuration of servers, networking equipment, and end-user devices for Lisbon municipality offices. Includes 3-year maintenance SLA.',
    buyer_name: 'Câmara Municipal de Lisboa',
    cpv_code: '72000000',
    estimated_value: 450000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-03-01',
    submission_deadline: '2026-04-30',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
  },
  {
    tender_id: 'TEST-PT-2026-002',
    title: 'Cloud Migration Services for National Tax Authority',
    description: 'Migration of legacy on-premises systems to cloud infrastructure. Includes architecture design, data migration, security audit, and staff training.',
    buyer_name: 'Autoridade Tributária e Aduaneira',
    cpv_code: '72212517',
    estimated_value: 1800000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-02-15',
    submission_deadline: '2026-05-15',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
  },
  {
    tender_id: 'TEST-PT-2026-003',
    title: 'ERP System Upgrade for Porto Water Utility',
    description: 'Upgrade existing SAP ERP system and integrate with new billing and customer management modules for Águas do Porto.',
    buyer_name: 'Águas do Porto, E.M.',
    cpv_code: '48000000',
    estimated_value: 620000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2025-12-01',
    submission_deadline: '2026-01-31',
    is_active: false,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
    final_contract_value: 545000,
    award_decision_date: '2026-02-15',
    winners_list: [{ winner_name: 'Novabase', winner_vat_id: '500760491' }],
  },
  // Construction tenders
  {
    tender_id: 'TEST-PT-2026-004',
    title: 'Road Resurfacing Works - EN1 Section Santarém to Leiria',
    description: 'Complete resurfacing of 42km section of EN1 between Santarém and Leiria, including drainage improvement and road markings.',
    buyer_name: 'Infraestruturas de Portugal, S.A.',
    cpv_code: '45233000',
    estimated_value: 8500000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-02-20',
    submission_deadline: '2026-05-20',
    is_active: true,
    source_system: 'TED',
    procedure_type: 'Open Procedure',
  },
  {
    tender_id: 'TEST-PT-2026-005',
    title: 'Construction of New Primary School - Cascais',
    description: 'Design and build of a new primary school with 16 classrooms, gymnasium, and canteen facilities. Must comply with nZEB requirements.',
    buyer_name: 'Câmara Municipal de Cascais',
    cpv_code: '45214210',
    estimated_value: 4200000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-03-10',
    submission_deadline: '2026-06-10',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
  },
  // Healthcare tenders
  {
    tender_id: 'TEST-PT-2026-006',
    title: 'Medical Imaging Equipment Maintenance Contract',
    description: 'Preventive and corrective maintenance of MRI, CT, and X-ray equipment across 3 hospital sites. 4-year framework agreement.',
    buyer_name: 'Centro Hospitalar de Lisboa Central',
    cpv_code: '33100000',
    estimated_value: 1200000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-01-10',
    submission_deadline: '2026-02-28',
    is_active: false,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
    final_contract_value: 1050000,
    award_decision_date: '2026-03-10',
    winners_list: [{ winner_name: 'Siemens Healthineers', winner_vat_id: '500100200' }],
  },
  {
    tender_id: 'TEST-PT-2026-007',
    title: 'Telemedicine Platform for Rural Health Centers',
    description: 'Development and deployment of telemedicine solution connecting 45 rural health centers with specialist consultations at central hospitals.',
    buyer_name: 'SPMS - Serviços Partilhados do Ministério da Saúde',
    cpv_code: '85000000',
    estimated_value: 920000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-03-15',
    submission_deadline: '2026-05-30',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
  },
  // Environmental tenders
  {
    tender_id: 'TEST-PT-2026-008',
    title: 'Urban Waste Collection Services - Braga Municipality',
    description: 'Door-to-door waste collection, recycling sorting, and transport to treatment facilities for 180,000 residents. 5-year contract.',
    buyer_name: 'Câmara Municipal de Braga',
    cpv_code: '90511000',
    estimated_value: 3700000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2025-11-01',
    submission_deadline: '2025-12-15',
    is_active: false,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
    final_contract_value: 3200000,
    award_decision_date: '2026-01-20',
    winners_list: [{ winner_name: 'SUMA - Serviços Urbanos e Meio Ambiente', winner_vat_id: '502123456' }],
  },
  {
    tender_id: 'TEST-PT-2026-009',
    title: 'Water Treatment Plant Upgrade - Algarve',
    description: 'Upgrade of wastewater treatment plant to tertiary treatment level. Includes new UV disinfection and nutrient removal systems.',
    buyer_name: 'Águas do Algarve, S.A.',
    cpv_code: '90000000',
    estimated_value: 5600000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-03-05',
    submission_deadline: '2026-06-05',
    is_active: true,
    source_system: 'TED',
    procedure_type: 'Open Procedure',
  },
  // Catering tenders
  {
    tender_id: 'TEST-PT-2026-010',
    title: 'School Meal Catering Services - Porto District',
    description: 'Supply of daily school meals for 85 schools (approximately 28,000 meals/day). Must comply with DGS nutritional guidelines and HACCP.',
    buyer_name: 'Câmara Municipal do Porto',
    cpv_code: '55524000',
    estimated_value: 2300000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-02-20',
    submission_deadline: '2026-04-15',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Limitado',
  },
  // Consulting tenders
  {
    tender_id: 'TEST-PT-2026-011',
    title: 'EU Structural Funds Management Advisory',
    description: 'Advisory services for the management and monitoring of Portugal 2030 structural funds. Includes program evaluation and compliance auditing.',
    buyer_name: 'Agência para o Desenvolvimento e Coesão, I.P.',
    cpv_code: '79000000',
    estimated_value: 380000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-03-20',
    submission_deadline: '2026-05-10',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
  },
  // Security tenders
  {
    tender_id: 'TEST-PT-2026-012',
    title: 'CCTV and Access Control System for Government Buildings',
    description: 'Supply, installation, and maintenance of integrated CCTV surveillance and access control systems across 12 government buildings in Lisbon.',
    buyer_name: 'Secretaria-Geral do Ministério da Administração Interna',
    cpv_code: '35120000',
    estimated_value: 780000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-03-12',
    submission_deadline: '2026-05-12',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
  },
  // Transport tenders
  {
    tender_id: 'TEST-PT-2026-013',
    title: 'School Bus Transport Services - Setúbal District',
    description: 'Daily school transport services for 12 routes covering 35 schools in Setúbal district. Fleet of minimum 15 vehicles with GPS tracking.',
    buyer_name: 'Câmara Municipal de Setúbal',
    cpv_code: '60130000',
    estimated_value: 1100000,
    currency: 'EUR',
    country: 'PT',
    publication_date: '2026-02-28',
    submission_deadline: '2026-04-28',
    is_active: true,
    source_system: 'BASE.gov.pt',
    procedure_type: 'Concurso Público',
  },
  // EU-wide tenders
  {
    tender_id: 'TEST-EU-2026-001',
    title: 'Cybersecurity Audit Framework for EU Institutions',
    description: 'Framework contract for cybersecurity audit services covering penetration testing, vulnerability assessments, and compliance reviews for EU institutions.',
    buyer_name: 'European Commission - DG DIGIT',
    cpv_code: '72212517',
    estimated_value: 5000000,
    currency: 'EUR',
    country: 'BE',
    publication_date: '2026-03-10',
    submission_deadline: '2026-06-10',
    is_active: true,
    source_system: 'TED',
    procedure_type: 'Open Procedure',
  },
  {
    tender_id: 'TEST-EU-2026-002',
    title: 'Environmental Impact Assessment Studies - Cohesion Fund Projects',
    description: 'Environmental impact assessments for infrastructure projects funded under the EU Cohesion Fund across Southern Europe.',
    buyer_name: 'European Commission - DG REGIO',
    cpv_code: '71313000',
    estimated_value: 2800000,
    currency: 'EUR',
    country: 'BE',
    publication_date: '2026-03-18',
    submission_deadline: '2026-06-18',
    is_active: true,
    source_system: 'TED',
    procedure_type: 'Open Procedure',
  },
];

// ─── Matches (will be linked to test accounts after we resolve client IDs) ───

function buildMatches(clientIdMap: Map<string, string>) {
  const itId = clientIdMap.get('test-it@winly-test.com');
  const constId = clientIdMap.get('test-construction@winly-test.com');
  const healthId = clientIdMap.get('test-health@winly-test.com');
  const envId = clientIdMap.get('test-environment@winly-test.com');
  const consultId = clientIdMap.get('test-consulting@winly-test.com');
  const transportId = clientIdMap.get('test-transport@winly-test.com');
  const securityId = clientIdMap.get('test-security@winly-test.com');
  const cateringId = clientIdMap.get('test-catering@winly-test.com');

  if (!itId || !constId || !healthId || !envId || !consultId || !transportId || !securityId || !cateringId) {
    console.error('Missing client IDs. Run seed-test-accounts.ts first.');
    return [];
  }

  return [
    // IT Services matches
    { client_id: itId, tender_id: 'TEST-PT-2026-001', match_score: 87, score_cpv: 95, score_strategic: 80, score_semantic: 82, score_keyword: 90, score_capacity: 85, score_market_opp: 78, score_location: 92, win_probability: 0.42, match_reasons: 'cpv:exact|location:match|capacity:strong' },
    { client_id: itId, tender_id: 'TEST-PT-2026-002', match_score: 92, score_cpv: 98, score_strategic: 90, score_semantic: 88, score_keyword: 95, score_capacity: 88, score_market_opp: 82, score_location: 90, win_probability: 0.48, match_reasons: 'cpv:exact|location:match|capacity:strong|keyword:cloud' },
    { client_id: itId, tender_id: 'TEST-EU-2026-001', match_score: 72, score_cpv: 88, score_strategic: 70, score_semantic: 65, score_keyword: 75, score_capacity: 60, score_market_opp: 70, score_location: 40, win_probability: 0.18, match_reasons: 'cpv:partial|capacity:medium' },
    // Construction matches
    { client_id: constId, tender_id: 'TEST-PT-2026-004', match_score: 91, score_cpv: 98, score_strategic: 88, score_semantic: 90, score_keyword: 85, score_capacity: 92, score_market_opp: 80, score_location: 95, win_probability: 0.55, match_reasons: 'cpv:exact|location:match|incumbent:Teixeira Duarte|capacity:strong' },
    { client_id: constId, tender_id: 'TEST-PT-2026-005', match_score: 83, score_cpv: 90, score_strategic: 82, score_semantic: 78, score_keyword: 80, score_capacity: 85, score_market_opp: 75, score_location: 90, win_probability: 0.38, match_reasons: 'cpv:exact|location:match' },
    // Healthcare matches
    { client_id: healthId, tender_id: 'TEST-PT-2026-006', match_score: 45, score_cpv: 85, score_strategic: 40, score_semantic: 35, score_keyword: 50, score_capacity: 30, score_market_opp: 42, score_location: 60, win_probability: 0.08, match_reasons: 'cpv:partial|capacity:weak' },
    { client_id: healthId, tender_id: 'TEST-PT-2026-007', match_score: 79, score_cpv: 90, score_strategic: 75, score_semantic: 72, score_keyword: 82, score_capacity: 74, score_market_opp: 70, score_location: 85, win_probability: 0.32, match_reasons: 'cpv:exact|location:match|keyword:telemedicine' },
    // Environmental matches
    { client_id: envId, tender_id: 'TEST-PT-2026-008', match_score: 88, score_cpv: 96, score_strategic: 85, score_semantic: 84, score_keyword: 90, score_capacity: 82, score_market_opp: 78, score_location: 92, win_probability: 0.45, match_reasons: 'cpv:exact|location:match|capacity:strong' },
    { client_id: envId, tender_id: 'TEST-PT-2026-009', match_score: 81, score_cpv: 92, score_strategic: 78, score_semantic: 76, score_keyword: 82, score_capacity: 75, score_market_opp: 72, score_location: 88, win_probability: 0.35, match_reasons: 'cpv:exact|location:match' },
    { client_id: envId, tender_id: 'TEST-EU-2026-002', match_score: 65, score_cpv: 80, score_strategic: 60, score_semantic: 58, score_keyword: 68, score_capacity: 55, score_market_opp: 62, score_location: 35, win_probability: 0.15, match_reasons: 'cpv:partial|location:remote' },
    // Consulting matches
    { client_id: consultId, tender_id: 'TEST-PT-2026-011', match_score: 85, score_cpv: 94, score_strategic: 82, score_semantic: 80, score_keyword: 88, score_capacity: 78, score_market_opp: 76, score_location: 90, win_probability: 0.40, match_reasons: 'cpv:exact|location:match|keyword:EU funds' },
    // Transport matches
    { client_id: transportId, tender_id: 'TEST-PT-2026-013', match_score: 76, score_cpv: 90, score_strategic: 72, score_semantic: 68, score_keyword: 78, score_capacity: 70, score_market_opp: 65, score_location: 82, win_probability: 0.28, match_reasons: 'cpv:exact|location:match' },
    // Security matches
    { client_id: securityId, tender_id: 'TEST-PT-2026-012', match_score: 82, score_cpv: 92, score_strategic: 80, score_semantic: 75, score_keyword: 85, score_capacity: 76, score_market_opp: 72, score_location: 88, win_probability: 0.36, match_reasons: 'cpv:exact|location:match|keyword:CCTV' },
    // Catering matches
    { client_id: cateringId, tender_id: 'TEST-PT-2026-010', match_score: 78, score_cpv: 92, score_strategic: 75, score_semantic: 70, score_keyword: 80, score_capacity: 68, score_market_opp: 72, score_location: 85, win_probability: 0.30, match_reasons: 'cpv:exact|location:match|keyword:school meals' },
  ];
}

// ─── Buyer Intelligence ──────────────────────────────────────────────────────

const BUYERS = [
  {
    name: 'Câmara Municipal de Lisboa',
    country: 'PT',
    total_contracts: 1247,
    total_spend: 890000000,
    avg_discount: 12.5,
    avg_bidder_count: 4.3,
    persona_name: 'Active Municipal Buyer',
    top_winners: [
      { name: 'Novabase', wins: 23, avg_value: 180000 },
      { name: 'Mota-Engil', wins: 18, avg_value: 2500000 },
      { name: 'Axians', wins: 12, avg_value: 145000 },
    ],
    sector_stats: [
      { cpv_division: '72', avg_bidder_count: 5.1, avg_contract_value: 220000, avg_discount: 15.2 },
      { cpv_division: '45', avg_bidder_count: 3.8, avg_contract_value: 1800000, avg_discount: 10.1 },
      { cpv_division: '90', avg_bidder_count: 2.5, avg_contract_value: 950000, avg_discount: 8.5 },
    ],
  },
  {
    name: 'Centro Hospitalar de Lisboa Central',
    country: 'PT',
    total_contracts: 534,
    total_spend: 420000000,
    avg_discount: 8.3,
    avg_bidder_count: 2.7,
    persona_name: 'Healthcare Institution',
    top_winners: [
      { name: 'Siemens Healthineers', wins: 45, avg_value: 850000 },
      { name: 'Philips Healthcare', wins: 32, avg_value: 620000 },
      { name: 'GE Healthcare', wins: 18, avg_value: 480000 },
    ],
    sector_stats: [
      { cpv_division: '33', avg_bidder_count: 2.4, avg_contract_value: 780000, avg_discount: 7.5 },
      { cpv_division: '85', avg_bidder_count: 3.1, avg_contract_value: 340000, avg_discount: 9.2 },
    ],
  },
  {
    name: 'Infraestruturas de Portugal, S.A.',
    country: 'PT',
    total_contracts: 892,
    total_spend: 2100000000,
    avg_discount: 10.8,
    avg_bidder_count: 3.9,
    persona_name: 'Infrastructure Authority',
    top_winners: [
      { name: 'Mota-Engil', wins: 67, avg_value: 12000000 },
      { name: 'Teixeira Duarte', wins: 45, avg_value: 8500000 },
      { name: 'Casais', wins: 32, avg_value: 5200000 },
    ],
    sector_stats: [
      { cpv_division: '45', avg_bidder_count: 4.2, avg_contract_value: 6500000, avg_discount: 11.5 },
      { cpv_division: '71', avg_bidder_count: 5.8, avg_contract_value: 350000, avg_discount: 14.2 },
    ],
  },
  {
    name: 'Câmara Municipal do Porto',
    country: 'PT',
    total_contracts: 978,
    total_spend: 650000000,
    avg_discount: 11.2,
    avg_bidder_count: 3.6,
    persona_name: 'Active Municipal Buyer',
    top_winners: [
      { name: 'Gertal', wins: 8, avg_value: 1800000 },
      { name: 'Eurest', wins: 6, avg_value: 1500000 },
    ],
    sector_stats: [
      { cpv_division: '55', avg_bidder_count: 3.2, avg_contract_value: 1200000, avg_discount: 6.8 },
      { cpv_division: '45', avg_bidder_count: 4.0, avg_contract_value: 2200000, avg_discount: 12.0 },
    ],
  },
  {
    name: 'SPMS - Serviços Partilhados do Ministério da Saúde',
    country: 'PT',
    total_contracts: 312,
    total_spend: 180000000,
    avg_discount: 9.5,
    avg_bidder_count: 3.2,
    persona_name: 'Central Health Procurement',
    top_winners: [
      { name: 'Novabase', wins: 15, avg_value: 420000 },
      { name: 'Altran', wins: 10, avg_value: 350000 },
    ],
    sector_stats: [
      { cpv_division: '72', avg_bidder_count: 4.5, avg_contract_value: 380000, avg_discount: 12.0 },
      { cpv_division: '33', avg_bidder_count: 2.8, avg_contract_value: 520000, avg_discount: 7.8 },
    ],
  },
];

// ─── Competitor Intelligence ─────────────────────────────────────────────────

const COMPETITORS = [
  { name: 'Novabase', country: 'PT', total_wins: 156, total_revenue: 28000000, win_rate_pct: 34.2, avg_discount_pct: 14.8, sector_diversity: 3, sector_stats: [{ cpv_division: '72', wins: 98, revenue: 18000000 }, { cpv_division: '48', wins: 43, revenue: 8000000 }, { cpv_division: '85', wins: 15, revenue: 2000000 }] },
  { name: 'Mota-Engil', country: 'PT', total_wins: 423, total_revenue: 1200000000, win_rate_pct: 28.6, avg_discount_pct: 11.2, sector_diversity: 3, sector_stats: [{ cpv_division: '45', wins: 310, revenue: 950000000 }, { cpv_division: '71', wins: 78, revenue: 180000000 }, { cpv_division: '90', wins: 35, revenue: 70000000 }] },
  { name: 'Siemens Healthineers', country: 'DE', total_wins: 89, total_revenue: 75000000, win_rate_pct: 62.3, avg_discount_pct: 5.8, sector_diversity: 2, sector_stats: [{ cpv_division: '33', wins: 72, revenue: 65000000 }, { cpv_division: '85', wins: 17, revenue: 10000000 }] },
  { name: 'Gertal', country: 'PT', total_wins: 87, total_revenue: 45000000, win_rate_pct: 52.1, avg_discount_pct: 6.3, sector_diversity: 2, sector_stats: [{ cpv_division: '55', wins: 72, revenue: 38000000 }, { cpv_division: '15', wins: 15, revenue: 7000000 }] },
  { name: 'SUMA - Serviços Urbanos e Meio Ambiente', country: 'PT', total_wins: 134, total_revenue: 320000000, win_rate_pct: 45.7, avg_discount_pct: 9.1, sector_diversity: 2, sector_stats: [{ cpv_division: '90', wins: 112, revenue: 280000000 }, { cpv_division: '71', wins: 22, revenue: 40000000 }] },
  { name: 'Securitas', country: 'SE', total_wins: 67, total_revenue: 18000000, win_rate_pct: 38.5, avg_discount_pct: 8.2, sector_diversity: 2, sector_stats: [{ cpv_division: '35', wins: 52, revenue: 14000000 }, { cpv_division: '32', wins: 15, revenue: 4000000 }] },
  { name: 'Deloitte', country: 'NL', total_wins: 112, total_revenue: 42000000, win_rate_pct: 41.3, avg_discount_pct: 12.5, sector_diversity: 3, sector_stats: [{ cpv_division: '79', wins: 68, revenue: 25000000 }, { cpv_division: '73', wins: 32, revenue: 12000000 }, { cpv_division: '80', wins: 12, revenue: 5000000 }] },
  { name: 'Barraqueiro', country: 'PT', total_wins: 54, total_revenue: 95000000, win_rate_pct: 48.2, avg_discount_pct: 7.5, sector_diversity: 2, sector_stats: [{ cpv_division: '60', wins: 42, revenue: 78000000 }, { cpv_division: '34', wins: 12, revenue: 17000000 }] },
];

// ─── Seed Functions ──────────────────────────────────────────────────────────

async function seedTenders() {
  console.log('Seeding tenders...');
  for (const tender of TENDERS) {
    const { error } = await supabase.from('tenders').upsert(tender, { onConflict: 'tender_id' });
    if (error) {
      console.error(`  [ERROR] ${tender.tender_id}:`, error.message);
    } else {
      console.log(`  [OK] ${tender.tender_id}: ${tender.title.slice(0, 50)}...`);
    }
  }
}

async function getClientIds(): Promise<Map<string, string>> {
  const { data, error } = await supabase.from('clients').select('id, email');
  if (error || !data) {
    console.error('Failed to fetch client IDs:', error?.message);
    return new Map();
  }
  return new Map(data.map((c) => [c.email, c.id]));
}

async function seedMatches(clientIdMap: Map<string, string>) {
  console.log('\nSeeding matches...');
  const matches = buildMatches(clientIdMap);
  for (const match of matches) {
    const { error } = await supabase
      .from('tender_matches')
      .upsert(match, { onConflict: 'client_id,tender_id' });
    if (error) {
      console.error(`  [ERROR] ${match.client_id} × ${match.tender_id}:`, error.message);
    } else {
      console.log(`  [OK] Score ${match.match_score} → ${match.tender_id}`);
    }
  }
}

async function seedBuyers() {
  console.log('\nSeeding buyer intelligence...');
  for (const buyer of BUYERS) {
    const { error } = await supabase
      .from('intel_buyers')
      .upsert(buyer, { onConflict: 'name' });
    if (error) {
      console.error(`  [ERROR] ${buyer.name}:`, error.message);
    } else {
      console.log(`  [OK] ${buyer.name} (${buyer.total_contracts} contracts)`);
    }
  }
}

async function seedCompetitors() {
  console.log('\nSeeding competitor intelligence...');
  for (const comp of COMPETITORS) {
    const { error } = await supabase
      .from('intel_competitors')
      .upsert(comp, { onConflict: 'name' });
    if (error) {
      console.error(`  [ERROR] ${comp.name}:`, error.message);
    } else {
      console.log(`  [OK] ${comp.name} (${comp.total_wins} wins)`);
    }
  }
}

async function main() {
  console.log('=== Winly Test Data Seeder ===\n');

  await seedTenders();

  const clientIdMap = await getClientIds();
  if (clientIdMap.size === 0) {
    console.error('\nNo clients found. Run seed-test-accounts.ts first.');
    process.exit(1);
  }
  console.log(`\nFound ${clientIdMap.size} client profiles.`);

  await seedMatches(clientIdMap);
  await seedBuyers();
  await seedCompetitors();

  console.log('\n=== Done ===');
}

main().catch(console.error);
