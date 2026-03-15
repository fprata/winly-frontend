'use client';

import React, { useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from '@/navigation';

interface BackButtonProps {
  /** Where to go when there is no browser history (e.g. user opened a bookmark). */
  fallbackHref: string;
  /** Label text. */
  label: string;
  className?: string;
}

/**
 * Universal back button that always goes to the actual previous page.
 *
 * Uses `router.back()` when the user has in-app history, otherwise
 * navigates to `fallbackHref` (e.g. "/matches", "/intelligence/buyers").
 *
 * To detect whether there is in-app history we check `window.history.length`
 * and the referrer. A fresh tab / bookmark has length <= 2 and no same-origin
 * referrer, so we fall back.
 */
export function BackButton({ fallbackHref, label, className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    // history.length > 2 is a reliable heuristic:
    // - Fresh tab = 1 (the current page)
    // - Navigated once within the app = 2+
    // Some browsers start at 1, some at 2, so > 2 gives confidence.
    // We also check the referrer is same-origin as a second signal.
    const hasHistory =
      typeof window !== 'undefined' &&
      window.history.length > 2 &&
      document.referrer.includes(window.location.origin);

    if (hasHistory) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }, [router, fallbackHref]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || 'inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-blue-600 transition-colors mb-4 group'}
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </button>
  );
}
