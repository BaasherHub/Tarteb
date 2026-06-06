import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { playSelectionHaptic } from '@/shared/utils/selectionHaptic';

type Props = {
  onPress: () => void;
};

export function ChangeLanguageLink({ onPress }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();

  const handlePress = () => {
    void playSelectionHaptic();
    onPress();
  };

  return (
    <View style={[styles.wrap, rtl.isRtl ? styles.wrapRtl : styles.wrapLtr]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.btn, rtl.row, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={t.changeLanguage}
      >
        <AppIcon name="language-outline" size={18} color={colors.primary} />
        <Text style={[styles.label, { writingDirection: rtl.writingDirection }]}>
          {t.changeLanguage}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  wrapLtr: { alignItems: 'flex-start' },
  wrapRtl: { alignItems: 'flex-end' },
  btn: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    minHeight: 44,
  },
  pressed: { backgroundColor: colors.primaryTint },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
  },
});
