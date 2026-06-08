import { expect, type Locator, type Page } from '@playwright/test';
import { completeLanguageSelectionIfNeeded, isEmployerBrowseVisible } from './app';

const BROWSE_HEADING = /what role are you hiring for|ما المهنة التي توظف لها/i;
const ROLE_EMPLOYER = /^(Employer|صاحب عمل)$/i;
const CONTINUE_AS_EMPLOYER = /continue as employer|المتابعة كـ/i;
/** Auth screen only — do not match employer onboarding "Phone number". */
const AUTH_PHONE_FIELD = /enter your phone number|أدخل رقم هاتفك/i;
const ONBOARDING_PHONE_FIELD = /phone number|رقم الهاتف/i;
const COMPANY_FIELD = /company name|اسم الشركة/i;
const CONTACT_FIELD = /contact name|اسم جهة الاتصال/i;

/** UAE local digits (without +971). Override with E2E_EMPLOYER_PHONE_LOCAL. */
export const E2E_EMPLOYER_PHONE_LOCAL =
  process.env.E2E_EMPLOYER_PHONE_LOCAL ?? '501551480';

/**
 * Language → role → phone (OTP bypass) → employer onboarding (if needed) → browse.
 * Safe to call when a saved session already lands on browse.
 */
export async function ensureEmployerBrowseSession(page: Page): Promise<void> {
  await completeLanguageSelectionIfNeeded(page);

  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (await isEmployerBrowseVisible(page, 1_500)) {
      return;
    }

    if (await isVisible(page.getByRole('button', { name: /^English$/i }))) {
      await page.getByRole('button', { name: /^English$/i }).click();
      continue;
    }

    if (await isVisible(page.getByRole('radio', { name: ROLE_EMPLOYER }))) {
      await selectEmployerRole(page);
      continue;
    }

    const onAuthPhone =
      (await isVisible(page.getByRole('textbox', { name: AUTH_PHONE_FIELD }))) &&
      !(await isVisible(page.getByRole('textbox', { name: COMPANY_FIELD })));
    if (onAuthPhone) {
      await signInWithPhoneBypass(page);
      continue;
    }

    const onOnboardingStep2 =
      (await isVisible(page.getByRole('textbox', { name: CONTACT_FIELD }))) &&
      !(await isEmployerBrowseVisible(page, 500));
    if (onOnboardingStep2) {
      await completeEmployerOnboardingStep2(page);
      continue;
    }

    const onOnboardingStep1 =
      (await isVisible(page.getByRole('textbox', { name: COMPANY_FIELD }))) &&
      !(await isVisible(page.getByRole('textbox', { name: CONTACT_FIELD })));
    if (onOnboardingStep1) {
      await completeEmployerOnboardingStep1(page);
      continue;
    }

    await page.waitForTimeout(400);
  }

  await expect(page.getByText(BROWSE_HEADING)).toBeVisible({ timeout: 10_000 });
}

async function isVisible(locator: Locator): Promise<boolean> {
  return locator.isVisible({ timeout: 500 }).catch(() => false);
}

/** RN Web controlled inputs: keyboard events update React state reliably. */
async function typeInto(page: Page, locator: Locator, value: string): Promise<void> {
  await locator.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.type(value, { delay: 25 });
}

async function clickWhenEnabled(page: Page, name: RegExp): Promise<void> {
  const button = page.getByRole('button', { name });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (await isEmployerBrowseVisible(page, 500)) {
      return;
    }
    if (await button.isEnabled().catch(() => false)) {
      await button.click();
      await isEmployerBrowseVisible(page, 15_000);
      return;
    }
    await page.waitForTimeout(300);
  }
  if (await isEmployerBrowseVisible(page, 1_000)) {
    return;
  }
  await expect(button).toBeEnabled({ timeout: 2_000 });
  await button.click();
}

async function selectEmployerRole(page: Page): Promise<void> {
  await page.getByRole('radio', { name: ROLE_EMPLOYER }).click();
  await page.getByRole('button', { name: CONTINUE_AS_EMPLOYER }).click();
}

async function signInWithPhoneBypass(page: Page): Promise<void> {
  const phoneInput = page.getByRole('textbox', { name: AUTH_PHONE_FIELD });
  await typeInto(page, phoneInput, E2E_EMPLOYER_PHONE_LOCAL);
  await clickWhenEnabled(page, /^Continue$|^متابعة$/i);
}

async function completeEmployerOnboardingStep1(page: Page): Promise<void> {
  const companyField = page.getByRole('textbox', { name: COMPANY_FIELD });
  const current = await companyField.inputValue().catch(() => '');
  const hasCompanyError = await page
    .getByRole('alert')
    .filter({ hasText: /company|شركة/i })
    .isVisible()
    .catch(() => false);

  if (!current.trim() || hasCompanyError) {
    await typeInto(page, companyField, `E2E Co ${Date.now()}`);
  }

  const continueBtn = page.getByRole('button', { name: /^Continue$|^متابعة$/i });
  if (await continueBtn.isDisabled()) {
    await page.waitForTimeout(800);
    return;
  }
  await continueBtn.click();
  await page.waitForTimeout(500);
}

async function completeEmployerOnboardingStep2(page: Page): Promise<void> {
  if (await isEmployerBrowseVisible(page, 500)) {
    return;
  }

  const contactField = page.getByRole('textbox', { name: CONTACT_FIELD });
  if (!(await contactField.isVisible({ timeout: 500 }).catch(() => false))) {
    return;
  }

  const stamp = Date.now();

  const contactVal = await contactField.inputValue({ timeout: 2_000 }).catch(() => '');
  if (!contactVal.trim()) {
    await typeInto(page, contactField, 'E2E Tester');
  }

  const phoneOnStep2 = page.getByRole('textbox', { name: ONBOARDING_PHONE_FIELD });
  if (await phoneOnStep2.isVisible({ timeout: 500 }).catch(() => false)) {
    const phoneVal = await phoneOnStep2.inputValue({ timeout: 2_000 }).catch(() => '');
    if (!phoneVal.trim()) {
      await typeInto(page, phoneOnStep2, E2E_EMPLOYER_PHONE_LOCAL);
    }
  }

  const emailField = page.getByRole('textbox', { name: /^Email\. Required/i });
  if (await emailField.isVisible({ timeout: 500 }).catch(() => false)) {
    const emailVal = await emailField.inputValue({ timeout: 2_000 }).catch(() => '');
    if (!emailVal.trim()) {
      await typeInto(page, emailField, `e2e+${stamp}@test.tarteb.local`);
    }
  }

  const dubaiSelected = await page
    .getByRole('button', { name: /^Dubai\. Selected/i })
    .isVisible()
    .catch(() => false);
  if (!dubaiSelected) {
    await page.getByRole('button', { name: /^Dubai\. Not selected/i }).click();
    return;
  }

  await clickWhenEnabled(page, /start browsing|ابدأ التصفح/i);
}
