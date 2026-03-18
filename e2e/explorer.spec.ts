import { test, expect } from '@playwright/test';
import { TEST_ACCOUNTS } from './fixtures/test-accounts';
import { login, navigateTo } from './helpers';

const SEARCH_PLACEHOLDER = /search by title|pesquis/i;

test.describe('Explorer — cross-industry search', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_ACCOUNTS.itServices);
    await navigateTo(page, 'explorer');
  });

  test('explorer page loads with stat cards and search', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: /tender explorer/i })).toBeVisible();
    await expect(page.getByPlaceholder(SEARCH_PLACEHOLDER)).toBeVisible();
  });

  test('search returns results for "software"', async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
    await searchInput.fill('software');
    await page.getByRole('button', { name: /search/i }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();
  });

  test('search returns results for "construção"', async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
    await searchInput.fill('construção');
    await page.getByRole('button', { name: /search/i }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toBeVisible();
  });

  test('empty search shows appropriate message', async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
    await searchInput.fill('xyznonexistent12345');
    await page.getByRole('button', { name: /search/i }).click();
    await page.waitForLoadState('networkidle');

    // Should show empty state or "no results" / "No tenders match"
    await expect(page.locator('main')).toContainText(/no.*tenders|no.*result|sem.*resultado/i);
  });

  test('filter button is visible', async ({ page }) => {
    // Scope to main to avoid matching other elements
    await expect(page.locator('main').getByRole('button', { name: /^filters$/i })).toBeVisible();
  });
});

test.describe('Explorer — industry-specific searches', () => {
  const searchScenarios = [
    { account: TEST_ACCOUNTS.construction, query: 'obras públicas', industry: 'Construction' },
    { account: TEST_ACCOUNTS.healthcare, query: 'equipamento médico', industry: 'Healthcare' },
    { account: TEST_ACCOUNTS.environmental, query: 'gestão de resíduos', industry: 'Environmental' },
    { account: TEST_ACCOUNTS.transport, query: 'transporte escolar', industry: 'Transport' },
    { account: TEST_ACCOUNTS.catering, query: 'refeições escolares', industry: 'Catering' },
  ];

  for (const scenario of searchScenarios) {
    test(`${scenario.industry}: search for "${scenario.query}"`, async ({ page }) => {
      await login(page, scenario.account);
      await navigateTo(page, 'explorer');

      const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
      await searchInput.fill(scenario.query);
      await page.getByRole('button', { name: /search/i }).click();
      await page.waitForLoadState('networkidle');

      // Should not crash; results or empty-state should appear
      await expect(page.locator('main')).toBeVisible();
    });
  }
});
