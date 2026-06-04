import { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

type Props = {
  message?: string;
  style?: ViewStyle;
  size?: 'small' | 'large';
};

export const ScreenLoading = memo(function ScreenLoading({
  message,
  style,
  size = 'large',
}: Props) {
  const rtl = useRtlStyles();
  return (
    <View style={[styles.wrap, style]}>
      <ActivityIndicator
        color={colors.primary}
        size={size === 'large' ? 'large' : 'small'}
      />
      {message ? (
        <Text
          style={[styles.message, { textAlign: rtl.textAlignCenter, writingDirection: rtl.writingDirection }]}
          numberOfLines={2}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
