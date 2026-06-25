import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

type Props = {
  label: string;
  onPress: () => void;
  hint?: string;
  danger?: boolean;
  showChevron?: boolean;
  accessibilityLabel?: string;
  loading?: boolean;
};

export function SettingsLinkRow({
  label,
  onPress,
  hint,
  danger,
  showChevron = true,
  accessibilityLabel,
  loading = false,
}: Props) {
  const rtl = useRtlStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.row, rtl.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      android_ripple={{ color: 'rgba(19,88,206,0.15)', borderless: false }}
    >
      <View style={styles.copy}>
        <Text
          style={[
            styles.label,
            danger && styles.danger,
            { textAlign: rtl.textAlign },
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
        {hint ? (
          <Text style={[styles.hint, { textAlign: rtl.textAlign }]} numberOfLines={2}>
            {hint}
          </Text>
        ) : null}
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : showChevron ? (
        <AppIcon
          name={rtl.isRtl ? 'chevron-back' : 'chevron-forward'}
          size={20}
          color={danger ? colors.error : colors.textSecondary}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  pressed: { backgroundColor: colors.primaryTint },
  copy: { flex: 1, minWidth: 0 },
  label: { ...typography.body, color: colors.textPrimary, fontWeight: '500' },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  danger: { color: colors.error, fontWeight: '600' },
});
