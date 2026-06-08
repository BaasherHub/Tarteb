import { test as setup, expect } from '@playwright/test';
import { completeLanguageSelectionIfNeeded, isEmployerBrowseVisible } from './helpers/app';

const authFile = 'e2e/.auth/employer.json';

/**
 * One-time employer session capture:
 *   npm run test:e2e:auth
 *
 * Log in as an employer in the paused browser, then resume the test to save storage state.
 */
setup('save employer auth state', async ({ page }) => {
  setup.setTimeout(300_000);
  await page.goto('/browse');
  await completeLanguageSelectionIfNeeded(page);

  if (!(await isEmployerBrowseVisible(page))) {
    await page.pause();
  }

  await expect(page.getByText(/what role are you hiring for|ما المهنة التي توظف لها/i)).toBeVisible({
    timeout: 60_000,
  });
  await page.context().storageState({ path: authFile });
});
