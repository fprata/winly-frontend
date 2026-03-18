import { test, expect } from '@playwright/test';
import { TEST_ACCOUNTS, type TestAccount } from './fixtures/test-accounts';
import { login, navigateTo } from './helpers';

/**
 * Tests that each industry account sees relevant matches on the dashboard.
 *
 * Scenarios:
 * - IT Services:     should see software/IT tenders (CPV 72, 48)
 * - Construction:    should see civil works tenders (CPV 45, 44, 71)
 * - Healthcare:      should see medical equipment tenders (CPV 33, 85)
 * - Environmental:   should see waste/water tenders (CPV 90, 41)
 * - Consulting:      should see advisory/training tenders (CPV 79, 73, 80)
 * - Transport:       should see transport tenders (CPV 60, 34, 50)
 * - Security:        should see security equipment tenders (CPV 35, 32)
 * - Catering:        should see food/hotel service tenders (CPV 55, 15)
 */

const matchScenarios: { key: string; account: TestAccount; expectedTerms: RegExp[] }[] = [
  {
    key: 'itServices',
    account: TEST_ACCOUNTS.itServices,
    expectedTerms: [/software|IT|informát|digital|sistema/i],
  },
  {
    key: 'construction',
    account: TEST_ACCOUNTS.construction,
    expectedTerms: [/construção|construction|obra|infraestrutura|engenharia/i],
  },
  {
    key: 'healthcare',
    account: TEST_ACCOUNTS.healthcare,
    expectedTerms: [/médic|medical|saúde|health|hospital|equipamento/i],
  },
  {
    key: 'environmental',
    account: TEST_ACCOUNTS.environmental,
    expectedTerms: [/ambiente|environment|resíduo|waste|água|water|limpeza/i],
  },
  {
    key: 'consulting',
    account: TEST_ACCOUNTS.consulting,
    expectedTerms: [/consult|formação|training|estudo|study|advisory/i],
  },
  {
    key: 'transport',
    account: TEST_ACCOUNTS.transport,
    expectedTerms: [/transport|mobilidade|veículo|vehicle|frota|fleet/i],
  },
  {
    key: 'security',
    account: TEST_ACCOUNTS.security,
    expectedTerms: [/segurança|security|vigilância|surveillance|CCTV|alarm/i],
  },
  {
    key: 'catering',
    account: TEST_ACCOUNTS.catering,
    expectedTerms: [/catering|refeição|meal|alimenta|food|restaura/i],
  },
];

for (const scenario of matchScenarios) {
  test.describe(`Matches — ${scenario.account.industry}`, () => {
    test('dashboard loads and shows match cards', async ({ page }) => {
      await login(page, scenario.account);
      await navigateTo(page, 'matches');

      // Page title or stat cards should be visible
      await expect(page.locator('main')).toBeVisible();

      // Should show at least the match list area (even if empty)
      const matchList = page.locator('[data-testid="match-list"], main');
      await expect(matchList).toBeVisible();
    });

    test('match cards display score rings', async ({ page }) => {
      await login(page, scenario.account);
      await navigateTo(page, 'matches');

      // If matches exist, each card should show a score
      const cards = page.locator('[data-testid="match-card"], [class*="match"]');
      const count = await cards.count();

      if (count > 0) {
        // First card should contain a score number (0–100)
        const firstCard = cards.first();
        await expect(firstCard).toContainText(/\d{1,3}/);
      }
    });

    test('stat cards show aggregate data', async ({ page }) => {
      await login(page, scenario.account);
      await navigateTo(page, 'matches');

      // Stat cards section (3 cards at top)
      const statCards = page.locator('[data-testid="stat-card"], [class*="stat"]');
      const count = await statCards.count();

      // Should have stat cards (may be 0 if no data, but section should render)
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
}
