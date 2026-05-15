import { test, expect } from '@playwright/test';

test('root renders login when unauthenticated', async ({ page }) => {
  await page.goto('/');
  const button = page.getByRole('button', { name: /continuar con google/i });
  await expect(button).toBeVisible();
});

test('protected route redirects to root when unauthenticated', async ({ page }) => {
  const response = await page.goto('/home');
  expect(response?.url()).toMatch(/\/$/);
});

test('health endpoint responds ok', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  const json = await response.json();
  expect(json.status).toBe('ok');
});
