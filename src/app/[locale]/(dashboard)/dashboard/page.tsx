import React from 'react';
import { Link } from '@/navigation'
import { Bell, User, Search, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';

export default async function Dashboard() {
  const t = await getTranslations('dashboard');
  const locale = await getLocale();
  const supabase = await createClient();

  // Fetch stats server-side
  const { data: matches, error } = await supabase
    .from('tender_matches')
    .select(`
      match_score,
      tenders (estimated_value)
    `);

  let stats = { total: 0, high: 0, value: 0 };
  let status = 'online';

  if (error) {
    console.error("Dashboard stats error:", error);
    status = 'error';
  } else if (matches) {
    const high = matches.filter((m: any) => m.match_score >= 75).length;

    const totalValue = matches.reduce((acc: number, m: any) => {
      const val = Array.isArray(m.tenders) ? m.tenders[0]?.estimated_value : m.tenders?.estimated_value;
      return acc + (val || 0);
    }, 0);

    stats = {
      total: matches.length,
      high,
      value: totalValue
    };
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">{t('title')}</h1>
          <p className="text-sm text-gray-500 max-w-xl">{t('subtitle')}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 border ${
          status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            status === 'online' ? 'bg-emerald-500 animate-pulse' :
            'bg-amber-500'
          }`}></div>
          {t('systemStatus', { status: status })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <StatCard
          icon={<Bell size={18} />}
          label={t('stats.activeMatches')}
          value={stats.total}
          color="teal"
          subtitle={
            <Link href="/matches" className="inline-flex items-center gap-1.5 text-teal-600 font-medium text-sm hover:gap-2.5 transition-all">
              {t('stats.manageMatches')} <ArrowRight size={14} />
            </Link>
          }
        />

        <StatCard
          icon={<Zap size={18} />}
          label={t('stats.highConfidence')}
          value={stats.high}
          color="navy"
          subtitle={
            <span className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
              <ShieldCheck size={14} /> {t('stats.matchScore', { score: 75 })}
            </span>
          }
        />

        <StatCard
          icon={<Globe size={18} />}
          label={t('stats.pipelineValue')}
          value={new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stats.value)}
          color="amber"
          subtitle={<span className="text-amber-600 text-sm font-medium">{t('stats.aggregatedContracts')}</span>}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-900 mb-0.5">{t('priorityActions')}</h2>
        <p className="text-sm text-gray-500">{t('quickAccess')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/profile">
          <Card hover className="flex items-center gap-5 group">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <User size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 mb-0.5 group-hover:text-teal-700 transition-colors">{t('biddingProfile.title')}</h4>
              <p className="text-sm text-gray-500 truncate">{t('biddingProfile.description')}</p>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all shrink-0" />
          </Card>
        </Link>

        <Link href="/explorer">
          <Card hover className="flex items-center gap-5 group">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <Search size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 mb-0.5 group-hover:text-teal-700 transition-colors">{t('marketExplorer.title')}</h4>
              <p className="text-sm text-gray-500 truncate">{t('marketExplorer.description')}</p>
            </div>
            <ArrowRight size={18} className="text-gray-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all shrink-0" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
