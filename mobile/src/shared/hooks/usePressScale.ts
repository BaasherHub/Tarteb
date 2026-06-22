import { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { interaction } from '@/core/theme/interaction';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

type Options = {
  enabled?: boolean;
  scaleTo?: number;
};

/**
 * Lightweight press feedback via scale (Animated API — no Reanimated dependency).
 */
export function usePressScale({ enabled = true, scaleTo = interaction.pressScale }: Options = {}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();
  const shouldAnimate = enabled && !reducedMotion;

  useEffect(() => {
    if (!shouldAnimate) scale.setValue(1);
  }, [scale, shouldAnimate]);

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
    if (shouldAnimate) animateTo(scaleTo);
  }, [shouldAnimate, animateTo, scaleTo]);

  const onPressOut = useCallback(() => {
    if (shouldAnimate) animateTo(1);
  }, [shouldAnimate, animateTo]);

  const animatedStyle: StyleProp<ViewStyle> = shouldAnimate
    ? { transform: [{ scale }] }
    : undefined;

  return { animatedStyle, onPressIn, onPressOut };
}
