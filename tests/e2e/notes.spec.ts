import { test, expect } from '@playwright/test';

test('adds a clinical note', async ({ page }) => {
  await page.goto('/assessments/asmt_001');
  await page.getByPlaceholder('Add a clinical observation...').fill('Follow-up recommended');
  await page.getByRole('button', { name: 'Add Note' }).click();
  await page.waitForTimeout(3000);
  await expect(page.getByText('Follow-up recommended')).toBeVisible();
});
