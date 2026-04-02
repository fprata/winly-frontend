import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('textbox', { name: 'Email' }).fill('nonexistent@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Should show an error message (not crash, not redirect)
    await expect(page.getByText(/invalid|error|incorrect/i)).toBeVisible({ timeout: 10000 });
  });

  test('signup with new email succeeds (confirmation email sent)', async ({ page }) => {
    await page.goto('/login');

    // Generate a unique email to avoid conflicts
    const uniqueEmail = `e2e.test.${Date.now()}@example.com`;

    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill('TestPassword123!');
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Should show success message — NOT "Error sending confirmation email"
    await expect(page.getByText(/check email/i)).toBeVisible({ timeout: 10000 });

    // Explicitly verify no error message is shown
    await expect(page.getByText(/error sending confirmation/i)).not.toBeVisible();
  });

  test('signup with short password shows validation error', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('123');
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Should show validation error
    await expect(page.getByText(/password|characters|short/i)).toBeVisible({ timeout: 10000 });
  });

  test('forgot password link navigates correctly', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: 'Forgot password?' }).click();

    await expect(page).toHaveURL(/forgot-password/);
  });
});
