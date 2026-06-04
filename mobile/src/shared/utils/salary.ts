/** Format integer AED amounts with thousands separators (e.g. 3000 → "3,000"). */
export function formatSalaryAmount(value: number | string | undefined | null): string {
  if (value == null || value === '') return '';
  const n =
    typeof value === 'number'
      ? value
      : parseInt(String(value).replace(/\D/g, ''), 10);
  if (!Number.isFinite(n) || n <= 0) return '';
  return n.toLocaleString('en-US');
}

/** Parse typed salary text (with or without commas) to a positive integer AED amount. */
export function parseSalaryAmount(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return undefined;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
