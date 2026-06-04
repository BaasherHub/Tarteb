import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type Props = {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
};

export const SkeletonBlock = memo(function SkeletonBlock({
  width = '100%',
  height,
  radius = spacing.sm,
  style,
}: Props) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

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
          { opacity: pulse },
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
