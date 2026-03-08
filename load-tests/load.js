/**
 * Load test — ramps to 50 concurrent users, steady for 5 minutes.
 * Models expected production traffic patterns.
 *
 * Run: k6 run load-tests/load.js
 * Run against prod: K6_BASE_URL=https://winly-frontend.vercel.app k6 run load-tests/load.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Trend, Counter } from 'k6/metrics';
import { BASE_URL, DEFAULT_HEADERS, API_THRESHOLDS, PAGE_THRESHOLDS } from './utils/config.js';
import { login, bearerHeaders } from './utils/auth.js';

// Custom metrics
const searchLatency = new Trend('search_latency', true);
const explorerLatency = new Trend('explorer_page_latency', true);
const buyerTendersLatency = new Trend('buyer_tenders_latency', true);
const searchErrors = new Counter('search_errors');

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // ramp up to 10 VUs
    { duration: '2m', target: 50 },   // ramp up to 50 VUs
    { duration: '5m', target: 50 },   // hold at 50 VUs
    { duration: '1m', target: 0 },    // ramp down
  ],
  thresholds: {
    // API routes
    'http_req_duration{type:api}': API_THRESHOLDS.http_req_duration,
    // SSR pages
    'http_req_duration{type:page}': PAGE_THRESHOLDS.http_req_duration,
    // Custom
    search_latency: ['p(95)<1500'],
    explorer_page_latency: ['p(95)<3000'],
    buyer_tenders_latency: ['p(95)<2000'],
    // Global
    http_req_failed: ['rate<0.01'],
  },
};

// Representative search terms
const COMPETITOR_QUERIES = ['meo', 'petrogal', 'medtronic', 'bayer', 'novartis', 'sanofi'];
const BUYER_QUERIES = ['hospital', 'município', 'universidade', 'câmara', 'serviços'];
const BUYER_NAMES = [
  'MEO - SERVIÇOS DE COMUNICAÇÕES E MULTIMÉDIA',
  'UNIVERSIDADE DE COIMBRA',
  'MUNICÍPIO DE VILA NOVA DE GAIA',
];

export function setup() {
  return { token: login() };
}

export default function (data) {
  const auth = bearerHeaders(data.token);

  // Each VU randomly picks a user journey to simulate real usage patterns
  const journey = randomIntBetween(1, 4);

  if (journey === 1) {
    // Journey 1: Explorer browse
    explorerJourney();
  } else if (journey === 2) {
    // Journey 2: Competitor intelligence search
    competitorSearchJourney();
  } else if (journey === 3) {
    // Journey 3: Buyer intelligence search
    buyerSearchJourney();
  } else {
    // Journey 4: Mixed — check notifications then search
    notificationsAndSearchJourney(auth);
  }

  sleep(randomIntBetween(1, 3));
}

function explorerJourney() {
  group('explorer_journey', () => {
    const res = http.get(`${BASE_URL}/en/explorer`, {
      headers: DEFAULT_HEADERS,
      tags: { type: 'page' },
    });
    explorerLatency.add(res.timings.duration);
    check(res, { 'explorer 200': (r) => r.status === 200 });
    sleep(1);

    // Simulate navigating to a tender detail
    // (tender UUID from fixture — real test would parse the response)
    const tenderRes = http.get(
      `${BASE_URL}/en/tenders/919398aa1b10bb609c65cd0373f95464`,
      { headers: DEFAULT_HEADERS, tags: { type: 'page' } }
    );
    check(tenderRes, { 'tender detail 200': (r) => r.status === 200 });
  });
}

function competitorSearchJourney() {
  group('competitor_search_journey', () => {
    const q = COMPETITOR_QUERIES[randomIntBetween(0, COMPETITOR_QUERIES.length - 1)];

    const res = http.get(
      `${BASE_URL}/api/intelligence/search?q=${encodeURIComponent(q)}&type=competitors`,
      { headers: DEFAULT_HEADERS, tags: { type: 'api' } }
    );
    searchLatency.add(res.timings.duration);

    const ok = check(res, {
      'competitor search 200': (r) => r.status === 200,
      'has results': (r) => {
        try { return Array.isArray(r.json('data')); } catch { return false; }
      },
    });
    if (!ok) searchErrors.add(1);
  });
}

function buyerSearchJourney() {
  group('buyer_search_journey', () => {
    // Search
    const q = BUYER_QUERIES[randomIntBetween(0, BUYER_QUERIES.length - 1)];
    const searchRes = http.get(
      `${BASE_URL}/api/intelligence/search?q=${encodeURIComponent(q)}&type=buyers`,
      { headers: DEFAULT_HEADERS, tags: { type: 'api' } }
    );
    searchLatency.add(searchRes.timings.duration);
    check(searchRes, { 'buyer search 200': (r) => r.status === 200 });

    sleep(0.5);

    // Buyer tenders
    const buyer = BUYER_NAMES[randomIntBetween(0, BUYER_NAMES.length - 1)];
    const tendersRes = http.get(
      `${BASE_URL}/api/intelligence/buyer-tenders?buyer_name=${encodeURIComponent(buyer)}`,
      { headers: DEFAULT_HEADERS, tags: { type: 'api' } }
    );
    buyerTendersLatency.add(tendersRes.timings.duration);
    check(tendersRes, { 'buyer tenders 200': (r) => r.status === 200 });
  });
}

function notificationsAndSearchJourney(auth) {
  group('notifications_and_search_journey', () => {
    // Fetch notification prefs (auth-protected)
    const prefsRes = http.get(
      `${BASE_URL}/api/notifications/preferences`,
      { headers: auth, tags: { type: 'api' } }
    );
    check(prefsRes, { 'prefs 200 or 401': (r) => [200, 401, 404].includes(r.status) });

    sleep(0.5);

    // Follow up with a search
    const searchRes = http.get(
      `${BASE_URL}/api/intelligence/search?q=medtronic&type=competitors`,
      { headers: DEFAULT_HEADERS, tags: { type: 'api' } }
    );
    searchLatency.add(searchRes.timings.duration);
    check(searchRes, { 'search after prefs 200': (r) => r.status === 200 });
  });
}
