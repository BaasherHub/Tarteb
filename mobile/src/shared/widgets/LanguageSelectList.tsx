import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppIcon } from '@/shared/widgets/AppIcon';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { chipA11yProps } from '@/shared/utils/a11y';

type Props = {
  options: readonly string[];
  selected: string[];
  onToggle: (lang: string) => void;
};

/** Compact checklist — less vertical space than a chip grid when expanded. */
export const LanguageSelectList = memo(function LanguageSelectList({
  options,
  selected,
  onToggle,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();

  return (
    <View style={styles.card}>
      {options.map((lang, index) => {
        const isOn = selected.includes(lang);
        const label = t.languageLabel(lang);
        const a11y = chipA11yProps(label, isOn, t);

        return (
          <Pressable
            key={lang}
            onPress={() => onToggle(lang)}
            accessibilityRole="button"
            {...a11y}
            style={({ pressed }) => [
              styles.row,
              rtl.row,
              index < options.length - 1 ? styles.rowDivider : null,
              pressed && styles.rowPressed,
            ]}
          >
            <Text
              style={[styles.label, { textAlign: rtl.textAlign }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {label}
            </Text>
            {isOn ? (
              <AppIcon name="checkmark-circle" size={20} color={colors.primary} />
            ) : (
              <View style={styles.ring} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 40,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowPressed: {
    backgroundColor: colors.primaryTint,
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
  },
  ring: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
});
