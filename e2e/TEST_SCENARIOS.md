# E2E Test Scenarios — Multi-Industry Test Accounts

## Test Accounts Summary

| ID | Email | Company | Industry | CPV Codes | Budget Range | Tier |
|----|-------|---------|----------|-----------|-------------|------|
| itServices | test-it@winly-test.com | DigiNova Solutions Lda. | IT Services & Software | 72, 48 | 50K – 2M | **Enterprise** |
| construction | test-construction@winly-test.com | Lusitana Obras S.A. | Construction & Civil Eng. | 45, 44, 71 | 200K – 15M | **Professional** |
| healthcare | test-health@winly-test.com | MedTech Portugal Lda. | Healthcare & Medical Equip. | 33, 85 | 25K – 5M | **Professional** |
| environmental | test-environment@winly-test.com | EcoVerde Ambiente S.A. | Environmental & Waste Mgmt. | 90, 41, 71 | 100K – 10M | **Enterprise** |
| consulting | test-consulting@winly-test.com | Strategos Consultoria Lda. | Business Consulting | 79, 73, 80 | 15K – 500K | **Starter** |
| transport | test-transport@winly-test.com | TransLuso Mobilidade S.A. | Transport & Logistics | 60, 34, 50 | 50K – 8M | **Starter** |
| security | test-security@winly-test.com | Vigilis Segurança Lda. | Security & Defence | 35, 32, 51 | 10K – 1M | **Explorer** |
| catering | test-catering@winly-test.com | Sabores do Tejo Catering Lda. | Catering & Food Services | 55, 15 | 20K – 3M | **Explorer** |

Password (all accounts): `WinlyTest2026!`

---

## Test Scenario Matrix

### 1. Onboarding Flow (`onboarding.spec.ts`)

| # | Scenario | Steps | Expected Result |
|---|----------|-------|-----------------|
| 1.1 | Complete onboarding | Fill all fields with IT Services data → Submit | Redirect to /dashboard |
| 1.2 | Empty required fields | Submit without filling anything | Validation errors for company name and services |
| 1.3 | Short services text | Fill company name + 2-char services → Submit | Error: "Please provide more details" |

### 2. Matches Dashboard (`matches.spec.ts`)

| # | Scenario | Account | Expected Result |
|---|----------|---------|-----------------|
| 2.1 | Dashboard loads | Each of 8 accounts | Main content visible, no crashes |
| 2.2 | Match cards display | Each of 8 accounts | Cards show numeric score (0–100) |
| 2.3 | Stat cards render | Each of 8 accounts | Top stat section renders |
| 2.4 | IT matches relevance | itServices | Matches contain software/IT/digital terms |
| 2.5 | Construction matches | construction | Matches contain construção/obra/engenharia terms |
| 2.6 | Healthcare matches | healthcare | Matches contain médico/saúde/hospital terms |
| 2.7 | Environmental matches | environmental | Matches contain ambiente/resíduo/água terms |
| 2.8 | Consulting matches | consulting | Matches contain consultoria/formação/estudo terms |
| 2.9 | Transport matches | transport | Matches contain transporte/mobilidade/veículo terms |
| 2.10 | Security matches | security | Matches contain segurança/vigilância/CCTV terms |
| 2.11 | Catering matches | catering | Matches contain catering/refeição/alimentação terms |

### 3. Explorer Search (`explorer.spec.ts`)

| # | Scenario | Account | Query | Expected Result |
|---|----------|---------|-------|-----------------|
| 3.1 | Page loads | itServices | — | Stat cards + search input visible |
| 3.2 | Software search | itServices | "software" | Results appear |
| 3.3 | Construction search | itServices | "construção" | Results appear |
| 3.4 | No results | itServices | "xyznonexistent12345" | Empty state / "no results" |
| 3.5 | CPV filter | itServices | "serviços" + CPV filter | Results narrow |
| 3.6 | Construction query | construction | "obras públicas" | Results or empty state |
| 3.7 | Healthcare query | healthcare | "equipamento médico" | Results or empty state |
| 3.8 | Environmental query | environmental | "gestão de resíduos" | Results or empty state |
| 3.9 | Transport query | transport | "transporte escolar" | Results or empty state |
| 3.10 | Catering query | catering | "refeições escolares" | Results or empty state |

### 4. Buyer Intelligence (`intelligence.spec.ts`)

| # | Scenario | Account | Query | Expected Result |
|---|----------|---------|-------|-----------------|
| 4.1 | Page loads | itServices | — | Stat cards visible |
| 4.2 | Buyer search | itServices | "Câmara Municipal" | Results or empty state |
| 4.3 | Buyer detail click | itServices | "Lisboa" → click result | Detail view loads |

### 5. Competitor Intelligence (`intelligence.spec.ts`)

| # | Scenario | Account | Competitor | Expected Result |
|---|----------|---------|------------|-----------------|
| 5.1 | IT competitor | itServices | "Novabase" | Results visible |
| 5.2 | Construction competitor | construction | "Mota-Engil" | Results visible |
| 5.3 | Healthcare competitor | healthcare | "Siemens Healthineers" | Results visible |
| 5.4 | Catering competitor | catering | "Gertal" | Results visible |

### 6. Profile Management (`profile.spec.ts`)

| # | Scenario | Account | Action | Expected Result |
|---|----------|---------|--------|-----------------|
| 6.1 | Display profile | itServices | Navigate to profile | Company name pre-filled |
| 6.2 | Update services | consulting | Change services text → Save | Success message |
| 6.3 | Update budget | construction | Change min/max budget → Save | Success message |
| 6.4 | Invalid update | security | Clear services to <10 chars → Save | Validation error |
| 6.5–6.12 | Profile loads per industry | All 8 accounts | Navigate to profile | Company name matches account |

### 7. Subscription Tier Access Control (`tier-access.spec.ts`)

#### 7a. Tier display on profile page

| # | Scenario | Account | Expected Result |
|---|----------|---------|-----------------|
| 7.1 | Explorer tier displayed | security, catering | Profile shows "Explorer" |
| 7.2 | Starter tier displayed | consulting, transport | Profile shows "Starter" |
| 7.3 | Professional tier displayed | construction, healthcare | Profile shows "Professional" |
| 7.4 | Enterprise tier displayed | itServices, environmental | Profile shows "Enterprise" |

#### 7b. Upgrade button visibility

| # | Scenario | Account (Tier) | Expected Result |
|---|----------|----------------|-----------------|
| 7.5 | Explorer upgrade options | security (Explorer) | Sees Starter, Professional, Enterprise buttons |
| 7.6 | Starter upgrade options | consulting (Starter) | Sees Professional, Enterprise buttons; no Starter |
| 7.7 | Professional upgrade options | construction (Professional) | Sees Enterprise button only |
| 7.8 | Enterprise — no upgrades | itServices (Enterprise) | No upgrade buttons visible |

#### 7c. Feature gating — Insights paywall

| # | Scenario | Account (Tier) | Expected Result |
|---|----------|----------------|-----------------|
| 7.9 | Explorer sees paywall | catering (Explorer) | Insights tab shows upgrade prompt / blurred content |
| 7.10 | Professional sees full insights | healthcare (Professional) | Insights tab shows content without paywall |

#### 7d. Feature gating — Export actions

| # | Scenario | Account (Tier) | Expected Result |
|---|----------|----------------|-----------------|
| 7.11 | Explorer cannot export | security (Explorer) | Export button disabled or shows upgrade prompt |
| 7.12 | Enterprise can export | itServices (Enterprise) | Export button enabled |

#### 7e. Feature gating — Tender chatbot

| # | Scenario | Account (Tier) | Expected Result |
|---|----------|----------------|-----------------|
| 7.13 | Explorer cannot chat | catering (Explorer) | Chat shows tier restriction |
| 7.14 | Professional can chat | construction (Professional) | Chat input enabled, no paywall |

---

## Running the Tests

### Seed test accounts (one-time setup)

```bash
# Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npx tsx e2e/fixtures/seed-test-accounts.ts
```

### Run unit tests

```bash
npm run test
```

### Run E2E tests

```bash
# Start dev server first, then:
npx playwright test

# Run specific file:
npx playwright test e2e/matches.spec.ts

# Run specific industry:
npx playwright test -g "IT Services"

# Run with UI:
npx playwright test --ui
```

### Run in headed mode (debug)

```bash
npx playwright test --headed --project=chromium
```

---

## Test Data Dependencies

- Tests assume accounts have been seeded via `seed-test-accounts.ts`
- Match data depends on the backend matching engine having run for these profiles
- Explorer/Intelligence results depend on live tender data in Supabase
- For CI, consider mocking Supabase responses or using a staging environment
