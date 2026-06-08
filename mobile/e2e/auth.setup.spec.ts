import fs from 'node:fs';
import path from 'node:path';
import { test as setup, expect } from '@playwright/test';
import { ensureEmployerBrowseSession } from './helpers/employerAuth';

const authFile = 'e2e/.auth/employer.json';

setup.use({ storageState: { cookies: [], origins: [] } });

/**
 * Saves employer session after automated login (OTP bypass + onboarding if needed):
 *   npm run test:e2e:auth
 */
setup('save employer auth state', async ({ page }) => {
  setup.setTimeout(120_000);

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto('/browse');
  await ensureEmployerBrowseSession(page);

  await expect(page.getByText(/what role are you hiring for|ما المهنة التي توظف لها/i)).toBeVisible({
    timeout: 30_000,
  });

  await page.context().storageState({ path: authFile });
});
