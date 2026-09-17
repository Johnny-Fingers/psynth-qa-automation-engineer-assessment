import { test, expect } from '@playwright/test';

test('adds a clinical note', async ({ page }) => {
  await page.goto('/assessments/asmt_001');
  const comment = `Comment generated via Playwright ${Date.now()}.`;
  await page.getByPlaceholder('Add a clinical observation...').fill(comment);
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes('/notes') && r.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Add Note' }).click();
  await responsePromise;
  await expect(page.getByText(comment)).toBeVisible();
});
