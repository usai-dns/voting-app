import { test, expect } from '@playwright/test';

test.describe('Comments', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /dave/i }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to Freedom to Vote bill
    await page.getByText('Freedom to Vote Act').click();
    await expect(page).toHaveURL(/\/bill\/freedom-to-vote/);

    // Go to Full Text tab where comments live
    await page.getByRole('button', { name: /full text/i }).click();
  });

  test('shows existing seeded comments', async ({ page }) => {
    // Seeded comments should be visible in bill text sections
    await expect(page.getByText(/voter registration/i).first()).toBeVisible();
  });

  test('can post a new comment', async ({ page }) => {
    const commentText = `E2E test comment ${Date.now()}`;

    // Find the first comment input and type in it
    const commentInput = page.getByPlaceholder(/add a comment/i).first();
    await commentInput.fill(commentText);

    // Click Post
    await page.getByRole('button', { name: 'Post' }).first().click();

    // The comment should appear
    await expect(page.getByText(commentText)).toBeVisible({ timeout: 10_000 });
  });
});
