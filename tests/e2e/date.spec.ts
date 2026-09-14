import { test, expect } from '@playwright/test';

test('Alex Thompson was assessed on January 15, 2024', async ({ page }) => {
  await page.goto('/assessments');
  const row = page.locator('tr').filter({ hasText: 'Alex Thompson' });
  await expect(row).toContainText('Jan 15, 2024');
});
