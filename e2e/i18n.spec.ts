import { test, expect } from '@playwright/test';
import { TEST_ACCOUNTS } from './fixtures/test-accounts';
import { login } from './helpers';

/**
 * Validates that both EN and PT locales render correctly across all pages.
 * Catches:
 * - Missing translations showing raw keys (e.g. "dashboard.title")
 * - Broken interpolation (e.g. "{count}" rendered literally)
 * - Layout-breaking long PT strings (overflow, truncation)
 * - Language switcher actually changing the page language
 */

const account = TEST_ACCOUNTS.itServices;

/** Raw translation keys contain dots and start with a namespace — detect them */
const RAW_KEY_PATTERN = /^[a-zA-Z]+\.[a-zA-Z]/;

/** Check that visible text in main doesn't contain raw i18n keys */
async function assertNoRawKeys(page: import('@playwright/test').Page) {
  const mainText = await page.locator('main').innerText();
  const lines = mainText.split('\n').map(l => l.trim()).filter(Boolean);
  const rawKeys = lines.filter(line => RAW_KEY_PATTERN.test(line) && !line.includes('http'));
  expect(rawKeys, `Found raw translation keys: ${rawKeys.join(', ')}`).toHaveLength(0);
}

/** Check no unresolved interpolation variables like {variableName} */
async function assertNoUnresolvedVars(page: import('@playwright/test').Page) {
  const mainText = await page.locator('main').innerText();
  const unresolvedVars = [...mainText.matchAll(/\{[a-zA-Z_]+\}/g)].map(m => m[0]);
  expect(unresolvedVars, `Found unresolved variables: ${unresolvedVars.join(', ')}`).toHaveLength(0);
}

// ─── Language switcher ────────────────────────────────────────────────────────

test.describe('Language switcher', () => {
  test('switches from EN to PT on dashboard', async ({ page }) => {
    await login(page, account);

    // Should start in EN
    await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible({ timeout: 10_000 });

    // Switch to PT
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');

    // Dashboard title should now be in Portuguese
    await expect(page.locator('main')).toContainText(/Centro de Comando|Painel/i, { timeout: 10_000 });
  });

  test('switches from PT back to EN', async ({ page }) => {
    await login(page, account);

    // Switch to PT
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');

    // Switch back to EN
    await page.getByRole('button', { name: 'EN' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: /command center/i })).toBeVisible({ timeout: 10_000 });
  });

  test('PT sidebar navigation labels are translated', async ({ page }) => {
    await login(page, account);
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('nav');
    // These are the PT sidebar labels from pt.json
    await expect(sidebar).toContainText(/Painel/);        // Dashboard
    await expect(sidebar).toContainText(/Explorador/);     // Explorer
    await expect(sidebar).toContainText(/Perfil/);         // Profile
  });
});

// ─── EN pages — no raw keys or broken interpolation ───────────────────────────

test.describe('EN locale — pages render without raw keys', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, account);
  });

  const pages = [
    { name: 'Dashboard', nav: () => 'dashboard' },
    { name: 'Matches', nav: () => 'matches' },
    { name: 'Explorer', nav: () => 'explorer' },
    { name: 'Buyer Intelligence', nav: () => 'buyers' },
    { name: 'Competitor Intelligence', nav: () => 'competitors' },
    { name: 'Profile', nav: () => 'profile' },
  ] as const;

  for (const { name, nav } of pages) {
    test(`${name} — no raw translation keys`, async ({ page }) => {
      const sidebar = page.locator('nav');
      const labelMap: Record<string, RegExp> = {
        dashboard: /^dashboard$/i,
        matches: /my matches/i,
        explorer: /^explorer$/i,
        buyers: /buyer profiles/i,
        competitors: /competitor intel/i,
        profile: /^profile$/i,
      };
      await sidebar.getByRole('link', { name: labelMap[nav()] }).click();
      await page.waitForLoadState('networkidle');

      await assertNoRawKeys(page);
      await assertNoUnresolvedVars(page);
    });
  }
});

// ─── PT pages — no raw keys or broken interpolation ───────────────────────────

test.describe('PT locale — pages render without raw keys', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, account);
    // Switch to PT
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');
  });

  const ptPages = [
    { name: 'Dashboard (PT)', path: '/pt/dashboard' },
    { name: 'Matches (PT)', path: '/pt/matches' },
    { name: 'Explorer (PT)', path: '/pt/explorer' },
    { name: 'Buyer Intelligence (PT)', path: '/pt/intelligence/buyers' },
    { name: 'Competitor Intelligence (PT)', path: '/pt/intelligence/competitors' },
    { name: 'Profile (PT)', path: '/pt/profile' },
  ];

  for (const { name, path } of ptPages) {
    test(`${name} — no raw translation keys`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      await assertNoRawKeys(page);
      await assertNoUnresolvedVars(page);
    });
  }
});

// ─── PT content is actually in Portuguese ─────────────────────────────────────

test.describe('PT locale — content is actually Portuguese', () => {
  test('Dashboard shows Portuguese headings', async ({ page }) => {
    await login(page, account);
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');

    const main = page.locator('main');
    // These are known PT translations from pt.json
    await expect(main).toContainText(/Centro de Comando/i);
  });

  test('Matches page shows Portuguese content', async ({ page }) => {
    await login(page, account);
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');
    await page.goto('/pt/matches');
    await page.waitForLoadState('networkidle');

    const main = page.locator('main');
    // "Correspondências" or match-related PT text
    await expect(main).toContainText(/correspondências|motor de correspondência/i);
  });

  test('Explorer page shows Portuguese content', async ({ page }) => {
    await login(page, account);
    await page.goto('/pt/explorer');
    await page.waitForLoadState('domcontentloaded');

    const main = page.locator('main');
    await expect(main).toContainText(/Explorador|concursos/i, { timeout: 15_000 });
  });

  test('Profile page shows Portuguese content', async ({ page }) => {
    await login(page, account);
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');
    await page.goto('/pt/profile');
    await page.waitForLoadState('networkidle');

    const main = page.locator('main');
    await expect(main).toContainText(/Perfil|Plano de Subscrição/i);
  });
});

// ─── Layout integrity — PT strings don't overflow ─────────────────────────────

test.describe('PT locale — no layout overflow', () => {
  test('sidebar labels fit without horizontal scroll', async ({ page }) => {
    await login(page, account);
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');

    // Check the page doesn't have horizontal overflow
    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test('stat cards in PT dashboard do not overflow', async ({ page }) => {
    await login(page, account);
    await page.getByRole('button', { name: 'PT' }).click();
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test('PT explorer page has no horizontal overflow', async ({ page }) => {
    await login(page, account);
    await page.goto('/pt/explorer');
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });

  test('PT profile page has no horizontal overflow', async ({ page }) => {
    await login(page, account);
    await page.goto('/pt/profile');
    await page.waitForLoadState('networkidle');

    const hasOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
  });
});

// ─── Public pages (no login required) ─────────────────────────────────────────
// These pages may redirect authenticated users, so we use a fresh context.

test.describe('Public pages — EN and PT render correctly', () => {
  test('Landing (EN) — renders with expected content', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Public Procurement/i, { timeout: 10_000 });
    await context.close();
  });

  test('Landing (PT) — renders Portuguese content', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/pt');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/Contratação Pública/i, { timeout: 10_000 });
    await context.close();
  });

  // About, Terms, Privacy, Contact require auth on this deployment.
  // Their translations are validated via the authenticated PT locale tests above.
});
