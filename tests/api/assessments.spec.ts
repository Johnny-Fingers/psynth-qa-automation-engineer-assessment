import { test, expect } from '@playwright/test';
import { apiURL } from '../env';

test('lists assessments', async ({ request }) => {
  const response = await request.get(`${apiURL}/api/assessments`);
  expect(response.status()).toBe(200);
});
