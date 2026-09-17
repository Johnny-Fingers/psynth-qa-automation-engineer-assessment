import { test, expect } from '@playwright/test';

test('assessments page loads', async ({ page }) => {
  await page.goto('/assessments');
  await expect(page.getByRole('heading', { name: 'Assessments' })).toBeVisible();
});

test('filter by name and status with results', async ({ page }) => {
  await page.goto('/assessments');

  await page.getByPlaceholder('Search by client name...').fill('Jordan Rivera');
  await page.getByRole('combobox').selectOption('completed');

  await expect(page.getByText('Jordan Rivera')).toBeVisible();
  await expect(page.getByText('No assessments found')).not.toBeVisible();
});

test('filter by name and status without results shows empty state', async ({ page }) => {
  await page.goto('/assessments');

  await page.getByPlaceholder('Search by client name...').fill('Alex');
  await page.getByRole('combobox').selectOption('pending_review');

  await expect(page.getByText('No assessments found')).toBeVisible();
});