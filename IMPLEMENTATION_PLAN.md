# Winly Frontend — Implementation Plan

Based on the technical assessment performed on 2026-02-01.

**Last updated:** 2026-03-01

## Implementation Status

| Priority | Item | Status | Notes |
|----------|------|--------|-------|
| 1.1 | Zod validation | ✅ COMPLETED | `zod@^4.3.6` installed in package.json |
| 1.2 | Rate limiting | ⚠️ NOT STARTED | - |
| 1.3 | CSP headers | ⚠️ NOT STARTED | - |
| 1.4 | Environment vars | ⚠️ NOT STARTED | - |
| 2.1 | Test infrastructure | ✅ COMPLETED | Vitest, Playwright, configs all installed |
| 2.2 | E2E tests | ⚠️ MINIMAL | Basic test structure exists but coverage is low |
| 2.3 | Unit tests | ⚠️ MINIMAL | Vitest configured but few tests written |
| 2.4 | CI pipeline | ⚠️ NOT STARTED | - |
| 3.1 | Recharts SSR | 🟡 PARTIAL | Some components have guards, not consistent |
| 3.2 | Error boundaries | ⚠️ NOT STARTED | - |
| 3.3 | Error handling | ⚠️ NOT STARTED | - |
| 4.1 | Pagination UI | ⚠️ NOT STARTED | - |
| 4.2 | Centralize constants | ⚠️ NOT STARTED | - |
| 4.3 | Caching strategy | ⚠️ NOT STARTED | ISR not implemented |
| 4.4 | next/image | ⚠️ NOT STARTED | - |
| 5.1 | i18n strings | 🟡 PARTIAL | Chart tooltips still hardcoded |
| 5.2 | Eliminate `any` | 🟡 ONGOING | Some progress made |
| 5.3 | Split components | ⚠️ NOT STARTED | Large client components remain |
| 6.1 | Health check | ⚠️ NOT STARTED | - |
| 6.2 | Staging env | ⚠️ NOT STARTED | - |
| 6.3 | Next.js version | ✅ STABLE | Running Next.js 16.1.1 |

---

## Priority 1: Security & Data Integrity

### 1.1 Add Zod validation on all Server Actions
- Install `zod`
- Create validation schemas for: login, signup, onboarding, profile update
- Validate FormData in every Server Action before Supabase calls
- Return structured error objects instead of redirecting with query params
- Files: `login/actions.ts`, `forgot-password/actions.ts`, `update-password/actions.ts`, `OnboardingForm.tsx`, `ProfileForm.tsx`

### 1.2 Add rate limiting
- Add rate limiting middleware or utility for:
  - `/api/checkout` (POST)
  - Auth Server Actions (login, signup, forgot-password)
- Options: Vercel KV-based rate limiter, `@upstash/ratelimit`, or in-memory for dev
- Target: 5 attempts per minute for auth, 3 per minute for checkout

### 1.3 Add Content Security Policy (CSP) headers
- Configure CSP in `next.config.ts` via `headers()`
- Allow: Supabase domain, Stripe JS, Vercel Analytics, Google Fonts
- Block: inline scripts (except Next.js nonces), data: URIs for scripts

### 1.4 Harden environment variable management
- Remove `.env.local` symlink, use proper `.env.local` per project
- Create `.env.example` with all required keys (no values)
- Audit `SUPABASE_SERVICE_ROLE_KEY` usage — ensure it's only imported in webhook handler

---

## Priority 2: Reliability & Testing

### 2.1 Add test infrastructure
- Install Vitest + @testing-library/react for unit/component tests
- Install Playwright for E2E tests
- Add npm scripts: `test`, `test:e2e`, `test:ci`
- Add `vitest.config.ts` and `playwright.config.ts`

### 2.2 Write critical path E2E tests (Playwright)
- Auth flow: signup → verify email → login → redirect to dashboard
- Onboarding flow: fill form → submit → redirect to dashboard
- Payment flow: checkout session creation → Stripe redirect
- Navigation: sidebar links, locale switching

### 2.3 Write unit tests (Vitest)
- `cpv-data.ts` — getCpvDescription for various locales
- `utils/supabase/*` — client creation
- UI components — render with props, snapshot tests
- Form validation schemas (once Zod is added)

### 2.4 Add CI pipeline
- GitHub Actions workflow: lint → type-check → unit tests → E2E tests
- Run on every PR to `main`
- Block merge on failure

---

## Priority 3: Stability & Error Handling

### 3.1 Fix Recharts SSR issues globally
- Add `isMounted` guard to ALL chart components:
  - `SectorMixChart.tsx` (already done)
  - `MarketShareChart.tsx`
  - `BuyerEvolutionCharts.tsx`
  - `CompetitorEvolutionCharts.tsx`
  - `BuyerCompetitorAnalysis.tsx`
  - Any charts inside `MarketOverviewClient.tsx`
- Ensure every `ResponsiveContainer` has a parent with explicit height

### 3.2 Add React error boundaries
- Create a reusable `ErrorBoundary` client component
- Add `error.tsx` files for key route groups: `(dashboard)`, `intelligence`, `matches`, `explorer`
- Add fallback UI with retry button

### 3.3 Standardize error handling in data fetching
- Server Components: show user-friendly error state instead of empty arrays
- Client Components: use React Query `error` state consistently
- Server Actions: return `{ success, error, data }` objects instead of redirect-with-params

---

## Priority 4: Performance

### 4.1 Add pagination UI
- Implement "Load More" or infinite scroll for MatchesClient and ExplorerClient
- Use React Query `useInfiniteQuery` for cursor-based pagination
- Replace hardcoded `.limit(100)` with configurable page sizes

### 4.2 Centralize constants
- Create `src/constants/index.ts` with:
  - Query limits / page sizes
  - Color palettes
  - Recharts color arrays
  - API configuration values

### 4.3 Add caching strategy
- Set `revalidate` on server-rendered intelligence pages (e.g., 5 minutes)
- Add cache headers for market data that doesn't change frequently
- Consider ISR for public pages (landing, about, personas)

### 4.4 Use next/image
- Audit for any `<img>` tags and replace with `next/image`
- Add image optimization for any user-uploaded content or logos

---

## Priority 5: Code Quality

### 5.1 Internationalize remaining hardcoded strings
- Chart tooltip labels in `SectorMixChart.tsx` ("bidders", "contracts", "avg")
- Any remaining hardcoded strings found in components
- Use `Intl.NumberFormat` with active locale for currency formatting instead of hardcoded `€`

### 5.2 Eliminate `any` types
- Fix Recharts formatter callbacks with proper types
- Type Supabase query responses with generated types (`supabase gen types`)
- Run `tsc --noEmit` in CI to catch regressions

### 5.3 Split large client components
- Break `MarketOverviewClient` into sub-components (filters, stats, charts, tables)
- Break `MatchesClient` into sub-components (search bar, filter panel, card list)
- Only wrap interactive parts in `"use client"` — keep static layout as server components where possible

---

## Priority 6: DevOps & Observability

### 6.1 Add health check endpoint
- Create `/api/health` route that checks Supabase connectivity
- Use for uptime monitoring

### 6.2 Add staging environment
- Separate Supabase project for staging
- Vercel preview deployments with staging env vars
- Document env setup in `.env.example`

### 6.3 Consider Next.js version
- Evaluate stability of Next.js 16.1.1 vs 15.x
- If encountering framework bugs, pin to latest stable 15.x release

---

## Execution Order

| Phase | Items | Focus |
|-------|-------|-------|
| Phase 1 | 1.1, 1.2, 1.3, 1.4 | Security hardening |
| Phase 2 | 3.1, 3.2, 3.3 | Stability fixes |
| Phase 3 | 2.1, 2.2, 2.3, 2.4 | Test infrastructure |
| Phase 4 | 4.1, 4.2, 4.3 | Performance |
| Phase 5 | 5.1, 5.2, 5.3 | Code quality |
| Phase 6 | 6.1, 6.2, 6.3 | DevOps |
