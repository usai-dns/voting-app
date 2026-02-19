import { test, expect } from '@playwright/test';

test.describe('Bill Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as carol (who hasn't voted in E2E yet)
    await page.goto('/login');
    await page.getByRole('button', { name: /carol/i }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to a bill
    await page.getByText('Freedom to Vote Act').click();
    await expect(page).toHaveURL(/\/bill\/freedom-to-vote/);
  });

  test('shows bill synopsis', async ({ page }) => {
    await expect(page.getByText(/comprehensive election reform/i)).toBeVisible();
  });

  test('shows bill sections with full text', async ({ page }) => {
    // Click the "Full Text" tab
    await page.getByRole('button', { name: /full text/i }).click();

    // Should see section titles
    await expect(page.getByText(/Voter Registration/i)).toBeVisible();
  });

  test('shows vote panel', async ({ page }) => {
    // Click the "Vote" tab
    await page.getByRole('button', { name: /vote/i }).first().click();

    // Should see vote options or already voted state
    const votePanel = page.locator('[class*="card"]');
    await expect(votePanel.first()).toBeVisible();
  });

  test('shows global tally', async ({ page }) => {
    await page.getByRole('button', { name: /vote/i }).first().click();
    await expect(page.getByText('Global Vote Tally')).toBeVisible();
    await expect(page.getByText(/Yea/)).toBeVisible();
    await expect(page.getByText(/Nay/)).toBeVisible();
  });
});
