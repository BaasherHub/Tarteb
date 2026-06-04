/** 4px spacing scale — use for padding, margin, and gap */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  /** Horizontal padding for screen content */
  screenX: 20,
  /** Standard card / panel padding */
  card: 16,
  /** Form field vertical rhythm */
  fieldGap: 12,
} as const;

export type SpacingKey = keyof typeof spacing;
