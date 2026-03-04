import React from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  ExternalLink, 
  Building2, 
  Globe, 
  DollarSign, 
  FileText,
  ShieldCheck,
  Zap,
  Target,
  Brain,
  Clock,
  Briefcase,
  AlertCircle,
  History,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/navigation';
import { notFound, redirect } from 'next/navigation';
import { getCpvDescription } from '@/utils/cpv-data';
import { PersonaBadge } from '@/components/PersonaBadge';
import { TenderInsights } from '@/components/TenderInsights';

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
  embedding?: number[] | string; // Synced vector
}

interface MatchDetails {
  match_score: number;
  match_reasons: string;
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
  const { id } = await params; // This is now guaranteed to be the tender_uuid
  
  const supabase = await createClient();
  const t = await getTranslations('tenders');
  const tMatches = await getTranslations('matches');
  const locale = await getLocale();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Simple, direct lookup by internal UUID
  // This avoids all URL encoding/decoding issues
  const { data: tender, error: tenderError } = await supabase
    .from('tenders')
    .select('*') // source_system might not exist yet as a column, select * to be safe
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

  // 1. Priority: Find a direct procurement platform link from DB fields
  const allUrls = rawDocUrl.split(',').map((u: string) => u.trim()).filter((u: string) => u.startsWith('http'));
  const directPlatformLink = allUrls.find(u => procPlatforms.some(p => u.toLowerCase().includes(p)));

  if (directPlatformLink) {
    derivedDocLink = directPlatformLink;
  } else {
    // 2. Any direct PDF (non-TED)
    const directPdf = allUrls.find(u => u.toLowerCase().endsWith('.pdf') && !u.includes('ted.europa.eu'));
    if (directPdf) {
      derivedDocLink = directPdf;
    }
  }

  // Define the Source Link
  // Priority 1: Official document URL (usually Diário da República PDF)
  // Priority 2: Fallback to Portal BASE search
  const sourceLink = (tender.document_urls && tender.document_urls.startsWith('http'))
    ? (tender.document_urls.includes(',') ? tender.document_urls.split(',')[0].trim() : tender.document_urls)
    : `https://www.base.gov.pt/Base4/pt/pesquisa/?type=anuncios&texto=${encodeURIComponent(tender.tender_id)}`;

  const normalizeUrl = (u: string | null) => u?.replace(/\/$/, '').replace('https://', 'http://').toLowerCase().trim();
  
  // Debug log for links
  console.log(`[TenderPage] ID: ${id}, Source: ${sourceLink}, Doc: ${derivedDocLink}`);

  // HIDE "View Documents" if it's identical to the source link
  if (normalizeUrl(derivedDocLink) === normalizeUrl(sourceLink)) {
    derivedDocLink = null;
  }

  const [profileRes] = await Promise.all([
    supabase.from('clients').select('*').eq('email', user.email).single()
  ]);

  const profile: ClientProfile | null = profileRes.data;

  // Fetch Secondary Data (Dependent on Tender/Profile)
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

  // NEW: Semantic Search for Related Tenders (Uses synced embeddings)
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

  // LOGIC: Find Sector-Specific Stats for this Buyer
  // We prefer metrics specific to this CPV division (e.g. "IT Services") over the buyer's global average.
  let sectorStats = null;
  if (buyerIntel?.sector_stats && cpvDiv) {
    // sector_stats is a JSON array in Supabase
    sectorStats = buyerIntel.sector_stats.find((s: any) => s.cpv_division === cpvDiv);
  }

  // Use Sector Specific data if available, otherwise Global
  const refinedAvgDiscount = sectorStats?.avg_discount ?? buyerIntel?.avg_discount ?? 0;
  const refinedBidderCount = sectorStats?.avg_bidder_count ?? buyerIntel?.avg_bidder_count ?? 0;
  const refinedVal = sectorStats?.avg_contract_value ?? buyerIntel?.avg_value ?? 0;

  // Refine Competitors (Filter by CPV)
  let relevantCompetitors = buyerIntel?.top_winners || [];
  
  if (buyerIntel?.top_winners && tender.cpv_code && buyerIntel.top_winners.length > 0) {
    const winnerNames = buyerIntel.top_winners.map((w: any) => w.winner_name);
    
    // Fetch competitor profiles to check sector expertise and get avg discount
    const { data: competitors } = await supabase
      .from('intel_competitors')
      .select('name, sector_stats, avg_discount_pct')
      .in('name', winnerNames);

    if (competitors && competitors.length > 0) {
      // Create maps for fast lookup
      const sectorMap = new Map(competitors.map((c: any) => [c.name, c.sector_stats]));
      const discountMap = new Map(competitors.map((c: any) => [c.name, c.avg_discount_pct]));
      
      const filtered = buyerIntel.top_winners.filter((w: any) => {
        const stats: any[] = sectorMap.get(w.winner_name) || [];
        // Check if they have wins/participation in this sector
        return stats.some((s: any) => s.cpv_division === cpvDiv);
      }).map((w: any) => ({
        ...w,
        avg_discount: discountMap.get(w.winner_name) || 0
      }));

      // If we found relevant competitors, use them. Otherwise show no data (don't fall back to irrelevant global top)
      relevantCompetitors = filtered;
    }
  }

  // Helper Functions (re-implemented for Server Component)
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

  const getCategorizedReasons = (rawReasons: string) => {
    if (!rawReasons) return [];
    const reasons = rawReasons.split(/[|]|,/).filter((r: string) => r.trim());
    const categories: Record<string, any> = {};
    reasons.forEach((reason: string) => {
      const text = reason.toLowerCase();
      let key = "";
      if (text.includes('urgent')) key = "urgent";
      else if (text.includes('country') || text.includes('location')) key = "market";
      else if (text.includes('budget') || text.includes('value') || text.includes('financial')) key = "budget";
      else if (text.includes('cpv') || text.includes('sector')) key = "sector";
      else if (text.includes('semantic') || text.includes('ai') || text.includes('context')) key = "ai";
      else if (text.includes('procedure') || text.includes('openness')) key = "process";

      if (key) {
        if (!categories[key]) {
          const configs: any = {
            urgent: { label: tMatches('categories.timeSensitivity'), icon: <Zap size={16} />, color: "text-orange-600" },
            market: { label: tMatches('categories.marketRelevance'), icon: <Globe size={16} />, color: "text-blue-600" },
            budget: { label: tMatches('categories.financialAlignment'), icon: <DollarSign size={16} />, color: "text-emerald-600" },
            sector: { label: tMatches('categories.sectorExpertise'), icon: <Target size={16} />, color: "text-purple-600" },
            ai: { label: tMatches('categories.aiMatchConfidence'), icon: <Brain size={16} />, color: "text-indigo-600" },
            process: { label: tMatches('categories.proceduralExperience'), icon: <FileText size={16} />, color: "text-slate-600" }
          };
          categories[key] = { ...configs[key], details: [] };
        }
        categories[key].details.push(reason.trim().replace(/^•\s*[✓✗⚠ℹ★]\s*/, ''));
      }
    });
    return Object.values(categories);
  };

  const incumbent = getIncumbent();

  // Pricing recommendations (simplified - in production this would come from market data)
  const mRange: MarketPricing | null = null; // TODO: Fetch from market pricing data table
  
  // Dynamic Pricing Strategy
  // If we have buyer history, use their average discount. Otherwise default to 10% conservative discount.
  // Use refined (sector-specific) discount if available
  const buyerAvgDiscount = refinedAvgDiscount ? Math.abs(refinedAvgDiscount) : 0;
  const discountPct = buyerAvgDiscount > 0 ? Math.round(buyerAvgDiscount) : 10;
  
  const targetBid = tender.estimated_value ? tender.estimated_value * (1 - (discountPct / 100)) : 0;

  const isAwarded = !tender.is_active;

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

                <div className="md:col-span-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Target size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sector Classification (CPV)</p>
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

          {isAwarded ? (
            /* AWARDED TENDER VIEW */
            <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Target size={24} className="text-amber-600" />
                  {t('awardDetails')}
                </h3>
                <div className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  {t('completed')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Winners */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('winningEntity')}</p>
                    {tender.winners_list && tender.winners_list.length > 0 ? (
                      tender.winners_list.map((winner: any, i: number) => (
                        <Link key={i} href={`/intelligence/competitors?name=${encodeURIComponent(winner.winner_name)}&backUrl=${encodeURIComponent('/tenders/' + id)}`} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-amber-200 transition-all group mb-2">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm font-bold">
                            W
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{winner.winner_name}</p>
                            {winner.winner_vat_id && <p className="text-xs text-slate-500">VAT: {winner.winner_vat_id}</p>}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-500 text-sm">
                        {t('winnerDetailsUnavailable')}
                      </div>
                    )}
                  </div>

                  {/* Award Date */}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('awardDate')}</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Clock size={18} className="text-slate-400" />
                      {tender.award_decision_date ? new Date(tender.award_decision_date).toLocaleDateString() : t('dateNotSpecified')}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('financialOutcome')}</p>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t('finalContractValue')}</p>
                      <p className="text-3xl font-black text-emerald-600">
                        {formatValue(tender.final_contract_value || 0, tender.currency)}
                      </p>
                    </div>
                    
                    {tender.final_contract_value && tender.estimated_value && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t('diffFromEstimate')}</p>
                        <div className="flex items-center gap-2">
                          {tender.final_contract_value < tender.estimated_value ? (
                            <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded text-xs">
                              {Math.round(((tender.estimated_value - tender.final_contract_value) / tender.estimated_value) * 100)}% {t('belowEstimate')}
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold bg-rose-100 px-2 py-1 rounded text-xs">
                              {Math.round(((tender.final_contract_value - tender.estimated_value) / tender.estimated_value) * 100)}% {t('aboveEstimate')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
          {/* Strategic Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Win Probability & Match Card */}
             {!(profile?.tier === 'Business' || profile?.tier === 'Enterprise') ? (
                <div className="flex flex-col h-full">
                  <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden flex-1 flex flex-col items-center justify-center text-center">
                     <Brain size=48 className="text-slate-700 mb-4" />
                     <h3 className="text-lg font-bold mb-2">{t('predictiveIntelligence')}</h3>
                     <p className="text-sm text-slate-400 max-w-xs mb-6">
                        Win Probability and Strategic Match Scoring are available exclusively on the <strong>Business</strong> plan.
                     </p>
                     <Link href="/profile" className="px-6 py-3 bg-blue-600 text-white text-xs font-black rounded-xl uppercase tracking-widest hover:bg-blue-500 transition-all">
                        Upgrade to Business
                     </Link>
                  </div>
                </div>
             ) : (
               <div className="flex flex-col h-full">
                 <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden flex-1 flex flex-col">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><Brain size={120} /></div>
                  <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-lg font-bold">{t('predictiveIntelligence')}</h3>
                         <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">{t('mlModel')}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-8 mb-10">
                        <div className="text-center group">
                          <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center relative mx-auto mb-3 transition-transform group-hover:scale-105">
                              <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * (match?.match_score || 0)) / 100} className="text-blue-500 transition-all duration-1000" strokeLinecap="round" />
                              </svg>
                              <span className="text-4xl font-black">{Math.round(match?.match_score || 0)}%</span>
                          </div>
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('companyFit')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8 border-t border-slate-800 pt-8">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500 uppercase">{t('sectorExpertise')}</span>
                            <span className="text-purple-400">+{match?.score_cpv || (match?.match_score ? t('pending') : '0')}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500 uppercase">{t('strategicAlignment')}</span>
                            <span className="text-blue-400">+{match?.score_strategic || (match?.match_score ? t('pending') : '0')}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500 uppercase">{t('aiSemanticMatch')}</span>
                            <span className="text-indigo-400">+{match?.score_semantic || (match?.match_score ? t('pending') : '0')}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500 uppercase">{t('capacityFit')}</span>
                            <span className="text-emerald-400">+{match?.score_capacity || (match?.match_score ? t('pending') : '0')}</span>
                          </div>
                      </div>

                      <div className="flex-1"></div>

                      <div className="pt-6 border-t border-slate-800">
                         <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">{t('fitAnalysis')}</p>
                         <ul className="space-y-3">
                            {match?.match_reasons?.split('|').filter((r: string) => r.trim()).map((reason: string, i: number) => (
                               <li key={i} className="flex items-start gap-3 text-xs text-slate-300 leading-tight">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                  {reason.trim()}
                               </li>
                            ))}
                         </ul>
                      </div>
                  </div>
               </div>
             </div>

             ) }

             {/* Competition & Market Card */}
             <div className="flex flex-col h-full">
               <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                     <Target size={20} className="text-rose-600" />
                     {t('competitiveLandscape')}
                  </h3>
                  
                  <div className="space-y-6 flex-1 flex flex-col">
                     {/* Incumbent Alert */}
                     {incumbent ? (
                        <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                           <div className="flex items-center gap-2 text-rose-700 font-black text-[10px] uppercase tracking-widest mb-2">
                              <AlertCircle size={14} />
                              {t('incumbentDetected')}
                           </div>
                           <p className="text-sm font-bold text-rose-900 mb-1">{incumbent}</p>
                           <p className="text-xs text-rose-600 italic">{t('renewalNotice')}</p>
                        </div>
                     ) : (
                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                           <div className="flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest mb-2">
                              <ShieldCheck size={14} />
                              {t('openField')}
                           </div>
                           <p className="text-xs text-emerald-600">{t('noIncumbent')}</p>
                        </div>
                     )}

                     {/* Predicted Competitors */}
                     <div>
                        <div className="flex justify-between items-center mb-4">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('expectedCompetitors')}</p>
                           {relevantCompetitors !== buyerIntel?.top_winners && (
                              <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider">{tMatches('categories.sectorExpertise')}</span>
                           )}
                        </div>
                        <div className="space-y-3">
                           {relevantCompetitors?.slice(0, 3).length > 0 ? (
                              relevantCompetitors.slice(0, 3).map((w: any, i: number) => (
                                 <Link key={i} href={`/intelligence/competitors?name=${encodeURIComponent(w.winner_name)}&backUrl=${encodeURIComponent('/tenders/' + id)}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                                          {w.winner_name.charAt(0)}
                                       </div>
                                       <div>
                                          <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors block leading-tight">{w.winner_name}</span>
                                          {w.avg_discount > 0 && (
                                             <span className="text-[9px] font-medium text-slate-400">Avg. Discount: <span className="text-emerald-600 font-bold">{w.avg_discount.toFixed(1)}%</span></span>
                                          )}
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <span className="text-[10px] font-black text-slate-400 block leading-none">{w.wins} {t('wins')}</span>
                                       <span className="text-[9px] font-bold text-emerald-600 uppercase">{t('topRival')}</span>
                                    </div>
                                 </Link>
                              ))
                           ) : (
                              <p className="text-xs text-slate-400 italic py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">{t('noCompetitorData')}</p>
                           )}
                        </div>
                     </div>

                     <div className="flex-1"></div>

                     {/* Buyer DNA */}
                     <div className="pt-6 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none">{t('avgDiscount')}</p>
                                {sectorStats && <span className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase">{tMatches('categories.sectorExpertise')}</span>}
                             </div>
                             <p className={`text-xl font-black ${refinedAvgDiscount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {refinedAvgDiscount ? `${refinedAvgDiscount.toFixed(1)}%` : '—'}
                             </p>
                             <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{t('buyerPriceSensitivity')}</p>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase leading-none">{t('marketDensity')}</p>
                                {sectorStats && <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase">{tMatches('categories.sectorExpertise')}</span>}
                             </div>
                             <p className="text-xl font-black text-slate-800">{typeof refinedBidderCount === 'number' && refinedBidderCount !== 0 ? refinedBidderCount.toFixed(1) : '—'}</p>
                             <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{t('avgBidders')}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
          </div>

          {/* Pricing Analysis Section */}
          {!(profile?.tier === 'Business' || profile?.tier === 'Enterprise') ? (
            <section className="bg-slate-50 p-10 rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 mb-6">
                  <DollarSign size=32 />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">{t('priceEngine')}</h3>
               <p className="text-sm text-slate-500 max-w-md mb-8 font-medium">
                  Our AI Price Recommendation Engine calculates the optimal bid value to maximize your win chance while preserving margins. Available on the <strong>Business</strong> plan.
               </p>
               <Link href="/profile" className="px-10 py-5 bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-100 uppercase tracking-widest hover:bg-emerald-500 transition-all">
                  Unlock Price Intelligence
               </Link>
            </section>
          ) : (
            <section className="bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <Target size={24} className="text-emerald-600" />
                   {t('priceEngine')}
                </h3>
                <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                   {t('estimateBased')}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                   <p className="text-slate-600 mb-6 font-medium leading-relaxed">
                      {t('priceAnalysisDesc')}
                   </p>
                   
                   <div className="space-y-8">
                      <div>
                         <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-3">
                            <span>{t('competitiveP25')}</span>
                            <span>{t('marketMedianP50')}</span>
                            <span>{t('highMarginP75')}</span>
                         </div>
                         <div className="h-4 bg-slate-100 rounded-full relative">
                            <div className="absolute inset-y-0 left-[25%] right-[25%] bg-emerald-500/20 border-x-2 border-emerald-500/40"></div>
                            <div
                               className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 shadow-xl z-10 transition-all duration-1000"
                               style={{ left: '50%' }}
                            ></div>
                         </div>
                         <div className="flex justify-between mt-3 tabular-nums font-bold text-xs text-slate-500 uppercase tracking-widest">
                            <span>{formatValue((tender.estimated_value || 0) * (benchmarks ? (1 + benchmarks.p25_discount_rate) : 0.7))}</span>
                            <span className="text-blue-600 font-black">{t('targetBid')}</span>
                            <span>{formatValue((tender.estimated_value || 0) * (benchmarks ? (1 + benchmarks.p75_discount_rate) : 1.2))}</span>
                         </div>
                      </div>

                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                            <TrendingDown size={20} />
                         </div>
                         <div>
                            <p className="font-bold text-blue-900 mb-1">{t('recStrategy')}</p>
                            <p className="text-sm text-blue-700">
                               {t('recStrategyDesc', { 
                                 value: formatValue(targetBid), 
                                 discount: discountPct,
                                 country: tender.country
                               })}
                               {buyerIntel?.avg_discount < 0 && (
                                  <span className="block mt-2 italic opacity-80">{t('buyerDiscountNote', { discount: Math.abs(Math.round(buyerIntel.avg_discount)) })}</span>
                               )}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t('marketContext')}</p>
                   <div className="space-y-4">
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase">{t('avgBuyerValue')}</p>
                         <p className="text-lg font-black text-slate-800">{formatValue(refinedVal)}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-500 uppercase">{t('buyerAvgVariation')}</p>
                         <p className={`text-lg font-black ${refinedAvgDiscount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {refinedAvgDiscount ? `${refinedAvgDiscount.toFixed(1)}%` : '—'}
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </section>
          )}

            </>
          )}

          {!isAwarded && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 px-2">
                <Brain size={20} className="text-teal-600" />
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">AI-Extracted Strategic Insights</h3>
              </div>
              <TenderInsights tenderId={id} initialInsights={tender.insights} derivedDocLink={derivedDocLink} userTier={profile?.tier} />
            </section>
          )}

          {/* Project Scope */}
          <section className="bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              {t('projectScope')}
            </h3>
            <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {tender.description || t('noDescription')}
            </div>
          </section>

          {/* Related Opportunities (Semantic Search) */}
          {relatedTenders.length > 0 && (
            <section className="bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
                <Brain size={20} className="text-blue-600" />
                Related Opportunities (AI Semantic)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedTenders.map((rt: any) => (
                  <Link key={rt.tender_id} href={`/tenders/${rt.tender_uuid}`} className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white transition-all flex flex-col h-full">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{rt.buyer_name}</p>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-3 mb-4 flex-1">{rt.title}</h4>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tabular-nums">{formatValue(rt.estimated_value, rt.currency)}</span>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 h-full">
          {!isAwarded && (
            <div className="sticky top-28 space-y-6">
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
                       <p className="text-[9px] font-bold text-slate-500 uppercase">Synced via Winly AI Core</p>
                    </div>
                  </div>
                </div>
              </div>

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}