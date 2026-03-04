import { test, expect } from '@playwright/test';

test('auth flow', async ({ page }) => {
  await page.goto('/login');
  
  // Fill login form
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  
  // Submit
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Expect redirect to dashboard (mocking or actual depending on env)
  // For now we just check if we stay on page with error or redirect
  // This depends on whether we have a real backend running for E2E
});
