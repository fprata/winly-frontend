/**
 * Soak test — 25 VUs for 30 minutes.
 * Detects memory leaks, connection pool exhaustion, and gradual degradation.
 *
 * Run: k6 run load-tests/soak.js
 * Note: Long-running — reserve for scheduled test runs.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Trend } from 'k6/metrics';
import { BASE_URL, DEFAULT_HEADERS } from './utils/config.js';
import { login, bearerHeaders } from './utils/auth.js';

// Track latency drift over time — rising p95 indicates gradual degradation
const latencyOverTime = new Trend('latency_over_time', true);

export const options = {
  stages: [
    { duration: '2m', target: 25 },   // ramp up
    { duration: '30m', target: 25 },  // hold — looking for memory leaks / drift
    { duration: '2m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.01'],
    latency_over_time: ['p(95)<3000'],
  },
};

const ENDPOINTS = [
  () => `${BASE_URL}/api/intelligence/search?q=meo&type=competitors`,
  () => `${BASE_URL}/api/intelligence/search?q=hospital&type=buyers`,
  () => `${BASE_URL}/api/intelligence/buyer-tenders?buyer_name=${encodeURIComponent('UNIVERSIDADE DE COIMBRA')}`,
  () => `${BASE_URL}/en/explorer`,
];

export function setup() {
  return { token: login() };
}

export default function (data) {
  const endpointFn = ENDPOINTS[randomIntBetween(0, ENDPOINTS.length - 1)];
  const url = endpointFn();

  const res = http.get(url, { headers: DEFAULT_HEADERS });
  latencyOverTime.add(res.timings.duration);

  check(res, { '2xx': (r) => r.status >= 200 && r.status < 300 });

  sleep(randomIntBetween(2, 5));
}
