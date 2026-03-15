export interface TenderDetails {
  tender_id: string;
  tender_uuid?: string;
  source_system: string;
  title: string;
  buyer_name: string;
  description: string;
  cpv_code: string | null;
  cpv_description: string | null;
  estimated_value: number;
  currency: string;
  publication_date: string;
  submission_deadline: string;
  country: string;
  document_urls: string | null;
  procedure_documents_url: string | null;
  is_active: boolean;
  final_contract_value: number | null;
  award_decision_date: string | null;
  winners_list: any[] | null;
  procedure_type: string | null;
  insights: any;
}

export interface MatchDetails {
  match_score: number;
  match_reasons: string;
  score_location?: number;
  score_cpv?: number;
  score_strategic?: number;
  score_semantic?: number;
  score_keyword?: number;
  score_capacity?: number;
  score_market_opp?: number;
  win_probability?: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  services: string;
  tech_stack: string;
  min_budget: number;
  max_budget: number;
}

export interface MarketPricing {
  count: number;
  p25: number;
  p50: number;
  p75: number;
}

export interface TenderContext {
  tender: TenderDetails;
  match: MatchDetails | null;
  buyerIntel: any;
  insights: any;
  competitors: any[];
  benchmarks: any;
}

export type UserTier = 'free' | 'Pro' | 'Starter' | 'Professional' | 'Enterprise';
