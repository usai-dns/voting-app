import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('shows login page for unauthenticated users', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Shadow Legislature')).toBeVisible();
    await expect(page.getByText('Sign In')).toBeVisible();
  });

  test('shows test account buttons', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Test Accounts')).toBeVisible();
    for (const name of ['alice', 'bob', 'carol', 'dave', 'eve']) {
      await expect(page.getByRole('button', { name: new RegExp(name, 'i') })).toBeVisible();
    }
  });

  test('can log in with test credentials', async ({ page }) => {
    await page.goto('/login');

    // Click alice test user to prefill
    await page.getByRole('button', { name: /alice/i }).click();

    // Submit the form
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Active Legislation')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Enter username').fill('nonexistent');
    await page.getByPlaceholder('Enter password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('can register a new account', async ({ page }) => {
    await page.goto('/login');

    // Switch to register mode
    await page.getByText("Don't have an account?").click();
    await expect(page.getByText('Create Account')).toBeVisible();

    // Fill in registration form with a unique username
    const username = `testuser_${Date.now()}`;
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByPlaceholder('Your public name').fill('Test User');
    await page.getByPlaceholder('Enter password').fill('testpass123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
  });

  test('can log out', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByRole('button', { name: /bob/i }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');

    // Click logout
    await page.getByRole('button', { name: /log\s*out|sign\s*out/i }).click();

    // Should be back on login page
    await expect(page).toHaveURL('/login');
  });
});
