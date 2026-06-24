import { memo, useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { playSuccessHaptic } from '@/shared/utils/successHaptic';
import { useReducedMotion } from '@/shared/hooks/useReducedMotion';
import { AppIcon } from '@/shared/widgets/AppIcon';

type Props = {
  title: string;
  subtitle?: string;
};

/** Success feedback after OTP verification — green checkmark, pulse, optional haptic. */
export const AuthSuccessPulse = memo(function AuthSuccessPulse({
  title,
  subtitle,
}: Props) {
  const rtl = useRtlStyles();
  const reducedMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const circlePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    void playSuccessHaptic();

    if (reducedMotion) {
      scale.setValue(1);
      opacity.setValue(1);
      checkScale.setValue(1);
      circlePulse.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 6,
      }),
      Animated.sequence([
        Animated.timing(circlePulse, {
          toValue: 1.08,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.spring(circlePulse, {
          toValue: 1,
          useNativeDriver: true,
          speed: 18,
          bounciness: 4,
        }),
      ]),
    ]).start();
  }, [checkScale, circlePulse, opacity, reducedMotion, scale]);

  return (
    <Animated.View
      style={[styles.wrap, { opacity, transform: [{ scale }] }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Animated.View style={[styles.ring, { transform: [{ scale: circlePulse }] }]}>
        <View
          style={[
            styles.circle,
            Platform.OS === 'android' ? styles.circleAndroid : null,
          ]}
        >
          <Animated.View style={{ transform: [{ scale: checkScale }] }} accessibilityLabel={title}>
            <AppIcon name="checkmark" size={44} color="#fff" />
          </Animated.View>
        </View>
      </Animated.View>
      <Text
        style={[
          styles.title,
          { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.sub,
            { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection },
          ]}
          numberOfLines={3}
        >
          {subtitle}
        </Text>
      ) : null}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  ring: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: `${colors.secondary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  circleAndroid: {
    elevation: 8,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  sub: { ...typography.body, color: colors.textSecondary },
});
