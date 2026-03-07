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
    <div className="flex items-center gap-3">
      <button
        onClick={handleExportPdf}
        disabled={!isPro || exportingPdf}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
          ${isPro
            ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm'
            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }
        `}
      >
        {exportingPdf ? <Loader2 size={14} className="animate-spin" /> : isPro ? <FileDown size={14} /> : <Lock size={14} />}
        {exportingPdf ? t('export.exporting') : t('export.pdf')}
      </button>

      <button
        onClick={handleExportQuestions}
        disabled={!isPro || exportingQuestions}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
          ${isPro
            ? 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 shadow-sm'
            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
          }
        `}
      >
        {exportingQuestions ? <Loader2 size={14} className="animate-spin" /> : isPro ? <HelpCircle size={14} /> : <Lock size={14} />}
        {exportingQuestions ? t('export.exporting') : t('export.questions')}
      </button>

      {!isPro && (
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t('export.proOnly')}</span>
      )}
    </div>
  );
}
