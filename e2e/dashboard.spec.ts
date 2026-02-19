import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as alice
    await page.goto('/login');
    await page.getByRole('button', { name: /alice/i }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');
  });

  test('shows all three bills', async ({ page }) => {
    await expect(page.getByText('Freedom to Vote Act')).toBeVisible();
    await expect(page.getByText('John R. Lewis Voting Rights Advancement Act')).toBeVisible();
    await expect(page.getByText('SAVE Act')).toBeVisible();
  });

  test('shows vote tallies on bill cards', async ({ page }) => {
    // Each bill should show vote counts
    await expect(page.getByText(/\d+ votes/).first()).toBeVisible();
  });

  test('can navigate to a bill detail page', async ({ page }) => {
    await page.getByText('Freedom to Vote Act').click();
    await expect(page).toHaveURL(/\/bill\/freedom-to-vote/);
    await expect(page.getByText('Freedom to Vote Act')).toBeVisible();
  });

  test('can navigate to verify page', async ({ page }) => {
    await page.getByRole('link', { name: /verify/i }).click();
    await expect(page).toHaveURL('/verify');
    await expect(page.getByText('Verify Your Vote')).toBeVisible();
  });
});
