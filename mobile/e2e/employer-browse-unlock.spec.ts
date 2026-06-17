import { test, expect } from '@playwright/test';
import { ensureEmployerBrowseSession } from './helpers/employerAuth';

/**
 * Employer E2E — browse → profile → unlock (fully automated auth via OTP bypass).
 *
 * Run:
 *   E2E_EMPLOYER=1 npm run test:e2e
 *
 * Optional: E2E_ROLE=Barista, E2E_EMPLOYER_PHONE_LOCAL=501551480
 * Faster reruns after first login: npm run test:e2e:auth (saves e2e/.auth/employer.json)
 */
const runEmployerE2E = process.env.E2E_EMPLOYER === '1';
const preferredRole = process.env.E2E_ROLE ?? 'Barista';

test.describe('employer browse → profile → unlock', () => {
  test.skip(!runEmployerE2E, 'Set E2E_EMPLOYER=1 to run employer E2E');

  test('pick role, open candidate, unlock contact', async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto('/browse');
    await ensureEmployerBrowseSession(page);

    await expect(
      page.getByText(/what role are you hiring for|ما المهنة التي توظف لها/i),
    ).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: new RegExp(`^${preferredRole}\\b`, 'i') }).click();
    await expect(
      page.getByRole('button', { name: /all roles|كل المهن/i }),
    ).toBeVisible({ timeout: 15_000 });

    await page
      .getByRole('button', { name: /opens candidate profile|يفتح ملف المرشح/i })
      .first()
      .click();

    const unlockButton = page.getByRole('button', {
      name: /unlock contact|افتح بيانات التواصل/i,
    });
    const callButton = page.getByRole('button', { name: /^Call$|^اتصال$/i });
    const unlockedState = callButton.or(
      page.getByText(/contact unlocked|unlocked, but|تم فتح بيانات التواصل|لا توجد بيانات تواصل/i),
    );

    if (await unlockButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await unlockButton.scrollIntoViewIfNeeded();
      await unlockButton.click();
    }

    await expect(unlockedState).toBeVisible({ timeout: 20_000 });
  });
});
