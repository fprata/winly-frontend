/**
 * Shared config for all load test scenarios.
 * Override BASE_URL via: K6_BASE_URL=https://winly-frontend.vercel.app k6 run smoke.js
 */

export const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:3000';

// Auth: provide a real Supabase session cookie or Bearer token.
// Get one by logging in to the app and copying the sb-* cookie,
// or set K6_SESSION_TOKEN to a valid Supabase JWT.
export const SESSION_TOKEN = __ENV.K6_SESSION_TOKEN || '';
export const SUPABASE_URL = __ENV.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = __ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const TEST_EMAIL = __ENV.K6_EMAIL || '';
export const TEST_PASSWORD = __ENV.K6_PASSWORD || '';

/**
 * Standard thresholds used across scenarios.
 * p95 < 2s for API routes, p95 < 4s for SSR pages.
 */
export const API_THRESHOLDS = {
  http_req_duration: ['p(95)<2000', 'p(99)<4000'],
  http_req_failed: ['rate<0.01'], // < 1% errors
};

export const PAGE_THRESHOLDS = {
  http_req_duration: ['p(95)<4000', 'p(99)<8000'],
  http_req_failed: ['rate<0.01'],
};

/** Build auth headers from session token (if available). */
export function authHeaders() {
  if (!SESSION_TOKEN) return {};
  return {
    Authorization: `Bearer ${SESSION_TOKEN}`,
    Cookie: `sb-access-token=${SESSION_TOKEN}`,
  };
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
