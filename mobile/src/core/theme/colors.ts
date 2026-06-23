/**
 * Tarteb color system
 *
 * Primary brand blue:  #1A6FFF (icon gradient start)
 * Secondary green:     #00C853 (active / hired / success)
 * All neutrals and semantic colors derived from these two anchors.
 */
export const colors = {
  // ── Brand ──────────────────────────────────────────────
  /** Main interactive color — buttons, links, active states. WCAG AA 6.3:1 on white. */
  primary: '#1358CE',
  /** Darker shade for gradients, hover/pressed states */
  primaryDark: '#0038CC',
  /** Light tint for backgrounds, selected chips */
  primaryTint: '#E8F0FF',

  /** Success / hired / active / green dot (icons & backgrounds — 3:1+ on white). */
  secondary: '#00C853',
  /** Use for green text on white — WCAG AA 5.1:1. */
  secondaryDark: '#15803D',
  secondaryTint: '#E6F9EE',

  // ── Neutrals ────────────────────────────────────────────
  /** App background */
  scaffold: '#F5F7FB',
  /** Card / surface background */
  surface: '#FFFFFF',
  /** Elevated surface (modals, sheets) */
  surfaceElevated: '#FFFFFF',

  /** Primary text */
  textPrimary: '#111827',
  /** Secondary / caption text */
  textSecondary: '#6B7280',
  /** Disabled / placeholder text */
  placeholder: '#9CA3AF',

  /** Dividers, borders */
  divider: '#E5E7EB',
  /** Input border */
  inputBorder: '#D1D5DB',

  // ── Semantic ────────────────────────────────────────────
  /** Error text/border on white — WCAG AA 5.9:1. */
  error: '#C41C1C',
  errorTint: '#FEF2F2',
  warning: '#F59E0B',
  warningTint: '#FFFBEB',
  /** Warning text on white — WCAG AA 7.1:1. Use instead of `warning` for text. */
  warningText: '#92400E',
} as const;

export type ColorKey = keyof typeof colors;
