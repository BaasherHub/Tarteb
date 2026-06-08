import { memo, useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { playSuccessHaptic } from '@/shared/utils/successHaptic';

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
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const circlePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    void playSuccessHaptic();

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
  }, [checkScale, circlePulse, opacity, scale]);

  return (
    <Animated.View
      style={[styles.wrap, { opacity, transform: [{ scale }] }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ scale: circlePulse }] },
          Platform.OS === 'android' ? styles.circleAndroid : null,
        ]}
      >
        <Animated.Text
          style={[styles.check, { transform: [{ scale: checkScale }] }]}
          accessibilityLabel={title}
        >
          ✓
        </Animated.Text>
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
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryTint,
    borderWidth: 3,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  circleAndroid: {
    elevation: 4,
  },
  check: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.secondary,
    lineHeight: 44,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  sub: { ...typography.body, color: colors.textSecondary },
});
