'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales } from '@/i18n';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any });
  };

  const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    pt: { name: 'Português', flag: '🇵🇹' },
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-zinc-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
        <Globe size={16} className="text-zinc-600" />
        <span className="text-sm font-semibold text-zinc-700">
          {languages[locale as keyof typeof languages]?.flag} {languages[locale as keyof typeof languages]?.name}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleChange(loc)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
              locale === loc ? 'bg-blue-50 text-blue-700 font-bold' : 'text-zinc-700'
            }`}
          >
            <span className="text-xl">{languages[loc]?.flag}</span>
            <span className="font-semibold">{languages[loc]?.name}</span>
            {locale === loc && (
              <span className="ml-auto text-blue-600">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
