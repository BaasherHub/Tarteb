import type { Locator, Page } from '@playwright/test';

export async function isVisible(locator: Locator): Promise<boolean> {
  return locator.isVisible({ timeout: 500 }).catch(() => false);
}

/** RN Web controlled inputs: keyboard events update React state reliably. */
export async function typeInto(page: Page, locator: Locator, value: string): Promise<void> {
  await locator.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(value, { delay: 25 });
}

export async function clickContinue(page: Page): Promise<void> {
  const button = page.getByRole('button', { name: /^Continue$|^متابعة$/i });
  if (await button.isEnabled().catch(() => false)) {
    await button.click();
  }
}
