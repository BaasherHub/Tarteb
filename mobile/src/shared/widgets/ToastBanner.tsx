import { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export type ToastVariant = 'default' | 'success' | 'error';

type Props = {
  message: string;
  variant?: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
};

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; accent: string }
> = {
  default: {
    bg: colors.surface,
    border: colors.divider,
    accent: colors.primary,
  },
  success: {
    bg: colors.secondaryTint,
    border: `${colors.secondary}40`,
    accent: colors.secondary,
  },
  error: {
    bg: colors.warningTint,
    border: `${colors.warning}50`,
    accent: colors.warning,
  },
};

export const ToastBanner = memo(function ToastBanner({
  message,
  variant = 'default',
  actionLabel,
  onAction,
  onDismiss,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const slide = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const palette = VARIANT_STYLES[variant];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slide, {
        toValue: 0,
        useNativeDriver: true,
        speed: 18,
        bounciness: 4,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, slide]);

  return (
    <Animated.View
      style={[
        styles.wrap,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity,
          transform: [{ translateY: slide }],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.row, rtl.row]}>
        <View style={[styles.accent, { backgroundColor: palette.accent }]} />
        <Text
          style={[
            styles.message,
            { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection },
          ]}
          numberOfLines={4}
        >
          {message}
        </Text>
        <Pressable
          onPress={onDismiss}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t.a11yDismissToast}
          style={({ pressed }) => pressed && styles.dismissPressed}
        >
          <Text style={styles.dismiss}>×</Text>
        </Pressable>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={() => {
            onAction();
            onDismiss();
          }}
          style={({ pressed }) => [
            styles.actionBtn,
            { alignSelf: rtl.isRtl ? 'flex-start' : 'flex-end' },
            pressed && styles.actionPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[styles.actionText, { color: palette.accent }]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    borderRadius: spacing.md,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  row: {
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    flexShrink: 0,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  dismiss: {
    fontSize: 22,
    lineHeight: 22,
    color: colors.textSecondary,
    fontWeight: '300',
    paddingHorizontal: spacing.xs,
  },
  dismissPressed: { opacity: interaction.pressed },
  actionBtn: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    minHeight: 36,
    justifyContent: 'center',
  },
  actionPressed: { opacity: interaction.pressed },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
