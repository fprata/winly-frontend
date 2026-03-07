"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@/navigation'
import {
  DollarSign,
  Target,
  Building2,
  ArrowRight,
  Clock,
  Globe,
  Search as SearchIcon,
  Star,
  Zap,
  Brain,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Fuse from 'fuse.js';
import { useTranslations, useLocale } from 'next-intl';
import { getCpvDescription } from '@/utils/cpv-data';
import { PageHeader } from './ui/PageHeader';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Badge } from './ui/Badge';
import { EmptyState } from './ui/EmptyState';
import { Card } from './ui/Card';

interface MatchesClientProps {
  initialMatches: any[];
  clientId: string;
}

export function MatchesClient({ initialMatches, clientId }: MatchesClientProps) {
  const [matches, setMatches] = useState<any[]>(() =>
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

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
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
          tenders!inner (
            *
          )
        `)
        .eq('client_id', clientId)
        .gte('match_score', minScoreFilter)
        .order('match_score', { ascending: false })
        .limit(100);

      if (error) {
        console.error("Supabase error:", error);
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
        setMatches(flattened);
      }
      setLoading(false);
    }
    fetchMatches();
  }, [minScoreFilter, isFirstRender, clientId, t]);

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
      else if (text.includes('semantic') || text.includes('match') || text.includes('context')) key = "ai";
      else if (text.includes('procedure') || text.includes('openness')) key = "process";

      if (key) {
        if (!categories[key]) {
          const configs: any = {
            urgent: { label: t('categories.timeSensitivity'), icon: <Zap size={13} />, color: "text-amber-600", bg: "bg-amber-50" },
            market: { label: t('categories.marketRelevance'), icon: <Globe size={13} />, color: "text-sky-600", bg: "bg-sky-50" },
            budget: { label: t('categories.financialAlignment'), icon: <DollarSign size={13} />, color: "text-emerald-600", bg: "bg-emerald-50" },
            sector: { label: t('categories.sectorExpertise'), icon: <Target size={13} />, color: "text-violet-600", bg: "bg-violet-50" },
            ai: { label: t('categories.aiMatchConfidence'), icon: <Brain size={13} />, color: "text-blue-600", bg: "bg-blue-50" },
            process: { label: t('categories.proceduralExperience'), icon: <FileText size={13} />, color: "text-zinc-600", bg: "bg-zinc-100" }
          };
          categories[key] = { ...configs[key] };
        }
      }
    });
    return Object.values(categories).slice(0, 4);
  };

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
    let result = matches;
    if (selectedCountry !== "All") result = result.filter((m: any) => (m.country || "") === selectedCountry);
    if (searchTerm) {
      const fuse = new Fuse(result, { keys: ['title', 'buyer_name'], threshold: 0.35 });
      result = fuse.search(searchTerm).map((r: any) => r.item);
    }
    return result;
  }, [matches, searchTerm, selectedCountry]);

  const countryOptions = [
    { value: "All", label: t('allRegions') },
    { value: "PT", label: "Portugal" },
    { value: "ES", label: "Spain" },
    { value: "FR", label: "France" },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<Star size={16} />}
        actions={
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
            <button
              onClick={() => setMinScoreFilter(0)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${minScoreFilter === 0 ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {t('allMatches')}
            </button>
            <button
              onClick={() => setMinScoreFilter(75)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${minScoreFilter === 75 ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              {t('highConfidence')}
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <Card padding="none" className="p-3 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-8">
            <Input
              icon={<SearchIcon size={16} />}
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-0 shadow-none focus:ring-0"
            />
          </div>
          <div className="md:col-span-4">
            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
              icon={<Globe size={15} />}
            />
          </div>
        </div>
      </Card>

      {/* Score Legend */}
      <div className="mb-6 flex flex-wrap items-center gap-y-2 gap-x-5 bg-white px-4 py-3 rounded-xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-2 mr-1">
          <Brain size={15} className="text-blue-600" />
          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{t('scoreLegend.title')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-violet-400" />
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight">{t('scoreLegend.cpv')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-sky-400" />
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight">{t('scoreLegend.strategic')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight">{t('scoreLegend.semantic')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight">{t('scoreLegend.keyword')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight">{t('scoreLegend.location')}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-white rounded-xl border border-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-xl bg-red-50 border border-red-100">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-red-700 underline hover:text-red-800"
          >
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
          {displayedMatches.map((match: any) => {
            const daysLeft = getDaysRemaining(match.submission_deadline);
            const score = Math.round(match.match_score);
            // SVG ring: r=34, circumference = 2*π*34 ≈ 213.6
            const circumference = 213.6;
            const dashOffset = circumference - (circumference * score) / 100;
            const scoreColor = score >= 75 ? '#2563eb' : score >= 50 ? '#f59e0b' : '#a1a1aa';

            const miniBarData = [
              { label: 'CPV', value: match.score_cpv || 0, color: '#8b5cf6' },
              { label: 'Str', value: match.score_strategic || 0, color: '#0ea5e9' },
              { label: 'AI', value: match.score_semantic || 0, color: '#14b8a6' },
              { label: 'Key', value: match.score_keyword || 0, color: '#10b981' },
              { label: 'Urg', value: match.score_location || 0, color: '#f59e0b' },
            ];

            const priorityColor = match.priority === 'High' ? 'rose' : match.priority === 'Medium' ? 'amber' : 'zinc';

            return (
              <Link
                key={match.tender_id}
                href={`/tenders/${match.tender_uuid}`}
                className="bg-white rounded-xl border border-zinc-200 shadow-sm flex overflow-hidden cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:-translate-y-px group"
              >
                {/* Score Column */}
                <div className="w-[140px] shrink-0 bg-zinc-50 border-r border-zinc-200 flex flex-col items-center justify-center py-5 px-3 gap-2">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 80 80" width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
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
                      className="absolute inset-0 flex items-center justify-center text-[22px] font-extrabold"
                      style={{ color: scoreColor }}
                    >
                      {score}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{t('matchScore')}</span>

                  {/* Mini-bars with labels */}
                  <div className="w-full px-1 space-y-1">
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

                {/* Body */}
                <div className="flex-1 p-5 flex flex-col gap-1.5 min-w-0">
                  {/* Header row: badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge color={priorityColor as 'rose' | 'amber' | 'zinc'}>
                      {t(`matchTypes.${(match.priority || 'low').toLowerCase()}`)}
                    </Badge>
                    {daysLeft !== null && (
                      <Badge color={daysLeft <= 7 ? 'rose' : 'amber'} icon={<Clock size={11} />}>
                        {t('daysLeft', { count: daysLeft })}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-[15px] font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {match.title}
                  </h3>

                  {/* Buyer row */}
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

                  {/* Metrics row */}
                  <div className="flex items-center gap-4 mt-1">
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
                </div>

                {/* Arrow */}
                <div className="w-11 shrink-0 flex items-center justify-center border-l border-zinc-200 text-zinc-400 group-hover:text-blue-600 transition-colors">
                  <ArrowRight size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
