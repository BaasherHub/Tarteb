import { test, expect } from '@playwright/test';

/**
 * Employer E2E — requires an authenticated employer session in the browser.
 *
 * Setup:
 * 1. Start the app: `cd mobile && npm run web`
 * 2. Log in manually as an employer and land on Browse (role picker).
 * 3. Run: `E2E_EMPLOYER=1 npm run test:e2e`
 *
 * Optional: E2E_ROLE=Barista to pick a specific role instead of the first available.
 */
const runEmployerE2E = process.env.E2E_EMPLOYER === '1';
const preferredRole = process.env.E2E_ROLE;

test.describe('employer browse → profile → unlock', () => {
  test.skip(!runEmployerE2E, 'Set E2E_EMPLOYER=1 after logging in as an employer in the browser');

  test('pick role, open candidate, unlock contact', async ({ page }) => {
    await page.goto('/browse');
    await expect(page.getByText(/pick a role|اختر مهنة/i)).toBeVisible({ timeout: 30_000 });

    const roleButton = preferredRole
      ? page.getByRole('button', { name: new RegExp(preferredRole, 'i') })
      : page.getByRole('button').filter({ hasText: /\(\d+\)/ }).first();

    await roleButton.click();
    await expect(page.getByText(/back to roles|العودة إلى المهن/i)).toBeVisible();

    const candidateCard = page.getByRole('button').filter({ hasNotText: /refine|filtered|back/i }).first();
    await candidateCard.click();

    const unlockButton = page.getByRole('button', { name: /unlock contact|افتح بيانات التواصل/i });
    await expect(unlockButton).toBeVisible({ timeout: 15_000 });
    await unlockButton.click();

    await expect(
      page.getByText(/unlocked|contact details|لا توجد بيانات تواصل|my unlocks/i),
    ).toBeVisible({ timeout: 15_000 });
  });
});
