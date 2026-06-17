import fs from 'node:fs';
import path from 'node:path';
import { test as setup, expect } from '@playwright/test';
import { ensureCandidateHomeSession } from './helpers/candidateAuth';

const authFile = 'e2e/.auth/candidate.json';

setup.use({ storageState: { cookies: [], origins: [] } });

/**
 * Saves candidate session after automated login (OTP bypass + onboarding if needed):
 *   npm run test:e2e:candidate:auth
 */
setup('save candidate auth state', async ({ page }) => {
  setup.setTimeout(240_000);

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto('/dashboard');
  await ensureCandidateHomeSession(page);

  await expect(page.getByText(/profile \d+% complete|اكتمال الملف/i)).toBeVisible({
    timeout: 30_000,
  });

  await page.context().storageState({ path: authFile });
});
