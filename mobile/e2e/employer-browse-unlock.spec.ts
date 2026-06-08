import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { completeLanguageSelectionIfNeeded, isEmployerBrowseVisible } from './helpers/app';

/**
 * Employer E2E — browse → profile → unlock.
 *
 * First-time setup (saves logged-in session):
 *   E2E_SAVE_AUTH=1 npx playwright test e2e/auth.setup.ts --headed
 *
 * Run the flow:
 *   E2E_EMPLOYER=1 npm run test:e2e
 *
 * Optional: E2E_ROLE=Barista
 */
const runEmployerE2E = process.env.E2E_EMPLOYER === '1';
const preferredRole = process.env.E2E_ROLE;
const storagePath = process.env.E2E_STORAGE_STATE ?? 'e2e/.auth/employer.json';
const hasStorageState = fs.existsSync(storagePath);

test.describe('employer browse → profile → unlock', () => {
  test.skip(!runEmployerE2E, 'Set E2E_EMPLOYER=1 to run employer E2E');

  test('pick role, open candidate, unlock contact', async ({ page }) => {
    await page.goto('/browse');
    await completeLanguageSelectionIfNeeded(page);

    if (!(await isEmployerBrowseVisible(page)) && !hasStorageState) {
      test.skip(true, 'No employer session saved. Run: npm run test:e2e:auth');
    }

    await expect(
      page.getByText(/what role are you hiring for|ما المهنة التي توظف لها/i),
    ).toBeVisible({ timeout: 30_000 });

    const roleButton = preferredRole
      ? page.getByRole('button', { name: new RegExp(preferredRole, 'i') })
      : page.getByRole('button').filter({ hasText: /\(\d+\)/ }).first();

    await roleButton.click();
    await expect(page.getByText(/all roles|كل المهن/i)).toBeVisible();

    const candidateCard = page
      .getByRole('button')
      .filter({ hasNotText: /refine|filtered|all roles|كل المهن/i })
      .first();
    await candidateCard.click();

    const unlockButton = page.getByRole('button', {
      name: /unlock contact|افتح بيانات التواصل/i,
    });
    await expect(unlockButton).toBeVisible({ timeout: 15_000 });
    await unlockButton.click();

    await expect(
      page.getByText(
        /contact unlocked|unlocked, but|call|اتصال|تم فتح بيانات التواصل|لا توجد بيانات تواصل/i,
      ),
    ).toBeVisible({ timeout: 15_000 });
  });
});
