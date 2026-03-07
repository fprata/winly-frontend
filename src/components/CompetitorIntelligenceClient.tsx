"use client";

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, TrendingUp, Users, ArrowUpRight, ArrowRight, ShieldCheck, Trophy, ArrowLeft, Building2, Check, SearchX, MapPin, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { getCpvDescription } from '@/utils/cpv-data';
import { PersonaBadge } from './PersonaBadge';
import { CompetitorEvolutionCharts } from './CompetitorEvolutionCharts';
import { SectorMixChart } from './SectorMixChart';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface CompetitorIntelligenceClientProps {
  initialProfile: any;
  initialSearchResults: any[];
  initialName: string | null;
  initialWonTenders?: any[];
  fromTender: string | null;
}

export function CompetitorIntelligenceClient({
  initialProfile,
  initialSearchResults,
  initialName,
  initialWonTenders = [],
  fromTender
}: CompetitorIntelligenceClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialName || "");
  const [searchResults, setSearchResults] = useState<any[]>(initialSearchResults);
  const [profile, setProfile] = useState<any>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [wonTenders, setWonTenders] = useState<any[]>(initialWonTenders);
  const t = useTranslations('intelligence.competitors');
  const locale = useLocale();

  const backUrl = searchParams.get('backUrl');

  // Sync profile when props change (Server navigation)
  useEffect(() => {
    setProfile(initialProfile);
    if (!initialProfile) {
        setSearchResults(initialSearchResults);
        setQuery("");
    } else {
        setQuery(initialProfile.name);
    }
  }, [initialProfile, initialSearchResults]);


  const searchCompetitors = async (value: string) => {
    if (value.length < 3) return;

    const res = await fetch(`/api/intelligence/search?q=${encodeURIComponent(value)}&type=competitors`);
    const json = await res.json();
    setSearchResults(json.data || []);
  };

  const navigateToProfile = (id: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (fromTender) params.set('fromTender', fromTender);
    if (backUrl) params.set('backUrl', backUrl);
    const qs = params.toString();
    router.push(`/intelligence/competitors/${encodeURIComponent(id)}${qs ? `?${qs}` : ''}`);
  };

  const clearProfile = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.push(`/intelligence/competitors`);
    }
  };

  const formatValue = (val: number) => {
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', { 
      style: 'currency', currency: 'EUR', maximumFractionDigits: 0 
    }).format(val || 0);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 text-zinc-800">
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
              {searchResults.length > 0 ? `${searchResults.length} competitors tracked` : ''}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <SearchIcon size={15} className="absolute left-2.5 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder') || "Search competitors..."}
                  value={query}
                  onChange={e => {
                    const val = e.target.value;
                    setQuery(val);
                    if (val.length >= 3) searchCompetitors(val);
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
            {searchResults.map((c: any, i: number) => {
              const getThreatTag = (c: any): { label: string; color: string } => {
                const wr = c.win_rate_pct || 0;
                if (wr >= 60) return { label: 'Top Threat', color: 'rose' };
                if (wr >= 45) return { label: 'High Threat', color: 'amber' };
                return { label: 'Moderate', color: 'zinc' };
              };
              const tag = getThreatTag(c);
              const formatVal = (val: number) => {
                if (!val) return '—';
                if (val >= 1_000_000) return `€${(val / 1_000_000).toFixed(1)}M`;
                if (val >= 1_000) return `€${(val / 1_000).toFixed(0)}K`;
                return `€${val}`;
              };
              return (
                <div
                  key={i}
                  onClick={() => navigateToProfile(c.competitor_id)}
                  className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-px group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[17px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors mb-1">{c.name}</h3>
                      <div className="flex items-center gap-1.5 text-[13px] text-zinc-500 mb-4">
                        <MapPin size={12} />
                        {c.country || 'Unknown'}
                        <span className="text-zinc-300">·</span>
                        IT Consulting &amp; Services
                        <span className="text-zinc-300">·</span>
                        Active since {new Date().getFullYear() - 5}
                      </div>
                      <div className="flex gap-6">
                        {c.win_rate_pct != null && (
                          <div>
                            <div className="text-[20px] font-extrabold text-blue-600 leading-none">{c.win_rate_pct.toFixed(0)}%</div>
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Win Rate</div>
                          </div>
                        )}
                        {c.total_revenue != null && (
                          <div>
                            <div className="text-[20px] font-extrabold text-zinc-900 leading-none">{formatVal(c.total_revenue)}</div>
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Revenue</div>
                          </div>
                        )}
                        <div>
                          <div className="text-[20px] font-extrabold text-zinc-900 leading-none">{c.total_wins || 0}</div>
                          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Contracts Won</div>
                        </div>
                        {c.avg_discount_pct != null && (
                          <div>
                            <div className="text-[20px] font-extrabold text-emerald-600 leading-none">{c.avg_discount_pct.toFixed(1)}%</div>
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Avg Discount</div>
                          </div>
                        )}
                        {c.buyer_diversity != null && (
                          <div>
                            <div className="text-[20px] font-extrabold text-zinc-900 leading-none">{c.buyer_diversity}</div>
                            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">Unique Buyers</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge color={tag.color as any}>{tag.label}</Badge>
                      <div className="flex items-center gap-1 text-[13px] text-zinc-400 group-hover:text-blue-600 transition-colors">
                        <span>View profile</span>
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
                title={t('noResults') || "No competitors found"}
                subtitle={t('noResultsHint') || "Try a different search term"}
              />
            )}
          </div>
        </>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 italic font-medium animate-pulse">{t('loading')}</div>
      ) : profile ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={clearProfile}
              className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors font-medium text-sm"
            >
              <ArrowLeft size={16} />
              {backUrl ? t('back') : t('backToSearch')}
            </button>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-zinc-200/60 shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center text-white border border-zinc-800 shadow-2xl">
                  <Trophy size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{profile.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase border border-blue-100">
                      <ShieldCheck size={12} className="text-emerald-500" /> {t('marketPlayerBadge')}
                    </span>
                    {profile.persona_name && (
                      <PersonaBadge personaName={profile.persona_name} />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('winRate')}</p>
                  <p className="text-2xl font-black text-blue-600 tabular-nums">{profile.win_rate_pct ? profile.win_rate_pct.toFixed(1) : '0.0'}%</p>
                </div>
                <div className="w-px h-12 bg-zinc-200"></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('avgDiscount')}</p>
                  <p className="text-2xl font-black text-emerald-600 tabular-nums">{profile.avg_discount_pct ? profile.avg_discount_pct.toFixed(1) : '0.0'}%</p>
                </div>
                <div className="w-px h-12 bg-zinc-200"></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('status')}</p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-emerald-500' : 'bg-zinc-400'}`}></div>
                    <p className="text-xs font-black text-zinc-700">{profile.is_active ? t('active') : t('inactive')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Card 1: Activity & Revenue */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full flex flex-col">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  {t('marketActivity')}
                </h3>
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-end pb-4 border-b border-zinc-50">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('stats.estimatedRevenue')}</p>
                      <p className="text-2xl font-black text-zinc-900 tabular-nums">{formatValue(profile.total_revenue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('activeSince')}</p>
                      <p className="text-sm font-bold text-zinc-600">{profile.first_active_year} - {profile.last_active_year}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('stats.totalWins')}</p>
                      <p className="text-xl font-black text-zinc-900 tabular-nums">{profile.total_wins}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('totalBids')}</p>
                      <p className="text-xl font-black text-zinc-400 tabular-nums">{profile.total_participations}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Market Presence & Risk */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full flex flex-col">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users size={18} className="text-purple-600" />
                  {t('marketReach')} & {t('biddingBehavior')}
                </h3>
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-end pb-4 border-b border-zinc-50">
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('buyerDiversity')}</p>
                      <p className="text-2xl font-black text-purple-600 tabular-nums">{profile.buyer_diversity}</p>
                      <p className="text-[9px] font-bold text-zinc-400 mt-1">{t('uniqueClients')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('directAwards')}</p>
                      <p className="text-2xl font-black text-rose-600 tabular-nums">{profile.direct_award_pct ? profile.direct_award_pct.toFixed(1) : '0.0'}%</p>
                      <p className="text-[9px] font-bold text-rose-400 mt-1">{t('nonCompetitive')}</p>
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
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{t('vatId')}</p>
                      <p className="text-sm font-bold text-zinc-600 tabular-nums">{profile.vat_id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Strategic Focus (Sectors & Buyers) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Strategic Sector Dominance */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full">
                <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
                  <Users size={20} className="text-purple-600" />
                  {t('sectorSpecialization')}
                </h3>
                <div className="h-[300px]">
                  <SectorMixChart sectorStats={profile.sector_stats || []} />
                </div>
              </div>

              {/* Top Buyers */}
              <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8 h-full">
                <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
                  <Building2 size={20} className="text-emerald-600" />
                  {t('topBuyers')}
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {profile.top_clients?.map((client: any, i: number) => {
                    const params = new URLSearchParams();
                    // We don't pass fromTender here usually, or should we? 
                    // If we want "Back to Tender" to persist even after jumping around, yes.
                    const fromTender = searchParams.get('fromTender');
                    if (fromTender) params.set('fromTender', fromTender);
                    params.set('backUrl', `${pathname}?${searchParams.toString()}`);

                    return (
                    <div key={i} className="p-4 bg-zinc-50 rounded-xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/intelligence/buyers/${encodeURIComponent(client.buyer_id)}?${params.toString()}`} className="text-xs font-black text-zinc-900 uppercase truncate pr-4 hover:text-blue-600 hover:underline block max-w-[200px]" title={client.buyer_name}>
                          {client.buyer_name}
                        </Link>
                        <p className="text-xs font-bold text-emerald-600 whitespace-nowrap">{client.contracts} {t('wins')}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-bold text-zinc-500">{formatValue(client.revenue)} {t('revenue')}</p>
                        {client.share_of_wallet_pct !== undefined && client.share_of_wallet_pct !== null && (
                            <p className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100" title={t('shareOfWallet')}>
                            {client.share_of_wallet_pct.toFixed(1)}% {t('shareOfWallet')}
                            </p>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
          </div>

          {/* Row 3: Evolution Charts */}
          <div className="mb-12">
             <CompetitorEvolutionCharts yearlyStats={profile.yearly_stats || []} />
          </div>

          {/* Row 4: Won Tenders Table */}
          <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8">
            <h3 className="text-xl font-black text-zinc-900 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm">
                <Trophy size={20} className="text-blue-600" />
                {t('wonTendersTitle')}
            </h3>
            <div className="overflow-hidden border border-zinc-100 rounded-xl">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-50/80 sticky top-0 z-10 backdrop-blur-sm">
                      <tr className="border-b border-zinc-100">
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('tenderTitle')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('tenderType')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('authority')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-32">{t('date')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-32 text-right">{t('stats.estimatedRevenue')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-40 text-right">{t('value')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {wonTenders.length > 0 ? (
                        wonTenders.map((tender, i) => {
                          const tenderBackUrl = `${pathname}?${searchParams.toString()}`;
                          return (
                          <tr
                            key={i}
                            className="hover:bg-blue-50/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <Link href={`/tenders/${tender.tender_uuid}?backUrl=${encodeURIComponent(tenderBackUrl)}`} className="font-bold text-zinc-800 text-sm group-hover:text-blue-700 transition-colors line-clamp-2" title={tender.title}>
                                {tender.title || "No Title"}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded text-[9px] font-black uppercase whitespace-nowrap">
                                {tender.procedure_type || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-zinc-500 line-clamp-1" title={tender.buyer_name}>{tender.buyer_name}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">
                                {tender.publication_date ? new Date(tender.publication_date).toLocaleDateString() : '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-zinc-500 whitespace-nowrap text-sm tabular-nums">
                              {formatValue(tender.estimated_value)}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-emerald-600 whitespace-nowrap text-sm tabular-nums">
                              {formatValue(tender.final_contract_value)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end">
                                <Link href={`/tenders/${tender.tender_uuid}?backUrl=${encodeURIComponent(tenderBackUrl)}`} className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                  <ArrowUpRight size={16} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );})
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 font-medium italic">
                            {t('noWonTenders')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}