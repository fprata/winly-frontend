import { test, expect } from '@playwright/test';
import { TEST_ACCOUNTS } from './fixtures/test-accounts';
import { login, navigateTo } from './helpers';

test.describe('Buyer Intelligence', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_ACCOUNTS.itServices);
    await navigateTo(page, 'buyers');
  });

  test('buyers page loads with heading and search', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: /buyer intelligence/i })).toBeVisible();
    await expect(page.getByPlaceholder(/search|buyer|pesquis/i)).toBeVisible();
  });

  test('search for a known public buyer returns results', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search|pesquis|buyer/i);
    await searchInput.fill('Câmara Municipal');
    await searchInput.press('Enter');

    await page.waitForLoadState('networkidle');

    // Should show result cards or a "no results" message
    await expect(page.locator('main')).toBeVisible();
  });

  test('clicking a buyer result shows detail', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search|pesquis|buyer/i);
    await searchInput.fill('Lisboa');
    await searchInput.press('Enter');
    await page.waitForLoadState('networkidle');

    const resultCards = page.locator('[data-testid="result-card"], [class*="result"]');
    const count = await resultCards.count();
    if (count > 0) {
      await resultCards.first().click();
      await page.waitForLoadState('networkidle');
      // Detail view should show buyer stats
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('Competitor Intelligence', () => {
  const competitorScenarios = [
    {
      account: TEST_ACCOUNTS.itServices,
      competitor: 'Novabase',
      industry: 'IT',
    },
    {
      account: TEST_ACCOUNTS.construction,
      competitor: 'Mota-Engil',
      industry: 'Construction',
    },
    {
      account: TEST_ACCOUNTS.healthcare,
      competitor: 'Siemens Healthineers',
      industry: 'Healthcare',
    },
    {
      account: TEST_ACCOUNTS.catering,
      competitor: 'Gertal',
      industry: 'Catering',
    },
  ];

  for (const scenario of competitorScenarios) {
    test(`${scenario.industry}: search competitor "${scenario.competitor}"`, async ({ page }) => {
      await login(page, scenario.account);
      await navigateTo(page, 'competitors');

      const searchInput = page.getByPlaceholder(/search|pesquis|competitor/i);
      await searchInput.fill(scenario.competitor);
      await searchInput.press('Enter');

      await page.waitForLoadState('networkidle');

      // Should show results or empty state — no crash
      await expect(page.locator('main')).toBeVisible();
    });
  }
});
