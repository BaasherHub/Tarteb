import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/core/theme/colors';

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
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipOn,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, selected && styles.textOn]}>{label}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  chipOn: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  pressed: { opacity: 0.88 },
  text: { fontSize: 14, color: colors.textPrimary },
  textOn: { color: colors.primary, fontWeight: '600' },
});


