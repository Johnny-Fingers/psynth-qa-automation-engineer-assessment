import { test, expect } from '@playwright/test';

test('opens the first assessment', async ({ page }) => {
  await page.goto('/assessments');

  const firstViewLink = page.getByRole('link', { name: 'View' }).first();
  await expect(firstViewLink).toBeVisible();

  const clientName = (await page.getByRole('cell').first().textContent())?.trim();
  expect(clientName).toBeTruthy();

  await firstViewLink.click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(clientName as string);
});
