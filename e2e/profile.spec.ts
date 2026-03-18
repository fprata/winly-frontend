import { test, expect } from '@playwright/test';
import { TEST_ACCOUNTS } from './fixtures/test-accounts';
import { login, navigateTo } from './helpers';

/**
 * Profile page structure (from snapshot):
 * - "Company Name" div label → textbox (no accessible label, value = company name)
 * - "Services & Keywords" div label → textbox (placeholder "Describe your services in detail...")
 * - "Sync Changes" button to save
 * - Subscription Plan section with tier as <h3>
 *
 * The Company Name textbox is the 2nd textbox in the General Information section
 * (1st is VAT ID with placeholder "e.g. 500123456").
 */

/** Get the Company Name input — it's the textbox right after the "Company Name" label */
function companyNameInput(page: import('@playwright/test').Page) {
  return page.locator('main').getByText('Company Name').locator('..').getByRole('textbox');
}

test.describe('Profile management', () => {
  test('displays current profile data after login', async ({ page }) => {
    const account = TEST_ACCOUNTS.itServices;
    await login(page, account);
    await navigateTo(page, 'profile');

    await expect(page.getByRole('heading', { name: /bidding profile/i })).toBeVisible({ timeout: 10_000 });

    // Company name should be in the input value
    await expect(companyNameInput(page)).toHaveValue(account.companyName, { timeout: 10_000 });
  });

  test('displays services text for logged-in account', async ({ page }) => {
    const account = TEST_ACCOUNTS.itServices;
    await login(page, account);
    await navigateTo(page, 'profile');

    const servicesInput = page.getByPlaceholder(/describe your services/i);
    await expect(servicesInput).toHaveValue(account.services, { timeout: 10_000 });
  });

  test('updates company services and shows success', async ({ page }) => {
    const account = TEST_ACCOUNTS.consulting;
    await login(page, account);
    await navigateTo(page, 'profile');

    const servicesInput = page.getByPlaceholder(/describe your services/i);
    await expect(servicesInput).toBeVisible({ timeout: 10_000 });

    const updatedServices =
      'Management consulting, digital transformation strategy, public sector reform advisory, EU funding applications and compliance auditing.';
    await servicesInput.clear();
    await servicesInput.fill(updatedServices);

    await page.getByRole('button', { name: /sync changes/i }).click();

    await expect(page.getByText(/success|sucesso|updated|atualizado|synced/i)).toBeVisible({
      timeout: 10_000,
    });
  });

  test('shows current subscription tier', async ({ page }) => {
    const account = TEST_ACCOUNTS.itServices;
    await login(page, account);
    await navigateTo(page, 'profile');

    await expect(
      page.locator('main').getByRole('heading', { name: 'Enterprise' })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Profile — per-industry verification', () => {
  const profileAccounts = [
    TEST_ACCOUNTS.itServices,
    TEST_ACCOUNTS.construction,
    TEST_ACCOUNTS.healthcare,
    TEST_ACCOUNTS.environmental,
    TEST_ACCOUNTS.consulting,
    TEST_ACCOUNTS.transport,
    TEST_ACCOUNTS.security,
    TEST_ACCOUNTS.catering,
  ];

  for (const account of profileAccounts) {
    test(`${account.industry}: profile loads correctly`, async ({ page }) => {
      await login(page, account);
      await navigateTo(page, 'profile');

      await expect(page.getByRole('heading', { name: /bidding profile/i })).toBeVisible({ timeout: 10_000 });

      // Company name should be in the input value
      await expect(companyNameInput(page)).toHaveValue(account.companyName, { timeout: 10_000 });
    });
  }
});
