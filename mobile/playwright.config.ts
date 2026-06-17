import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:8081';
const storagePath = process.env.E2E_STORAGE_STATE ?? 'e2e/.auth/employer.json';
const storageState = fs.existsSync(storagePath) ? storagePath : undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 120_000,
  use: {
    baseURL,
    storageState,
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: 'npm run web',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
          ...process.env,
          EXPO_PUBLIC_E2E_AUTO_PHOTO: 'true',
        },
      },
});
