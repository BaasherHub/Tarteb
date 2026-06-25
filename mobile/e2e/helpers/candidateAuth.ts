import { expect, type Page } from '@playwright/test';
import { completeLanguageSelectionIfNeeded } from './app';
import { clickContinue, isVisible, typeInto } from './rnForm';

const ROLE_CANDIDATE = /^(Job seeker|باحث عن عمل)$/i;
const CONTINUE_AS_CANDIDATE = /continue as job seeker|المتابعة كـ/i;
const AUTH_PHONE_FIELD = /enter your phone number|أدخل رقم هاتفك/i;
const ONBOARDING_PHONE_FIELD = /phone number|رقم الهاتف/i;

/** UAE local digits (without +971). Override with E2E_CANDIDATE_PHONE_LOCAL. */
export const E2E_CANDIDATE_PHONE_LOCAL =
  process.env.E2E_CANDIDATE_PHONE_LOCAL ?? '501551481';

export async function isCandidateHomeVisible(page: Page, timeoutMs = 5_000): Promise<boolean> {
  const homeMarker = page
    .getByRole('tab', { name: /^Profile$|^الملف$/i })
    .or(page.getByRole('button', { name: /profile \d+% complete|اكتمال الملف/i }))
    .or(page.getByText(/profile active|الملف نشط/i));
  return homeMarker.first().isVisible({ timeout: timeoutMs }).catch(() => false);
}

/**
 * Language → job seeker → phone (OTP bypass) → onboarding (if needed) → candidate home.
 */
export async function ensureCandidateHomeSession(page: Page): Promise<void> {
  await completeLanguageSelectionIfNeeded(page);

  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    if (await isCandidateHomeVisible(page, 1_500)) {
      return;
    }

    if (await isVisible(page.getByRole('button', { name: /^English$/i }))) {
      await page.getByRole('button', { name: /^English$/i }).click();
      continue;
    }

    if (await isVisible(page.getByRole('radio', { name: ROLE_CANDIDATE }))) {
      await selectCandidateRole(page);
      continue;
    }

    const onAuthPhone =
      (await isVisible(page.getByRole('textbox', { name: AUTH_PHONE_FIELD }))) &&
      !(await isOnboardingStep(page, 1));
    if (onAuthPhone) {
      await signInWithPhoneBypass(page);
      continue;
    }

    if (await isOnboardingStep(page, 1)) {
      await completePhotoStep(page);
      continue;
    }

    if (await isOnboardingStep(page, 2)) {
      await completeRoleStep(page);
      continue;
    }

    if (await isOnboardingStep(page, 3)) {
      await completeLocationStep(page);
      continue;
    }

    if (await isOnboardingStep(page, 4)) {
      await completeSalaryVisaStep(page);
      continue;
    }

    if (await isOnboardingStep(page, 5)) {
      await completeFinishStep(page);
      continue;
    }

    await page.waitForTimeout(400);
  }

  await expect(page.getByText(/profile \d+% complete|اكتمال الملف/i)).toBeVisible({
    timeout: 15_000,
  });
}

async function isOnboardingStep(page: Page, step: number): Promise<boolean> {
  return isVisible(page.getByText(new RegExp(`step ${step} of 5`, 'i')));
}

async function pressOnboardingContinue(page: Page): Promise<void> {
  await page.getByRole('button', { name: /^Continue$|^متابعة$/i }).click({ timeout: 10_000 });
}

async function selectCandidateRole(page: Page): Promise<void> {
  await page.getByRole('radio', { name: ROLE_CANDIDATE }).click();
  await page.getByRole('button', { name: CONTINUE_AS_CANDIDATE }).click();
}

async function signInWithPhoneBypass(page: Page): Promise<void> {
  await typeInto(page, page.getByRole('textbox', { name: AUTH_PHONE_FIELD }), E2E_CANDIDATE_PHONE_LOCAL);
  await clickContinue(page);
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (await isCandidateHomeVisible(page, 500)) return;
    for (const step of [1, 2, 3, 4, 5]) {
      if (await isOnboardingStep(page, step)) return;
    }
    await page.waitForTimeout(300);
  }
}

async function completePhotoStep(page: Page): Promise<void> {
  const addPhoto = page.getByRole('button', { name: /tap to add photo|اضغط لإضافة صورة/i });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const needsPhoto = await addPhoto.isVisible({ timeout: 300 }).catch(() => false);
    if (!needsPhoto) break;
    await page.waitForTimeout(500);
  }
  await pressOnboardingContinue(page);
  await page.waitForTimeout(800);
}

async function completeRoleStep(page: Page): Promise<void> {
  const role = process.env.E2E_CANDIDATE_ROLE ?? 'Barista';
  const rolePicker = page.getByRole('button', { name: /^Job role$|^المهنة$/i });
  if (await rolePicker.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await rolePicker.click();
  }
  await page.getByRole('button', { name: new RegExp(`^${role}\\b`, 'i') }).click();
  await pressOnboardingContinue(page);
  await page.waitForTimeout(500);
}

async function hasLocationWithDistrict(page: Page): Promise<boolean> {
  return page
    .getByText(/Selected:.*—|المحدد:.*—/i)
    .isVisible({ timeout: 500 })
    .catch(() => false);
}

async function completeLocationStep(page: Page): Promise<void> {
  const nameField = page.getByRole('textbox', { name: /full name|الاسم الكامل/i });
  if ((await nameField.inputValue().catch(() => '')).trim().length === 0) {
    await typeInto(page, nameField, 'E2E Candidate');
  }

  const phoneField = page.getByRole('textbox', { name: ONBOARDING_PHONE_FIELD }).first();
  if (await phoneField.isVisible({ timeout: 500 }).catch(() => false)) {
    const phoneVal = await phoneField.inputValue({ timeout: 2_000 }).catch(() => '');
    if (!phoneVal.trim()) {
      await typeInto(page, phoneField, E2E_CANDIDATE_PHONE_LOCAL);
    }
  }

  const nationalityField = page.getByRole('textbox', { name: /^Nationality|^الجنسية/i });
  if (await nationalityField.isVisible({ timeout: 500 }).catch(() => false)) {
    const natVal = await nationalityField.inputValue({ timeout: 2_000 }).catch(() => '');
    if (!natVal.trim()) {
      await typeInto(page, nationalityField, 'Indian');
      const indian = page.getByRole('button', { name: /^Indian$/i });
      if (await indian.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await indian.click();
      }
    }
  }

  if (!(await hasLocationWithDistrict(page))) {
    const dubaiOnly = await page
      .getByText(/Selected: Dubai$|المحدد: دبي$/i)
      .isVisible({ timeout: 300 })
      .catch(() => false);
    const dubaiChipSelected = await page
      .getByRole('button', { name: /^Dubai\. Selected/i })
      .isVisible()
      .catch(() => false);

    if (!dubaiChipSelected && !dubaiOnly && !(await hasLocationWithDistrict(page))) {
      await page.getByRole('button', { name: /^Dubai\. Not selected/i }).click();
      await page.waitForTimeout(300);
    }

    const areaField = page.getByRole('textbox', { name: /area or district|المنطقة أو الحي/i });
    if (await areaField.isVisible({ timeout: 500 }).catch(() => false)) {
      await typeInto(page, areaField, 'Marina');
      const marinaOption = page.getByRole('button', { name: /^Dubai Marina$/i });
      if (await marinaOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await marinaOption.click();
      } else {
        await areaField.press('Tab');
      }
      await page.waitForTimeout(300);
    }
  }

  await pressOnboardingContinue(page);
  await page.waitForTimeout(500);
}

async function completeSalaryVisaStep(page: Page): Promise<void> {
  const visaSelected = await page
    .getByRole('button', { name: /^Employment visa\. Selected/i })
    .isVisible()
    .catch(() => false);
  if (!visaSelected) {
    await page.getByRole('button', { name: /^Employment visa\. Not selected/i }).click();
  }

  const currentSalary = page.getByRole('textbox', { name: /^Current salary|^الراتب الحالي/i });
  if (await currentSalary.isVisible({ timeout: 500 }).catch(() => false)) {
    if (!(await currentSalary.inputValue().catch(() => '')).trim()) {
      await typeInto(page, currentSalary, '4000');
    }
  }

  const expectedSalary = page.getByRole('textbox', { name: /^Expected salary|^الراتب المتوقع/i });
  if (await expectedSalary.isVisible({ timeout: 500 }).catch(() => false)) {
    if (!(await expectedSalary.inputValue().catch(() => '')).trim()) {
      await typeInto(page, expectedSalary, '5000');
    }
  }

  await pressOnboardingContinue(page);
  await page.waitForTimeout(500);
}

async function completeFinishStep(page: Page): Promise<void> {
  if (await isCandidateHomeVisible(page, 2_000)) {
    return;
  }

  const noExpSelected = await page
    .getByRole('button', { name: /^No experience\. Selected/i })
    .isVisible()
    .catch(() => false);
  if (!noExpSelected) {
    await page.getByRole('button', { name: /^No experience\. Not selected/i }).click();
  }

  const englishSelected = await page
    .getByRole('button', { name: /^English\. Selected/i })
    .isVisible()
    .catch(() => false);
  if (!englishSelected) {
    await page.getByRole('button', { name: /^English\. Not selected/i }).click();
  }

  const submit = page.getByRole('button', { name: /submit profile|إرسال الملف/i });
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (await isCandidateHomeVisible(page, 500)) {
      return;
    }
    if (await submit.isVisible({ timeout: 300 }).catch(() => false)) {
      if (await submit.isEnabled().catch(() => false)) {
        await submit.click();
      }
    }
    await page.waitForTimeout(500);
  }
}
