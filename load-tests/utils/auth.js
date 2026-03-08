/**
 * Supabase auth helper for k6 load tests.
 * Logs in with email/password and returns the access token.
 * Call once in setup() and pass the token to default().
 *
 * Usage:
 *   import { login } from './utils/auth.js';
 *   export function setup() { return { token: login() }; }
 *   export default function(data) { ... use data.token ... }
 */

import http from 'k6/http';
import { check } from 'k6';
import { SUPABASE_URL, SUPABASE_ANON_KEY, TEST_EMAIL, TEST_PASSWORD, SESSION_TOKEN } from './config.js';

/**
 * Returns a valid access token.
 * Priority: K6_SESSION_TOKEN env var → email/password login.
 */
export function login() {
  if (SESSION_TOKEN) return SESSION_TOKEN;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !TEST_EMAIL || !TEST_PASSWORD) {
    console.warn(
      '[auth] No credentials provided. Protected routes will return 401.\n' +
      '  Set K6_SESSION_TOKEN, or K6_EMAIL + K6_PASSWORD + NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
    return '';
  }

  const res = http.post(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    {
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
    }
  );

  check(res, { 'login 200': (r) => r.status === 200 });

  const body = res.json();
  if (!body.access_token) {
    throw new Error(`[auth] Login failed: ${res.body}`);
  }

  return body.access_token;
}

/** Returns headers with Bearer token for API calls. */
export function bearerHeaders(token) {
  if (!token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
