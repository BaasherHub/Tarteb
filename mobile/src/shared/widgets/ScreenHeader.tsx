import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';

type Props = {
  title: string;
  onSettings?: () => void;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, onSettings, right }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  return (
    <View style={[styles.row, rtl.rowBetween]}>
      <Text style={[styles.title, { textAlign: rtl.textAlign }]} numberOfLines={2}>
        {title}
      </Text>
      <View style={[styles.right, rtl.row]}>
        {right}
        {onSettings ? (
          <Pressable
            onPress={onSettings}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel={t.settings}
          >
            <AppIcon name="settings" size={24} color={colors.textPrimary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    flex: 1,
    flexShrink: 1,
  },
  right: { alignItems: 'center', gap: spacing.sm, flexShrink: 0 },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
