/**
 * Stress test — finds the breaking point by ramping to 200 VUs.
 * Focuses on the heaviest endpoints: search API + explorer SSR.
 *
 * Run: k6 run load-tests/stress.js
 * Warning: runs for ~12 minutes. Don't run against production without prior approval.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL, DEFAULT_HEADERS } from './utils/config.js';
import { login } from './utils/auth.js';

const errorRate = new Rate('error_rate');
const searchP99 = new Trend('search_p99_tracker', true);

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // warm up
    { duration: '2m', target: 100 },  // moderate stress
    { duration: '2m', target: 150 },  // high stress
    { duration: '2m', target: 200 },  // peak stress
    { duration: '2m', target: 100 },  // recovery
    { duration: '2m', target: 0 },    // ramp down
  ],
  thresholds: {
    // Stress thresholds are more lenient than load
    http_req_duration: ['p(99)<8000'],
    error_rate: ['rate<0.05'],        // Allow up to 5% errors under stress
  },
};

const QUERIES = ['meo', 'hospital', 'petrogal', 'medtronic', 'câmara', 'bayer', 'sanofi'];

export function setup() {
  return { token: login() };
}

export default function () {
  // Alternate between the two highest-traffic endpoints
  if (Math.random() < 0.6) {
    // 60% weight: search API (most common user action)
    const q = QUERIES[randomIntBetween(0, QUERIES.length - 1)];
    const type = Math.random() < 0.5 ? 'competitors' : 'buyers';
    const res = http.get(
      `${BASE_URL}/api/intelligence/search?q=${encodeURIComponent(q)}&type=${type}`,
      { headers: DEFAULT_HEADERS, tags: { type: 'api', endpoint: 'search' } }
    );
    searchP99.add(res.timings.duration);
    const ok = check(res, { 'search 200': (r) => r.status === 200 });
    errorRate.add(!ok);
  } else {
    // 40% weight: Explorer SSR page
    const res = http.get(
      `${BASE_URL}/en/explorer`,
      { headers: DEFAULT_HEADERS, tags: { type: 'page', endpoint: 'explorer' } }
    );
    const ok = check(res, { 'explorer 200': (r) => r.status === 200 });
    errorRate.add(!ok);
  }

  sleep(randomIntBetween(1, 2));
}
