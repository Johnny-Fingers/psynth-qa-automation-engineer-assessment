import { test, expect } from '@playwright/test';

test('opens the first assessment', async ({ page }) => {
  await page.goto('/assessments');
  await page.locator('td.p-4.font-medium').first().waitFor();
  await page.locator('table tbody tr td a').first().click();
  await expect(page.locator('h1')).toContainText('Alex Thompson');
});
