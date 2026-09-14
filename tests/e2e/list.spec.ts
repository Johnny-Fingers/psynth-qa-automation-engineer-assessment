import { test, expect } from '@playwright/test';

test('assessments page loads', async ({ page }) => {
  await page.goto('/assessments');
  await expect(page.getByRole('heading', { name: 'Assessments' })).toBeVisible();
});
