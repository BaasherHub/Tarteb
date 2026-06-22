import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';

type Props = {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
};

const sharedPulse = new Animated.Value(0.45);
let sharedLoop: Animated.CompositeAnimation | null = null;
let activeSkeletons = 0;

export const SkeletonBlock = memo(function SkeletonBlock({
  width = '100%',
  height,
  radius = spacing.sm,
  style,
}: Props) {
  const reducedMotion = useReducedMotion();
  const mounted = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      sharedPulse.setValue(0.65);
      return;
    }

    mounted.current = true;
    activeSkeletons += 1;
    if (!sharedLoop) {
      sharedLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(sharedPulse, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(sharedPulse, {
            toValue: 0.45,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      sharedLoop.start();
    }

    return () => {
      if (!mounted.current) return;
      mounted.current = false;
      activeSkeletons = Math.max(0, activeSkeletons - 1);
      if (activeSkeletons === 0) {
        sharedLoop?.stop();
        sharedLoop = null;
      }
    };
  }, [reducedMotion]);

  return (
    <View
      style={[
        styles.base,
        { width, height, borderRadius: radius },
        style,
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.shimmer,
          { opacity: sharedPulse },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  shimmer: {
    backgroundColor: colors.surface,
  },
});
