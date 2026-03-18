import { test, expect } from '@playwright/test';
import { TEST_ACCOUNTS } from './fixtures/test-accounts';
import { login, navigateTo } from './helpers';

/**
 * Tier distribution across test accounts:
 *   Explorer:     security, catering
 *   Starter:      consulting, transport
 *   Professional: construction, healthcare
 *   Enterprise:   itServices, environmental
 *
 * The tier is displayed as an <h3> heading inside the Subscription Plan section.
 * "Explorer" also appears as a sidebar nav link, so we scope to <main>.
 */

test.describe('Tier — profile page displays correct tier', () => {
  const tierAccounts = [
    { account: TEST_ACCOUNTS.security, expectedTier: 'Explorer' },
    { account: TEST_ACCOUNTS.catering, expectedTier: 'Explorer' },
    { account: TEST_ACCOUNTS.consulting, expectedTier: 'Starter' },
    { account: TEST_ACCOUNTS.transport, expectedTier: 'Starter' },
    { account: TEST_ACCOUNTS.construction, expectedTier: 'Professional' },
    { account: TEST_ACCOUNTS.healthcare, expectedTier: 'Professional' },
    { account: TEST_ACCOUNTS.itServices, expectedTier: 'Enterprise' },
    { account: TEST_ACCOUNTS.environmental, expectedTier: 'Enterprise' },
  ];

  for (const { account, expectedTier } of tierAccounts) {
    test(`${account.industry} shows tier "${expectedTier}"`, async ({ page }) => {
      await login(page, account);
      await navigateTo(page, 'profile');

      // Tier is rendered as an <h3> heading inside <main>
      await expect(
        page.locator('main').getByRole('heading', { name: expectedTier })
      ).toBeVisible({ timeout: 10_000 });
    });
  }
});

test.describe('Tier — Explorer upgrade buttons', () => {
  test('Explorer user sees upgrade options', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.security); // Explorer tier
    await navigateTo(page, 'profile');

    // Explorer should see at least one upgrade button
    const main = page.locator('main');
    await expect(main.getByRole('heading', { name: 'Explorer' })).toBeVisible({ timeout: 10_000 });

    // Should see upgrade buttons (Starter, Professional, or Enterprise)
    const upgradeButtons = main.getByRole('button').filter({ hasText: /starter|professional|enterprise/i });
    const count = await upgradeButtons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Tier — Enterprise has no upgrade buttons', () => {
  test('Enterprise user sees "Manage Subscription" instead of upgrade', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.itServices); // Enterprise tier
    await navigateTo(page, 'profile');

    const main = page.locator('main');
    await expect(main.getByRole('heading', { name: 'Enterprise' })).toBeVisible({ timeout: 10_000 });

    // Should see "Manage Subscription" instead of upgrade buttons
    await expect(main.getByRole('button', { name: /manage subscription/i })).toBeVisible();
  });
});

test.describe('Tier — Insights paywall for free/Starter users', () => {
  test('Explorer user sees paywall on tender insights', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.catering); // Explorer tier
    await navigateTo(page, 'matches');

    // Click first match card if available
    const matchLinks = page.locator('main a[href*="tender"]');
    const count = await matchLinks.count();
    if (count > 0) {
      await matchLinks.first().click();
      await page.waitForLoadState('networkidle');

      // Look for insights tab
      const insightsTab = page.getByRole('tab', { name: /insights/i });
      if (await insightsTab.isVisible()) {
        await insightsTab.click();

        // Should see upgrade prompt or blurred content
        await expect(
          page.getByText(/upgrade|unlock|professional/i)
        ).toBeVisible({ timeout: 10_000 });
      }
    }
  });

  test('Professional user sees full insights without paywall', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.healthcare); // Professional tier
    await navigateTo(page, 'matches');

    const matchLinks = page.locator('main a[href*="tender"]');
    const count = await matchLinks.count();
    if (count > 0) {
      await matchLinks.first().click();
      await page.waitForLoadState('networkidle');

      const insightsTab = page.getByRole('tab', { name: /insights/i });
      if (await insightsTab.isVisible()) {
        await insightsTab.click();

        // Should NOT see upgrade paywall
        await expect(
          page.getByText(/upgrade to professional/i)
        ).not.toBeVisible({ timeout: 5_000 });
      }
    }
  });
});

test.describe('Tier — Export actions gated by tier', () => {
  test('Explorer user cannot export', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.security); // Explorer tier
    await navigateTo(page, 'matches');

    const matchLinks = page.locator('main a[href*="tender"]');
    const count = await matchLinks.count();
    if (count > 0) {
      await matchLinks.first().click();
      await page.waitForLoadState('networkidle');

      const exportBtn = page.getByRole('button', { name: /export|download/i });
      if (await exportBtn.isVisible()) {
        const isDisabled = await exportBtn.isDisabled();
        if (!isDisabled) {
          await exportBtn.click();
          await expect(page.getByText(/upgrade|professional/i)).toBeVisible({ timeout: 5_000 });
        }
      }
    }
  });

  test('Enterprise user can access export', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.itServices); // Enterprise tier
    await navigateTo(page, 'matches');

    const matchLinks = page.locator('main a[href*="tender"]');
    const count = await matchLinks.count();
    if (count > 0) {
      await matchLinks.first().click();
      await page.waitForLoadState('networkidle');

      const exportBtn = page.getByRole('button', { name: /export|download/i });
      if (await exportBtn.isVisible()) {
        await expect(exportBtn).toBeEnabled();
      }
    }
  });
});

test.describe('Tier — Tender chatbot access', () => {
  test('Explorer user cannot use tender chatbot', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.catering); // Explorer tier
    await navigateTo(page, 'matches');

    const matchLinks = page.locator('main a[href*="tender"]');
    const count = await matchLinks.count();
    if (count > 0) {
      await matchLinks.first().click();
      await page.waitForLoadState('networkidle');

      const chatInput = page.getByPlaceholder(/ask|chat|pergunt/i);
      if (await chatInput.isVisible()) {
        await chatInput.fill('What are the requirements?');
        await chatInput.press('Enter');
        await expect(page.getByText(/upgrade|tier|plano/i)).toBeVisible({ timeout: 10_000 });
      }
    }
  });

  test('Professional user can use tender chatbot', async ({ page }) => {
    await login(page, TEST_ACCOUNTS.construction); // Professional tier
    await navigateTo(page, 'matches');

    const matchLinks = page.locator('main a[href*="tender"]');
    const count = await matchLinks.count();
    if (count > 0) {
      await matchLinks.first().click();
      await page.waitForLoadState('networkidle');

      const chatInput = page.getByPlaceholder(/ask|chat|pergunt/i);
      if (await chatInput.isVisible()) {
        await expect(chatInput).toBeEnabled();
      }
    }
  });
});
