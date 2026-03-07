'use client';

import React from 'react';
import { Target, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';

interface AwardTabProps {
  tenderId: string;
  tender: {
    winners_list: any[] | null;
    award_decision_date: string | null;
    final_contract_value: number | null;
    estimated_value: number;
    currency: string;
  };
}

export function AwardTab({ tenderId, tender }: AwardTabProps) {
  const t = useTranslations('tenders');
  const locale = useLocale();

  const formatValue = (val: number, curr: string = 'EUR') => {
    if (!val) return t('valueNotSpecified');
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'currency',
      currency: curr || 'EUR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200/60 shadow-sm p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <Target size={24} className="text-amber-600" />
          {t('awardDetails')}
        </h3>
        <div className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
          {t('completed')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Winners */}
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">{t('winningEntity')}</p>
            {tender.winners_list && tender.winners_list.length > 0 ? (
              tender.winners_list.map((winner: any, i: number) => (
                <Link key={i} href={`/intelligence/competitors?name=${encodeURIComponent(winner.winner_name)}&backUrl=${encodeURIComponent('/tenders/' + tenderId)}`} className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-amber-200 transition-all group mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-600 shadow-sm font-bold">
                    W
                  </div>
                  <div>
                    <p className="font-bold text-zinc-800 group-hover:text-amber-600 transition-colors">{winner.winner_name}</p>
                    {winner.winner_vat_id && <p className="text-xs text-zinc-500">VAT: {winner.winner_vat_id}</p>}
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 italic text-zinc-500 text-sm">
                {t('winnerDetailsUnavailable')}
              </div>
            )}
          </div>

          {/* Award Date */}
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{t('awardDate')}</p>
            <p className="text-lg font-bold text-zinc-800 flex items-center gap-2">
              <Clock size={18} className="text-zinc-400" />
              {tender.award_decision_date ? new Date(tender.award_decision_date).toLocaleDateString() : t('dateNotSpecified')}
            </p>
          </div>
        </div>

        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">{t('financialOutcome')}</p>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{t('finalContractValue')}</p>
              <p className="text-3xl font-black text-emerald-600">
                {formatValue(tender.final_contract_value || 0, tender.currency)}
              </p>
            </div>

            {tender.final_contract_value && tender.estimated_value && (
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{t('diffFromEstimate')}</p>
                <div className="flex items-center gap-2">
                  {tender.final_contract_value < tender.estimated_value ? (
                    <span className="text-emerald-600 font-bold bg-emerald-100 px-2 py-1 rounded text-xs">
                      {Math.round(((tender.estimated_value - tender.final_contract_value) / tender.estimated_value) * 100)}% {t('belowEstimate')}
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold bg-rose-100 px-2 py-1 rounded text-xs">
                      {Math.round(((tender.final_contract_value - tender.estimated_value) / tender.estimated_value) * 100)}% {t('aboveEstimate')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
