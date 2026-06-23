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
  /** Denser chip for grids (years, languages). */
  compact?: boolean;
  /** Tightest chip — 3-column language grids. */
  dense?: boolean;
};

export const SelectableChip = memo(function SelectableChip({
  label,
  selected,
  onPress,
  accessibilityLabel,
  compact = false,
  dense = false,
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
          compact && styles.chipCompact,
          dense && styles.chipDense,
          selected && styles.chipOn,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            compact && styles.textCompact,
            dense && styles.textDense,
            selected && styles.textOn,
          ]}
          numberOfLines={dense ? 1 : 2}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1.5}
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
  chipCompact: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 10,
  },
  chipDense: {
    minHeight: 44,
    minWidth: 0,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    borderRadius: 8,
  },
  text: { ...typography.caption, fontSize: 14, color: colors.textPrimary, textAlign: 'center' },
  textCompact: { fontSize: 13, fontWeight: '600' },
  textDense: { fontSize: 12, fontWeight: '600' },
  textOn: { color: colors.primary, fontWeight: '600' },
});
