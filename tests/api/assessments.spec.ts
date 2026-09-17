import { test, expect } from '@playwright/test';
import { apiURL } from '../env';

test('lists assessments', async ({ request }) => {
  const response = await request.get(`${apiURL}/api/assessments`);
  expect(response.status()).toBe(200);
});

test('filter assessments by existing assessment type returns results', async ({ request }) => {
  const response = await request.get(`${apiURL}/api/assessments`, {
    params: { type: 'WISC-V' },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.length).toBeGreaterThan(0);
  for (const item of body) {
    expect(item.assessment_type).toBe('WISC-V');
  }
});

test('filter assessments by unknown assessment type returns empty list', async ({ request }) => {
  const response = await request.get(`${apiURL}/api/assessments`, {
    params: { type: 'BRIEF-A' },
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual([]);
});
