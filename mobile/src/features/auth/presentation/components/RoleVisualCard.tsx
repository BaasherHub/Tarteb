import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppIcon, type AppIconName } from '@/shared/widgets/AppIcon';
import { playSelectionHaptic } from '@/shared/utils/selectionHaptic';

const ICON_SIZE = 30;
const ICON_BOX = 72;

/** Role card colors — same hues as brand tokens, softened via icon opacity. */
export type RoleCardTheme = {
  accent: string;
  accentTint: string;
  icon: string;
};

type Props = {
  selected: boolean;
  onPress: () => void;
  icon: AppIconName;
  title: string;
  theme: RoleCardTheme;
  disabled?: boolean;
};

export function RoleVisualCard({
  selected,
  onPress,
  icon,
  title,
  theme,
  disabled,
}: Props) {
  const { accent, accentTint, icon: iconColor } = theme;

  const handlePress = () => {
    if (disabled) return;
    void playSelectionHaptic();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!disabled }}
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: selected ? accentTint : colors.surface,
            borderColor: selected ? `${accent}70` : colors.divider,
            borderWidth: selected ? 2 : 1,
          },
          selected && styles.cardSelected,
        ]}
      >
        <View style={styles.cardContent}>
          <View
            style={[
              styles.iconSquare,
              {
                backgroundColor: accentTint,
                borderWidth: selected ? 2 : 0,
                borderColor: accent,
              },
            ]}
          >
            <AppIcon name={icon} size={ICON_SIZE} color={iconColor} style={styles.iconGlyph} />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  pressed: { opacity: 0.94 },
  disabled: { opacity: 0.6 },
  card: {
    aspectRatio: 1,
    width: '100%',
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconSquare: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    opacity: 0.72,
    textAlign: 'center',
    height: ICON_SIZE,
    lineHeight: ICON_SIZE,
  },
  title: {
    fontSize: typography.body.fontSize,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    margin: 0,
    paddingHorizontal: spacing.xs,
  },
});
