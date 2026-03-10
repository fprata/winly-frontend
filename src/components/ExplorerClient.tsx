"use client";

import React, { useState, useEffect, useRef, useMemo, useTransition } from 'react';
import { Link, useRouter, usePathname } from '@/navigation'
import { useSearchParams } from 'next/navigation';
import {
  Search as SearchIcon,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  X,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Tag,
  ArrowUpDown,
  SearchX,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getCpvDescription, CPV_DIVISIONS } from '@/utils/cpv-data';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { EmptyState } from './ui/EmptyState';
import { PAGINATION } from '@/constants';

interface Tender {
  tender_id: string;
  tender_uuid: string;
  title: string;
  buyer_name: string;
  estimated_value: number;
  currency: string;
  publication_date: string;
  submission_deadline?: string;
  country: string;
  cpv_code: string;
  is_active?: boolean;
  final_contract_value?: number;
  source_system?: string;
  procedure_documents_url?: string;
  document_urls?: string;
  tender_matches?: {
    match_score: number;
  }[];
}

interface ExplorerClientProps {
  initialTenders: Tender[];
  initialTotal: number;
  clientId: string | null;
}

const COUNTRY_OPTIONS = [
  { value: "All", label: "All Countries", labelPt: "Todos os Países" },
  { value: "PT", label: "Portugal", labelPt: "Portugal" },
  { value: "ES", label: "Spain", labelPt: "Espanha" },
  { value: "FR", label: "France", labelPt: "França" },
  { value: "DE", label: "Germany", labelPt: "Alemanha" },
  { value: "IT", label: "Italy", labelPt: "Itália" },
  { value: "NL", label: "Netherlands", labelPt: "Países Baixos" },
  { value: "BE", label: "Belgium", labelPt: "Bélgica" },
  { value: "AT", label: "Austria", labelPt: "Áustria" },
  { value: "IE", label: "Ireland", labelPt: "Irlanda" },
  { value: "PL", label: "Poland", labelPt: "Polónia" },
];

const COUNTRY_FLAGS: Record<string, string> = {
  PT: "🇵🇹", ES: "🇪🇸", FR: "🇫🇷", DE: "🇩🇪", IT: "🇮🇹",
  NL: "🇳🇱", BE: "🇧🇪", AT: "🇦🇹", IE: "🇮🇪", PL: "🇵🇱",
  UK: "🇬🇧", GR: "🇬🇷", SE: "🇸🇪", DK: "🇩🇰", FI: "🇫🇮",
  CZ: "🇨🇿", RO: "🇷🇴", HU: "🇭🇺", BG: "🇧🇬", HR: "🇭🇷",
  LU: "🇱🇺", SK: "🇸🇰", SI: "🇸🇮", LT: "🇱🇹", LV: "🇱🇻",
  EE: "🇪🇪", CY: "🇨🇾", MT: "🇲🇹",
};

function getCountryFlag(code: string): string {
  return COUNTRY_FLAGS[code] || "🌍";
}

function getDaysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function getDaysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function ExplorerClient({ initialTenders, initialTotal, clientId }: ExplorerClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [total, setTotal] = useState(initialTotal);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isFirstRender = useRef(true);
  const t = useTranslations('explorer');
  const tCommon = useTranslations('common');

  const initialQuery = searchParams.get('q') || "";
  const initialCountry = searchParams.get('country') || "All";
  const initialCpv = searchParams.get('cpv') || "All";
  const initialMinValue = searchParams.get('minValue') || "";
  const initialMaxValue = searchParams.get('maxValue') || "";
  const initialStatus = searchParams.get('status') || "All";
  const initialSort = searchParams.get('sort') || "newest";
  const initialPage = parseInt(searchParams.get('page') || "0");

  const [query, setQuery] = useState(initialQuery);
  const [country, setCountry] = useState(initialCountry);
  const [cpv, setCpv] = useState(initialCpv);
  const [minValue, setMinValue] = useState(initialMinValue);
  const [maxValue, setMaxValue] = useState(initialMaxValue);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [showFilters, setShowFilters] = useState(false);

  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;

  // Count active filters (excluding defaults)
  const activeFilterCount = useMemo(() => [
    country !== "All",
    cpv !== "All",
    minValue !== "",
    maxValue !== "",
    status !== "All",
  ].filter(Boolean).length, [country, cpv, minValue, maxValue, status]);

  // Sync tenders when server provides fresh data (after navigation)
  useEffect(() => {
    setTenders(initialTenders);
    setTotal(initialTotal);
  }, [initialTenders, initialTotal]);

  // Sync filter UI state from URL (for browser back/forward)
  useEffect(() => {
    setQuery(searchParams.get('q') || "");
    setCountry(searchParams.get('country') || "All");
    setCpv(searchParams.get('cpv') || "All");
    setMinValue(searchParams.get('minValue') || "");
    setMaxValue(searchParams.get('maxValue') || "");
    setStatus(searchParams.get('status') || "All");
    setSort(searchParams.get('sort') || "newest");
    setPage(parseInt(searchParams.get('page') || "0"));

    // On mount the server already provided data — skip the extra client fetch
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  }, [searchParams]);

  const updateUrl = (
    newQuery: string, newCountry: string, newCpv: string,
    newMinValue: string, newMaxValue: string, newStatus: string,
    newSort: string, newPage: number
  ) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCountry !== "All") params.set('country', newCountry);
    if (newCpv !== "All") params.set('cpv', newCpv);
    if (newMinValue) params.set('minValue', newMinValue);
    if (newMaxValue) params.set('maxValue', newMaxValue);
    if (newStatus !== "All") params.set('status', newStatus);
    if (newSort !== "newest") params.set('sort', newSort);
    if (newPage > 0) params.set('page', newPage.toString());

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query, country, cpv, minValue, maxValue, status, sort, 0);
  };

  const applyFilters = () => {
    updateUrl(query, country, cpv, minValue, maxValue, status, sort, 0);
  };

  const clearFilters = () => {
    setCountry("All");
    setCpv("All");
    setMinValue("");
    setMaxValue("");
    setStatus("All");
    setSort("newest");
    updateUrl(query, "All", "All", "", "", "All", "newest", 0);
  };

  const removeFilter = (filter: string) => {
    const newCountry = filter === "country" ? "All" : country;
    const newCpv = filter === "cpv" ? "All" : cpv;
    const newMinValue = filter === "minValue" ? "" : minValue;
    const newMaxValue = filter === "maxValue" ? "" : maxValue;
    const newStatus = filter === "status" ? "All" : status;
    updateUrl(query, newCountry, newCpv, newMinValue, newMaxValue, newStatus, sort, 0);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(query, country, cpv, minValue, maxValue, status, sort, newPage);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    updateUrl(query, country, cpv, minValue, maxValue, status, newSort, 0);
  };

  const getScoreColor = (score: number): "green" | "amber" | "zinc" => {
    if (score >= 70) return 'green';
    if (score >= 40) return 'amber';
    return 'zinc';
  };

  const getTenderStatus = (tender: Tender): { label: string; color: "green" | "amber" | "zinc" } => {
    if (tender.final_contract_value) return { label: t('awarded'), color: 'amber' };
    if (tender.is_active) return { label: t('active'), color: 'green' };
    return { label: t('inactive'), color: 'zinc' };
  };

  const totalPages = Math.ceil(total / pageSize);
  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  const cpvOptions = useMemo(() => CPV_DIVISIONS.map(d => ({
    value: d.value,
    label: locale === 'pt' ? d.label_pt : d.label,
  })), [locale]);

  // Active filter chips
  const filterChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (country !== "All") {
      const c = COUNTRY_OPTIONS.find(o => o.value === country);
      chips.push({ key: "country", label: c ? (locale === 'pt' ? c.labelPt : c.label) : country });
    }
    if (cpv !== "All") {
      const div = cpvOptions.find(o => o.value === cpv);
      chips.push({ key: "cpv", label: div ? div.label : cpv });
    }
    if (minValue) chips.push({ key: "minValue", label: `≥ €${Number(minValue).toLocaleString()}` });
    if (maxValue) chips.push({ key: "maxValue", label: `≤ €${Number(maxValue).toLocaleString()}` });
    if (status !== "All") chips.push({ key: "status", label: status === "active" ? t('active') : status === "inactive" ? t('inactive') : t('awarded') });
    return chips;
  }, [country, cpv, cpvOptions, minValue, maxValue, status, locale, t]);

  // Stat calculations
  const closingThisWeek = useMemo(() => tenders.filter(tender => {
    if (!tender.submission_deadline) return false;
    const days = getDaysUntil(tender.submission_deadline);
    return days >= 0 && days <= 7;
  }).length, [tenders]);

  const totalValue = useMemo(() => tenders.reduce((sum, t) => sum + (t.estimated_value || 0), 0), [tenders]);

  const formatTotalValue = (val: number) => {
    if (val >= 1_000_000_000) return `€${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `€${(val / 1_000_000).toFixed(1)}M`;
    return `€${(val / 1_000).toFixed(0)}K`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <header className="flex flex-wrap justify-between items-start mb-7 gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-zinc-950 leading-none mb-1">{t('title')}</h1>
          <p className="text-[14px] text-zinc-500">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {total > 0 ? t('liveFeedActive', { total: total.toLocaleString() }) : t('liveFeed')}
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-zinc-500">{t('totalActive') || 'Total Active'}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe size={16} />
            </div>
          </div>
          <div className="text-[32px] font-bold tracking-tight text-zinc-900 leading-none">{total.toLocaleString()}</div>
          <div className="mt-2 text-[13px] text-zinc-500">
            {tenders.length > 0 ? t('newToday', { count: tenders.filter(td => getDaysAgo(td.publication_date) === 0).length }) : t('acrossAllMarkets')}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-zinc-500">{t('closingThisWeek') || 'Closing This Week'}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-[32px] font-bold tracking-tight text-amber-600 leading-none">{closingThisWeek}</div>
          <div className="mt-2 text-[13px] text-zinc-500">{t('deadlinesIn7Days') || 'Deadlines in 7 days'}</div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-zinc-500">{t('totalValue') || 'Total Value'}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-[32px] font-bold tracking-tight text-zinc-900 leading-none">{formatTotalValue(totalValue)}</div>
          <div className="mt-2 text-[13px] text-zinc-500">{t('acrossActiveTenders') || 'Across active tenders'}</div>
        </div>
      </div>

      {/* Section title + Controls */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[18px] font-bold text-zinc-900">{t('allTenders') || 'All Tenders'}</h2>
      </div>

      {/* Search Bar */}
      <Card className="p-2 mb-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-wrap">
          <Input
            icon={<SearchIcon size={18} />}
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="border-0 shadow-none focus:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <SlidersHorizontal size={14} />
            {t('filters')}
            {activeFilterCount > 0 && (
              <span className="bg-white text-zinc-900 text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <Button onClick={handleSearch} size="md">
            {t('searchButton')}
          </Button>
        </form>

        {/* Collapsible Filters Panel */}
        {showFilters && (
          <div className="border-t border-zinc-100 p-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Country */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  {t('allCountries').replace('All ', '')}
                </label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 outline-none focus:border-blue-300 transition-all"
                >
                  {COUNTRY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {locale === 'pt' ? opt.labelPt : opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* CPV Sector */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  {t('sector')}
                </label>
                <select
                  value={cpv}
                  onChange={e => setCpv(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="All">{t('allSectors')}</option>
                  {cpvOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label.length > 50 ? opt.label.slice(0, 50) + '…' : opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value Range */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  {t('valueRange')}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder={t('minValue')}
                    value={minValue}
                    onChange={e => setMinValue(e.target.value)}
                    className="w-1/2 px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 outline-none focus:border-blue-300 transition-all"
                  />
                  <input
                    type="number"
                    placeholder={t('maxValue')}
                    value={maxValue}
                    onChange={e => setMaxValue(e.target.value)}
                    className="w-1/2 px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 outline-none focus:border-blue-300 transition-all"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  {t('status')}
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="All">{t('allStatuses')}</option>
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="awarded">{t('awarded')}</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                  {t('sortBy')}
                </label>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 outline-none focus:border-blue-300 transition-all"
                >
                  <option value="newest">{t('sortNewest')}</option>
                  <option value="valueDesc">{t('sortValueDesc')}</option>
                  <option value="valueAsc">{t('sortValueAsc')}</option>
                  <option value="matchScore">{t('sortMatchScore')}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-zinc-100">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  {t('clearFilters')}
                </button>
              )}
              <Button onClick={applyFilters} size="sm">
                {t('searchButton')}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Active Filter Chips + Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterChips.map(chip => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg"
            >
              {chip.label}
              <button onClick={() => removeFilter(chip.key)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
          {filterChips.length > 1 && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors ml-1"
            >
              {t('clearFilters')}
            </button>
          )}
        </div>
        {total > 0 && !isPending && (
          <p className="text-xs text-zinc-400 font-medium">
            {t('showingResults', { from: from.toLocaleString(), to: to.toLocaleString(), total: total.toLocaleString() })}
          </p>
        )}
      </div>

      {/* Sort Quick Toggle (visible when filters hidden) */}
      {!showFilters && (
        <div className="flex items-center justify-end gap-2 mb-4">
          <ArrowUpDown size={12} className="text-zinc-400" />
          <select
            value={sort}
            onChange={e => handleSortChange(e.target.value)}
            className="text-xs font-medium text-zinc-500 bg-transparent outline-none cursor-pointer"
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="valueDesc">{t('sortValueDesc')}</option>
            <option value="valueAsc">{t('sortValueAsc')}</option>
            <option value="matchScore">{t('sortMatchScore')}</option>
          </select>
        </div>
      )}

      {/* Results */}
      {isPending ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-zinc-200 p-6 animate-pulse">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-zinc-100 rounded-lg w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-3 bg-zinc-100 rounded w-32" />
                    <div className="h-3 bg-zinc-100 rounded w-24" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-zinc-50 rounded-lg w-20" />
                    <div className="h-5 bg-zinc-50 rounded-lg w-16" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-5 bg-zinc-100 rounded-lg w-24 ml-auto" />
                  <div className="h-3 bg-zinc-50 rounded w-16 ml-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-rose-200 p-8 text-center">
          <p className="text-sm font-medium text-rose-600 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs font-bold text-rose-700 underline hover:no-underline"
          >
            {tCommon('tryAgain')}
          </button>
        </div>
      ) : tenders.length === 0 ? (
        <EmptyState
          icon={<SearchX size={36} />}
          title={t('noResults')}
          subtitle={t('noResultsHint')}
          action={activeFilterCount > 0 ? (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-xl hover:bg-zinc-200 transition-all"
            >
              {t('clearFilters')}
            </button>
          ) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {tenders.map((tender) => {
            const match = Array.isArray(tender.tender_matches) ? tender.tender_matches[0] : null;
            const tenderStatus = getTenderStatus(tender);
            const daysAgo = tender.publication_date ? getDaysAgo(tender.publication_date) : null;
            const daysUntilDeadline = tender.submission_deadline ? getDaysUntil(tender.submission_deadline) : null;
            const cpvLabel = getCpvDescription(tender.cpv_code, locale);

            return (
              <div
                key={tender.tender_id}
                className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => router.push(`/tenders/${tender.tender_uuid}?backUrl=${encodeURIComponent(pathname)}`)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  {/* Left: Tender Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/tenders/${tender.tender_uuid}?backUrl=${encodeURIComponent(pathname)}`}
                      className="text-[17px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {tender.title}
                    </Link>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                        <Building2 size={12} className="text-zinc-400 shrink-0" />
                        <span className="truncate max-w-[140px] sm:max-w-[200px]">{tender.buyer_name}</span>
                      </span>
                      <span className="text-zinc-200">·</span>
                      <span className="text-xs text-zinc-500">
                        {getCountryFlag(tender.country)} {tender.country}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {/* CPV Badge */}
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase border border-purple-100 truncate max-w-[220px]" title={cpvLabel}>
                        <Tag size={10} className="shrink-0" />
                        {cpvLabel.length > 35 ? cpvLabel.slice(0, 35) + '…' : cpvLabel}
                      </span>

                      {/* Status Badge */}
                      <Badge color={tenderStatus.color}>
                        {tenderStatus.label}
                      </Badge>

                      {/* Match Score */}
                      {match && (
                        <Badge color={getScoreColor(match.match_score)}>
                          {Math.round(match.match_score)}% {t('matchScore').toLowerCase()}
                        </Badge>
                      )}

                      {/* Publication Date */}
                      {daysAgo !== null && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400">
                          <Calendar size={10} />
                          {daysAgo === 0 ? t('publishedToday') : t('publishedAgo', { days: daysAgo })}
                        </span>
                      )}

                      {/* Deadline */}
                      {daysUntilDeadline !== null && (
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                          daysUntilDeadline <= 0 ? 'text-rose-500' :
                          daysUntilDeadline <= 7 ? 'text-amber-500' : 'text-zinc-400'
                        }`}>
                          <Clock size={10} />
                          {daysUntilDeadline <= 0 ? t('deadlineExpired') : t('deadlineIn', { days: daysUntilDeadline })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Value + Action */}
                  <div className="flex sm:flex-col sm:text-right sm:shrink-0 items-center sm:items-end justify-between sm:justify-between gap-3 sm:gap-2">
                    <div>
                      <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        {tender.final_contract_value ? t('finalValue') : t('estValue')}
                      </div>
                      <div className={`text-[17px] sm:text-[20px] font-extrabold leading-tight tabular-nums ${tender.final_contract_value ? 'text-emerald-600' : 'text-zinc-900'}`}>
                        {(tender.final_contract_value || tender.estimated_value)
                          ? `€${((tender.final_contract_value || tender.estimated_value) as number).toLocaleString()}`
                          : <span className="text-sm text-zinc-300 font-medium">{t('noValue')}</span>
                        }
                      </div>
                      {tender.final_contract_value && tender.estimated_value && (
                        <div className="text-xs text-zinc-400 line-through">€{tender.estimated_value.toLocaleString()} {t('estAbbrev')}</div>
                      )}
                    </div>
                    <div className="flex justify-end shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && !isPending && (
        <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-zinc-200 shadow-sm px-5 py-3">
          <p className="text-xs text-zinc-400 font-medium">
            {t('pageOf', { current: page + 1, total: totalPages })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft size={14} className="mr-1" />
              {t('previous')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={(page + 1) * pageSize >= total}
              onClick={() => handlePageChange(page + 1)}
            >
              {t('next')}
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
