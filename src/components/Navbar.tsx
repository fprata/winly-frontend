'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('nav');

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">W</div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">WINLY<span className="text-zinc-400 font-medium">AI</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/about" className="hidden md:block text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">{t('about')}</Link>
          <Link href="/contact" className="hidden md:block text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">{t('contact')}</Link>
          <LanguageSwitcher />
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">{t('login')}</Link>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all">{t('getStarted')}</Link>
        </div>
      </div>
    </nav>
  );
}
