import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';

type Props = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export const EmptyState = memo(function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>📋</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
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
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  icon: { fontSize: 40, marginBottom: 12 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actions: { width: '100%', maxWidth: 320, gap: 10, marginTop: 20 },
});


