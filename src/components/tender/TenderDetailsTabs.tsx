'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

interface TabConfig {
  id: string;
  label: string;
  content: ReactNode;
  badge?: { score: number; level: string } | null;
  hidden?: boolean;
}

interface TenderDetailsTabsProps {
  tabs: TabConfig[];
  riskScore?: number | null;
  riskLevel?: string | null;
}

function getRiskColor(score: number): string {
  if (score <= 3) return 'bg-emerald-500';
  if (score <= 6) return 'bg-amber-500';
  return 'bg-rose-500';
}

function getRiskTextColor(score: number): string {
  if (score <= 3) return 'text-emerald-600';
  if (score <= 6) return 'text-amber-600';
  return 'text-rose-600';
}

export function TenderDetailsTabs({ tabs, riskScore, riskLevel }: TenderDetailsTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('tenders');

  const visibleTabs = tabs.filter(tab => !tab.hidden);
  const initialTab = searchParams.get('tab') || visibleTabs[0]?.id || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && visibleTabs.some(tab => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, visibleTabs]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === visibleTabs[0]?.id) {
      params.delete('tab');
    } else {
      params.set('tab', tabId);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  };

  const activeContent = visibleTabs.find(tab => tab.id === activeTab)?.content || visibleTabs[0]?.content;

  return (
    <div className="space-y-8">
      {/* Tab Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit overflow-x-auto">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`
              px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2
              ${activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
              }
            `}
          >
            {tab.label}
            {tab.id === 'insights' && riskScore != null && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black text-white ${getRiskColor(riskScore)}`}>
                <AlertTriangle size={9} />
                {riskScore}/10
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeContent}
      </div>
    </div>
  );
}

export { getRiskColor, getRiskTextColor };
