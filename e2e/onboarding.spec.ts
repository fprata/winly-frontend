import { test, expect } from '@playwright/test';
import { TEST_ACCOUNTS, TEST_PASSWORD } from './fixtures/test-accounts';

/**
 * Onboarding tests are skipped in E2E against a live deployment because:
 * - Sign-up requires email confirmation (Supabase default)
 * - The onboarding page redirects to /dashboard for users who already have a profile
 * - Creating fresh users programmatically requires the service role key
 *
 * These scenarios are instead covered by:
 * - Unit tests in src/tests/onboarding-validation.test.ts (schema validation)
 * - Profile tests in profile.spec.ts (form interaction on the profile page)
 *
 * If email confirmation is disabled in a test Supabase project, remove `.skip`.
 */

test.describe('Onboarding flow', () => {
  test.skip('completes onboarding with valid company profile', async ({ page }) => {
    // Requires a fresh user without a profile — sign-up needs email confirm disabled
    await page.goto('/login');
    const freshEmail = `test-onboard-${Date.now()}@winly-test.com`;
    await page.getByLabel('Email').fill(freshEmail);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign up/i }).click();

    // Should land on onboarding after sign-up
    await page.waitForURL(/\/(onboarding)/, { timeout: 15_000 });

    const account = TEST_ACCOUNTS.itServices;
    await page.getByPlaceholder(/acme/i).fill(account.companyName);
    await page.getByPlaceholder(/describe your services/i).fill(account.services);
    await page.getByRole('button', { name: /continue|save|submit|next/i }).click();

    await expect(page).toHaveURL(/\/(dashboard|matches)/, { timeout: 15_000 });
  });

  test.skip('shows validation errors for empty required fields', async ({ page }) => {
    await page.goto('/login');
    const freshEmail = `test-onboard-${Date.now()}@winly-test.com`;
    await page.getByLabel('Email').fill(freshEmail);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign up/i }).click();
    await page.waitForURL(/\/(onboarding)/, { timeout: 15_000 });

    await page.getByRole('button', { name: /continue|save|submit|next/i }).click();

    await expect(page.getByText(/company name/i)).toBeVisible();
  });

  test.skip('shows validation error for short services description', async ({ page }) => {
    await page.goto('/login');
    const freshEmail = `test-onboard-${Date.now()}@winly-test.com`;
    await page.getByLabel('Email').fill(freshEmail);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign up/i }).click();
    await page.waitForURL(/\/(onboarding)/, { timeout: 15_000 });

    await page.getByPlaceholder(/acme/i).fill('Test Co');
    await page.getByPlaceholder(/describe your services/i).fill('IT');

    await page.getByRole('button', { name: /continue|save|submit|next/i }).click();

    await expect(page.getByText(/more details/i)).toBeVisible();
  });
});
