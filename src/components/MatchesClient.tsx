"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from '@/navigation'
import {
  DollarSign,
  Target,
  Building2,
  ChevronRight,
  ChevronLeft,
  Clock,
  Search as SearchIcon,
  Star,
  Filter,
  ArrowUpDown,
  TrendingUp,
  ShieldCheck,
  Bell,
  X,
  Globe,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Fuse from 'fuse.js';
import { useTranslations, useLocale } from 'next-intl';
import { getCpvDescription } from '@/utils/cpv-data';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';

interface MatchesClientProps {
  initialMatches: any[];
  clientId: string;
  totalCount?: number;
}

const PAGE_SIZE = 20;

export function MatchesClient({ initialMatches, clientId, totalCount }: MatchesClientProps) {
  const [allMatches, setAllMatches] = useState<any[]>(() =>
    initialMatches.map((m: any) => ({
      ...m,
      ...(m.tenders || {}),
      priority: m.match_score >= 75 ? 'High' : m.match_score >= 50 ? 'Medium' : 'Low'
    }))
  );
  const [loading, setLoading] = useState(false);
  const t = useTranslations('matches');
  const locale = useLocale();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    async function fetchMatches() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('tender_matches')
        .select(`
          match_score,
          match_reasons,
          score_cpv,
          score_strategic,
          score_semantic,
          score_keyword,
          score_location,
          win_probability,
          tender_id,
          tender_uuid,
          tenders!inner (*)
        `)
        .eq('client_id', clientId)
        .gte('match_score', minScoreFilter)
        .order('match_score', { ascending: false })
        .limit(200);

      if (error) {
        setError(t('errorLoadingMatches') || "Could not load matches");
      } else {
        const flattened = data.map((m: any) => {
          const tender = m.tenders ? (Array.isArray(m.tenders) ? m.tenders[0] : m.tenders) : {};
          return {
            ...m,
            ...tender,
            tender_uuid: m.tender_uuid || tender.tender_uuid,
            priority: m.match_score >= 75 ? 'High' : m.match_score >= 50 ? 'Medium' : 'Low'
          };
        });
        setAllMatches(flattened);
        setPage(0);
      }
      setLoading(false);
    }
    fetchMatches();
  }, [minScoreFilter, clientId, t]);

  const formatValue = (val: number, curr: string) => {
    if (!val) return "TBD";
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'currency', currency: curr || 'EUR', maximumFractionDigits: 0
    }).format(val);
  };

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const displayedMatches = useMemo(() => {
    let result = allMatches;
    if (selectedCountry !== "All") result = result.filter((m: any) => (m.country || "") === selectedCountry);
    if (searchTerm) {
      const fuse = new Fuse(result, { keys: ['title', 'buyer_name'], threshold: 0.35 });
      result = fuse.search(searchTerm).map((r: any) => r.item);
    }
    return result;
  }, [allMatches, searchTerm, selectedCountry]);

  const paginatedMatches = useMemo(() => {
    return displayedMatches.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [displayedMatches, page]);

  const totalPages = Math.ceil(displayedMatches.length / PAGE_SIZE);
  const from = page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, displayedMatches.length);

  // Stat card data
  const highConfidenceCount = allMatches.filter(m => m.match_score >= 75).length;
  const pipelineValue = allMatches.reduce((sum, m) => sum + (m.estimated_value || 0), 0);
  const activeCount = totalCount ?? allMatches.length;

  const formatPipelineValue = (val: number) => {
    if (val >= 1_000_000_000) return `€${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `€${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `€${(val / 1_000).toFixed(0)}K`;
    return `€${val.toFixed(0)}`;
  };

  // Active filter chips
  const activeChips: { key: string; label: string }[] = [];
  if (minScoreFilter > 0) activeChips.push({ key: 'score', label: `Score: ${minScoreFilter}+` });
  if (selectedCountry !== 'All') activeChips.push({ key: 'country', label: selectedCountry });

  const removeChip = (key: string) => {
    if (key === 'score') setMinScoreFilter(0);
    if (key === 'country') setSelectedCountry('All');
  };

  return (
    <div className="pb-16">
      {/* Page Header */}
      <header className="flex flex-wrap justify-between items-start mb-7 gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-zinc-950 leading-none mb-1">{t('title')}</h1>
          <p className="text-[14px] text-zinc-500">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Live Feed Active
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-zinc-500">{t('activeMatches') || 'Active Matches'}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell size={16} />
            </div>
          </div>
          <div className="text-[32px] font-bold tracking-tight text-zinc-900 leading-none">{activeCount.toLocaleString()}</div>
          <div className="mt-2">
            <Link href="/matches" className="text-blue-600 text-[13px] font-semibold flex items-center gap-1 hover:underline">
              {t('managePipeline') || 'Manage pipeline'} <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-zinc-500">{t('highConfidence') || 'High Confidence'}</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-[32px] font-bold tracking-tight text-zinc-900 leading-none">{highConfidenceCount}</div>
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-xs font-medium border border-zinc-200">
              &gt; 75% {t('matchScore') || 'Match Score'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-zinc-500">{t('pipelineValue') || 'Pipeline Value'}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-[32px] font-bold tracking-tight text-zinc-900 leading-none">
            {formatPipelineValue(pipelineValue)}
          </div>
          <div className="mt-2 text-[13px] text-zinc-500">{t('acrossAllMatches') || 'Across all active matches'}</div>
        </div>
      </div>

      {/* Section header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <h2 className="text-[18px] font-bold text-zinc-900">{t('recentMatches') || 'Recent Matches'}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setMinScoreFilter(minScoreFilter > 0 ? 0 : 60)}
            className="h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Filter size={15} /> Filters
          </button>
          <button
            onClick={() => setMinScoreFilter(minScoreFilter === 75 ? 0 : 75)}
            className={`h-9 px-3 rounded-lg border text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all ${minScoreFilter === 75 ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'}`}
          >
            <ArrowUpDown size={15} /> Score
          </button>
          <div className="relative flex-1 sm:flex-none">
            <SearchIcon size={15} className="absolute left-2.5 top-2.5 text-zinc-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder') || "Search tenders..."}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              className="h-9 pl-8 pr-3 w-full sm:w-64 rounded-lg border border-zinc-300 text-sm outline-none bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 placeholder:text-zinc-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      {activeChips.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          {activeChips.map(chip => (
            <span key={chip.key} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
              {chip.label}
              <button onClick={() => removeChip(chip.key)} className="opacity-60 hover:opacity-100 cursor-pointer">
                <X size={13} />
              </button>
            </span>
          ))}
          <button onClick={() => { setMinScoreFilter(0); setSelectedCountry('All'); }} className="text-xs text-zinc-400 hover:text-zinc-600">
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      {!loading && displayedMatches.length > 0 && (
        <div className="text-xs text-zinc-400 mb-3">
          Showing {from}–{to} of {displayedMatches.length.toLocaleString()} matches
        </div>
      )}

      {/* Match list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-white rounded-xl border border-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-xl bg-red-50 border border-red-100">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-red-700 underline hover:text-red-800">
            Try again
          </button>
        </div>
      ) : displayedMatches.length === 0 ? (
        <EmptyState
          icon={<Star size={32} />}
          title={t('noMatchesFound')}
          subtitle={t('adjustFilters')}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedMatches.map((match: any) => {
            const daysLeft = getDaysRemaining(match.submission_deadline);
            const score = Math.round(match.match_score);
            const circumference = 213.6;
            const dashOffset = circumference - (circumference * score) / 100;
            const scoreColor = score >= 75 ? '#2563eb' : score >= 50 ? '#f59e0b' : '#a1a1aa';
            const priorityColor: 'rose' | 'amber' | 'zinc' = match.priority === 'High' ? 'rose' : match.priority === 'Medium' ? 'amber' : 'zinc';

            const miniBarData = [
              { label: 'CPV', value: match.score_cpv || 0, color: '#8b5cf6' },
              { label: 'Loc', value: match.score_location || 0, color: '#f59e0b' },
              { label: 'Cap', value: match.score_capacity || 0, color: '#0ea5e9' },
              { label: 'Key', value: match.score_keyword || 0, color: '#10b981' },
              { label: 'Mkt', value: match.score_market_opp || 0, color: '#a1a1aa' },
            ];

            return (
              <Link
                key={match.tender_id}
                href={`/tenders/${match.tender_uuid}`}
                className="bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row overflow-hidden cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-px group"
              >
                {/* Score Column */}
                <div className="sm:w-[140px] sm:shrink-0 bg-zinc-50 border-b sm:border-b-0 sm:border-r border-zinc-200 flex flex-row sm:flex-col items-center sm:justify-center py-3 sm:py-5 px-4 sm:px-3 gap-3 sm:gap-2">
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0">
                    <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="40" cy="40" r="34" stroke="#e4e4e7" strokeWidth="6" fill="none" />
                      <circle
                        cx="40" cy="40" r="34"
                        stroke={scoreColor}
                        strokeWidth="6" fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className="absolute inset-0 flex items-center justify-center text-[18px] sm:text-[22px] font-extrabold"
                      style={{ color: scoreColor }}
                    >
                      {score}
                    </span>
                  </div>
                  <div className="flex flex-col sm:items-center gap-1 sm:gap-2 flex-1 sm:w-full">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{t('matchScore')}</span>
                    <div className="w-full sm:px-1 space-y-1">
                      {miniBarData.map(bar => (
                        <div key={bar.label} className="flex items-center gap-1">
                          <span className="text-[9px] font-semibold text-zinc-400 uppercase w-7 text-right">{bar.label}</span>
                          <div className="flex-1 h-[3px] bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${Math.min(bar.value, 100)}%`, backgroundColor: bar.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col gap-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge color={priorityColor}>
                      {t(`matchTypes.${(match.priority || 'low').toLowerCase()}`)}
                    </Badge>
                    {daysLeft !== null && (
                      <Badge color={daysLeft <= 7 ? 'rose' : 'amber'} icon={<Clock size={11} />}>
                        {daysLeft} {t('daysLeft', { count: daysLeft }).replace(`${daysLeft} `, '') || 'days left'}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-[15px] font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                    {match.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[13px] text-zinc-500">
                    <Building2 size={13} />
                    <span className="truncate">{match.buyer_name}</span>
                    {match.country && (
                      <>
                        <span className="text-zinc-300">·</span>
                        <span>{match.country}</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-[26px] h-[26px] rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <DollarSign size={13} />
                      </div>
                      <span className="text-sm font-semibold text-zinc-900">{formatValue(match.estimated_value, match.currency)}</span>
                    </div>
                    {match.win_probability > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-[26px] h-[26px] rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Target size={13} />
                        </div>
                        <span className="text-sm font-semibold text-zinc-900">Win: {Math.round(match.win_probability)}%</span>
                      </div>
                    )}
                    {match.cpv_code && (
                      <Badge color="blue">
                        {match.cpv_code} — {getCpvDescription(match.cpv_code, locale)}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {match.priority === 'High' && <Badge color="blue">Sector match</Badge>}
                    {match.win_probability >= 60 && <Badge color="blue">Budget fit</Badge>}
                    {match.score_strategic >= 70 && <Badge color="blue">Strategic fit</Badge>}
                    {match.country && <Badge color="zinc">{match.country === 'PT' ? 'Portugal' : match.country}</Badge>}
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex w-11 shrink-0 items-center justify-center border-l border-zinc-200 text-zinc-400 group-hover:text-blue-600 transition-colors">
                  <ChevronRight size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && displayedMatches.length > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-200">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={15} /> Previous
          </button>
          <span className="text-sm text-zinc-500">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="h-9 px-3 rounded-lg border border-zinc-200 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
