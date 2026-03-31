'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/navigation';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept(value: 'all' | 'essential') {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setVisible(false);

    if (value === 'all') {
      window.dispatchEvent(new Event('cookie-consent-updated'));
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 text-center sm:text-left">
          We use cookies to keep you signed in and improve your experience.{' '}
          <Link href="/cookies" className="text-blue-600 hover:underline font-medium">
            Cookie Policy
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => accept('essential')}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={() => accept('all')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
