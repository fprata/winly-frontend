"use client";

import React, { useState, useEffect } from 'react';
import { Link, useRouter, usePathname } from '@/navigation'
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { getCpvDescription } from '@/utils/cpv-data';
import { PageHeader } from './ui/PageHeader';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
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
  country: string;
  cpv_code: string;
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

export function ExplorerClient({ initialTenders, initialTotal, clientId }: ExplorerClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('explorer');
  const tCommon = useTranslations('common');

  const initialQuery = searchParams.get('q') || "";
  const initialCountry = searchParams.get('country') || "All";
  const initialPage = parseInt(searchParams.get('page') || "0");

  const [query, setQuery] = useState(initialQuery);
  const [country, setCountry] = useState(initialCountry);
  const [page, setPage] = useState(initialPage);

  const pageSize = PAGINATION.DEFAULT_PAGE_SIZE;

  useEffect(() => {
    const urlQuery = searchParams.get('q') || "";
    const urlCountry = searchParams.get('country') || "All";
    const urlPage = parseInt(searchParams.get('page') || "0");

    setQuery(urlQuery);
    setCountry(urlCountry);
    setPage(urlPage);
    fetchTenders(urlQuery, urlCountry, urlPage);
  }, [searchParams]);

  const updateUrl = (newQuery: string, newCountry: string, newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery) params.set('q', newQuery); else params.delete('q');
    if (newCountry !== "All") params.set('country', newCountry); else params.delete('country');
    if (newPage > 0) params.set('page', newPage.toString()); else params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  const fetchTenders = async (q: string, c: string, p: number) => {
    setLoading(true);
    setError(null);

    let supabaseQuery = supabase
      .from('tenders')
      .select('*, tender_matches(match_score)', { count: 'estimated' });

    if (q) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${q}%,buyer_name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (c !== "All") {
      supabaseQuery = supabaseQuery.eq('country', c);
    }

    const { data, count, error } = await supabaseQuery
      .order('publication_date', { ascending: false })
      .range(p * pageSize, (p + 1) * pageSize - 1);

    if (error) {
      console.error("Search failed:", error);
      setError(tCommon('errorLoadingData') || "Error loading data");
      setTenders([]);
      setTotal(0);
    } else {
      setTenders(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query, country, 0);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    updateUrl(query, newCountry, 0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl(query, country, newPage);
  };

  const getScoreColor = (score: number): "emerald" | "amber" | "slate" => {
    if (score >= 70) return 'emerald';
    if (score >= 40) return 'amber';
    return 'slate';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-1.5 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-transparent text-gray-800 text-sm outline-none"
          />
        </form>
        <select
          value={country}
          onChange={e => handleCountryChange(e.target.value)}
          className="px-3.5 py-2.5 bg-transparent text-gray-600 text-sm font-medium outline-none cursor-pointer min-w-[140px]"
        >
          <option value="All">{t('allCountries')}</option>
          <option value="PT">Portugal</option>
        </select>
        <Button onClick={handleSearch} size="md">
          {t('searchButton')}
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">{t('tableInfo')}</th>
                <th className="px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">Match Score</th>
                <th className="px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-center">{t('tableValue')}</th>
                <th className="px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">{t('tableAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-gray-400 text-sm">{tCommon('loading')}</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-red-500 text-sm font-medium">
                    {error} <br/>
                    <button onClick={() => window.location.reload()} className="underline mt-2 text-red-700">{tCommon('tryAgain')}</button>
                  </td>
                </tr>
              ) : tenders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-gray-400 text-sm font-medium">{t('noResults')}</td>
                </tr>
              ) : (
                tenders.map((tender) => {
                  const match = Array.isArray(tender.tender_matches) ? tender.tender_matches[0] : null;
                  return (
                    <tr
                      key={tender.tender_id}
                      className="hover:bg-gray-50/60 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/tenders/${tender.tender_uuid}`)}
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/tenders/${tender.tender_uuid}`}
                          className="text-gray-800 font-medium line-clamp-1 group-hover:text-teal-700 transition-colors text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tender.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[11px] text-gray-400 font-medium">{tender.buyer_name}</p>
                          <span className="text-gray-200">|</span>
                          <p className="text-[11px] text-gray-400 truncate max-w-[280px]" title={getCpvDescription(tender.cpv_code)}>
                            {getCpvDescription(tender.cpv_code)}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-center gap-1">
                          {match ? (
                            <Badge color={getScoreColor(match.match_score)}>
                              {Math.round(match.match_score)}%
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-gray-300">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center font-medium text-gray-700 tabular-nums text-sm">
                        {tender.estimated_value ? `€${tender.estimated_value.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end">
                          <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all">
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-medium">{t('totalRecords', { count: total.toLocaleString() })}</p>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="ghost" size="sm" disabled={(page + 1) * pageSize >= total} onClick={() => handlePageChange(page + 1)}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
