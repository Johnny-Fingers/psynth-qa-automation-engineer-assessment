import { test, expect } from '@playwright/test';
import { apiURL } from '../env';

test('rejects an empty clinical note', async ({ request }) => {
  const response = await request.post(`${apiURL}/api/assessments/asmt_001/notes`, {
    data: { content: '', author: 'QA' },
  });
  expect(response.status()).toBe(422);
});

test('rejects a clinical note without author', async ({ request }) => {
  const response = await request.post(`${apiURL}/api/assessments/asmt_001/notes`, {
    data: { content: 'Follow up is recommended.', author: ''}
  });
  expect(response.status()).toBe(422);
});