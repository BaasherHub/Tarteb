/** Default UAE country code for hints and validation. */
export const UAE_DIAL_CODE = '+971';

/** Example shown in placeholders (no spaces). */
export const UAE_PHONE_EXAMPLE = '+971501551480';

/** Max formatted length: `+971 XX XXX XXXX` */
export const UAE_PHONE_FORMATTED_MAX_LENGTH = 17;

/**
 * Normalize user input to E.164.
 * Accepts +971501551480, 971501551480, or legacy 0501551480 → +971501551480.
 */
export function normalizeE164(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return '';

  const compact = trimmed.replace(/[\s\-().]/g, '');
  let digits = compact.replace(/\D/g, '');

  while (digits.startsWith('00')) {
    digits = digits.slice(2);
  }

  if (digits.startsWith('971')) {
    return `+${digits.slice(0, 12)}`;
  }

  if (digits.startsWith('0') && digits.length >= 9 && digits.length <= 10) {
    return `${UAE_DIAL_CODE}${digits.slice(1, 10)}`;
  }

  if (compact.startsWith('+') && digits) {
    return `+${digits.slice(0, 12)}`;
  }

  if (digits.length) {
    return `+${digits.slice(0, 12)}`;
  }

  return '';
}

/** UAE mobile numbers: +971 5X XXX XXXX (9 digits after country code). */
export function isValidUaeMobileE164(e164: string): boolean {
  return /^\+9715[0-9]{8}$/.test(e164);
}

/** Display with spaces: +971 50 155 1480 */
export function formatPhoneForDisplay(phone: string): string {
  const e164 = normalizeE164(phone);
  if (!e164.startsWith('+971')) return phone.trim();
  const local = e164.slice(4, 13);
  let out = UAE_DIAL_CODE;
  if (local.length > 0) out += ` ${local.slice(0, 2)}`;
  if (local.length > 2) out += ` ${local.slice(2, 5)}`;
  if (local.length > 5) out += ` ${local.slice(5, 9)}`;
  return out;
}

/**
 * Live formatting while typing — keeps +971 prefix and inserts spaces.
 */
export function formatUaePhoneInput(raw: string): string {
  if (!raw.trim()) return UAE_DIAL_CODE;

  const compact = raw.replace(/[^\d+]/g, '');
  let digits = compact.replace(/\D/g, '');

  if (compact.startsWith('+') || digits.startsWith('971')) {
    if (digits.startsWith('971')) digits = digits.slice(3);
  } else if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 9);

  let out = UAE_DIAL_CODE;
  if (digits.length > 0) out += ` ${digits.slice(0, 2)}`;
  if (digits.length > 2) out += ` ${digits.slice(2, 5)}`;
  if (digits.length > 5) out += ` ${digits.slice(5, 9)}`;
  return out;
}

/** Strip to E.164 for copy/paste into Twilio. */
export function e164FromFormattedInput(formatted: string): string {
  return normalizeE164(formatted);
}

/** User left optional field blank or only the +971 prefix. */
export function isEmptyOptionalUaePhone(formatted: string | null | undefined): boolean {
  if (!formatted?.trim()) return true;
  const e164 = normalizeE164(formatted);
  return !e164 || e164 === UAE_DIAL_CODE;
}

/**
 * Optional UAE mobile (e.g. WhatsApp). Empty → null; partial/invalid → error.
 */
export function validateOptionalUaeMobile(
  formatted: string | null | undefined,
): { ok: true; e164: string | null } | { ok: false } {
  if (isEmptyOptionalUaePhone(formatted)) {
    return { ok: true, e164: null };
  }
  const e164 = normalizeE164(formatted!);
  if (!isValidUaeMobileE164(e164)) {
    return { ok: false };
  }
  return { ok: true, e164 };
}
