import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { ensureCandidateHomeSession } from './helpers/candidateAuth';

/**
 * Candidate E2E — auth → onboarding (if needed) → profile home.
 *
 * Run:
 *   E2E_CANDIDATE=1 npm run test:e2e:candidate
 *
 * Optional: E2E_CANDIDATE_PHONE_LOCAL=501551481, E2E_CANDIDATE_ROLE=Barista
 * Faster reruns: npm run test:e2e:candidate:auth (saves e2e/.auth/candidate.json)
 */
const runCandidateE2E = process.env.E2E_CANDIDATE === '1';
const candidateAuthFile = 'e2e/.auth/candidate.json';

test.describe('candidate onboarding → profile home', () => {
  test.skip(!runCandidateE2E, 'Set E2E_CANDIDATE=1 to run candidate E2E');

  test.use({
    storageState: fs.existsSync(candidateAuthFile)
      ? candidateAuthFile
      : { cookies: [], origins: [] },
  });

  test('complete profile and land on home tab', async ({ page }) => {
    test.setTimeout(240_000);

    await page.goto('/dashboard');
    await ensureCandidateHomeSession(page);

    await expect(page.getByRole('tab', { name: /^Profile$|^الملف$/i })).toHaveAttribute(
      'aria-selected',
      'true',
      { timeout: 30_000 },
    );
  });
});
