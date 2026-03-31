'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';

export function BlogCTA() {
  const t = useTranslations('blogCta');

  return (
    <section className="mt-16 mb-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 px-8 py-10 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-3">
        {t('headline')}
      </h2>
      <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mx-auto mb-6">
        {t('subtext')}
      </p>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md hover:-translate-y-px active:translate-y-0"
      >
        {t('button')}
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}
