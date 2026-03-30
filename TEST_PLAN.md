# Winly Frontend — Comprehensive Test Plan

## Overview

This plan covers **functional testing**, **data integrity testing**, and **KPI validation** for all areas of the Winly frontend application. Tests are split into:

- **Unit tests** (Vitest) — business logic, data validation, component behavior
- **E2E tests** (Playwright) — user flows, page rendering, cross-page navigation
- **Data quality tests** — validate real/seeded data makes sense (scores, values, dates, KPIs)

---

## 1. Authentication & Authorization

### Unit Tests
- [ ] `normaliseTier()` maps all DB values correctly (free, Pro, Enterprise, legacy Starter/Professional)
- [ ] `hasAccess()` returns correct boolean for every feature × tier combination
- [ ] `isPaid()`, `isPro()`, `isEnterprise()` classification

### E2E Tests
- [ ] Login with valid credentials → redirected to dashboard
- [ ] Login with invalid credentials → error shown
- [ ] Unauthenticated user → redirected to login
- [ ] Each tier sees correct upgrade/manage buttons on profile page
- [ ] Free user sees paywall on gated features (AI insights, export, chatbot)
- [ ] Pro user can access AI insights but not chatbot/export
- [ ] Enterprise user can access all features

---

## 2. Dashboard

### E2E Tests
- [ ] Dashboard loads with 3 KPI stat cards
- [ ] Active Matches count is a non-negative integer
- [ ] High Confidence count <= Active Matches count
- [ ] Pipeline Value is formatted as EUR currency
- [ ] Pipeline Value >= 0
- [ ] Quick action links navigate to correct pages
- [ ] System status badge is visible

### Data Validation Tests
- [ ] Active Matches count matches `SELECT COUNT(*) FROM tender_matches WHERE is_active = true`
- [ ] High Confidence count matches `WHERE match_score >= 75`
- [ ] Pipeline Value equals sum of `estimated_value` from active matched tenders
- [ ] Pipeline Value is reasonable (not negative, not > €1B for a single SME)

---

## 3. Matches

### E2E Tests
- [ ] Matches page loads with match cards
- [ ] Free user sees exactly 5 unblurred matches + paywall
- [ ] Pro/Enterprise user sees full list
- [ ] Each match card displays: title, buyer, score, country, CPV, value, deadline
- [ ] Match score displays as percentage (0-100)
- [ ] Score ring color: green (>=75), amber (50-74), red (<50)
- [ ] Clicking a match card navigates to tender detail page
- [ ] Search filters matches by text
- [ ] Country filter works
- [ ] Min score slider filters correctly

### Data Validation Tests
- [ ] All match scores are in range 0-100
- [ ] Score components (score_cpv, score_strategic, etc.) are each in range 0-100
- [ ] Win probability is in range 0-1 (or 0-100)
- [ ] match_reasons is a valid pipe-separated string
- [ ] Every tender_match references a valid tender (no orphans)
- [ ] Every tender_match references a valid client (no orphans)
- [ ] Active matches only reference active tenders (is_active = true)
- [ ] Matches are sorted by score descending
- [ ] No duplicate matches (same client + same tender)

---

## 4. Explorer (Tender Search)

### E2E Tests
- [ ] Explorer page loads with tender list
- [ ] Total tenders count displayed
- [ ] "Closing This Week" count displayed and <= total active
- [ ] Search by keyword returns relevant results
- [ ] Country filter returns only tenders from selected country
- [ ] CPV filter returns tenders with matching CPV prefix
- [ ] Value range filter excludes out-of-range tenders
- [ ] Status filter: Active shows only is_active=true, Awarded shows is_active=false
- [ ] Sort by newest shows most recent publication_date first
- [ ] Pagination works (next/previous)

### Data Validation Tests
- [ ] All tenders have non-empty title and buyer_name
- [ ] All estimated_value > 0
- [ ] All CPV codes match 8-digit format (XXXXXXXX)
- [ ] All country codes are valid ISO 3166-1 alpha-2
- [ ] publication_date <= submission_deadline for active tenders
- [ ] Active tenders have submission_deadline >= today (not expired)
- [ ] Awarded tenders have final_contract_value set
- [ ] Awarded tenders have award_decision_date set
- [ ] currency is valid ISO 4217 code (EUR, GBP, etc.)
- [ ] source_system is one of known values (BASE.gov.pt, TED, etc.)

---

## 5. Tender Detail Page

### E2E Tests — Overview Tab
- [ ] Tender header shows: title, status badge, source, country, CPV, value
- [ ] Active tender shows "Active" badge with pulsing indicator
- [ ] Awarded tender shows "Awarded" badge
- [ ] Deadline countdown displayed for active tenders
- [ ] Document links are clickable (if present)
- [ ] Match score section displayed (if user has a match)
- [ ] Bidding analysis section shows target bid, avg discount, avg bidders
- [ ] Related tenders section shows up to 3 similar tenders
- [ ] Buyer intel section shows buyer name, top winners, sector stats

### E2E Tests — AI Insights Tab
- [ ] Free user sees paywall
- [ ] Pro user sees insights (or generate button)
- [ ] Enterprise user sees insights with export buttons
- [ ] Risk score hero displays score (0-100), level, risk factors
- [ ] Export PDF button triggers download (Enterprise only)

### E2E Tests — Award Tab
- [ ] Award tab visible only for awarded tenders
- [ ] Shows winner name(s) and VAT ID(s)
- [ ] Shows final contract value
- [ ] Shows award decision date
- [ ] Shows variance from estimate (% above/below)

### Data Validation Tests
- [ ] Risk score is in range 0-100
- [ ] Risk level matches score: Low (0-25), Medium (26-50), High (51-75), Critical (76-100)
- [ ] key_risk_factors is a non-empty array when risk_level != Low
- [ ] Insights locale structure is valid: has pt-PT and/or en-US keys
- [ ] final_contract_value is reasonable vs estimated_value (within 0.1x-10x range)
- [ ] winners_list entries have winner_name (non-empty string)
- [ ] award_decision_date >= publication_date
- [ ] Market benchmarks: p25 <= p50 <= p75

---

## 6. Intelligence — Market Overview

### E2E Tests
- [ ] Page loads with market-wide metrics
- [ ] Average bidder count > 0
- [ ] Average discount % is between 0-100
- [ ] Total buyers count > 0
- [ ] Sector filter changes displayed stats
- [ ] Top competitors table shows name, wins, revenue, win rate

### Data Validation Tests
- [ ] avg_bidder_count >= 1 for all sectors
- [ ] avg_discount between 0% and 80% (unrealistic above 80%)
- [ ] direct_award_pct between 0% and 100%
- [ ] Sector stats: p25_discount <= median_discount <= p75_discount
- [ ] No sector has 0 contracts (if it appears in the data)

---

## 7. Intelligence — Buyers

### E2E Tests
- [ ] Buyer list loads with default top-20
- [ ] Search returns buyers matching query (3+ chars)
- [ ] Buyer card shows: name, country, contracts, spend, discount, bidders
- [ ] Clicking buyer navigates to buyer detail
- [ ] Buyer detail shows top winners, sector stats, tender history

### Data Validation Tests
- [ ] total_contracts > 0 for every buyer in the list
- [ ] total_spend > 0 and reasonable (< €10B)
- [ ] avg_discount between 0% and 80%
- [ ] avg_bidder_count >= 1
- [ ] top_winners array is non-empty for buyers with > 5 contracts
- [ ] sector_stats CPV divisions are valid 2-digit codes
- [ ] No buyer has total_spend < sum of their individual contracts (consistency)

---

## 8. Intelligence — Competitors

### E2E Tests
- [ ] Competitor list loads with default top-20
- [ ] Search returns competitors matching query
- [ ] Competitor card shows: name, country, wins, revenue, win rate, discount
- [ ] Clicking competitor navigates to detail page
- [ ] Competitor detail shows sector performance, won tenders

### Data Validation Tests
- [ ] total_wins > 0 for every competitor in the list
- [ ] total_revenue > 0
- [ ] win_rate_pct between 0% and 100%
- [ ] avg_discount_pct between 0% and 80%
- [ ] sector_diversity >= 1
- [ ] sector_stats CPV divisions are valid 2-digit codes

---

## 9. Profile & Subscription

### E2E Tests
- [ ] Profile page displays company name, VAT, tier badge
- [ ] CPV codes are displayed correctly
- [ ] Competitors list is displayed
- [ ] Budget range shown
- [ ] Edit fields and save → success toast
- [ ] Upgrade button redirects to Lemon Squeezy checkout
- [ ] Manage Subscription button opens customer portal (paid tiers)
- [ ] Notification preferences toggle and save

### Data Validation Tests
- [ ] CPV codes are valid 2-digit divisions (01-99)
- [ ] min_budget < max_budget
- [ ] tier is one of valid values
- [ ] email is valid format
- [ ] major_competitors is a JSON array of strings

---

## 10. Checkout & Billing (Lemon Squeezy)

### Unit Tests
- [ ] Checkout route validates tier (only Pro, Enterprise accepted)
- [ ] Checkout route validates billingInterval (only month, year)
- [ ] Checkout route rejects unauthenticated requests (401)
- [ ] Webhook verifies HMAC signature correctly
- [ ] Webhook rejects invalid signature (400)
- [ ] Webhook `order_created` updates client tier in DB
- [ ] Webhook `subscription_expired` downgrades to free
- [ ] Webhook `subscription_cancelled` downgrades to free

### E2E Tests
- [ ] Free user clicks upgrade → redirected to LS checkout page
- [ ] After successful checkout → redirected to dashboard with success param
- [ ] Tier updated in profile page after payment

---

## 11. i18n & Translations

### Unit Tests (existing, verify complete)
- [ ] EN and PT have identical key sets
- [ ] No empty translation values
- [ ] Interpolation variables match between EN and PT
- [ ] No raw HTML leaked into translations
- [ ] PT translations are not identical to EN (untranslated detection)

### E2E Tests
- [ ] Language switcher toggles EN ↔ PT
- [ ] All dashboard pages render without raw i18n keys
- [ ] All public pages render in both locales
- [ ] No horizontal overflow caused by longer PT strings

---

## 12. API Routes

### Unit/Integration Tests
- [ ] `POST /api/checkout` — returns valid checkout URL for valid input
- [ ] `POST /api/checkout` — returns 401 for unauthenticated
- [ ] `POST /api/checkout` — returns 400 for invalid tier
- [ ] `POST /api/billing/portal` — returns portal URL for paid user
- [ ] `POST /api/billing/portal` — returns 404 for user with no billing account
- [ ] `POST /api/webhooks/lemonsqueezy` — processes order_created
- [ ] `POST /api/webhooks/lemonsqueezy` — rejects invalid signature
- [ ] `POST /api/contact` — sends email for valid form submission
- [ ] `GET /api/explorer/search` — returns paginated tender results
- [ ] `GET /api/intelligence/search` — returns buyer/competitor results
- [ ] `POST /api/analyze/document` — rejects free tier (403)
- [ ] `POST /api/analyze/document` — accepts Pro/Enterprise
- [ ] `POST /api/export/insights-pdf` — rejects non-Enterprise (403)
- [ ] `POST /api/chat/tender` — rejects non-Enterprise (403)

---

## 13. Security

### Unit Tests (existing, verify complete)
- [ ] `safePath()` blocks directory traversal, protocol-relative URLs, javascript:
- [ ] `isSafeUrl()` blocks localhost, private IPs, metadata endpoints
- [ ] CSP headers present on all pages
- [ ] No secrets in client-side code

---

## 14. Blog

### E2E Tests
- [ ] Blog listing page renders with post cards
- [ ] Each post card shows title, description, date, tags, reading time
- [ ] Clicking a post navigates to full article
- [ ] Blog post page renders MDX content
- [ ] Back to blog link works
- [ ] Blog renders in both EN and PT locales

---

## 15. Cross-Cutting Data Quality Checks

These tests run against seeded or real data and validate business-logic consistency:

- [ ] No tender has `estimated_value = 0` or negative
- [ ] No match has `match_score` outside 0-100
- [ ] No buyer has `avg_bidder_count < 1`
- [ ] No competitor has `win_rate_pct > 100` or negative
- [ ] All awarded tenders have `final_contract_value > 0`
- [ ] `final_contract_value / estimated_value` ratio is between 0.1 and 10 (no absurd outliers)
- [ ] Market benchmarks follow p25 <= p50 <= p75 ordering
- [ ] Risk scores map to correct risk levels
- [ ] Dashboard KPIs are internally consistent (high_confidence <= active_matches)
- [ ] Pipeline value equals sum of matched active tender values
- [ ] No tender has `submission_deadline < publication_date`
- [ ] All CPV codes in tenders table are 8-digit format
- [ ] All CPV codes in clients table are valid 2-digit divisions

---

## Test Execution

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright — requires dev server running)
npm run test:e2e

# Both (CI mode)
npm run test:ci

# Seed test data
npx tsx e2e/fixtures/seed-test-data.ts
```

## Test Accounts

See `e2e/fixtures/test-accounts.ts` for 8 industry-specific test accounts covering all 4 tiers.

## Test Data

See `e2e/fixtures/seed-test-data.ts` for seeded tenders, matches, buyer intel, and competitor intel data.
