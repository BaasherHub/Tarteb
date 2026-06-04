import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

type Props = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  icon?: string;
};

export const EmptyState = memo(function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  icon = '📋',
}: Props) {
  const rtl = useRtlStyles();
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text
        style={[styles.title, { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection }]}
        numberOfLines={3}
      >
        {title}
      </Text>
      {message ? (
        <Text
          style={[styles.message, { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection }]}
          numberOfLines={6}
        >
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.actions}>
          <PrimaryButton label={actionLabel} onPress={onAction} />
          {secondaryLabel && onSecondary ? (
            <SecondaryButton label={secondaryLabel} onPress={onSecondary} />
          ) : null}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  iconCircle: {
    width: spacing.xxxl * 2,
    height: spacing.xxxl * 2,
    borderRadius: spacing.xxxl,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  icon: { fontSize: typography.h1.fontSize },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: { width: '100%', maxWidth: 320, gap: spacing.md, marginTop: spacing.sm },
});
