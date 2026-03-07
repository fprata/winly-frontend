'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales } from '@/i18n';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
  };

  const labels: Record<string, string> = { en: 'EN', pt: 'PT' };

  return (
    <div className="flex gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`px-2 py-1 text-xs rounded cursor-pointer transition-all font-medium ${
            locale === loc
              ? 'text-blue-600 bg-blue-50 font-semibold'
              : 'text-zinc-400 bg-transparent hover:text-zinc-700'
          }`}
        >
          {labels[loc] || loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
