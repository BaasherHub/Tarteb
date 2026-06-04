import { StyleSheet, Text, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

type Props = {
  label: string;
  value: string;
  variant?: 'default' | 'secondary';
};

export function ProfileFactRow({ label, value, variant = 'default' }: Props) {
  const rtl = useRtlStyles();
  if (!value.trim()) return null;

  return (
    <View style={[styles.row, rtl.row]}>
      <Text style={[styles.label, { textAlign: rtl.textAlign }]} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[
          variant === 'secondary' ? styles.valueSecondary : styles.value,
          { textAlign: rtl.textAlignEnd },
        ]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
    width: '100%',
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    flexShrink: 0,
    maxWidth: '42%',
  },
  value: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  valueSecondary: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    minWidth: 0,
    lineHeight: 20,
  },
});
