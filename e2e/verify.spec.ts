import { test, expect } from '@playwright/test';

test.describe('Vote Verification', () => {
  test('can verify a vote by receipt ID', async ({ page }) => {
    // First: register and cast a vote to get a receipt
    const username = `verifier_${Date.now()}`;
    await page.goto('/login');
    await page.getByText("Don't have an account?").click();
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByPlaceholder('Your public name').fill('Verifier');
    await page.getByPlaceholder('Enter password').fill('testpass');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL('/');

    // Vote on John Lewis VRA
    await page.getByText('John R. Lewis').click();
    await page.getByRole('button', { name: /vote/i }).first().click();
    await page.getByText('Yea — Support').click();
    await page.getByRole('button', { name: 'Submit Vote' }).click();
    await expect(page.getByText('Vote Recorded')).toBeVisible({ timeout: 10_000 });

    // Show and copy the receipt
    await page.getByRole('button', { name: /show receipt/i }).click();
    const receiptCode = page.locator('code');
    const receiptId = await receiptCode.textContent();
    expect(receiptId).toBeTruthy();
    expect(receiptId!.length).toBe(32);

    // Navigate to verify page
    await page.getByRole('link', { name: /verify/i }).click();
    await expect(page).toHaveURL('/verify');

    // Enter receipt and verify
    await page.getByPlaceholder(/paste your vote receipt/i).fill(receiptId!);
    await page.getByRole('button', { name: 'Verify Vote' }).click();

    // Should show vote verified
    await expect(page.getByText('Vote Verified')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('YEA')).toBeVisible();
  });

  test('shows error for invalid receipt', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /eve/i }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/');

    await page.getByRole('link', { name: /verify/i }).click();
    await page.getByPlaceholder(/paste your vote receipt/i).fill('invalid_receipt_00000000000000');
    await page.getByRole('button', { name: 'Verify Vote' }).click();

    await expect(page.getByText('No Vote Found')).toBeVisible({ timeout: 10_000 });
  });
});
