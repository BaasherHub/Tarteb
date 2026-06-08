import type { Strings } from '@/core/i18n/strings';
import {
  fieldLabelA11y,
  type FieldLabelFlags,
} from '@/shared/widgets/FieldLabel';

/** Build field label + error for screen readers (RTL-friendly single announcement). */
export function fieldA11yLabel(
  label: string,
  error?: string,
  hint?: string,
  flags?: FieldLabelFlags,
  t?: Strings,
): string {
  const base =
    flags && t ? fieldLabelA11y(label, flags, t) : label;
  const parts = [base, hint, error].filter(Boolean);
  return parts.join('. ');
}

export function chipA11yProps(
  label: string,
  selected: boolean,
  t: Strings,
): {
  accessibilityLabel: string;
  accessibilityHint: string;
  accessibilityState: { selected: boolean };
} {
  return {
    accessibilityLabel: `${label}. ${selected ? t.a11ySelected : t.a11yNotSelected}`,
    accessibilityHint: t.a11yChipToggle,
    accessibilityState: { selected },
  };
}

export function candidateCardA11yLabel(
  t: Strings,
  parts: {
    name: string;
    role: string;
    location: string;
    nationality?: string;
    unlocked?: boolean;
    activeAgo?: string;
  },
): string {
  const segments = [
    parts.name,
    parts.role,
    parts.location,
    parts.nationality,
    parts.unlocked ? t.unlockedBadge : undefined,
    parts.activeAgo,
    t.a11yOpensCandidateProfile,
  ].filter(Boolean);
  return segments.join('. ');
}
