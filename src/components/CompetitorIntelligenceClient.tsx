"use client";

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, TrendingUp, Users, ArrowUpRight, ArrowRight, ShieldCheck, Trophy, ArrowLeft, Building2, Check, SearchX } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { getCpvDescription } from '@/utils/cpv-data';
import { PersonaBadge } from './PersonaBadge';
import { CompetitorEvolutionCharts } from './CompetitorEvolutionCharts';
import { SectorMixChart } from './SectorMixChart';
import { PageHeader } from './ui/PageHeader';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface CompetitorIntelligenceClientProps {
  initialProfile: any;
  initialSearchResults: any[];
  initialName: string | null;
  fromTender: string | null;
}

export function CompetitorIntelligenceClient({ 
  initialProfile, 
  initialSearchResults,
  initialName, 
  fromTender 
}: CompetitorIntelligenceClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialName || "");
  const [searchResults, setSearchResults] = useState<any[]>(initialSearchResults);
  const [profile, setProfile] = useState<any>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [wonTenders, setWonTenders] = useState<any[]>([]);
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

  // Fetch wins for the competitor
  useEffect(() => {
    const fetchWins = async () => {
      if (!profile?.name) return;
      
      const { data } = await supabase
        .from('tenders')
        .select('tender_id, tender_uuid, title, estimated_value, final_contract_value, publication_date, winners_list, procedure_type, buyer_name')
        .eq('is_active', false)
        // Check if competitor name is in winners_list JSON array
        .contains('winners_list', [{ winner_name: profile.name }])
        .order('publication_date', { ascending: false });

      if (data) {
        setWonTenders(data);
      }
    };

    fetchWins();
  }, [profile?.name]);

  const searchCompetitors = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.length < 3) return;
    
    const { data } = await supabase
      .from('intel_competitors')
      .select('name, country, total_wins, competitor_id')
      .textSearch('search_vector', query, { type: 'websearch', config: 'public.simple_unaccent' })
      .limit(10);

    setSearchResults(data || []);
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
    <div className="max-w-6xl mx-auto pb-20 text-slate-800">
      {fromTender && (
        <Link href={`/tenders/${fromTender}`} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-8 font-bold text-sm group w-fit">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('backToTender')}
        </Link>
      )}

      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Trophy size={18} />}
        subtitleLink={{ label: t('competitorPersonasGuide'), href: '/personas' }}
      />

      {!profile && (
        <div className="relative mb-12 max-w-2xl">
          <Card className="p-2 mb-4">
            <form onSubmit={searchCompetitors} className="flex items-center gap-2">
              <Input
                icon={<SearchIcon size={18} />}
                placeholder={t('searchPlaceholder')}
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    if (e.target.value.length >= 3) searchCompetitors();
                    else if (e.target.value.length === 0) setSearchResults(initialSearchResults);
                    else setSearchResults([]);
                }}
                className="border-0 shadow-none focus:ring-0"
              />
            </form>
          </Card>

          {searchResults.length > 0 && query.length >= 3 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden">
              {searchResults.map((c, i) => (
                <button
                  key={i}
                  onClick={() => navigateToProfile(c.competitor_id)}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-center justify-between group"
                >
                  <div>
                    <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{c.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase">{c.country}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 italic font-medium animate-pulse">{t('loading')}</div>
      ) : profile ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={clearProfile}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm"
            >
              <ArrowLeft size={16} />
              {backUrl ? t('back') : t('backToSearch')}
            </button>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white border border-slate-800 shadow-2xl">
                  <Trophy size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{profile.name}</h2>
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
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('winRate')}</p>
                  <p className="text-2xl font-black text-blue-600 tabular-nums">{profile.win_rate_pct ? profile.win_rate_pct.toFixed(1) : '0.0'}%</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('avgDiscount')}</p>
                  <p className="text-2xl font-black text-emerald-600 tabular-nums">{profile.avg_discount_pct ? profile.avg_discount_pct.toFixed(1) : '0.0'}%</p>
                </div>
                <div className="w-px h-12 bg-slate-200"></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('status')}</p>
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className={`w-2 h-2 rounded-full ${profile.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    <p className="text-xs font-black text-slate-700">{profile.is_active ? t('active') : t('inactive')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Card 1: Activity & Revenue */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 h-full flex flex-col">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  {t('marketActivity')}
                </h3>
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-end pb-4 border-b border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('stats.estimatedRevenue')}</p>
                      <p className="text-2xl font-black text-slate-900 tabular-nums">{formatValue(profile.total_revenue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('activeSince')}</p>
                      <p className="text-sm font-bold text-slate-600">{profile.first_active_year} - {profile.last_active_year}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('stats.totalWins')}</p>
                      <p className="text-xl font-black text-slate-900 tabular-nums">{profile.total_wins}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('totalBids')}</p>
                      <p className="text-xl font-black text-slate-400 tabular-nums">{profile.total_participations}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Market Presence & Risk */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 h-full flex flex-col">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users size={18} className="text-purple-600" />
                  {t('marketReach')} & {t('biddingBehavior')}
                </h3>
                <div className="space-y-6 flex-1">
                  <div className="flex justify-between items-end pb-4 border-b border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('buyerDiversity')}</p>
                      <p className="text-2xl font-black text-purple-600 tabular-nums">{profile.buyer_diversity}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-1">{t('uniqueClients')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('directAwards')}</p>
                      <p className="text-2xl font-black text-rose-600 tabular-nums">{profile.direct_award_pct ? profile.direct_award_pct.toFixed(1) : '0.0'}%</p>
                      <p className="text-[9px] font-bold text-rose-400 mt-1">{t('nonCompetitive')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sectorDiversity')}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-black text-indigo-600 tabular-nums">{profile.sector_diversity || 0}</p>
                        <span className="text-[10px] font-bold text-slate-400">{t('cpvSectors')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('vatId')}</p>
                      <p className="text-sm font-bold text-slate-600 tabular-nums">{profile.vat_id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Strategic Focus (Sectors & Buyers) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Strategic Sector Dominance */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 h-full">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
                  <Users size={20} className="text-purple-600" />
                  {t('sectorSpecialization')}
                </h3>
                <div className="h-[300px]">
                  <SectorMixChart sectorStats={profile.sector_stats || []} />
                </div>
              </div>

              {/* Top Buyers */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 h-full">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2 uppercase tracking-tight text-sm">
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
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/intelligence/buyers/${encodeURIComponent(client.buyer_id)}?${params.toString()}`} className="text-xs font-black text-slate-900 uppercase truncate pr-4 hover:text-blue-600 hover:underline block max-w-[200px]" title={client.buyer_name}>
                          {client.buyer_name}
                        </Link>
                        <p className="text-xs font-bold text-emerald-600 whitespace-nowrap">{client.contracts} {t('wins')}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] font-bold text-slate-500">{formatValue(client.revenue)} {t('revenue')}</p>
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
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight text-sm">
                <Trophy size={20} className="text-blue-600" />
                {t('wonTendersTitle')}
            </h3>
            <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                      <tr className="border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('tenderTitle')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('tenderType')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('authority')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">{t('date')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-right">{t('stats.estimatedRevenue')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-40 text-right">{t('value')}</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {wonTenders.length > 0 ? (
                        wonTenders.map((tender, i) => {
                          const tenderBackUrl = `${pathname}?${searchParams.toString()}`;
                          return (
                          <tr
                            key={i}
                            className="hover:bg-blue-50/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <Link href={`/tenders/${tender.tender_uuid}?backUrl=${encodeURIComponent(tenderBackUrl)}`} className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors line-clamp-2" title={tender.title}>
                                {tender.title || "No Title"}
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase whitespace-nowrap">
                                {tender.procedure_type || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-500 line-clamp-1" title={tender.buyer_name}>{tender.buyer_name}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
                                {tender.publication_date ? new Date(tender.publication_date).toLocaleDateString() : '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-500 whitespace-nowrap text-sm tabular-nums">
                              {formatValue(tender.estimated_value)}
                            </td>
                            <td className="px-6 py-4 text-right font-black text-emerald-600 whitespace-nowrap text-sm tabular-nums">
                              {formatValue(tender.final_contract_value)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end">
                                <Link href={`/tenders/${tender.tender_uuid}?backUrl=${encodeURIComponent(tenderBackUrl)}`} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                  <ArrowUpRight size={16} />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );})
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
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
      ) : (
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              {query.length >= 3 ? t('searchResults') : t('topCompetitors')}
            </h3>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((c, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigateToProfile(c.competitor_id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {c.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge color="slate">{c.country}</Badge>
                        <span className="text-[10px] text-slate-400">{c.total_wins?.toLocaleString()} {t('stats.totalWins')}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SearchX size={36} />}
              title={t('noResultsFound')}
            />
          )}
        </div>
      )}
    </div>
  );
}