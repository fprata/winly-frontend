'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { useEffect, useState, Suspense, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const COOKIE_CONSENT_KEY = 'cookie-consent';

function initPostHog() {
  if (
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    !posthog.__loaded
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
    });
  }
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      ph.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(false);

  const checkConsent = useCallback(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent === 'all') {
        initPostHog();
        setConsentGiven(true);
      }
    }
  }, []);

  useEffect(() => {
    checkConsent();

    function handleConsentUpdate() {
      checkConsent();
    }

    window.addEventListener('cookie-consent-updated', handleConsentUpdate);
    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
    };
  }, [checkConsent]);

  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || !consentGiven) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
