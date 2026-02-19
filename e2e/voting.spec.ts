import { test, expect } from '@playwright/test';

test.describe('Voting', () => {
  test('can cast a vote and receive a receipt', async ({ page }) => {
    // Register a fresh user to guarantee they haven't voted
    const username = `voter_${Date.now()}`;
    await page.goto('/login');
    await page.getByText("Don't have an account?").click();
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByPlaceholder('Your public name').fill('E2E Voter');
    await page.getByPlaceholder('Enter password').fill('testpass');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL('/');

    // Navigate to SAVE Act (less likely to have prior E2E votes)
    await page.getByText('SAVE Act').click();

    // Go to Vote tab
    await page.getByRole('button', { name: /vote/i }).first().click();

    // Select "Yea"
    await page.getByText('Yea — Support').click();

    // Submit
    await page.getByRole('button', { name: 'Submit Vote' }).click();

    // Should see receipt
    await expect(page.getByText('Vote Recorded')).toBeVisible({ timeout: 10_000 });

    // Show receipt ID
    await page.getByRole('button', { name: /show receipt/i }).click();
    await expect(page.getByText('Your Vote Receipt')).toBeVisible();
  });

  test('prevents double voting', async ({ page }) => {
    // Register a fresh user
    const username = `doublevoter_${Date.now()}`;
    await page.goto('/login');
    await page.getByText("Don't have an account?").click();
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByPlaceholder('Your public name').fill('Double Voter');
    await page.getByPlaceholder('Enter password').fill('testpass');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL('/');

    // Vote on Freedom to Vote Act
    await page.getByText('Freedom to Vote Act').click();
    await page.getByRole('button', { name: /vote/i }).first().click();
    await page.getByText('Nay — Oppose').click();
    await page.getByRole('button', { name: 'Submit Vote' }).click();
    await expect(page.getByText('Vote Recorded')).toBeVisible({ timeout: 10_000 });

    // Reload the page
    await page.reload();

    // Should still show "Vote Recorded" — cannot vote again
    await page.getByRole('button', { name: /vote/i }).first().click();
    await expect(page.getByText('Vote Recorded')).toBeVisible({ timeout: 10_000 });
  });
});
