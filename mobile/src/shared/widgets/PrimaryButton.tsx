import { memo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { colors } from '@/core/theme/colors';
import { interaction } from '@/core/theme/interaction';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { usePressScale } from '@/shared/hooks/usePressScale';

type Props = {
  label: string;
  onPress: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
};

export const PrimaryButton = memo(function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  accessibilityHint,
}: Props) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale({
    enabled: !disabled && !loading,
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: !!loading }}
    >
      <Animated.View
        style={[
          styles.button,
          animatedStyle,
          (disabled || loading) && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" accessibilityLabel={label} />
        ) : (
          <Text
            style={styles.label}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            maxFontSizeMultiplier={1.3}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    minHeight: 48,
    borderRadius: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    opacity: 1,
  },
  disabled: { opacity: interaction.disabled },
  label: {
    color: '#fff',
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: typography.body.lineHeight,
  },
});
