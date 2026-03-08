/**
 * Smoke test — 1 VU, 30s.
 * Verifies every endpoint responds correctly before running heavier tests.
 * Run: k6 run load-tests/smoke.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from './utils/config.js';
import { login, bearerHeaders } from './utils/auth.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<5000'],
  },
};

export function setup() {
  return { token: login() };
}

export default function (data) {
  const auth = bearerHeaders(data.token);

  // ── Public / SSR pages ───────────────────────────────────────────────────
  group('SSR pages', () => {
    group('Explorer', () => {
      const res = http.get(`${BASE_URL}/en/explorer`, { headers: DEFAULT_HEADERS });
      check(res, { 'explorer 200': (r) => r.status === 200 });
    });

    group('Landing', () => {
      const res = http.get(`${BASE_URL}/en`, { headers: DEFAULT_HEADERS });
      check(res, { 'landing 200': (r) => r.status === 200 });
    });

    group('Health', () => {
      const res = http.get(`${BASE_URL}/api/health`, { headers: DEFAULT_HEADERS });
      check(res, { 'health responds': (r) => r.status !== 0 });
    });
  });

  // ── Intelligence search API ───────────────────────────────────────────────
  group('Search API', () => {
    group('competitor search', () => {
      const res = http.get(
        `${BASE_URL}/api/intelligence/search?q=meo&type=competitors`,
        { headers: DEFAULT_HEADERS }
      );
      check(res, {
        'competitor search 200': (r) => r.status === 200,
        'returns array': (r) => Array.isArray(r.json('data')),
      });
    });

    group('buyer search', () => {
      const res = http.get(
        `${BASE_URL}/api/intelligence/search?q=hospital&type=buyers`,
        { headers: DEFAULT_HEADERS }
      );
      check(res, {
        'buyer search 200': (r) => r.status === 200,
        'returns array': (r) => Array.isArray(r.json('data')),
      });
    });

    group('short query returns empty', () => {
      const res = http.get(
        `${BASE_URL}/api/intelligence/search?q=me&type=competitors`,
        { headers: DEFAULT_HEADERS }
      );
      check(res, {
        'short query 200': (r) => r.status === 200,
        'empty data': (r) => r.json('data').length === 0,
      });
    });
  });

  // ── Buyer tenders API ────────────────────────────────────────────────────
  group('Buyer tenders API', () => {
    const res = http.get(
      `${BASE_URL}/api/intelligence/buyer-tenders?buyer_name=MEO%20-%20SERVI%C3%87OS%20DE%20COMUNICA%C3%87%C3%95ES%20E%20MULTIM%C3%89DIA`,
      { headers: DEFAULT_HEADERS }
    );
    check(res, {
      'buyer-tenders 200': (r) => r.status === 200,
      'has data': (r) => Array.isArray(r.json('data')),
    });
  });

  // ── Auth-protected API routes ─────────────────────────────────────────────
  group('Protected API routes', () => {
    group('notifications/preferences', () => {
      const res = http.get(
        `${BASE_URL}/api/notifications/preferences`,
        { headers: auth }
      );
      check(res, {
        'prefs 200 or 401': (r) => [200, 401, 404].includes(r.status),
      });
    });
  });

  sleep(1);
}
