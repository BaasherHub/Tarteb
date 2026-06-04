import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';

type Props = {
  message: string;
  variant?: 'info' | 'warning';
};

export function InfoBanner({ message, variant = 'info' }: Props) {
  const rtl = useRtlStyles();
  const bg = variant === 'warning' ? colors.warningTint : `${colors.primary}10`;
  const border = variant === 'warning' ? '#FFE082' : `${colors.primary}25`;
  const textColor = variant === 'warning' ? '#B45309' : colors.textPrimary;

  return (
    <View style={[styles.banner, { backgroundColor: bg, borderColor: border }]}>
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            textAlign: rtl.textAlign,
            writingDirection: rtl.writingDirection,
          },
        ]}
        numberOfLines={6}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  text: { fontSize: 14, lineHeight: 20 },
});
