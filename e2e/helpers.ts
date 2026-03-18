import { type Page, expect } from '@playwright/test';
import type { TestAccount } from './fixtures/test-accounts';

/**
 * Log in via the UI and wait for the dashboard redirect.
 * The app uses locale-prefixed routes (e.g. /en/dashboard).
 */
export async function login(page: Page, account: TestAccount) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(account.email);
  await page.getByLabel('Password').fill(account.password);
  await page.getByRole('button', { name: /log in/i }).click();
  // May land on /dashboard or /en/dashboard (locale prefix added client-side)
  await page.waitForURL(/\/(dashboard|onboarding|matches)/, { timeout: 15_000 });
}

/**
 * Assert the sidebar is visible and shows the company name.
 */
export async function expectSidebar(page: Page, companyName: string) {
  const sidebar = page.locator('nav');
  await expect(sidebar).toBeVisible();
  await expect(sidebar).toContainText(companyName, { timeout: 5_000 });
}

/**
 * Navigate to a dashboard section via the sidebar nav links.
 * Scoped to the sidebar <nav> to avoid matching dashboard cards.
 */
export async function navigateTo(
  page: Page,
  section: 'matches' | 'explorer' | 'buyers' | 'competitors' | 'profile'
) {
  const labelMap: Record<string, RegExp> = {
    matches: /my matches/i,
    explorer: /^explorer$/i,
    buyers: /buyer profiles/i,
    competitors: /competitor intel/i,
    profile: /^profile$/i,
  };
  const sidebar = page.locator('nav');
  await sidebar.getByRole('link', { name: labelMap[section] }).click();
  await page.waitForLoadState('networkidle');
}
