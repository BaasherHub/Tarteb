import { useCallback, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { interaction } from '@/core/theme/interaction';

type Options = {
  enabled?: boolean;
  scaleTo?: number;
};

/**
 * Lightweight press feedback via scale (Animated API — no Reanimated dependency).
 */
export function usePressScale({ enabled = true, scaleTo = interaction.pressScale }: Options = {}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = useCallback(
    (toValue: number) => {
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }).start();
    },
    [scale],
  );

  const onPressIn = useCallback(() => {
    if (enabled) animateTo(scaleTo);
  }, [enabled, animateTo, scaleTo]);

  const onPressOut = useCallback(() => {
    if (enabled) animateTo(1);
  }, [enabled, animateTo]);

  const animatedStyle: StyleProp<ViewStyle> = enabled
    ? { transform: [{ scale }] }
    : undefined;

  return { animatedStyle, onPressIn, onPressOut };
}
