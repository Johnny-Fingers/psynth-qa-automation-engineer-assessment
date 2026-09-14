import { test, expect } from '@playwright/test';

test('generates a narrative summary', async ({ page }) => {
  await page.goto('/assessments/asmt_001');
  await page.getByRole('button', { name: 'Generate Report' }).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('obtained a score')).toBeVisible();
});
