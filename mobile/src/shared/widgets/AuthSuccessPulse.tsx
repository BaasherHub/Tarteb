import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

type Props = {
  title: string;
  subtitle?: string;
};

/** Brief success feedback after OTP verification (Animated API). */
export const AuthSuccessPulse = memo(function AuthSuccessPulse({
  title,
  subtitle,
}: Props) {
  const rtl = useRtlStyles();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={[styles.wrap, { opacity, transform: [{ scale }] }]}>
      <View style={styles.circle}>
        <Text style={styles.check}>✓</Text>
      </View>
      <Text
        style={[styles.title, { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection }]}
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
    gap: spacing.md,
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondaryTint,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.secondary,
    lineHeight: 40,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  sub: { ...typography.body, color: colors.textSecondary },
});
