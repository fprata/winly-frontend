"use client";

import { Link } from '@/navigation'
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-800 pt-12">
        <div className="flex flex-col gap-4">
           <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-black">W</div>
              <span className="text-xl font-bold text-slate-200 tracking-tight">WINLY<span className="text-slate-600">AI</span></span>
           </Link>
           <p className="max-w-xs text-sm text-slate-500">
             {t('tagline')}
           </p>
        </div>
        <div className="flex gap-8 text-sm font-medium">
           <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link>
           <Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link>
           <Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link>
           <Link href="/about" className="hover:text-white transition-colors">{t('about')}</Link>
        </div>
        <p className="text-sm text-slate-600">{t('copyright')}</p>
      </div>
    </footer>
  )
}