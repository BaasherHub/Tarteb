import { Platform, StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

/** Shared screen layout tokens — use across Home, Settings, onboarding, employer. */
export const layout = {
  screenPaddingX: spacing.screenX,
  screenPaddingBottom: spacing.xxxl,
  /** Extra scroll padding so content clears bottom tab bar. */
  tabBarClearance: Platform.OS === 'web' ? 80 : 96,
  cardRadius: 16,
  cardPadding: spacing.lg,
} as const;

export const layoutStyles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: layout.screenPaddingBottom,
  },
  screenContentWithTabBar: {
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: layout.screenPaddingBottom + layout.tabBarClearance,
  },
  screenHeaderWrap: {
    paddingHorizontal: layout.screenPaddingX,
  },
  surfaceCard: {
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  surfaceCardInset: {
    padding: layout.cardPadding,
  },
  footer: {
    padding: layout.screenPaddingX,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.scaffold,
  },
  sectionGroup: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionGroupFirst: {
    marginTop: 0,
  },
  sectionForm: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionFormFirst: {
    marginTop: 0,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.placeholder,
    marginBottom: spacing.sm,
  },
});
