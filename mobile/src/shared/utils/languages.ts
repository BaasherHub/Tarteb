/** Legacy value removed from pickers; strip on read/write. */
const DEPRECATED_LANGUAGE = 'Other';

export function sanitizeLanguages(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(String).filter((l) => l.trim() && l !== DEPRECATED_LANGUAGE);
}

export function formatLanguagesSummary(
  languages: string[],
  label: (lang: string) => string,
  moreLabel: (extra: number) => string,
  maxShown = 3,
): string {
  if (languages.length === 0) return '';
  const shown = languages.slice(0, maxShown).map(label);
  const extra = languages.length - Math.min(languages.length, maxShown);
  if (extra > 0) shown.push(moreLabel(extra));
  return shown.join(' · ');
}
