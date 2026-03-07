"use client";

import { Link } from '@/navigation'
import { useTranslations } from 'next-intl';

export function DashboardFooter() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-zinc-100 py-3 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-zinc-400">
        <p>{t('copyright')}</p>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-zinc-700 transition-colors">{t('landingPage')}</Link>
          <Link href="/contact" className="hover:text-zinc-700 transition-colors">{t('support')}</Link>
          <Link href="/terms" className="hover:text-zinc-700 transition-colors">{t('terms')}</Link>
          <Link href="/privacy" className="hover:text-zinc-700 transition-colors">{t('privacy')}</Link>
        </div>
      </div>
    </footer>
  );
}
