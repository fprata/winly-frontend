# Test Accounts

All accounts use password: `WinlyTest2026!`

Seed them with: `npx tsx e2e/fixtures/seed-test-accounts.ts`

## By Tier

### Enterprise
| Email | Company | Industry | CPV Codes |
|-------|---------|----------|-----------|
| `test-it@winly-test.com` | DigiNova Solutions Lda. | IT Services & Software | 72, 48 |
| `test-environment@winly-test.com` | EcoVerde Ambiente S.A. | Environmental Services | 90, 41, 71 |

### Professional (normalizes to Enterprise)
| Email | Company | Industry | CPV Codes |
|-------|---------|----------|-----------|
| `test-construction@winly-test.com` | Lusitana Obras S.A. | Construction & Civil Engineering | 45, 44, 71 |
| `test-health@winly-test.com` | MedTech Portugal Lda. | Healthcare & Medical Equipment | 33, 85 |

### Starter (normalizes to Pro)
| Email | Company | Industry | CPV Codes |
|-------|---------|----------|-----------|
| `test-consulting@winly-test.com` | Strategos Consultoria Lda. | Business Consulting | 79, 73, 80 |
| `test-transport@winly-test.com` | TransLuso Mobilidade S.A. | Transport & Logistics | 60, 34, 50 |

### Explorer (free)
| Email | Company | Industry | CPV Codes |
|-------|---------|----------|-----------|
| `test-security@winly-test.com` | Vigilis Seguranca Lda. | Security & Defence | 35, 32, 51 |
| `test-catering@winly-test.com` | Sabores do Tejo Catering Lda. | Catering & Food Services | 55, 15 |

## Feature Access by Tier

| Feature | Explorer (free) | Pro (Starter) | Enterprise (Professional) |
|---------|:-:|:-:|:-:|
| Tender search | yes | yes | yes |
| Top 5 matches | yes | yes | yes |
| Unlimited matches | - | yes | yes |
| AI analysis | - | 5/month | unlimited |
| Buyer intelligence | - | yes | yes |
| Competitor intelligence | - | yes | yes |
| Market overview | - | yes | yes |
| AI chatbot | - | - | yes |
| PDF export | - | - | yes |
| Excel export | - | - | yes |

## Test Data

Seed tenders, matches, and intelligence data with:
```bash
npx tsx e2e/fixtures/seed-test-data.ts
```

This creates 15 tenders, 14 matches, 5 buyers, and 8 competitors linked to the accounts above.
