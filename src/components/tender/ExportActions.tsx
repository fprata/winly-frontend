'use client';

import React, { useState } from 'react';
import { FileDown, HelpCircle, Lock, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from '../ui/Toast';
import type { UserTier } from './types';

interface ExportActionsProps {
  tenderId: string;
  tier: UserTier;
}

export function ExportActions({ tenderId, tier }: ExportActionsProps) {
  const t = useTranslations('tenders');
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingQuestions, setExportingQuestions] = useState(false);

  const isPro = tier === 'Professional' || tier === 'Enterprise';

  const handleExportPdf = async () => {
    if (!isPro) return;
    setExportingPdf(true);
    try {
      const res = await fetch('/api/export/insights-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tender-insights-${tenderId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast('success', t('export.downloadReady'));
    } catch {
      toast('error', t('export.exportError'));
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportQuestions = async () => {
    if (!isPro) return;
    setExportingQuestions(true);
    try {
      const res = await fetch('/api/export/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenderId }),
      });
      if (!res.ok) throw new Error('Export failed');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tender-questions-${tenderId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('success', t('export.downloadReady'));
    } catch {
      toast('error', t('export.exportError'));
    } finally {
      setExportingQuestions(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-zinc-200">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <FileDown size={16} />
        </div>
        <h3 className="text-[15px] font-bold text-zinc-900">{t('export.actions') || 'Actions'}</h3>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleExportPdf}
          disabled={!isPro || exportingPdf}
          className={`h-9 px-4 rounded-lg text-[14px] font-semibold flex items-center gap-2 transition-all ${
            isPro
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }`}
        >
          {exportingPdf ? <Loader2 size={14} className="animate-spin" /> : isPro ? <FileDown size={14} /> : <Lock size={14} />}
          {exportingPdf ? t('export.exporting') : t('export.pdf')}
        </button>

        <button
          onClick={handleExportQuestions}
          disabled={!isPro || exportingQuestions}
          className={`h-9 px-4 rounded-lg text-[14px] font-semibold flex items-center gap-2 border transition-all ${
            isPro
              ? 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 shadow-sm'
              : 'bg-zinc-50 text-zinc-400 border-zinc-200 cursor-not-allowed'
          }`}
        >
          {exportingQuestions ? <Loader2 size={14} className="animate-spin" /> : isPro ? <HelpCircle size={14} /> : <Lock size={14} />}
          {exportingQuestions ? t('export.exporting') : t('export.questions')}
        </button>

        {!isPro && (
          <span className="text-[12px] text-zinc-400 font-medium">{t('export.proOnly')}</span>
        )}
      </div>
    </div>
  );
}
