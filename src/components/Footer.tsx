"use client";

import { Link } from '@/navigation'
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-white border-t border-zinc-200 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-3">
           <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">W</div>
              <span className="text-xl font-bold text-zinc-900 tracking-tight">WINLY</span>
           </Link>
           <p className="max-w-xs text-sm text-zinc-500">
             {t('tagline')}
           </p>
        </div>
        <div className="flex gap-6 text-sm">
           <Link href="/privacy" className="text-zinc-500 hover:text-zinc-700 transition-colors">{t('privacy')}</Link>
           <Link href="/terms" className="text-zinc-500 hover:text-zinc-700 transition-colors">{t('terms')}</Link>
           <Link href="/cookies" className="text-zinc-500 hover:text-zinc-700 transition-colors">{t('cookies')}</Link>
           <Link href="/contact" className="text-zinc-500 hover:text-zinc-700 transition-colors">{t('contact')}</Link>
           <Link href="/blog" className="text-zinc-500 hover:text-zinc-700 transition-colors">{t('blog')}</Link>
           <Link href="/about" className="text-zinc-500 hover:text-zinc-700 transition-colors">{t('about')}</Link>
        </div>
        <p className="text-sm text-zinc-400">{t('copyright')}</p>
      </div>
    </footer>
  )
}