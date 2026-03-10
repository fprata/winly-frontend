"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, Building2, TrendingUp, Users, ArrowUpRight, ArrowLeft, ArrowRight, ShieldCheck, Filter, Check, ChevronDown, Activity, HeartHandshake, Lock, PieChart, SearchX, MapPin, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { getCpvDescription } from '@/utils/cpv-data';
import { BuyerCompetitorAnalysis } from './BuyerCompetitorAnalysis';
import { PersonaBadge } from './PersonaBadge';
import { BuyerEvolutionCharts } from './BuyerEvolutionCharts';
import { SectorMixChart } from './SectorMixChart';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface BuyerIntelligenceClientProps {
  initialProfile: any;
  initialSearchResults: any[];
  initialName: string | null;
  fromTender: string | null;
}

export function BuyerIntelligenceClient({ initialProfile, initialSearchResults, initialName, fromTender }: BuyerIntelligenceClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const backUrl = searchParams.get('backUrl');
  
  const [query, setQuery] = useState(initialName || "");
  const [searchResults, setSearchResults] = useState<any[]>(initialSearchResults);
  const [profile, setProfile] = useState<any>(initialProfile);
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tendersLoading, setTendersLoading] = useState(false);
  
  // Filter State
  const [selectedCpvs, setSelectedCpvs] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const t = useTranslations('intelligence.buyers');
  const locale = useLocale();

  // Sync only when the server sends a different profile (e.g. navigating via ?name= param).
  // Deliberately excludes initialSearchResults — it's a new array reference on every server render
  // and syncing it unconditionally would wipe client-side search state.
  useEffect(() => {
    setProfile(initialProfile);
    if (!initialProfile) {
      // Only restore the server list when it's non-empty, so a transient empty
      // server response doesn't wipe a valid client-side search result set.
      if (initialSearchResults.length > 0) {
        setSearchResults(initialSearchResults);
      }
      setQuery("");
    } else {
      setQuery(initialProfile.name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProfile]);

  // Reset filter when profile changes
  useEffect(() => {
    setSelectedCpvs([]);
    setTenders([]);
  }, [profile?.name]);

  // Fetch raw tenders for dynamic analysis
  useEffect(() => {
    const fetchTenders = async () => {
      if (!profile?.name) return;

      setTendersLoading(true);
      const res = await fetch(`/api/intelligence/buyer-tenders?buyer_name=${encodeURIComponent(profile.name)}`);
      const json = await res.json();
      if (json.data) {
        setTenders(json.data);
      }
      setTendersLoading(false);
    };

    fetchTenders();
  }, [profile?.name]);

  const searchBuyers = async (value: string) => {
    if (value.length < 3) return;

    const res = await fetch(`/api/intelligence/search?q=${encodeURIComponent(value)}&type=buyers`);
    const json = await res.json();
    setSearchResults(json.data || []);
  };

  const navigateToProfile = (id: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (fromTender) params.set('fromTender', fromTender);
    if (backUrl) params.set('backUrl', backUrl);
    const qs = params.toString();
    router.push(`/intelligence/buyers/${encodeURIComponent(id)}${qs ? `?${qs}` : ''}`);
  };

  const clearProfile = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.push(`/intelligence/buyers`);
    }
  };

  const formatValue = (val: number) => {
    if (!val) return "—";
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', { 
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0 
    }).format(val);
  };

  // Helper to generate yearly stats from filtered tenders
  const generateYearlyStats = (tenders: any[]) => {
      const stats: Record<number, {total_spend: number, total_contracts: number}> = {};
      tenders.forEach(t => {
          if(!t.publication_date) return;
          const year = new Date(t.publication_date).getFullYear();
          if (!stats[year]) stats[year] = { total_spend: 0, total_contracts: 0 };
          stats[year].total_spend += (t.final_contract_value || 0);
          stats[year].total_contracts++;
      });
      return Object.entries(stats)
        .map(([year, s]) => ({ year: parseInt(year), ...s, direct_award_pct: 0 })) // Missing DA pct in client-side calc without procedure type
        .sort((a,b) => b.year - a.year);
  };

  // Recalculate metrics based on selection
  const metrics = useMemo(() => {
    if (!profile) return null;
    
    let filteredTenders = tenders;
    let isFiltered = selectedCpvs.length > 0;

    if (isFiltered) {
        filteredTenders = tenders.filter(t => {
            if (!t.cpv_code) return false;
            const division = t.cpv_code.substring(0, 2);
            return selectedCpvs.includes(division);
        });
    }

    // 1. Calculate Aggregates for Cards (if filtered)
    let total_contracts = profile.total_contracts;
    let total_spend = profile.total_spend;
    let avg_value = profile.avg_value;
    let direct_award_pct = profile.direct_award_pct;
    let avg_bidder_count = profile.avg_bidder_count;
    let avg_discount = profile.avg_discount;
    let supplier_count = profile.supplier_count;
    let sector_diversity = profile.sector_diversity;

    if (isFiltered && tenders.length > 0) {
        // Re-calculate from filtered tenders
        total_contracts = filteredTenders.length;
        total_spend = filteredTenders.reduce((sum, t) => sum + (t.final_contract_value || 0), 0);
        avg_value = total_contracts > 0 ? total_spend / total_contracts : 0;
        
        const matchingSectors = (profile.sector_stats || []).filter((s: any) => selectedCpvs.includes(s.cpv_division));
        total_contracts = matchingSectors.reduce((sum: number, s: any) => sum + (s.total_contracts || 0), 0);
        total_spend = matchingSectors.reduce((sum: number, s: any) => sum + (s.total_spend || 0), 0);
        avg_value = total_contracts > 0 ? total_spend / total_contracts : 0;
        
        const weighted_da = matchingSectors.reduce((sum: number, s: any) => sum + ((s.direct_award_pct || 0) * (s.total_contracts || 0)), 0);
        direct_award_pct = total_contracts > 0 ? weighted_da / total_contracts : 0;

        const weighted_bidders = matchingSectors.reduce((sum: number, s: any) => sum + ((s.avg_bidder_count || 0) * (s.total_contracts || 0)), 0);
        avg_bidder_count = total_contracts > 0 ? weighted_bidders / total_contracts : 0;

        const weighted_discount = matchingSectors.reduce((sum: number, s: any) => sum + ((s.avg_discount || 0) * (s.total_contracts || 0)), 0);
        avg_discount = total_contracts > 0 ? weighted_discount / total_contracts : 0;
        
        supplier_count = null; // Can't calc unique from sector stats
        sector_diversity = matchingSectors.length;
    }

    // 2. Compute Trends for Charts (Dynamic)
    // We need to group filteredTenders by Year
    let competitor_trends: any[] = [];
    let sector_trends: any[] = [];

    if (tenders.length > 0) {
        const compTrendsMap: Record<number, Record<string, {wins: number, revenue: number}>> = {};
        const sectorTrendsMap: Record<number, Record<string, {count: number, spend: number}>> = {};

        filteredTenders.forEach(t => {
            if (!t.publication_date) return;
            const year = new Date(t.publication_date).getFullYear();
            const yearInt = isNaN(year) ? 0 : year;
            if (yearInt < 2020) return; // limit history

            // Competitor Trend
            if (Array.isArray(t.winners_list)) {
                t.winners_list.forEach((w: any) => {
                    const name = w.winner_name || "Unknown";
                    if (!compTrendsMap[yearInt]) compTrendsMap[yearInt] = {};
                    if (!compTrendsMap[yearInt][name]) compTrendsMap[yearInt][name] = { wins: 0, revenue: 0 };
                    compTrendsMap[yearInt][name].wins++;
                    compTrendsMap[yearInt][name].revenue += (t.final_contract_value || 0);
                });
            }

            // Sector Trend
            if (t.cpv_code) {
                const div = t.cpv_code.substring(0, 2);
                if (!sectorTrendsMap[yearInt]) sectorTrendsMap[yearInt] = {};
                if (!sectorTrendsMap[yearInt][div]) sectorTrendsMap[yearInt][div] = { count: 0, spend: 0 };
                sectorTrendsMap[yearInt][div].count++;
                sectorTrendsMap[yearInt][div].spend += (t.final_contract_value || 0);
            }
        });

        // Flatten
        Object.entries(compTrendsMap).forEach(([year, winners]) => {
            Object.entries(winners).forEach(([name, stats]) => {
                competitor_trends.push({
                    year: parseInt(year),
                    winner_name: name,
                    wins: stats.wins,
                    revenue: stats.revenue
                });
            });
        });

        Object.entries(sectorTrendsMap).forEach(([year, sectors]) => {
            Object.entries(sectors).forEach(([div, stats]) => {
                sector_trends.push({
                    year: parseInt(year),
                    cpv_division: div,
                    total_contracts: stats.count,
                    total_spend: stats.spend
                });
            });
        });
    } else if (!isFiltered) {
        // Fallback to pre-calculated profile stats if available and not filtering
        competitor_trends = profile.competitor_trends || [];
        sector_trends = profile.sector_trends || [];
    }

    // 3. Latest Lists
    const activeTenders = filteredTenders
        .filter(t => t.is_active)
        .slice(0, 5);
        
    const awardedTenders = filteredTenders
        .filter(t => t.final_contract_value !== null)
        .slice(0, 5);

    return {
        ...profile,
        total_contracts,
        total_spend,
        avg_value,
        direct_award_pct,
        avg_bidder_count,
        avg_discount,
        supplier_count,
        sector_diversity,
        competitor_trends, // Dynamic
        sector_trends,     // Dynamic
        activeTenders,     // Dynamic
        awardedTenders,    // Dynamic
        // For the Spending History List (Right Side)
        // We can either filter the pre-calc yearly_stats (if they exist) or generate them.
        // Pre-calc yearly_stats in DB are global. We should generate them for consistency if filtered.
        yearly_stats: isFiltered ? generateYearlyStats(filteredTenders) : profile.yearly_stats
    };
  }, [profile, selectedCpvs, tenders]);

  const toggleCpv = (code: string) => {
    setSelectedCpvs(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {fromTender && (
        <Link href={`/tenders/${fromTender}`} className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors mb-6 font-medium text-sm group w-fit">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('backToTender')}
        </Link>
      )}

      {!profile && (
        <>
          {/* Page Header */}
          <header className="mb-7">
            <h1 className="text-[28px] font-extrabold tracking-tight text-zinc-950 leading-none mb-1">{t('title')}</h1>
            <p className="text-[14px] text-zinc-500">{t('subtitle')}</p>
          </header>

          {/* Search + Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-[13px] text-zinc-400">
              {searchResults.length > 0 ? t('buyersFound', { count: searchResults.length }) : ''}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon size={15} className="absolute left-2.5 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder') || "Search buyers by name..."}
                  value={query}
                  onChange={e => {
                    const val = e.target.value;
                    setQuery(val);
                    if (val.length >= 3) searchBuyers(val);
                    else if (val.length === 0) setSearchResults(initialSearchResults);
                    else setSearchResults([]);
                  }}
                  className="h-9 pl-8 pr-3 w-72 rounded-lg border border-zinc-300 text-sm outline-none bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-zinc-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Result Cards */}
          <div className="flex flex-col gap-3">
            {searchResults.map((b: any, i: number) => {
              const getBuyerTag = (b: any): { label: string; color: string } => {
                if ((b.avg_bidder_count || 0) >= 5) return { label: t('tagCompetitive'), color: 'blue' };
                if ((b.total_contracts || 0) >= 100) return { label: t('tagHighVolume'), color: 'green' };
                if ((b.avg_discount || 0) < 5) return { label: t('tagLoyal'), color: 'amber' };
                return { label: t('tagActive'), color: 'zinc' };
              };
              const tag = getBuyerTag(b);
              const formatVal = (val: number) => {
                if (!val) return '—';
                if (val >= 1_000_000) return `€${(val / 1_000_000).toFixed(1)}M`;
                if (val >= 1_000) return `€${(val / 1_000).toFixed(0)}K`;
                return `€${val}`;
              };
              return (
                <div
                  key={i}
                  onClick={() => navigateToProfile(b.buyer_company_id)}
                  className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-px group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors mb-1">{b.name}</h3>
                      <div className="flex items-center gap-1.5 text-[13px] text-zinc-500 mb-4">
                        <MapPin size={12} />
                        {b.country || 'Unknown'}
                        <span className="text-zinc-300">·</span>
                        {t('publicProcurement')}
                      </div>
                      <div className="flex gap-6">
                        <div>
                          <div className="text-[20px] font-extrabold text-blue-600 leading-none">{formatVal(b.total_spend)}</div>
                          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">{t('totalSpend')}</div>
                        </div>
                        <div>
                          <div className="text-[20px] font-extrabold text-zinc-900 leading-none">{b.total_contracts || 0}</div>
                          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">{t('contracts')}</div>
                        </div>
                        {b.avg_discount != null && (
                          <div>
                            <div className="text-[20px] font-extrabold text-emerald-600 leading-none">{b.avg_discount.toFixed(1)}%</div>
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">{t('avgDiscount')}</div>
                          </div>
                        )}
                        {b.avg_bidder_count != null && (
                          <div>
                            <div className="text-[20px] font-extrabold text-zinc-900 leading-none">{b.avg_bidder_count.toFixed(1)}</div>
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">{t('avgBidders')}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge color={tag.color as any}>{tag.label}</Badge>
                      <div className="flex items-center gap-1 text-[13px] text-zinc-400 group-hover:text-blue-600 transition-colors">
                        <span>{t('viewProfile')}</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {searchResults.length === 0 && query.length >= 3 && (
              <EmptyState
                icon={<SearchX size={32} />}
                title={t('noResults') || "No buyers found"}
                subtitle={t('noResultsHint') || "Try a different search term"}
              />
            )}
          </div>
        </>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 italic animate-pulse">{t('loading')}</div>
      ) : metrics ? (
        <div className="space-y-8 animate-in fade-in duration-500 text-zinc-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <button
              onClick={clearProfile}
              className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              <ArrowLeft size={16} />
              {backUrl ? t('back') : t('backToSearch')}
            </button>

            {/* Global Sector Filter */}
            <div className="relative">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl font-bold text-xs text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
                >
                    <Filter size={14} className="text-zinc-400" />
                    {selectedCpvs.length === 0 ? t('analysis.allSectors') : t('analysis.selectedSectors', { count: selectedCpvs.length })}
                    <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-xl z-30 p-2">
                        <button 
                            onClick={() => setSelectedCpvs([])}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${selectedCpvs.length === 0 ? 'bg-blue-50 text-blue-700' : 'text-zinc-700 hover:bg-zinc-50'}`}
                        >
                            {t('analysis.allSectors')}
                            {selectedCpvs.length === 0 && <Check size={14} />}
                        </button>
                        <div className="h-px bg-zinc-100 my-1"></div>
                        {profile.sector_stats?.map((sector: any) => (
                            <button 
                                key={sector.cpv_division}
                                onClick={() => toggleCpv(sector.cpv_division)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${selectedCpvs.includes(sector.cpv_division) ? 'bg-blue-50 text-blue-700' : 'text-zinc-700 hover:bg-zinc-50'}`}
                            >
                                <span className="truncate pr-2" title={getCpvDescription(sector.cpv_division)}>{getCpvDescription(sector.cpv_division)}</span>
                                {selectedCpvs.includes(sector.cpv_division) && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                )}
                {/* Backdrop */}
                {isFilterOpen && <div className="fixed inset-0 z-20" onClick={() => setIsFilterOpen(false)}></div>}
            </div>
          </div>

          {/* === NEW HEADER SECTION (Identical to Competitor) === */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-zinc-200/60 shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center text-white border border-zinc-800 shadow-2xl">
                  <Building2 size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight leading-none mb-2">{profile.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase border border-emerald-100">
                      <ShieldCheck size={12} /> {t('verifiedAuthority')}
                    </span>
                    {profile.persona_name && (
                      <PersonaBadge personaName={profile.persona_name} />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('totalSpend')}</p>
                  <p className="text-2xl font-black text-zinc-900 tabular-nums">{formatValue(metrics.total_spend)}</p>
                </div>
                <div className="w-px h-12 bg-zinc-200"></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('avgValue')}</p>
                  <p className="text-2xl font-black text-blue-600 tabular-nums">{formatValue(metrics.avg_value)}</p>
                </div>
                <div className="w-px h-12 bg-zinc-200"></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('awards')}</p>
                  <p className="text-2xl font-black text-zinc-900 tabular-nums">{metrics.total_contracts}</p>
                </div>
              </div>
            </div>

            {/* === NEW CARD LAYOUT (Market Dominance & Buyer DNA) === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Card 1: Buyer DNA & Strategy */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full flex flex-col">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-blue-600" />
                  {t('buyerStrategyDna')}
                </h3>
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-end pb-4 border-b border-zinc-50">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('opennessScore')}</p>
                      <p className="text-2xl font-black text-emerald-600 tabular-nums">{(100 - (metrics.direct_award_pct || 0)).toFixed(1)}%</p>
                      <p className="text-[9px] font-bold text-zinc-400 mt-1">{t('inverseOfDirectAwards')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('loyaltyScore')}</p>
                      <p className="text-2xl font-black text-indigo-600 tabular-nums">
                        {profile.incumbency_rate_pct ? profile.incumbency_rate_pct : '—'}%
                      </p>
                      <p className="text-[9px] font-bold text-zinc-400 mt-1">{t('spendToTopVendor')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('avgBidders')}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-black text-zinc-900 tabular-nums">{metrics.avg_bidder_count !== null ? metrics.avg_bidder_count.toFixed(1) : '—'}</p>
                        <span className="text-[10px] font-bold text-zinc-400">{t('perTender')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('avgDiscount')}</p>
                      <p className={`text-xl font-black tabular-nums ${metrics.avg_discount < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {metrics.avg_discount ? `${metrics.avg_discount.toFixed(1)}%` : '0.0%'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Market Risk & Structure */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full flex flex-col">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Lock size={18} className="text-rose-600" />
                  {t('riskFactors')}
                </h3>
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-end pb-4 border-b border-zinc-50">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('directAwards')}</p>
                      <p className="text-2xl font-black text-rose-600 tabular-nums">{metrics.direct_award_pct?.toFixed(1)}%</p>
                      <p className="text-[9px] font-bold text-rose-400 mt-1">{t('nonCompetitive')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('q4Focus')}</p>
                      <p className="text-2xl font-black text-amber-600 tabular-nums">{profile.q4_seasonality ? (profile.q4_seasonality * 100).toFixed(1) : '—'}%</p>
                      <p className="text-[9px] font-bold text-amber-500 mt-1">{t('yearEndActivity')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('sectorDiversity')}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-black text-indigo-600 tabular-nums">{profile.sector_diversity || 0}</p>
                        <span className="text-[10px] font-bold text-zinc-400">{t('cpvSectors')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('supplierPool')}</p>
                      <p className="text-xl font-black text-zinc-900 tabular-nums">{metrics.supplier_count}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Strategic Focus (Sectors & Top Suppliers) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Strategic Sector Dominance */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full">
                <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
                  <PieChart size={20} className="text-purple-600" />
                  {t('sectorSpecialization')}
                </h3>
                <div className="h-[300px]">
                  <SectorMixChart sectorStats={profile.sector_stats || []} />
                </div>
              </div>

              {/* Top Suppliers (Visual) */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full">
                <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
                  <HeartHandshake size={20} className="text-emerald-600" />
                  {t('topSuppliers')}
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {profile.top_winners?.map((winner: any, i: number) => {
                    const params = new URLSearchParams();
                    if (fromTender) params.set('fromTender', fromTender);
                    params.set('backUrl', `${pathname}?${searchParams.toString()}`);
                    
                    return (
                    <div key={i} className="p-4 bg-zinc-50 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all">
                      <div className="flex justify-between items-start mb-1">
                        {winner.competitor_id ? (
                          <Link href={`/intelligence/competitors/${encodeURIComponent(winner.competitor_id)}?${params.toString()}`} className="text-xs font-black text-zinc-900 uppercase truncate pr-4 hover:text-blue-600 hover:underline block max-w-[200px]" title={winner.winner_name}>
                            {winner.winner_name}
                          </Link>
                        ) : (
                          <span className="text-xs font-black text-zinc-900 uppercase truncate pr-4 block max-w-[200px]" title={winner.winner_name}>
                            {winner.winner_name}
                          </span>
                        )}
                        <p className="text-xs font-bold text-emerald-600 whitespace-nowrap">{winner.wins} {t('wins')}</p>
                      </div>
                      
                      {/* Share of Spend Visual Bar */}
                      <div className="mt-2 mb-1">
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-[10px] font-bold text-zinc-500">{formatValue(winner.revenue)}</p>
                        {winner.share_of_spend_pct !== undefined && winner.share_of_spend_pct !== null && (
                            <p className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100" title={t('shareOfWallet')}>
                            {winner.share_of_spend_pct.toFixed(1)}% {t('shareOfWallet')}
                            </p>
                        )}
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${winner.share_of_spend_pct}%` }}
                            ></div>
                        </div>
                      </div>
                    </div>
                  )})}
                </div>
              </div>
          </div>

          {metrics.yearly_stats && metrics.yearly_stats.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[550px]">
                {/* Evolution Charts (Visuals) */}
                <div className="lg:col-span-7 h-full">
                    {metrics.competitor_trends && metrics.sector_trends && (
                        <BuyerEvolutionCharts 
                            competitorTrends={metrics.competitor_trends} 
                            sectorTrends={metrics.sector_trends} 
                        />
                    )}
                </div>

                {/* Historical Spending Trend (Data List) */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full overflow-y-auto custom-scrollbar">
                    <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm sticky top-0 bg-white z-10 pb-4 border-b border-zinc-100">
                        <TrendingUp size={20} className="text-blue-600" />
                        {t('spendingHistory')}
                    </h3>
                    <div className="space-y-6">
                        {metrics.yearly_stats.map((year: any, i: number) => (
                        <div key={i} className="group">
                            <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-black text-zinc-900">{year.year}</span>
                            <span className="text-xs font-bold text-zinc-500">{formatValue(year.total_spend)} • {year.total_contracts} {t('projects')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-zinc-100 rounded-full overflow-hidden flex">
                                <div 
                                className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                                style={{ width: `${(year.total_spend / metrics.yearly_stats[0].total_spend) * 100}%` }}
                                ></div>
                            </div>
                            <span className={`text-[10px] font-black w-12 text-right ${year.direct_award_pct > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {year.direct_award_pct ? year.direct_award_pct.toFixed(1) : 0}% DA
                            </span>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {/* Latest Activity Lists */}
          {(() => {
            const tenderBackUrl = encodeURIComponent(`${pathname}?${searchParams.toString()}`);
            return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Active Tenders */}
             <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8">
                <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm">
                    <TrendingUp size={20} className="text-blue-600" />
                    {t('analysis.activeTenders')}
                </h3>
                <div className="space-y-4">
                    {metrics.activeTenders?.length > 0 ? metrics.activeTenders.map((td: any, i: number) => (
                        <div key={i} className="p-4 bg-zinc-50 rounded-xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <Link href={`/tenders/${td.tender_uuid}?backUrl=${tenderBackUrl}`} className="text-xs font-black text-zinc-900 uppercase truncate pr-4 hover:text-blue-600 hover:underline block max-w-[300px]" title={td.title}>
                                    {td.title || "No Title"}
                                </Link>
                                <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">
                                    {td.submission_deadline ? new Date(td.submission_deadline).toLocaleDateString() : 'Open'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-[10px] font-bold text-zinc-500">{formatValue(td.estimated_value)} (Est)</p>
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 uppercase">{t('active')}</span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-zinc-400 italic text-sm text-center py-4">{t('noActiveTenders')}</p>
                    )}
                </div>
             </div>

             {/* Awarded Tenders */}
             <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8">
                <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm">
                    <Check size={20} className="text-emerald-600" />
                    {t('analysis.latestAwards')}
                </h3>
                <div className="space-y-4">
                    {metrics.awardedTenders?.length > 0 ? metrics.awardedTenders.map((td: any, i: number) => (
                        <div key={i} className="p-4 bg-zinc-50 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <Link href={`/tenders/${td.tender_uuid}?backUrl=${tenderBackUrl}`} className="text-xs font-black text-zinc-900 uppercase truncate pr-4 hover:text-blue-600 hover:underline block max-w-[300px]" title={td.title}>
                                    {td.title || "No Title"}
                                </Link>
                                <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">
                                    {td.publication_date ? new Date(td.publication_date).getFullYear() : ''}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-3">
                                    <p className="text-[10px] font-bold text-zinc-500">{formatValue(td.final_contract_value)}</p>
                                    <p className="text-[10px] font-medium text-zinc-400 border-l border-zinc-200 pl-3">Est. {formatValue(td.estimated_value)}</p>
                                </div>
                                {td.estimated_value && td.final_contract_value < td.estimated_value && (
                                    <span className="text-[9px] font-bold text-emerald-600">
                                        -{Math.round(((td.estimated_value - td.final_contract_value)/td.estimated_value)*100)}% Disc.
                                    </span>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p className="text-zinc-400 italic text-sm text-center py-4">{t('noAwardedTenders')}</p>
                    )}
                </div>
             </div>
          </div>
            );
          })()}

          <BuyerCompetitorAnalysis
            buyerName={profile.name} 
            selectedCpvs={selectedCpvs}
            initialTenders={tenders} 
          />
        </div>
      ) : null}
    </div>
  );
}