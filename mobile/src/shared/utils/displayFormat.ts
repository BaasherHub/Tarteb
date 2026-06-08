import { NATIONALITIES, resolveNationality } from '@/shared/constants/nationalities';

/** Title-case a person or place name for display. */
export function formatDisplayName(name: string): string {
  const trimmed = collapseDoubledToken(name.trim());
  if (!trimmed) return '';

  return trimmed
    .split(/\s+/)
    .map((word) => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function collapseDoubledToken(value: string): string {
  if (value.length < 2 || value.length % 2 !== 0) return value;
  const half = value.length / 2;
  const left = value.slice(0, half);
  const right = value.slice(half);
  if (left.toLowerCase() === right.toLowerCase()) return left;
  return value;
}

/** Canonical demonym for browse/detail (fixes aliases and duplicated values). */
export function formatNationalityDisplay(raw: string): string {
  const trimmed = collapseDoubledToken(raw.trim());
  if (!trimmed) return '';

  const resolved = resolveNationality(trimmed);
  if (resolved) return resolved;

  const lower = trimmed.toLowerCase();
  for (const demonym of NATIONALITIES) {
    const doubled = `${demonym}${demonym}`.toLowerCase();
    if (lower === doubled) return demonym;
  }

  return formatDisplayName(trimmed);
}
