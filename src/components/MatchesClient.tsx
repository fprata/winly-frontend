"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@/navigation'
import {
  DollarSign,
  MapPin,
  Brain,
  FileText,
  Target,
  Zap,
  Building2,
  ArrowRight,
  Clock,
  Globe,
  Search as SearchIcon,
  Star
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
        .limit(100); // Pagination: limit to 100 matches

      if (error) {
        console.error("Supabase error:", error);
        setError(t('errorLoadingMatches') || "Could not load matches");
      } else {
        const flattened = data.map((m: any) => {
          const t = m.tenders ? (Array.isArray(m.tenders) ? m.tenders[0] : m.tenders) : {};
          return {
            ...m,
            ...t,
            // Ensure we use the UUID from the match or the tender record
            tender_uuid: m.tender_uuid || t.tender_uuid,
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
            ai: { label: t('categories.aiMatchConfidence'), icon: <Brain size={13} />, color: "text-teal-600", bg: "bg-teal-50" },
            process: { label: t('categories.proceduralExperience'), icon: <FileText size={13} />, color: "text-gray-600", bg: "bg-gray-50" }
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

  const getEncodedId = (id: string) => encodeURIComponent(encodeURIComponent(id));

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
        icon={<Star size={18} />}
        actions={
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMinScoreFilter(0)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${minScoreFilter === 0 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('allMatches')}
            </button>
            <button
              onClick={() => setMinScoreFilter(75)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${minScoreFilter === 75 ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('highConfidence')}
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-8">
        <div className="md:col-span-8">
          <Input
            icon={<SearchIcon size={18} />}
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:col-span-4">
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
            icon={<Globe size={16} />}
          />
        </div>
      </div>

      {/* Score Legend */}
      <div className="mb-8 flex flex-wrap items-center gap-y-3 gap-x-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mr-2">
          <Brain size={16} className="text-teal-600" />
          <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{t('scoreLegend.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-sm" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{t('scoreLegend.cpv')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{t('scoreLegend.strategic')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{t('scoreLegend.semantic')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{t('scoreLegend.keyword')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{t('scoreLegend.location')}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-white rounded-xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-red-50 border border-red-100">
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
          icon={<Star size={36} />}
          title={t('noMatchesFound')}
          subtitle={t('adjustFilters')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayedMatches.map((match: any) => {
            const daysLeft = getDaysRemaining(match.submission_deadline);
            const reasons = getCategorizedReasons(match.match_reasons);

            return (
              <Card key={match.tender_id} className="p-0 flex flex-col md:flex-row items-stretch group hover:border-gray-300 hover:shadow-md transition-all duration-300 overflow-hidden">

                {/* Score Column */}
                <div className="md:w-40 bg-gray-50 flex flex-col items-center justify-center p-5 border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-200" />
                      <circle
                        cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="5" fill="transparent"
                        strokeDasharray={226.2}
                        strokeDashoffset={226.2 - (226.2 * match.match_score) / 100}
                        className={`${match.match_score >= 75 ? 'text-teal-600' : match.match_score >= 50 ? 'text-amber-500' : 'text-gray-400'} transition-all duration-700`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xl font-extrabold text-gray-900">{Math.round(match.match_score)}%</span>
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">{t('matchScore')}</span>

                  {/* Score Components Mini-Bar */}
                  <div className="flex gap-0.5 w-full px-3">
                    {match.score_cpv > 0 && <div className="h-1 flex-1 bg-violet-400 rounded-full" title="CPV Match" />}
                    {match.score_strategic > 0 && <div className="h-1 flex-1 bg-sky-400 rounded-full" title="Strategic Fit" />}
                    {match.score_semantic > 0 && <div className="h-1 flex-1 bg-teal-400 rounded-full" title="AI Semantic" />}
                    {match.score_keyword > 0 && <div className="h-1 flex-1 bg-emerald-400 rounded-full" title="Keyword Match" />}
                    {match.score_location > 0 && <div className="h-1 flex-1 bg-amber-400 rounded-full" title="Deadline Urgency" />}
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge
                      color={(match.priority || 'Low') === 'High' ? 'teal' : (match.priority || 'Low') === 'Medium' ? 'amber' : 'slate'}
                    >
                      {t(`matchTypes.${(match.priority || 'low').toLowerCase()}`)}
                    </Badge>

                    {daysLeft !== null && (
                      <Badge
                        color={daysLeft <= 7 ? 'rose' : 'amber'}
                        icon={<Clock size={11} />}
                      >
                        {t('daysLeft', { count: daysLeft })}
                      </Badge>
                    )}

                    <span className="text-gray-400 text-[11px] font-medium flex items-center gap-1.5 ml-auto">
                      <Building2 size={12} />
                      {match.buyer_name}
                    </span>
                  </div>

                  <Link href={`/tenders/${match.tender_uuid}`}>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors leading-snug mb-1.5 pr-4">
                      {match.title}
                    </h3>
                  </Link>


                  <p className="text-xs text-gray-400 mb-4 truncate max-w-[500px]" title={getCpvDescription(match.cpv_code)}>
                    {getCpvDescription(match.cpv_code)}
                  </p>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-none mb-0.5">{t('value')}</p>
                        <p className="text-sm font-semibold text-gray-800 tabular-nums">{formatValue(match.estimated_value, match.currency)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-none mb-0.5">{t('region')}</p>
                        <p className="text-sm font-semibold text-gray-800 uppercase">{match.country}</p>
                      </div>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-1.5">
                      {reasons.map((cat: any, i: number) => (
                        <div
                          key={i}
                          title={cat.label}
                          className={`w-8 h-8 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center hover:scale-110 transition-transform cursor-help`}
                        >
                          {cat.icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex flex-row md:flex-col items-center justify-center gap-2 p-4 border-t md:border-t-0 md:border-l border-gray-100">
                  <Link
                    href={`/tenders/${match.tender_uuid}`}
                    className="flex-1 md:flex-none w-full md:w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-teal-700 transition-all group/btn"
                    title={t('viewReport')}
                  >
                    <ArrowRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
