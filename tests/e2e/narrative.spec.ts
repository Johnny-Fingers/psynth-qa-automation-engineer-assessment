import { test, expect } from '@playwright/test';

test('generates a narrative summary', async ({ page }) => {
  await page.goto('/assessments/asmt_001');
  await page.getByRole('button', { name: 'Generate Report' }).click();

  for (const domain of [
    'Verbal Comprehension Index (VCI)',
    'Visual Spatial Index (VSI)',
    'Fluid Reasoning Index (FRI)',
    'Working Memory Index (WMI)',
    'Processing Speed Index (PSI)',
  ]) {
    await expect(page.getByText(`${domain}:`, { exact: true })).toBeVisible();
  }
});

test('downloads the generated narrative as PDF', async ({ page }) => {
  await page.goto('/assessments/asmt_001');
  await page.getByRole('button', { name: 'Generate Report' }).click();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'PDF' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
});
