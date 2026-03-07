import React from 'react';
import {
  ArrowLeft,
  ExternalLink,
  DollarSign,
  FileText,
  Clock,
  History,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { notFound, redirect } from 'next/navigation';
import { getCpvDescription } from '@/utils/cpv-data';
import { getServerUser } from '@/utils/dev-auth';
import { TenderDetailsTabs } from '@/components/tender/TenderDetailsTabs';
import { OverviewTab } from '@/components/tender/OverviewTab';
import { AwardTab } from '@/components/tender/AwardTab';
import { InsightsTab } from '@/components/tender/InsightsTab';
import { TenderChatbot } from '@/components/tender/TenderChatbot';
import type { UserTier } from '@/components/tender/types';

interface TenderDetails {
  tender_id: string;
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
  embedding?: number[] | string;
}

interface ClientProfile {
  id: string;
  name: string;
  services: string;
  tech_stack: string;
  min_budget: number;
  max_budget: number;
  tier?: string;
}

interface MarketPricing {
  count: number;
  p25: number;
  p50: number;
  p75: number;
}

export default async function TenderDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ backUrl?: string }>;
}) {
  const { id } = await params;
  const { backUrl } = await searchParams;

  const supabase = await createClient();
  const t = await getTranslations('tenders');
  const locale = await getLocale();

  const { user } = await getServerUser(supabase);
  if (!user) redirect('/login');

  // Simple, direct lookup by internal UUID
  const { data: tender, error: tenderError } = await supabase
    .from('tenders')
    .select('*')
    .eq('tender_uuid', id)
    .single();

  if (tenderError || !tender) {
    console.error(`[TenderPage] Tender not found for UUID: ${id}`);
    notFound();
  }

  // Derive document link
  let derivedDocLink: string | null = null;
  const rawDocUrl = (tender.procedure_documents_url || '') + ',' + (tender.document_urls || '');
  const procPlatforms = ['acingov.pt', 'vortal.biz', 'anogov.com', 'saphety.com', 'base.gov.pt', 'publiccontracts.gov.pt', 'comunidade.vortal'];

  const allUrls = rawDocUrl.split(',').map((u: string) => u.trim()).filter((u: string) => u.startsWith('http'));
  const directPlatformLink = allUrls.find(u => procPlatforms.some(p => u.toLowerCase().includes(p)));

  if (directPlatformLink) {
    derivedDocLink = directPlatformLink;
  } else {
    const directPdf = allUrls.find(u => u.toLowerCase().endsWith('.pdf') && !u.includes('ted.europa.eu'));
    if (directPdf) {
      derivedDocLink = directPdf;
    }
  }

  const sourceLink = (tender.document_urls && tender.document_urls.startsWith('http'))
    ? (tender.document_urls.includes(',') ? tender.document_urls.split(',')[0].trim() : tender.document_urls)
    : `https://www.base.gov.pt/Base4/pt/pesquisa/?type=anuncios&texto=${encodeURIComponent(tender.tender_id)}`;

  const normalizeUrl = (u: string | null) => u?.replace(/\/$/, '').replace('https://', 'http://').toLowerCase().trim();

  if (normalizeUrl(derivedDocLink) === normalizeUrl(sourceLink)) {
    derivedDocLink = null;
  }

  // Fetch profile with tier
  const [profileRes] = await Promise.all([
    supabase.from('clients').select('*').eq('email', user.email).single()
  ]);

  const profile: ClientProfile | null = profileRes.data;
  const userTier: UserTier = (profile?.tier as UserTier) || 'free';

  // Fetch Secondary Data
  const cpvDiv = tender.cpv_code ? tender.cpv_code.substring(0, 2) : null;

  const buyerPromise = supabase
    .from('intel_buyers')
    .select('*')
    .eq('name', tender.buyer_name)
    .single();

  const matchPromise = profile ? supabase
    .from('tender_matches')
    .select('match_score, match_reasons, score_location, score_cpv, score_strategic, score_semantic, score_keyword, score_capacity, score_market_opp, win_probability')
    .eq('tender_uuid', id)
    .eq('client_id', profile.id)
    .maybeSingle() : Promise.resolve({ data: null });

  const benchmarkPromise = cpvDiv ? supabase
    .from('market_benchmarks')
    .select('p25_discount_rate, median_discount_rate, p75_discount_rate')
    .eq('cpv_division', cpvDiv)
    .eq('country', tender.country)
    .single() : Promise.resolve({ data: null });

  const [buyerRes, matchRes, benchmarkRes] = await Promise.all([buyerPromise, matchPromise, benchmarkPromise]);

  const buyerIntel = buyerRes.data;
  const match: any | null = matchRes.data;
  const benchmarks = benchmarkRes.data;

  // Semantic Search for Related Tenders
  let relatedTenders: any[] = [];
  if (tender.embedding) {
    const { data: related } = await supabase.rpc('match_tenders', {
      query_embedding: tender.embedding,
      match_threshold: 0.5,
      match_count: 3,
      current_tender_id: tender.tender_id
    });
    relatedTenders = related || [];
  }

  // Sector-Specific Stats
  let sectorStats = null;
  if (buyerIntel?.sector_stats && cpvDiv) {
    sectorStats = buyerIntel.sector_stats.find((s: any) => s.cpv_division === cpvDiv);
  }

  const refinedAvgDiscount = sectorStats?.avg_discount ?? buyerIntel?.avg_discount ?? 0;
  const refinedBidderCount = sectorStats?.avg_bidder_count ?? buyerIntel?.avg_bidder_count ?? 0;
  const refinedVal = sectorStats?.avg_contract_value ?? buyerIntel?.avg_value ?? 0;

  // Refine Competitors
  let relevantCompetitors = buyerIntel?.top_winners || [];

  if (buyerIntel?.top_winners && tender.cpv_code && buyerIntel.top_winners.length > 0) {
    const winnerNames = buyerIntel.top_winners.map((w: any) => w.winner_name);

    const { data: competitors } = await supabase
      .from('intel_competitors')
      .select('name, sector_stats, avg_discount_pct')
      .in('name', winnerNames);

    if (competitors && competitors.length > 0) {
      const sectorMap = new Map(competitors.map((c: any) => [c.name, c.sector_stats]));
      const discountMap = new Map(competitors.map((c: any) => [c.name, c.avg_discount_pct]));

      const filtered = buyerIntel.top_winners.filter((w: any) => {
        const stats: any[] = sectorMap.get(w.winner_name) || [];
        return stats.some((s: any) => s.cpv_division === cpvDiv);
      }).map((w: any) => ({
        ...w,
        avg_discount: discountMap.get(w.winner_name) || 0
      }));

      relevantCompetitors = filtered;
    }
  }

  // Helper Functions
  const formatValue = (val: number, curr: string = 'EUR') => {
    if (!val) return t('valueNotSpecified');
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'currency',
      currency: curr || 'EUR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getIncumbent = () => {
    if (!match?.match_reasons) return null;
    const match_obj = match.match_reasons.split('|').find((r: string) => r.includes('incumbent'));
    if (!match_obj) return null;
    return match_obj.split(':')[1]?.trim() || "Detected";
  };

  const incumbent = getIncumbent();

  const buyerAvgDiscount = refinedAvgDiscount ? Math.abs(refinedAvgDiscount) : 0;
  const discountPct = buyerAvgDiscount > 0 ? Math.round(buyerAvgDiscount) : 10;
  const targetBid = tender.estimated_value ? tender.estimated_value * (1 - (discountPct / 100)) : 0;

  const isAwarded = !tender.is_active;

  // Risk score from existing insights
  const riskScore = tender.insights?.risk_assessment?.overall_risk_score ?? null;
  const riskLevel = tender.insights?.risk_assessment?.risk_level ?? null;

  // Filter embedding before passing to client components
  const { embedding, ...tenderWithoutEmbedding } = tender;

  // Prepare serializable tender data for client components
  const tenderForOverview = {
    title: tender.title,
    buyer_name: tender.buyer_name,
    estimated_value: tender.estimated_value,
    currency: tender.currency,
    country: tender.country,
    description: tender.description,
    cpv_code: tender.cpv_code,
    procedure_type: tender.procedure_type,
    submission_deadline: tender.submission_deadline,
    publication_date: tender.publication_date,
    source_system: tender.source_system,
    tender_id: tender.tender_id,
  };

  const tenderForAward = {
    winners_list: tender.winners_list,
    award_decision_date: tender.award_decision_date,
    final_contract_value: tender.final_contract_value,
    estimated_value: tender.estimated_value,
    currency: tender.currency,
  };

  // Build tabs
  const tabs = [
    {
      id: 'overview',
      label: t('tabs.overview'),
      content: isAwarded ? (
        <AwardTab tenderId={id} tender={tenderForAward} />
      ) : (
        <OverviewTab
          tenderId={id}
          tender={tenderForOverview}
          match={match}
          buyerIntel={buyerIntel ? {
            top_winners: buyerIntel.top_winners,
            avg_discount: buyerIntel.avg_discount,
            total_contracts: buyerIntel.total_contracts,
            avg_bidder_count: buyerIntel.avg_bidder_count,
            persona_name: buyerIntel.persona_name,
          } : null}
          relevantCompetitors={relevantCompetitors}
          sectorStats={sectorStats}
          refinedAvgDiscount={refinedAvgDiscount}
          refinedBidderCount={refinedBidderCount}
          refinedVal={refinedVal}
          benchmarks={benchmarks}
          targetBid={targetBid}
          discountPct={discountPct}
          incumbent={incumbent}
          relatedTenders={relatedTenders}
          riskScore={riskScore}
          riskLevel={riskLevel}
          riskFactors={tender.insights?.risk_assessment?.key_risk_factors}
          userTier={userTier}
        />
      ),
    },
    {
      id: 'insights',
      label: t('tabs.aiInsights'),
      content: (
        <InsightsTab
          tenderId={id}
          initialInsights={tender.insights}
          derivedDocLink={derivedDocLink}
          tier={userTier}
        />
      ),
      hidden: isAwarded,
    },
  ];

  const isPro = userTier === 'Professional' || userTier === 'Enterprise';

  const daysLeft = tender.submission_deadline
    ? Math.ceil((new Date(tender.submission_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="max-w-[1100px] mx-auto pb-20">
      {/* Back link */}
      <Link href={backUrl || '/matches'} className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-blue-600 transition-colors mb-4 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        {backUrl ? t('back') : t('backToMatches')}
      </Link>

      {/* Detail Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-zinc-950 leading-snug mb-3">{tender.title}</h1>
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Status */}
          {tender.is_active ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t('active')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium">
              <History size={10} /> {t('awarded')}
            </span>
          )}

          {/* Match score */}
          {match?.match_score != null && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium">
              {Math.round(match.match_score)}% {t('match')}
            </span>
          )}

          {/* Source */}
          {tender.source_system && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-xs font-medium">
              {tender.source_system}
            </span>
          )}

          {/* Country */}
          {tender.country && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium">
              <MapPin size={10} /> {tender.country}
            </span>
          )}

          {/* CPV */}
          {tender.cpv_code && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium">
              CPV: {tender.cpv_code}
            </span>
          )}

          {/* Value */}
          {tender.estimated_value > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium">
              <DollarSign size={10} /> {formatValue(tender.estimated_value, tender.currency)}
            </span>
          )}

          {/* Deadline */}
          {daysLeft !== null && daysLeft > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 text-xs font-medium">
              <Clock size={10} /> {daysLeft} {t('daysLeft')}
            </span>
          )}

          {/* Source links */}
          <div className="flex items-center gap-3 ml-2">
            {derivedDocLink && (
              <a href={derivedDocLink} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-purple-600 hover:underline flex items-center gap-1">
                <FileText size={12} /> {t('viewDocuments')}
              </a>
            )}
            <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
              <ExternalLink size={12} /> {t('viewSource')}
            </a>
          </div>
        </div>
      </div>

      {/* Tab System */}
      <TenderDetailsTabs
        tabs={tabs}
        riskScore={riskScore}
        riskLevel={riskLevel}
      />

      {/* Floating Chatbot (Pro/Enterprise only) */}
      {isPro && !isAwarded && (
        <TenderChatbot tenderId={id} />
      )}
    </div>
  );
}
