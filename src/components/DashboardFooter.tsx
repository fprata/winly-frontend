"use client";

import { Link } from '@/navigation'
import { useTranslations } from 'next-intl';

export function DashboardFooter() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-auto py-8 px-8 border-t border-slate-200/60 bg-slate-50">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
        <p>{t('copyright')}</p>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-teal-600 transition-colors">{t('landingPage')}</Link>
          <Link href="/contact" className="hover:text-teal-600 transition-colors">{t('support')}</Link>
          <Link href="/terms" className="hover:text-teal-600 transition-colors">{t('terms')}</Link>
          <Link href="/privacy" className="hover:text-teal-600 transition-colors">{t('privacy')}</Link>
        </div>
      </div>
    </footer>
  );
}
