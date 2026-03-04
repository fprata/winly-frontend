import React from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Building2,
  Globe,
  DollarSign,
  FileText,
  ShieldCheck,
  Target,
  Clock,
  Briefcase,
  History,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Gavel
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { notFound, redirect } from 'next/navigation';
import { getCpvDescription } from '@/utils/cpv-data';
import { PersonaBadge } from '@/components/PersonaBadge';
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
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const supabase = await createClient();
  const t = await getTranslations('tenders');
  const locale = await getLocale();

  const { data: { user } } = await supabase.auth.getUser();
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
          buyerIntel={buyerIntel ? { top_winners: buyerIntel.top_winners, avg_discount: buyerIntel.avg_discount } : null}
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

  const isPro = userTier === 'Pro' || userTier === 'Enterprise';

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <Link href="/matches" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-bold group text-sm w-fit">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        {t('backToMatches')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
            <div className={`bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center ${isAwarded ? 'bg-amber-50/50 border-amber-100' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isAwarded ? (
                    <>
                      <History size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black text-amber-500 tracking-widest uppercase">{t('historicalAwardRecord')}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('metadataAnalysis')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {derivedDocLink && (
                  <a href={derivedDocLink} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-purple-600 uppercase flex items-center gap-1.5 hover:underline transition-all">
                    {t('viewDocuments')} <FileText size={12} />
                  </a>
                )}
                <a
                  href={sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1.5 hover:underline transition-all"
                >
                  {t('viewSource')} <ExternalLink size={12} />
                </a>
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-black text-slate-900 leading-tight mb-8">{tender.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Link href={`/intelligence/buyers?name=${encodeURIComponent(tender.buyer_name)}&fromTender=${id}&backUrl=${encodeURIComponent('/tenders/' + id)}`} className="md:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 hover:bg-white transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('authority')}</p>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-2 text-slate-800 font-bold text-sm">
                      <Building2 size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      {tender.buyer_name}
                    </div>
                    {buyerIntel?.persona_name && (
                      <div className="ml-6">
                        <PersonaBadge personaName={buyerIntel.persona_name} />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('market')}</p>
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Globe size={18} className="text-blue-600" />
                    {tender.country}
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('financials')}</p>
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-lg tabular-nums">
                    <DollarSign size={18} className="text-emerald-600" />
                    {formatValue(tender.estimated_value, tender.currency)}
                  </div>
                </div>

                {tender.procedure_type && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('procedureType')}</p>
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <Gavel size={18} className="text-violet-600" />
                      {tender.procedure_type}
                    </div>
                  </div>
                )}
                {tender.publication_date && (
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('publicationDate')}</p>
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm tabular-nums">
                      <Calendar size={18} className="text-sky-600" />
                      {new Date(tender.publication_date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB')}
                    </div>
                  </div>
                )}

                <div className="md:col-span-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Target size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sectorClassification')}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-800">{tender.cpv_code || "N/A"}</span>
                    </div>
                    {tender.cpv_code && (
                      <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-3xl">
                        {tender.cpv_description || getCpvDescription(tender.cpv_code)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab System */}
          <TenderDetailsTabs
            tabs={tabs}
            riskScore={riskScore}
            riskLevel={riskLevel}
          />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 h-full">
          <div className="sticky top-28 space-y-6">
            {isAwarded ? (
              <>
                {/* Award Summary Card */}
                <div className="bg-amber-900 text-white p-8 rounded-[32px] shadow-xl">
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-widest mb-6">{t('awardDetails')}</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <History size={28} className="text-amber-300" />
                    </div>
                    <div>
                      <p className="text-2xl font-black tabular-nums">
                        {tender.award_decision_date ? new Date(tender.award_decision_date).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB') : t('dateNotSpecified')}
                      </p>
                      <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mt-1">{t('awardDate')}</p>
                    </div>
                  </div>

                  {tender.final_contract_value ? (
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 mb-4">
                      <p className="text-[10px] font-black text-amber-300/80 uppercase tracking-widest mb-1">{t('finalContractValue')}</p>
                      <p className="text-xl font-black">{formatValue(tender.final_contract_value, tender.currency)}</p>
                      {tender.estimated_value && (
                        <p className="text-xs font-bold text-amber-300/60 mt-1">
                          {tender.final_contract_value < tender.estimated_value
                            ? `${Math.round(((tender.estimated_value - tender.final_contract_value) / tender.estimated_value) * 100)}% ${t('belowEstimate')}`
                            : `${Math.round(((tender.final_contract_value - tender.estimated_value) / tender.estimated_value) * 100)}% ${t('aboveEstimate')}`
                          }
                        </p>
                      )}
                    </div>
                  ) : null}

                  {tender.winners_list && tender.winners_list.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[10px] font-black text-amber-300/80 uppercase tracking-widest mb-3">{t('winningEntity')}</p>
                      {tender.winners_list.map((w: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center text-amber-300 text-xs font-black">W</div>
                          <p className="text-sm font-bold">{w.winner_name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company Fit Card (also useful for awarded tenders) */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Briefcase size={18} className="text-indigo-600" />
                    {t('companyProfileFit')}
                  </h3>
                  <div className="space-y-6">
                    <div className="group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{t('yourServices')}</p>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-indigo-200 transition-colors">
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{profile?.services || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Deadline Card */}
                <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl">
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">{t('submissionDeadline')}</h3>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                      <Clock className="text-blue-400" size={28} />
                    </div>
                    <div>
                      <p className="text-2xl font-black tabular-nums">
                        {tender.submission_deadline ? new Date(tender.submission_deadline).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-GB') : t('contactAuthority')}
                      </p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t('localTime')}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 uppercase tracking-widest text-xs">
                      {t('trackThisBid')}
                    </button>
                    <button className="w-full py-4 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-xs">
                      {t('ignoreTender')}
                    </button>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-wider leading-none mb-1">{t('verifiedIntelligence')}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">{t('syncedVia')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Score Mini Card */}
                {riskScore != null && (
                  <div className={`rounded-[32px] p-6 shadow-sm border ${
                    riskScore <= 3 ? 'bg-emerald-50 border-emerald-200' :
                    riskScore <= 6 ? 'bg-amber-50 border-amber-200' :
                    'bg-rose-50 border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('riskMiniCard')}</p>
                        <p className={`text-3xl font-black ${
                          riskScore <= 3 ? 'text-emerald-600' :
                          riskScore <= 6 ? 'text-amber-600' :
                          'text-rose-600'
                        }`}>
                          {riskScore}/10
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        riskScore <= 3 ? 'bg-emerald-100 text-emerald-600' :
                        riskScore <= 6 ? 'bg-amber-100 text-amber-600' :
                        'bg-rose-100 text-rose-600'
                      }`}>
                        <AlertTriangle size={24} />
                      </div>
                    </div>
                    <p className={`text-xs font-black uppercase tracking-widest mt-2 ${
                      riskScore <= 3 ? 'text-emerald-600' :
                      riskScore <= 6 ? 'text-amber-600' :
                      'text-rose-600'
                    }`}>
                      {riskScore <= 3 ? t('risk.low') : riskScore <= 6 ? t('risk.medium') : t('risk.high')}
                    </p>
                  </div>
                )}

                {/* Company Fit Card */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Briefcase size={18} className="text-indigo-600" />
                    {t('companyProfileFit')}
                  </h3>
                  <div className="space-y-6">
                    <div className="group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{t('yourServices')}</p>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-indigo-200 transition-colors">
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{profile?.services || "—"}</p>
                      </div>
                    </div>

                    <div className="group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">{t('budgetAlignment')}</p>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-emerald-200 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-black text-slate-800 tabular-nums">
                            {profile?.max_budget ? formatValue(profile.max_budget) : "—"}
                          </p>
                          {tender.estimated_value <= (profile?.max_budget || 1000000000) ? (
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">{t('inRange')}</span>
                          ) : (
                            <span className="text-[9px] font-black text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase">{t('outOfRange')}</span>
                          )}
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (tender.estimated_value / (profile?.max_budget || 1)) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chatbot (Pro/Enterprise only) */}
      {isPro && !isAwarded && (
        <TenderChatbot tenderId={id} />
      )}
    </div>
  );
}
