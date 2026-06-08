import type { Page } from '@playwright/test';

/** Pass language selection when the app opens on a fresh browser profile. */
export async function completeLanguageSelectionIfNeeded(page: Page): Promise<void> {
  const english = page.getByRole('button', { name: /^English$/i });
  if (await english.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await english.click();
  }
}

export async function isEmployerBrowseVisible(
  page: Page,
  timeoutMs = 5_000,
): Promise<boolean> {
  const browseHeading = page.getByText(
    /what role are you hiring for|ما المهنة التي توظف لها/i,
  );
  return browseHeading.isVisible({ timeout: timeoutMs }).catch(() => false);
}

export async function isAuthScreenVisible(page: Page): Promise<boolean> {
  const phoneOtp = page.getByText(/enter your phone number|أدخل رقم هاتفك/i);
  return phoneOtp.isVisible({ timeout: 3_000 }).catch(() => false);
}
