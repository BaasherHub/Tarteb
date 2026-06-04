/**
 * Tarteb color system
 *
 * Primary brand blue:  #1A6FFF (icon gradient start)
 * Secondary green:     #00C853 (active / hired / success)
 * All neutrals and semantic colors derived from these two anchors.
 */
export const colors = {
  // ── Brand ──────────────────────────────────────────────
  /** Main interactive color — buttons, links, active states */
  primary: '#1A6FFF',
  /** Darker shade for gradients, hover/pressed states */
  primaryDark: '#0038CC',
  /** Light tint for backgrounds, selected chips */
  primaryTint: '#E8F0FF',

  /** Success / hired / active / green dot */
  secondary: '#00C853',
  secondaryDark: '#009624',
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
  error: '#EF4444',
  errorTint: '#FEF2F2',
  warning: '#F59E0B',
  warningTint: '#FFFBEB',
} as const;

export type ColorKey = keyof typeof colors;
