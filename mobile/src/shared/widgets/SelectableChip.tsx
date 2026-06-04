import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { usePressScale } from '@/shared/hooks/usePressScale';
import { chipA11yProps } from '@/shared/utils/a11y';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

export const SelectableChip = memo(function SelectableChip({
  label,
  selected,
  onPress,
  accessibilityLabel,
}: Props) {
  const { t } = useLocale();
  const a11y = chipA11yProps(accessibilityLabel ?? label, selected, t);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      {...a11y}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.chip,
          selected && styles.chipOn,
          animatedStyle,
        ]}
      >
        <Text
          style={[styles.text, selected && styles.textOn]}
          numberOfLines={2}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1.25}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: { maxWidth: '100%' },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  chipOn: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  text: { ...typography.caption, fontSize: 14, color: colors.textPrimary, textAlign: 'center' },
  textOn: { color: colors.primary, fontWeight: '600' },
});
