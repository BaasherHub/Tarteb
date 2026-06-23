import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

export function FieldError({ message }: { message?: string }) {
  const rtl = useRtlStyles();
  if (!message) return null;
  return (
    <Text
      style={[styles.text, { textAlign: rtl.textAlign, writingDirection: rtl.writingDirection }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      numberOfLines={4}
      maxFontSizeMultiplier={1.5}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
});
